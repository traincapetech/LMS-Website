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
  FaFileAlt
} from "react-icons/fa";

const LectureVideo = () => {
  const { videoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const API_BASE = "http://localhost:5001";

  const searchParams = new URLSearchParams(location.search);
  const courseId =
    location.state?.courseId ||
    location.state?.courseId?.id ||
    searchParams.get("courseId");

  const [course, setCourse] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [activeTab, setActiveTab] = useState("overview");

  const findLectureById = (courseData, itemId) => {
    if (!courseData?.curriculum) return null;
    for (const sec of courseData.curriculum) {
      for (const item of sec.items) {
        if (item._id?.toString() === itemId?.toString()) {
          return item;
        }
      }
    }
    return null;
  };

  // -------------------------------------------------------------------
  // FETCH COURSE + VIDEO DETAILS
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!courseId) return;

    const fetchCourseAndVideos = async () => {
      try {
        const courseRes = await fetch(`${API_BASE}/api/courses/${courseId}`);
        const rawCourse = await courseRes.json();

        if (!rawCourse.curriculum) return;

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
        await Promise.all(
          videoIds.map(async (id) => {
            const vRes = await fetch(`${API_BASE}/api/upload/check/${id}`);
            if (!vRes.ok) return;
            const data = await vRes.json();
            if (data.video) videoMap.set(id, data.video);
          })
        );

        // Attach videoUrl + duration to each item
        const populatedCurriculum = rawCourse.curriculum.map((sec) => ({
          ...sec,
          items: (sec.items || []).map((item) => {
            if (!item.videoId) return item;
            const meta = videoMap.get(item.videoId.toString());
            return {
              ...item,
              videoUrl: meta?.url || item.videoUrl || "",
              duration: meta?.duration || item.duration,
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
            populatedCurriculum[0].sectionId]: true
          });
        }

        // Set current video
        let selected = null;
        if (location.state?.video?._id)
          selected = findLectureById(fullCourse, location.state.video._id);
        if (!selected && videoId)
          selected = findLectureById(fullCourse, videoId);

        if (!selected) {
          // fallback → first lecture
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
      }
    };

    fetchCourseAndVideos();
  }, [courseId, videoId, location.state]);

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

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

        <h4 style={{ fontWeight: "600" }}>🎯 What You’ll Learn</h4>
        <ul style={{ marginLeft: "20px" }}>
          {course.learningObjectives?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h4 style={{ fontWeight: "600", marginTop: "16px" }}>🧩 Requirements</h4>
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
          }}
          onClick={() => {
            setCurrentVideo(vid);
            navigate(`/lecture/${vid._id}?courseId=${courseId}`, {
              state: { courseId, video: vid },
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaPlayCircle style={{ color: "#7e22ce" }} />
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
          <div style={{ paddingLeft: "55px", paddingRight: "20px", paddingBottom: "12px" }}>
            {vid.documents.map((doc, i) => (
              <div key={i} style={{ marginTop: "8px" }}>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#7e22ce",
                    fontSize: "14px",
                    textDecoration: "underline",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <FaFileAlt /> {doc.fileName}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // -------------------------------------------------------------------
  // MAIN RENDER
  // -------------------------------------------------------------------
  return (
    <>
      {/* HEADER */}
      <header
        style={{
          backgroundColor: "#111",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "22px", color: "#a855f7" }}>
            TrainCapeTechLMS
          </span>
          <span style={{ color: "#67696b" }}>|</span>
          <span>{course?.landingTitle || "Course"}</span>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f6f9" }}>
        {/* LEFT: VIDEO PLAYER */}
        <div style={{ flex: 1, padding: "20px" }}>
          <div
            style={{
              backgroundColor: "#000",
              aspectRatio: "16/9",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            {currentVideo?.videoUrl ? (
              <video controls autoPlay style={{ width: "100%", height: "100%" }}>
                <source src={currentVideo.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <div style={{ color: "white", padding: "20px", textAlign: "center" }}>
                No video uploaded.
              </div>
            )}
          </div>

          <h2 style={{ marginTop: "24px", fontSize: "24px", fontWeight: "700" }}>
            {currentVideo?.title}
          </h2>

          {/* TABS */}
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

        {/* RIGHT SIDEBAR (Course Content) */}
        <div
          style={{
            width: "400px",
            backgroundColor: "#fff",
            borderLeft: "1px solid #ddd",
          }}
        >
          <div
            style={{
              fontWeight: "700",
              padding: "16px 20px",
              borderBottom: "1px solid #ddd",
            }}
          >
            📚 Course Content
          </div>

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
                      .filter((i) => i.type === "lecture")
                      .map((vid) => (
                        <VideoListItem
                          key={vid._id || vid.itemId}
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
    </>
  );
};

export default LectureVideo;
