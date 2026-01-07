const Progress = require('../models/Progress');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const CourseDiscussion = require('../models/CourseDiscussion');
const PendingCourse = require('../models/PendingCourse');

// Mark lecture as completed
exports.markLectureComplete = async (req, res) => {
  try {
    const { courseId, lectureId, itemId } = req.body;
    const userId = req.user._id || req.user.id;

    if (!courseId || (!lectureId && !itemId)) {
      return res.status(400).json({
        message: 'Course ID and Lecture ID (or itemId) are required'
      });
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        message: 'You must be enrolled in this course to track progress'
      });
    }

    // Get or create progress
    let progress = await Progress.findOne({
      user: userId,
      course: courseId
    });

    if (!progress) {
      progress = new Progress({
        enrollment: enrollment._id,
        user: userId,
        course: courseId
      });
    }

    // Check if already completed
    const lectureIdToUse = lectureId || itemId;
    const alreadyCompleted = progress.completedLectures.some(
      l => l.lectureId?.toString() === lectureIdToUse?.toString() ||
        l.itemId === itemId
    );

    if (!alreadyCompleted) {
      progress.completedLectures.push({
        lectureId: lectureId || null,
        itemId: itemId || null,
        completedAt: new Date()
      });

      // Calculate progress percentage
      const course = await Course.findById(courseId).populate('instructor');
      if (course && course.curriculum) {
        const totalLectures = course.curriculum.reduce(
          (sum, section) => sum + (section.items?.filter(item => item.type === 'lecture').length || 0),
          0
        );

        if (totalLectures > 0) {
          progress.progressPercentage = Math.round(
            (progress.completedLectures.length / totalLectures) * 100
          );
        }

        // Check if course is completed
        const wasNotCompleted = !progress.isCompleted;
        if (progress.progressPercentage >= 100) {
          progress.isCompleted = true;
          progress.completedAt = new Date();
          enrollment.isCompleted = true;
          enrollment.completedAt = new Date();
          enrollment.progress = 100;
          await enrollment.save();

          // 🎉 AUTO-SEND CONGRATULATIONS MESSAGE (only first time)
          if (wasNotCompleted) {
            try {
              const pendingCourse = await PendingCourse.findById(course.pendingCourseId);

              if (pendingCourse && pendingCourse.congratsMsg && pendingCourse.congratsMsg.trim()) {
                await CourseDiscussion.create({
                  courseId: courseId,
                  sender: course.instructor._id,
                  message: pendingCourse.congratsMsg.trim(),
                  isInstructorMessage: true
                });
                console.log('🎉 Congratulations message sent to student who completed course');
              }
            } catch (msgError) {
              console.error('Failed to send congratulations message:', msgError);
              // Don't fail progress if message fails
            }
          }
        }
      }

      await progress.save();
    }

    // Update enrollment progress
    enrollment.progress = progress.progressPercentage;
    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    res.json({
      message: 'Lecture marked as completed',
      progress: {
        progressPercentage: progress.progressPercentage,
        completedLectures: progress.completedLectures.length,
        isCompleted: progress.isCompleted
      }
    });
  } catch (error) {
    console.error('Mark lecture complete error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update last accessed lecture
exports.updateLastAccessed = async (req, res) => {
  try {
    const { courseId, lectureId, itemId, sectionId } = req.body;
    const userId = req.user._id || req.user.id;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        message: 'You must be enrolled in this course'
      });
    }

    // Update enrollment
    enrollment.lastAccessedAt = new Date();
    if (lectureId || itemId) {
      enrollment.lastAccessedLecture = lectureId || itemId;
    }
    await enrollment.save();

    // Update progress
    let progress = await Progress.findOne({
      user: userId,
      course: courseId
    });

    if (progress) {
      progress.lastAccessedLecture = {
        lectureId: lectureId || null,
        itemId: itemId || null,
        sectionId: sectionId || null,
        accessedAt: new Date()
      };
      await progress.save();
    }

    res.json({ message: 'Last accessed updated' });
  } catch (error) {
    console.error('Update last accessed error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get progress for a course
exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id || req.user.id;

    const progress = await Progress.findOne({
      user: userId,
      course: courseId
    }).populate('course');

    if (!progress) {
      return res.json({
        progressPercentage: 0,
        completedLectures: [],
        completedQuizzes: [],
        isCompleted: false,
        lastAccessedLecture: null
      });
    }

    res.json({
      progressPercentage: progress.progressPercentage,
      completedLectures: progress.completedLectures,
      completedQuizzes: progress.completedQuizzes,
      isCompleted: progress.isCompleted,
      completedAt: progress.completedAt,
      lastAccessedLecture: progress.lastAccessedLecture,
      timeSpent: progress.timeSpent
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark quiz as completed
exports.markQuizComplete = async (req, res) => {
  try {
    const { courseId, quizId, score, maxScore } = req.body;
    const userId = req.user._id || req.user.id;

    if (!courseId || !quizId) {
      return res.status(400).json({
        message: 'Course ID and Quiz ID are required'
      });
    }

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({
        message: 'You must be enrolled in this course'
      });
    }

    // Get or create progress
    let progress = await Progress.findOne({
      user: userId,
      course: courseId
    });

    if (!progress) {
      progress = new Progress({
        enrollment: enrollment._id,
        user: userId,
        course: courseId
      });
    }

    // Check if already completed
    const existingQuiz = progress.completedQuizzes.find(
      q => q.quizId?.toString() === quizId.toString()
    );

    if (!existingQuiz) {
      progress.completedQuizzes.push({
        quizId,
        score: score || 0,
        maxScore: maxScore || 0,
        completedAt: new Date()
      });
      await progress.save();
    }

    res.json({
      message: 'Quiz marked as completed',
      quizResult: existingQuiz || progress.completedQuizzes[progress.completedQuizzes.length - 1]
    });
  } catch (error) {
    console.error('Mark quiz complete error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

