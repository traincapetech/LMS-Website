import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronUp,
  FaPlayCircle,
  FaClock,
  FaListAlt,
  FaQuestionCircle,
  FaStar,
  FaStickyNote,
  FaTrophy,
  FaShareAlt,
  FaEllipsisV,
  FaFilePdf,
  FaFileAlt,
  FaSpinner,
  FaCertificate,
} from "react-icons/fa";
import { useStore } from "../Store/store";
import { enrollmentAPI, progressAPI } from "@/utils/api";
import { toast } from "sonner";
import QuizPlayer from "../components/QuizPlayer";
import { Check } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const LectureVideo = () => {
  const { lectureId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://lms-backend-5s5x.onrender.com";

  const searchParams = new URLSearchParams(location.search);
  const courseId =
    location.state?.courseId ||
    location.state?.courseId?.id ||
    searchParams.get("courseId");

  const [course, setCourse] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [completedLectures, setCompletedLectures] = useState(new Set()); // Track completed lectures
  const [loading, setLoading] = useState(true); // Loading state
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false); // Track course completion
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);
  // const { loading, error, fetchCoursesById, coursesById: rawCourse } = useStore();
  const findLectureById = (courseData, itemId) => {
    if (!courseData?.curriculum) return null;
    for (const sec of courseData.curriculum) {
      for (const item of sec.items) {
        if (
          item._id?.toString() === itemId?.toString() ||
          item.itemId?.toString() === itemId?.toString() ||
          item.quizId?.toString() === itemId?.toString()
        ) {
          return item;
        }
      }
    }
    return null;
  };

  // Add this helper function to find lecture by video ID
  const findLectureByVideoId = (courseData, videoId) => {
    if (!courseData?.curriculum) return null;
    for (const sec of courseData.curriculum) {
      for (const item of sec.items) {
        if (item.videoId?.toString() === videoId?.toString()) {
          return item;
        }
      }
    }
    return null;
  };

  // FETCH COURSE
  useEffect(() => {
    if (!courseId) return;

    // If we already have the course loaded and IDs match, don't refetch
    // checking course._id vs courseId. course._id is usually the mongo id
    if (course && (course._id === courseId || course.id === courseId)) {
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);

        const courseRes = await fetch(`${API_BASE}/api/courses/${courseId}`);
        const rawCourse = await courseRes.json();

        if (!rawCourse.curriculum) {
          setLoading(false);
          return;
        }

        const pendingCourseId = rawCourse.pendingCourseId;
        const videoMap = new Map();

        // Fetch video metadata if videos exist
        try {
          const vRes = await fetch(
            `${API_BASE}/api/upload/check/${pendingCourseId}`
          );
          if (vRes.ok) {
            const data = await vRes.json();
            if (data.uploadedVideos && Array.isArray(data.uploadedVideos)) {
              data.uploadedVideos.forEach((video) => {
                videoMap.set(video._id.toString(), video);
              });
            }
          }
        } catch (error) {
          console.error("Error fetching videos:", error);
        }

        // Attach videoUrl + duration
        const populatedCurriculum = rawCourse.curriculum.map((sec) => ({
          ...sec,
          items: (sec.items || []).map((item) => {
            if (!item.videoId) return item;
            const meta = videoMap.get(item.videoId.toString());
            return {
              ...item,
              videoUrl: meta?.url || "",
              duration: meta?.duration || 0,
              videoTitle: meta?.title || item.title,
            };
          }),
        }));

        const fullCourse = { ...rawCourse, curriculum: populatedCurriculum };
        setCourse(fullCourse);

        // Open first section by default
        if (populatedCurriculum.length > 0) {
          setOpenSections({
            [populatedCurriculum[0]._id ||
              populatedCurriculum[0].sectionId]: true,
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Helper function to normalize IDs - get all possible ID formats for an item
  const getAllItemIds = (item) => {
    const ids = new Set();
    if (item?._id) ids.add(item._id.toString());
    if (item?.itemId) ids.add(item.itemId.toString());
    if (item?.videoId) ids.add(item.videoId.toString());
    if (item?.quizId) ids.add(item.quizId.toString());
    return ids;
  };

  // Helper function to check if an item is completed using all possible IDs
  const isItemCompleted = (item) => {
    if (!item) return false;
    const itemIds = getAllItemIds(item);
    for (const id of itemIds) {
      if (completedLectures.has(id)) return true;
    }
    return false;
  };

  // SELECT VIDEO EFFECT
  useEffect(() => {
    if (!course) return;

    let selected = null;

    // 1. Try finding by lectureId (URL param)
    if (lectureId) {
      selected = findLectureById(course, lectureId);
      if (!selected) {
        selected = findLectureByVideoId(course, lectureId);
      }
    }

    // 2. Fallback: try finding by location state
    if (!selected && location.state?.lectureId) {
      selected = findLectureById(course, location.state.lectureId);
    }
    if (!selected && location.state?.videoId) {
      selected = findLectureByVideoId(course, location.state.videoId);
    }

    // 3. Last resort: first available lecture
    if (!selected && !lectureId) {
      for (const sec of course.curriculum) {
        const first = sec.items.find(
          (i) => i.type === "lecture" || i.type === "quiz"
        );
        if (first) {
          selected = first;
          break;
        }
      }
    }

    console.log("Setting current content:", selected);
    // Determine type and set state
    if (selected) {
      if (selected.type === "quiz") {
        setSelectedQuiz(selected);
        setCurrentVideo(null);
      } else {
        setCurrentVideo(selected);
        setSelectedQuiz(null);
      }
    } else {
      // Clear both if nothing selected
      setCurrentVideo(null);
      setSelectedQuiz(null);
    }
  }, [course, lectureId, location.state]);

  // Check enrollment and load progress
  useEffect(() => {
    const checkEnrollmentAndLoadProgress = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || !courseId) {
        setCheckingEnrollment(false);
        return;
      }

      // ADMIN BYPASS: Grant access immediately
      if (user?.role === "admin") {
        console.log("Admin access: Bypassing enrollment check");
        setIsEnrolled(true);
        setCheckingEnrollment(false);
          // Load progress for admin
        try {
          const progressRes = await progressAPI.getCourseProgress(courseId);
          const completedLecs = progressRes.data.completedLectures || [];
          const completedQuizzes = progressRes.data.completedQuizzes || [];

          // Check if course is completed
          setIsCourseCompleted(progressRes.data.isCompleted || false);

          // Normalize all IDs from backend
          const completedIds = new Set();
          completedLecs.forEach((l) => {
            if (l.lectureId) completedIds.add(l.lectureId.toString());
            if (l.itemId) completedIds.add(l.itemId.toString());
          });
          completedQuizzes.forEach((q) => {
            if (q.quizId) completedIds.add(q.quizId.toString());
            if (q.itemId) completedIds.add(q.itemId.toString());
          });

          setCompletedLectures(completedIds);
        } catch (e) {
          console.log("Admin progress fetch skipped or failed", e);
        }
        return;
      }

      try {
        // Check enrollment
        const enrollmentRes = await enrollmentAPI.checkEnrollment(courseId);
        setIsEnrolled(enrollmentRes.data.isEnrolled);

        if (enrollmentRes.data.isEnrolled) {
          // Load progress
          const progressRes = await progressAPI.getCourseProgress(courseId);
          const completedLecs = progressRes.data.completedLectures || [];
          const completedQuizzes = progressRes.data.completedQuizzes || [];

          // Check if course is completed
          setIsCourseCompleted(progressRes.data.isCompleted || false);

          // Normalize all IDs from backend - check all possible ID formats
          const completedIds = new Set();
          completedLecs.forEach((l) => {
            if (l.lectureId) completedIds.add(l.lectureId.toString());
            if (l.itemId) completedIds.add(l.itemId.toString());
          });
          completedQuizzes.forEach((q) => {
            if (q.quizId) completedIds.add(q.quizId.toString());
            if (q.itemId) completedIds.add(q.itemId.toString());
          });

          // Also match with course items to ensure we capture all ID formats
          if (course?.curriculum) {
            course.curriculum.forEach((sec) => {
              sec.items?.forEach((item) => {
                const itemIds = getAllItemIds(item);
                // Check if any of the item's IDs match completed IDs from backend
                itemIds.forEach((id) => {
                  if (completedIds.has(id)) {
                    // Add all IDs for this item to completed set
                    itemIds.forEach((itemId) => completedIds.add(itemId));
                  }
                });
              });
            });
          }

          setCompletedLectures(completedIds);

          // Update last accessed
          if (lectureId && course) {
            const currentLecture = findLectureById(course, lectureId);
            if (currentLecture) {
              // Find the section containing this lecture
              let sectionId = null;
              for (const sec of course.curriculum || []) {
                if (sec.items?.some((item) => 
                  item._id?.toString() === currentLecture._id?.toString() ||
                  item.itemId === currentLecture.itemId ||
                  item._id?.toString() === lectureId?.toString() ||
                  item.itemId === lectureId
                )) {
                  sectionId = sec._id || sec.sectionId;
                  break;
                }
              }

              await progressAPI.updateLastAccessed({
                courseId,
                lectureId: currentLecture.videoId || null,
                itemId: currentLecture.itemId || currentLecture._id || lectureId,
                sectionId: sectionId,
              });
            }
          }
        } else {
          // Not enrolled - redirect to course details
          toast.error("You must be enrolled in this course to access lectures");
          navigate(`/course/${courseId}`);
        }
      } catch (err) {
        console.error("Enrollment check error:", err);
        // If not logged in, allow viewing (for preview)
        if (err.response?.status === 401) {
          setIsEnrolled(false);
        } else {
          toast.error("Failed to verify enrollment");
        }
      } finally {
        setCheckingEnrollment(false);
      }
    };

    if (courseId && course) {
      checkEnrollmentAndLoadProgress();
    }
  }, [courseId, course, lectureId]);

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  // Calculate total items (lectures + quizzes) correctly
  const totalItems = course
    ? course.curriculum.reduce(
      (sum, sec) =>
        sum +
        (sec.items || []).filter((item) => item.type === "lecture" || item.type === "quiz").length,
      0
    )
    : 0;

  // Calculate completed items count
  const completedItemsCount = course
    ? course.curriculum.reduce((count, sec) => {
        const sectionCompleted = (sec.items || []).filter((item) => {
          if (item.type !== "lecture" && item.type !== "quiz") return false;
          return isItemCompleted(item);
        }).length;
        return count + sectionCompleted;
      }, 0)
    : 0;

  // Calculate progress percentage
  const progressPercent =
    totalItems > 0
      ? Math.round((completedItemsCount / totalItems) * 100)
      : 0;

  // Update course completion status based on progress
  useEffect(() => {
    if (progressPercent === 100 && totalItems > 0) {
      setIsCourseCompleted(true);
    }
  }, [progressPercent, totalItems]);

  // Download certificate function
  const handleDownloadCertificate = async () => {
    if (!courseId) return;
    
    setDownloadingCertificate(true);
    try {
      const response = await progressAPI.generateCertificate(courseId);
      
      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate_${course?.title?.replace(/[^a-z0-9]/gi, '_') || 'Course'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Certificate downloaded successfully! 🎉");
    } catch (error) {
      console.error("Certificate download error:", error);
      if (error.response?.status === 403) {
        toast.error("Course must be completed to download certificate");
      } else {
        toast.error("Failed to download certificate. Please try again.");
      }
    } finally {
      setDownloadingCertificate(false);
    }
  };

  // Mark lecture as completed
  const markAsCompleted = async (lectureId) => {
    const token = localStorage.getItem("token");
    if (!token || !courseId) {
      toast.error("Please login to track progress");
      return;
    }

    // Find the lecture to get its details
    const lecture = findLectureById(course, lectureId);
    if (!lecture) {
      console.error("Lecture not found:", lectureId);
      return;
    }

    // Get all possible IDs for this lecture
    const allIds = getAllItemIds(lecture);
    if (allIds.size === 0) {
      // Fallback to the provided lectureId
      allIds.add(lectureId.toString());
    }

    // Optimistically update UI - add all IDs
    setCompletedLectures((prev) => {
      const newSet = new Set(prev);
      allIds.forEach((id) => newSet.add(id));
      return newSet;
    });

    try {
      const response = await progressAPI.markLectureComplete({
        courseId,
        lectureId: lecture.videoId || null,
        itemId: lecture.itemId || lecture._id || lectureId,
      });
      
      // Check if course is now completed
      if (response.data?.progress?.isCompleted) {
        setIsCourseCompleted(true);
        toast.success("🎉 Congratulations! Course completed!");
      } else {
        toast.success("Lecture marked as completed!");
      }
    } catch (err) {
      // Revert on error - remove all IDs
      setCompletedLectures((prev) => {
        const newSet = new Set(prev);
        allIds.forEach((id) => newSet.delete(id));
        return newSet;
      });
      toast.error("Failed to mark lecture as completed");
    }
  };

  // -------------------------------------------------------------------
  // OVERVIEW TAB
  // -------------------------------------------------------------------
  const renderOverviewTab = () => {
    if (!course) return <p>Loading...</p>;
    return (
      <div style={{ padding: "10px 20px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "700" }}>
          {course.landingTitle || course.title}
        </h3>

        <p style={{ marginBottom: "10px" }}>{course.landingSubtitle}</p>

        <h4 style={{ fontWeight: "600" }}>🎯 What You'll Learn</h4>
        <ul style={{ marginLeft: "20px" }}>
          {course.learningObjectives?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h4 style={{ fontWeight: "600", marginTop: "16px" }}>
          🧩 Requirements
        </h4>
        <ul style={{ marginLeft: "20px" }}>
          {course.requirements?.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "notes":
        return <p>📝 Notes (coming soon)</p>;
      case "qna":
        return <p>❓ Q&A (coming soon)</p>;
      case "reviews":
        return <p>⭐ Reviews (coming soon)</p>;
      default:
        return null;
    }
  };

  // -------------------------------------------------------------------
  // SIDEBAR LECTURE ROW + DOCUMENTS
  // -------------------------------------------------------------------
  const VideoListItem = ({ vid, isActive }) => {
    // Make sure we have correct ID for navigation
    const lectureId = vid._id || vid.itemId;
    const videoId = vid.videoId;
    const isCompleted = isItemCompleted(vid);

    // Function to handle document click
    const handleDocumentClick = (doc) => {
      navigate(`/resource/${doc.fileName}`, {
        state: {
          fileUrl: doc.fileUrl,
          fileName: doc.fileName,
          courseId: courseId,
          lectureId: lectureId,
        },
      });
    };

    return (
      <div style={{ borderBottom: "1px solid #eee" }}>
        {/* VIDEO ROW */}
        <div
         className={` mb-1 ${
          isActive ? "bg-blue-100 border-l-4 border-blue-500" : ""
        }`}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 20px",
            cursor: "pointer",
            // backgroundColor: isActive ? "#f3e8ff" : "#fff",
            // borderLeft: isActive
            //   ? "4px solid #7e22ce"
            //   : "4px solid transparent",
          }}
          onClick={() => {
            // Use lecture ID for navigation
            navigate(`/lecture/${lectureId}?courseId=${courseId}`, {
              state: {
                lectureId: lectureId,
                videoId: videoId,
                courseId: courseId,
                pendingCourseId: course?.pendingCourseId,
                video: vid,
              },
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
            className="rounded-full w-5 h-5 border flex items-center justify-center border-blue-500"
              // style={{
              //   width: 20,
              //   height: 20,
              //   borderRadius: "50%",
              //   border: isCompleted ? "none" : "2px solid #d1d5db",
              //   backgroundColor: isCompleted ? "#7e22ce" : "transparent",
              //   marginRight: 10,
              //   display: "flex",
              //   alignItems: "center",
              //   justifyContent: "center",
              //   color: isCompleted ? "white" : "transparent",
              //   fontSize: 12,
              // }}
              onClick={(e) => {
                e.stopPropagation();
                markAsCompleted(lectureId);
              }}
            >
              {isCompleted ? <Check className="size-5 text-blue-500" /> : <FaPlayCircle className="size-5 text-blue-500" />}
            </div>
            <span style={{ marginLeft: "10px" }}>{vid.title}</span>
          </div>

          <span style={{ fontSize: "12px", color: "#6b7280" }}>
            {vid.duration
              ? `${Math.floor(vid.duration / 60)}:${String(
                Math.floor(vid.duration % 60)
              ).padStart(2, "0")}`
              : "5:00"}
          </span>
        </div>

        {/* DOCUMENTS LIST UNDER LECTURE */}
        {vid.documents?.length > 0 && (
          <div
            style={{
              paddingLeft: "55px",
              paddingRight: "20px",
              paddingBottom: "12px",
            }}
          >
            {vid.documents.map((doc, i) => (
              <div key={i} style={{ marginTop: "8px" }}>
                <div
                  onClick={() => handleDocumentClick(doc)}
                  style={{
                    color: "#7e22ce",
                    fontSize: "14px",
                    textDecoration: "underline",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                  }}
                >
                  <FaFileAlt /> {doc.fileName}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const QuizListItem = ({ item, isActive }) => {
    // Prioritize _id for navigation to match findLectureById logic
    const quizId = item._id || item.itemId || item.quizId;
    const isCompleted = isItemCompleted(item);

    // Basic styling to match VideoListItem
    return (
      <div
        className={` ${
          isActive ? "bg-blue-100 border-l-4 border-blue-500" : ""
        }`}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 20px",
          cursor: "pointer",
          borderBottom: "1px solid #eee",
          // backgroundColor: isActive ? "#f3e8ff" : "#fff",
          // borderLeft: isActive ? "4px solid #7e22ce" : "4px solid transparent",
        }}
        onClick={() => {
          // Navigate to lecture page (handling quiz as a lecture item)
          navigate(`/lecture/${quizId}?courseId=${courseId}`, {
            state: {
              lectureId: quizId,
              courseId: courseId,
              pendingCourseId: course?.pendingCourseId,
              video: item, // Passing item as video for consistency in state
            },
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            marginRight: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="rounded-full w-5 h-5 border flex items-center justify-center border-blue-500"
            // style={{
            //   width: 20,
            //   height: 20,
            //   borderRadius: "50%",
            //   border: isCompleted ? "none" : "2px solid #d1d5db",
            //   backgroundColor: isCompleted ? "#7e22ce" : "transparent",
            //   marginRight: 10,
            //   display: "flex",
            //   alignItems: "center",
            //   justifyContent: "center",
            //   color: isCompleted ? "white" : "transparent",
            //   fontSize: 12,
            // }}
            onClick={(e) => {
              e.stopPropagation();
              markAsCompleted(quizId);
            }}
          >
            {isCompleted ? (
              <Check className="size-5 text-blue-500" />
            ) : (
              <FaQuestionCircle className="size-5 text-blue-500" />
            )}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "14px" }}>{item.title}</div>
          <span style={{ fontSize: "12px", color: "#6b7280" }}>
            {item.quizQuestions?.length || 0} Questions
          </span>
        </div>
      </div>
    );
  };

  // Loading UI
  if (loading || checkingEnrollment) {
    return (
      <div className="flex items-center w-full h-screen justify-center">
        <Spinner className="text-blue-600 size-12" />
      </div>
    );
  }

  // -------------------------------------------------------------------
  // MAIN RENDER
  // -------------------------------------------------------------------
  return (
    <>
      {/* HEADER */}
      <header
        className="mt-25 font-poppins"
        style={{
          backgroundColor: "#111",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: "#67696b" }}>|</span>
          <span className="text-sm md:text-base">
            {course?.title || "Course"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* 🏆 Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaTrophy className="size-5 text-blue-600" />
            <div>
              <div
                style={{
                  width: "120px",
                  height: "8px",
                  backgroundColor: "#333",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  className="bg-blue-600"
                  style={{
                    height: "100%",
                    width: `${progressPercent}%`,

                    transition: "width 0.4s ease",
                  }}
                ></div>
              </div>
              <span style={{ fontSize: "13px", color: "#d1d5db" }}>
                {completedItemsCount}/{totalItems} items ({progressPercent}%)
              </span>
            </div>
          </div>

          {/* Certificate Download Button */}
          {isCourseCompleted && (
            <button
              onClick={handleDownloadCertificate}
              disabled={downloadingCertificate}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-sm px-4 py-2 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {downloadingCertificate ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FaCertificate />
                  <span>Download Certificate</span>
                </>
              )}
            </button>
          )}

          <button className="flex items-center gap-1 border rounded-sm px-2 py-2">
            <FaShareAlt style={{ marginRight: "6px" }} />
            Share
          </button>
          <FaEllipsisV
            style={{ color: "#d1d5db", cursor: "pointer", fontSize: "18px" }}
          />
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div
        className="flex flex-col md:flex-row min-h-screen px-4 py-5 md:p-0 font-poppins"
      // style={{
      //   display: "flex",
      //   minHeight: "100vh",
      //   backgroundColor: "#f4f6f9",
      // }}
      >
        {/* LEFT: VIDEO PLAYER */}
        <div style={{ flex: 1, padding: "20px" }}>
          <div
            style={{
              backgroundColor: selectedQuiz ? "#181821" : "#000",
              aspectRatio: "16/9",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              display: "flex", // Ensure QuizPlayer fills container
              flexDirection: "column",
            }}
          >
            {selectedQuiz ? (
              <QuizPlayer
                quiz={selectedQuiz}
                courseId={courseId}
                isCompleted={isItemCompleted(selectedQuiz)}
                onComplete={async (score) => {
                  // Update local state to show completion immediately
                  const allIds = getAllItemIds(selectedQuiz);
                  setCompletedLectures((prev) => {
                    const newSet = new Set(prev);
                    allIds.forEach((id) => newSet.add(id));
                    return newSet;
                  });
                  
                  // Check if course is now completed by fetching latest progress
                  try {
                    const progressRes = await progressAPI.getCourseProgress(courseId);
                    if (progressRes.data.isCompleted) {
                      setIsCourseCompleted(true);
                      toast.success("🎉 Congratulations! Course completed!");
                    }
                  } catch (e) {
                    console.log("Failed to check course completion", e);
                  }
                }}
              />
            ) : currentVideo?.videoUrl ? (
              <video
                key={currentVideo._id}
                controls
                autoPlay
                style={{ width: "100%", height: "100%" }}
                onEnded={() => {
                  // Auto-mark video as complete when it ends
                  if (currentVideo && courseId) {
                    const lectureId = currentVideo._id || currentVideo.itemId;
                    markAsCompleted(lectureId);
                  }
                }}
              >
                <source src={currentVideo.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <div
                style={{
                  color: "white",
                  padding: "20px",
                  textAlign: "center",
                  margin: "auto",
                }}
              >
                No video uploaded.
              </div>
            )}
          </div>

          <h2
            style={{ marginTop: "24px", fontSize: "24px", fontWeight: "700" }}
          >
            {currentVideo?.title}
          </h2>

          {/* Course Completion Banner */}
          {isCourseCompleted && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "12px",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                  }}
                >
                  🎉
                </div>
                <div>
                  <h3 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>
                    Congratulations!
                  </h3>
                  <p style={{ fontSize: "14px", margin: "4px 0 0 0", opacity: 0.9 }}>
                    You've successfully completed this course. Download your certificate to showcase your achievement!
                  </p>
                </div>
              </div>
              <button
                onClick={handleDownloadCertificate}
                disabled={downloadingCertificate}
                className="bg-white text-purple-700 hover:bg-gray-100 rounded-lg px-6 py-3 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {downloadingCertificate ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FaCertificate />
                    <span>Get Certificate</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TABS */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #ddd",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                cursor: "pointer",
                borderBottom:
                  activeTab === "overview" ? "3px solid #7e22ce" : "none",
                color: activeTab === "overview" ? "#7e22ce" : "#4b5563",
              }}
              onClick={() => setActiveTab("overview")}
            >
              <FaListAlt /> Overview
            </div>
            <div
              style={{
                padding: "12px 18px",
                cursor: "pointer",
                borderBottom:
                  activeTab === "notes" ? "3px solid #7e22ce" : "none",
                color: activeTab === "notes" ? "#7e22ce" : "#4b5563",
              }}
              onClick={() => setActiveTab("notes")}
            >
              <FaStickyNote /> Notes
            </div>
            <div
              style={{
                padding: "12px 18px",
                cursor: "pointer",
                borderBottom:
                  activeTab === "qna" ? "3px solid #7e22ce" : "none",
                color: activeTab === "qna" ? "#7e22ce" : "#4b5563",
              }}
              onClick={() => setActiveTab("qna")}
            >
              <FaQuestionCircle /> Q&A
            </div>
            <div
              style={{
                padding: "12px 18px",
                cursor: "pointer",
                borderBottom:
                  activeTab === "reviews" ? "3px solid #7e22ce" : "none",
                color: activeTab === "reviews" ? "#7e22ce" : "#4b5563",
              }}
              onClick={() => setActiveTab("reviews")}
            >
              <FaStar /> Reviews
            </div>
          </div>

          {renderTabContent()}
        </div>

        {/* RIGHT SIDEBAR (Course Content) */}
        <div
          style={{
            width: "400px",
            backgroundColor: "#fff",
            borderLeft: "1px solid #ddd",
          }}
        >
          <h2 className="text-lg font-semibold px-3 py-3">Course Content</h2>

          {course?.curriculum?.map((section) => {
            const key = section._id || section.sectionId;

            return (
              <div key={key}>
                {/* Section Header */}
                <div
                  style={{
                    padding: "14px 20px",
                    backgroundColor: "#f8f9fb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleSection(key)}
                >
                  <span>{section.title}</span>
                  {openSections[key] ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                {/* Section Items (lectures + docs) */}
                {openSections[key] && (
                  <div>
                    {(section.items || [])
                      .filter((i) => i.type === "lecture" || i.type === "quiz")
                      .map((item) =>
                        item.type === "quiz" ? (
                          <QuizListItem
                            key={item._id || item.itemId || item.quizId}
                            item={item}
                            isActive={
                              currentVideo?._id === item._id ||
                              currentVideo?.itemId === item.itemId
                            }
                          />
                        ) : (
                          <VideoListItem
                            key={item._id || item.itemId || item.videoId}
                            vid={item}
                            isActive={currentVideo?._id === item._id}
                          />
                        )
                      )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default LectureVideo;
