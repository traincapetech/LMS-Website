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
} from "react-icons/fa";
import { useStore } from "../Store/store";

const LectureVideo = () => {
  const { lectureId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

  const searchParams = new URLSearchParams(location.search);
  const courseId =
    location.state?.courseId ||
    location.state?.courseId?.id ||
    searchParams.get("courseId");

  const [course, setCourse] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [completedLectures, setCompletedLectures] = useState(new Set()); // Track completed lectures
  const [loading, setLoading] = useState(true); // Loading state
  // const { loading, error, fetchCoursesById, coursesById: rawCourse } = useStore();


  const findLectureById = (courseData, itemId) => {
    if (!courseData?.curriculum) return null;
    for (const sec of courseData.curriculum) {
      for (const item of sec.items) {
        const id = item._id || item.id || item.itemId;

        if (id?.toString() === itemId?.toString()) {
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

  // FETCH COURSE + VIDEO DETAILS
  useEffect(() => {
    if (!courseId) return;

    const fetchCourseAndVideos = async () => {
      try {
        setLoading(true); // Start loading

        const courseRes = await fetch(`${API_BASE}/api/courses/${courseId}`);
        const rawCourse = await courseRes.json();
        //  fetchCoursesById(courseId);

        if (!rawCourse.curriculum) return;

        // Extract pendingCourseId from the course data
        const pendingCourseId = rawCourse.pendingCourseId;

        // Collect video IDs
        const videoIds = [
          ...new Set(
            rawCourse.curriculum.flatMap((sec) =>
              (sec.items || [])
                .filter((i) => i.videoId)
                .map((i) => i.videoId.toString())
            )
          ),
        ];

        // Fetch video metadata
        const videoMap = new Map();
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

        // Attach videoUrl + duration to each item
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

        // Open first section
        if (populatedCurriculum.length > 0) {
          setOpenSections({
            [populatedCurriculum[0]._id ||
              populatedCurriculum[0].sectionId]: true,
          });
        }

        // Set current video - prioritize the lecture ID from URL
        let selected = null;

        // First try to find by lecture ID from URL
        if (lectureId) {
          selected = findLectureById(fullCourse, lectureId);



          // If not found by lecture ID, try to find by video ID
          if (!selected) {
            selected = findLectureByVideoId(fullCourse, lectureId);
          }
        }

        // If not found, try to find by lecture ID from state
        if (!selected && location.state?.lectureId) {
          selected = findLectureById(fullCourse, location.state.lectureId);
        }

        // If still not found, try to find by video ID from state
        if (!selected && location.state?.videoId) {
          selected = findLectureByVideoId(fullCourse, location.state.videoId);
        }

        // Final fallback to the first available video
        if (!selected) {
          for (const sec of populatedCurriculum) {
            const first = sec.items.find((i) => i.type === "lecture");
            if (first) {
              selected = first;
              break;
            }
          }
        }

        setCurrentVideo(selected);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchCourseAndVideos();
  }, [courseId, lectureId, location.state]);

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  // Calculate total lectures correctly
  const totalLectures = course
    ? course.curriculum.reduce(
      (sum, sec) =>
        sum +
        (sec.items || []).filter((item) => item.type === "lecture").length,
      0
    )
    : 0;

  // Calculate progress percentage
  const progressPercent =
    totalLectures > 0
      ? Math.round((completedLectures.size / totalLectures) * 100)
      : 0;

  // Mark lecture as completed
  const markAsCompleted = (lectureId) => {
    setCompletedLectures((prev) => new Set(prev).add(lectureId));
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
    // Ensure fallback to 'id' if '_id' is missing
    const lectureId = vid._id || vid.id || vid.itemId;
    const videoId = vid.videoId;
    const isCompleted = completedLectures.has(lectureId);

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
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 20px",
            cursor: "pointer",
            backgroundColor: isActive ? "#f3e8ff" : "#fff",
            borderLeft: isActive
              ? "4px solid #7e22ce"
              : "4px solid transparent",
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
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: isCompleted ? "none" : "2px solid #d1d5db",
                backgroundColor: isCompleted ? "#7e22ce" : "transparent",
                marginRight: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isCompleted ? "white" : "transparent",
                fontSize: 12,
              }}
              onClick={(e) => {
                e.stopPropagation();
                markAsCompleted(lectureId);
              }}
            >
              {isCompleted && "✓"}
            </div>
            {vid.type === "quiz" ? (
              <FaQuestionCircle style={{ color: "#7e22ce" }} />
            ) : (
              <FaPlayCircle style={{ color: "#7e22ce" }} />
            )}
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

  // Loading UI
  if (loading) {
    return (
      <div
        style={{
          background: "#181821",
          minHeight: "100vh",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, color: "#f4c150" }}>Loading video...</div>
          <div style={{ color: "#b1b1b1" }}>Please wait.</div>
        </div>
      </div>
    );
  }


  console.log("currentVideo", currentVideo);
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
          <span className="text-sm md:text-base">{course?.title || "Course"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* 🏆 Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaTrophy style={{ color: "#a855f7", fontSize: "18px" }} />
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
                  style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    backgroundColor: "#a855f7",
                    transition: "width 0.4s ease",
                  }}
                ></div>
              </div>
              <span style={{ fontSize: "13px", color: "#d1d5db" }}>
                {completedLectures.size}/{totalLectures} lectures (
                {progressPercent}%)
              </span>
            </div>
          </div>

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
      <div className="flex flex-col md:flex-row min-h-screen px-4 py-5 md:p-0 font-poppins"
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
              backgroundColor: "#000",
              aspectRatio: "16/9",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >

            {/* START: Modified Main Content Area */}
            {currentVideo?.type === "quiz" ? (
              // ----------------- QUIZ VIEW -----------------
              <div style={{ padding: "40px", backgroundColor: "#fff", minHeight: "400px" }}>
                <h2 className="text-2xl font-bold mb-4">📝 Quiz: {currentVideo.title}</h2>

                {currentVideo.questions && currentVideo.questions.length > 0 ? (
                  <div className="space-y-6">
                    {currentVideo.questions.map((q, index) => (
                      <div key={index} className="border p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg mb-3">
                          {index + 1}. {q.question || q.text} {/* Adjust based on your DB schema */}
                        </h3>
                        <div className="space-y-2">
                          {q.options && q.options.map((opt, optIndex) => (
                            // Adjust logic based on how you saved options (array of strings or objects)
                            <div key={optIndex} className="flex items-center gap-2">
                              <input type="radio" name={`question-${index}`} id={`q${index}-opt${optIndex}`} />
                              <label htmlFor={`q${index}-opt${optIndex}`}>{opt.text || opt}</label>
                            </div>
                          ))}
                          {/* Fallback if you used 'answers' array in useQuiz.js */}
                          {q.answers && q.answers.map((ans, ansIndex) => (
                            <div key={ansIndex} className="flex items-center gap-2">
                              <input type="radio" name={`question-${index}`} />
                              <label>{ans.text}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button className="mt-5 px-4 py-2 bg-purple-600 text-white rounded">
                      Submit Quiz
                    </button>
                  </div>
                ) : (
                  <p>No questions in this quiz.</p>
                )}
              </div>
            ) : currentVideo?.videoUrl ? (
              // ----------------- VIDEO VIEW -----------------
              <video
                key={currentVideo._id}
                controls
                autoPlay
                style={{ width: "100%", height: "100%" }}
              >
                <source src={currentVideo.videoUrl} type="video/mp4" />
              </video>
            ) : (
              // ----------------- EMPTY VIEW -----------------
              <div style={{ color: "white", padding: "20px", textAlign: "center" }}>
                Select a lecture or quiz to start.
              </div>
            )}
            {/* END: Modified Main Content Area */}
          </div>

          <h2
            style={{ marginTop: "24px", fontSize: "24px", fontWeight: "700" }}
          >
            {currentVideo?.title}
          </h2>

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
                      .map((vid) => (
                        <VideoListItem
                          key={vid._id || vid.itemId || vid.videoId}
                          vid={vid}
                          isActive={currentVideo?._id === vid._id}
                        />
                      ))}
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
