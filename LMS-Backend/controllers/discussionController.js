const CourseDiscussion = require('../models/CourseDiscussion');

/**
 * Send a new message in course discussion
 * POST /api/discussion/:courseId
 */
exports.sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { courseId } = req.params;
        const sender = req.user._id || req.user.id;

        // Validate message
        if (!message || !message.trim()) {
            return res.status(400).json({ message: 'Message content is required' });
        }

        // Create new message
        const newMessage = await CourseDiscussion.create({
            courseId,
            sender,
            message: message.trim(),
            isInstructorMessage: req.isInstructor // Set by checkCourseAccess middleware
        });

        // Populate sender details for frontend display
        await newMessage.populate('sender', 'name email photoUrl role');

        res.status(201).json({
            success: true,
            message: newMessage
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};

/**
 * Get all messages for a course
 * GET /api/discussion/:courseId
 */
exports.getCourseMessages = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Fetch all messages for the course
        const messages = await CourseDiscussion.find({ courseId })
            .populate('sender', 'name email photoUrl role')
            .sort({ createdAt: 1 }); // Oldest first (chronological order)

        res.json({
            success: true,
            count: messages.length,
            messages
        });
    } catch (error) {
        console.error('Fetch messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
};
