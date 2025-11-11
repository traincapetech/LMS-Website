import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const LectureVideo = () => {
  const { videoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [titleVideos, setTitle] = useState([])
  const { id } = useParams();
  // 🎬 Get all videos and the selected one from location.state
  const allVideos = location.state?.videos || [];
  const initialVideo = location.state?.video;


  const [currentVideo, setCurrentVideo] = useState(initialVideo || null);
  const [openSection, setOpenSection] = useState(true); // sidebar toggle

  useEffect(() => {
    // If the user directly lands on this page (no state passed)
    if (!initialVideo && allVideos.length > 0) {
      const found = allVideos.find((v) => v._id === videoId);
      setCurrentVideo(found || allVideos[0]);
    }
  }, [videoId, allVideos, initialVideo]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Case 1: State is already passed from CourseDetails
        if (allVideos.length > 0) return;

        // Case 2: User directly visits the page
        const resSingle = await fetch(`http://localhost:5001/api/videos/${videoId}`);
        const videoData = await resSingle.json();

        if (!videoData.success) return;
        setCurrentVideo(videoData.video);  // Set the current video

        // Now fetch all videos of that course
        const courseId = videoData.video.courseId;
        const resAll = await fetch(`http://localhost:5001/api/videos/course/${courseId}`);
        const allCourseVideos = await resAll.json();

        if (allCourseVideos.success) {
          setTitle(allCourseVideos.videos);
        }
      } catch (err) {
        console.error("Error fetching course videos:", err);
      }
    };

    fetchVideos();
  }, [videoId]);


  const toggleSection = () => setOpenSection(!openSection);

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      color: "#1f2937",
    },
    videoSection: {
      flex: 1,
      padding: "24px",
    },
    videoPlayer: {
      position: "relative",
      backgroundColor: "#000",
      borderRadius: "12px",
      overflow: "hidden",
      aspectRatio: "16/9",
    },
    video: {
      width: "100%",
      height: "100%",
      borderRadius: "12px",
      objectFit: "cover",
    },
    sidebar: {
      width: "380px",
      borderLeft: "1px solid #d1d5db",
      backgroundColor: "#fff",
      padding: "16px",
      overflowY: "auto",
    },
    videoItem: (isActive) => ({
      padding: "10px 12px",
      borderRadius: "6px",
      marginBottom: "6px",
      cursor: "pointer",
      backgroundColor: isActive ? "#7e22ce" : "#f3f4f6",
      color: isActive ? "#fff" : "#374151",
      fontWeight: isActive ? "600" : "400",
      transition: "all 0.3s ease",
    }),
  };

  return (
    <div style={styles.container}>
      {/* Left Side - Video Player */}
      <div style={styles.videoSection}>
        <div style={styles.videoPlayer}>
          {currentVideo ? (
            <video
              style={styles.video}
              controls
              poster={currentVideo.thumbnailUrl || ""}
            >
              <source src={currentVideo.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div
              style={{
                color: "#fff",
                textAlign: "center",
                padding: "100px",
              }}
            >
              <p>No video selected.</p>
              <button
                onClick={() => navigate(-1)}
                style={{
                  background: "#7e22ce",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 20px",
                  marginTop: "16px",
                  cursor: "pointer",
                }}
              >
                Go Back
              </button>
            </div>
          )}
        </div>

        {/* Video title */}
        <h2 style={{ marginTop: "20px", fontSize: "18px", fontWeight: "600" }}>
          {currentVideo?.title || "Video Player"}
        </h2>
      </div>

      {/* Right Side - Sidebar */}
      <div style={styles.sidebar}>
        <div
          onClick={toggleSection}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f3f4f6",
            padding: "12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <h3 style={{ fontWeight: "600", fontSize: "16px" }}>Course content</h3>
          {openSection ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {openSection && (
          <div style={{ marginTop: "12px" }}>
            {titleVideos && titleVideos.length > 0 ? (
              titleVideos.map((vid, index) => (
                <div
                  key={vid._id}
                  style={styles.videoItem(currentVideo?._id === vid._id)}
                  onClick={() =>
                    navigate(`/play-video/${vid._id}`, {
                      state: { video: vid, videos: titleVideos },
                    })
                  }
                >
                  🎬 {vid.title}
                </div>
              ))
            ) : (
              <p style={{ color: "#6b7280" }}>No videos available</p>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default LectureVideo;
