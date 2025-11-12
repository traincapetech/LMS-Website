import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getCourseById } from "./CourseData";
import {
  FaChevronDown,
  FaChevronUp,
  FaPlayCircle,
  FaCheckCircle,
  FaClock,
  FaListAlt,
  FaQuestionCircle,
  FaStar,
  FaStickyNote,
  FaTrophy,
  FaShareAlt,
  FaEllipsisV,
} from "react-icons/fa";

const LectureVideo = () => {
  const { videoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const courseId =
    location.state?.courseId?.id ||
    location.pathname.split("/")[2]?.toLowerCase();

  const [course, setCourse] = useState(null);
  const allVideos = location.state?.videos || [];
  const initialVideo = location.state?.video;
  const [currentVideo, setCurrentVideo] = useState(initialVideo || null);
  const [openSections, setOpenSections] = useState({ 0: true });
  const [activeTab, setActiveTab] = useState("overview");
  const [documents, setDocuments] = useState([]); // 📄 Store uploaded docs

  // 🎓 Demo fallback
  const demoCourse = [
    {
      sectionTitle: "Introduction to React (3 Lectures)",
      videos: [
        { _id: "v1", title: "Welcome to the Course", duration: "4:12", completed: true },
        { _id: "v2", title: "What is React?", duration: "6:45", completed: true },
        { _id: "v3", title: "React Project Setup", duration: "8:10", completed: false },
      ],
    },
    {
      sectionTitle: "Components & Props (3 Lectures)",
      videos: [
        { _id: "v4", title: "Functional Components", duration: "10:20", completed: false },
        { _id: "v5", title: "Class Components", duration: "7:55", completed: true },
        { _id: "v6", title: "Props in React", duration: "6:05", completed: false },
      ],
    },
  ];

  // 🔹 Fetch course data + documents
  useEffect(() => {
    if (courseId) {
      const fetchedCourse = getCourseById(courseId);
      setCourse(fetchedCourse);
    }

    if (!initialVideo && allVideos.length > 0) {
      const found = allVideos.find((v) => v._id === videoId);
      setCurrentVideo(found || allVideos[0]);
    }

    if (!currentVideo) {
      setCurrentVideo(demoCourse[0].videos[0]);
    }

    // 📄 Fetch all uploaded documents from backend
    const fetchDocuments = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/document/all`);
        const data = await res.json();
        if (data.success) setDocuments(data.documents);
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    };
    fetchDocuments();
  }, [videoId, courseId, allVideos, initialVideo]);

  const toggleSection = (index) =>
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));

  // 🧮 Calculate progress
  const totalLectures = demoCourse.reduce(
    (sum, sec) => sum + sec.videos.length,
    0
  );
  const completedLectures = demoCourse.reduce(
    (sum, sec) => sum + sec.videos.filter((v) => v.completed).length,
    0
  );
  const progressPercent = Math.round((completedLectures / totalLectures) * 100);

  // ✅ Overview Tab
  const renderOverviewTab = () => {
    if (!course) return <p>Loading course overview...</p>;

    return (
      <div style={{ padding: "10px 20px", color: "#4b5563" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "10px" }}>
          {course.title}
        </h3>
        <p style={{ marginBottom: "12px" }}>{course.description}</p>

        <h4 style={{ fontWeight: "600", marginTop: "16px" }}>🎯 What You’ll Learn</h4>
        <ul style={{ marginLeft: "20px" }}>
          {course.whatYouWillLearn.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h4 style={{ fontWeight: "600", marginTop: "16px" }}>🧩 Requirements</h4>
        <ul style={{ marginLeft: "20px" }}>
          {course.requirements.map((req, i) => (
            <li key={i}>{req}</li>
          ))}
        </ul>

        <h4 style={{ fontWeight: "600", marginTop: "16px" }}>📦 Includes</h4>
        <ul style={{ marginLeft: "20px" }}>
          {course.includes.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <p style={{ marginTop: "16px", fontSize: "14px", color: "#6b7280" }}>
          🕒 Total Duration: {course.courseContent.totalLength} | 📚{" "}
          {course.courseContent.totalLectures} Lectures
        </p>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "notes":
        return <p>📝 Add personal notes for this lecture here.</p>;
      case "qna":
        return <p>❓ Ask and answer questions related to this lecture.</p>;
      case "reviews":
        return <p>⭐ Average course rating: {course?.rating || "4.6"} / 5</p>;
      default:
        return null;
    }
  };

  // 🎨 Styles
  const styles = {
    header: {
      backgroundColor: "#111",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px",
      borderBottom: "1px solid #333",
      position: "sticky",
      top: 0,
      zIndex: 1000,
    },
    progressBarContainer: {
      width: "120px",
      height: "8px",
      backgroundColor: "#333",
      borderRadius: "4px",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      width: `${progressPercent}%`,
      backgroundColor: "#a855f7",
      transition: "width 0.4s ease",
    },
    progressText: {
      fontSize: "13px",
      color: "#d1d5db",
    },
    logo: {
      fontSize: "22px",
      fontWeight: "700",
      color: "#a855f7",
      letterSpacing: "0.5px",
    },
    courseTitle: {
      fontSize: "16px",
      color: "#e5e7eb",
      fontWeight: "500",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "600px",
    },
    container: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f4f6f9",
      color: "#1f2937",
    },
    videoSection: {
      flex: 1,
      maxWidth: "calc(100% - 300px)",
    },
    videoPlayer: {
      position: "relative",
      backgroundColor: "#000",
      overflow: "hidden",
      aspectRatio: "16/9",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    },
    sidebar: {
      width: "400px",
      backgroundColor: "#fff",
      overflowY: "auto",
      boxShadow: "-4px 0 10px rgba(0,0,0,0.05)",
      flexShrink: 0,
    },
    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#f8f9fb",
      padding: "14px 20px",
      fontWeight: "600",
      cursor: "pointer",
      borderBottom: "1px solid #e5e7eb",
      color: "#1f2937",
    },
    videoItem: (isActive, isCompleted) => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 20px",
      borderLeft: isActive ? "4px solid #7e22ce" : "4px solid transparent",
      backgroundColor: isActive ? "#f3e8ff" : "#fff",
      color: isActive ? "#7e22ce" : isCompleted ? "#6b7280" : "#1f2937",
      fontWeight: isActive ? "600" : "400",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "14px",
    }),
  };

  // 📘 Each video row with resource link
  const VideoListItem = ({ vid, isActive, onClick }) => {
    const statusIcon = vid.completed ? (
      <FaCheckCircle style={{ color: isActive ? "#7e22ce" : "#10b981" }} />
    ) : (
      <FaPlayCircle style={{ color: "#7e22ce" }} />
    );

    return (
      <div style={styles.videoItem(isActive, vid.completed)} onClick={onClick}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {statusIcon}
          <span style={{ marginLeft: "10px" }}>{vid.title}</span>
        </div>
        <span style={{ fontSize: "12px", color: isActive ? "#7e22ce" : "#6b7280" }}>
          {/* 🔗 Resource link opens uploaded doc */}
          {documents.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/resource/${documents[0]._id}`, { state: { fileUrl: documents[0].fileUrl } });
              }}
              style={{
                fontSize: "13px",
                color: "#7e22ce",
                cursor: "pointer",
                marginLeft: "28px",
              }}
            >
              📘 View Resource
            </span>
          )}

          <FaClock style={{ marginRight: "4px" }} />
          {vid.duration}
        </span>
      </div>
    );
  };

  return (
    <>
      {/* 🧭 Header */}
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={styles.logo}>TrainCapeTechLMS</span>
          <span style={{ color: "#67696bff", fontSize: "18px" }}>|</span>
          <span style={styles.courseTitle}>
            {course?.title || "Data Engineering Essentials using SQL, Python, and PySpark"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* 🏆 Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaTrophy style={{ color: "#a855f7", fontSize: "18px" }} />
            <div>
              <div style={styles.progressBarContainer}>
                <div style={styles.progressFill}></div>
              </div>
              <span style={styles.progressText}>
                {completedLectures}/{totalLectures} lectures ({progressPercent}%)
              </span>
            </div>
          </div>

          <button
            style={{
              border: "1px solid #d1d5db",
              color: "#fff",
              background: "transparent",
              borderRadius: "4px",
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            <FaShareAlt style={{ marginRight: "6px" }} />
            Share
          </button>
          <FaEllipsisV style={{ color: "#d1d5db", cursor: "pointer", fontSize: "18px" }} />
        </div>
      </header>

      {/* 🎬 Layout */}
      <div style={styles.container}>
        <div style={styles.videoSection}>
          <div style={styles.videoPlayer}>
            {currentVideo && (
              <video
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                controls
                autoPlay
              >
                <source src={currentVideo.videoUrl || ""} type="video/mp4" />
              </video>
            )}
          </div>

          <h2 style={{ marginTop: "24px", fontSize: "24px", fontWeight: "700" }}>
            {currentVideo?.title || "Welcome to the Course"}
          </h2>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #ddd", marginTop: "20px" }}>
            <div
              style={{
                padding: "12px 18px",
                cursor: "pointer",
                borderBottom: activeTab === "overview" ? "3px solid #7e22ce" : "none",
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
                borderBottom: activeTab === "notes" ? "3px solid #7e22ce" : "none",
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
                borderBottom: activeTab === "qna" ? "3px solid #7e22ce" : "none",
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
                borderBottom: activeTab === "reviews" ? "3px solid #7e22ce" : "none",
                color: activeTab === "reviews" ? "#7e22ce" : "#4b5563",
              }}
              onClick={() => setActiveTab("reviews")}
            >
              <FaStar /> Reviews
            </div>
          </div>

          {renderTabContent()}
        </div>

        {/* 📚 Sidebar */}
        <div style={styles.sidebar}>
          <div style={{ fontWeight: "700", padding: "16px 20px", borderBottom: "1px solid #ddd" }}>
            📚 Course Content
          </div>
          {demoCourse.map((section, index) => (
            <div key={index}>
              <div style={styles.sectionHeader} onClick={() => toggleSection(index)}>
                <span>{section.sectionTitle}</span>
                {openSections[index] ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {openSections[index] && (
                <div>
                  {section.videos.map((vid) => (
                    <VideoListItem
                      key={vid._id}
                      vid={vid}
                      isActive={currentVideo?._id === vid._id}
                      onClick={() => setCurrentVideo(vid)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LectureVideo;
