import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PendingCourseDetails = () => {
  const { pendingCourseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [videos, setVideos] = useState([]);

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

  /* -------------------------------------------
     1️⃣  Fetch Pending Course Details
  ------------------------------------------- */
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${API_BASE}/api/pending-courses/${pendingCourseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        console.log("mohit",data);
        if (!res.ok) throw new Error(data.message || "Failed to fetch course");

        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [pendingCourseId, token]);

  /* -------------------------------------------
     2️⃣  Fetch Videos for This Course
  ------------------------------------------- */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/upload/check/${pendingCourseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (data.success) {
          setVideos(data.uploadedVideos); // List of uploaded videos
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchVideos();
  }, [pendingCourseId]);

  /* -------------------------------------------
           LOADING + ERROR HANDLING
  ------------------------------------------- */
  if (loading)
    return <div style={{ textAlign: "center", marginTop: 60 }}>Loading...</div>;

  if (error)
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: 60 }}>
        {error}
      </div>
    );

  if (!course) return null;

  /* -------------------------------------------
                  RENDER DATA
  ------------------------------------------- */
  return (
    <Card
      className="mt-30 mb-10 mx-auto font-poppins"
      style={{
        maxWidth: 900,

        padding: 32,
        background: "#ffffff",
        borderRadius: 16,
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Back Button */}
      <Button className="w-1/10" onClick={() => navigate(-1)}>
        <ChevronLeft />
        Back
      </Button>
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-4xl font-semibold">Pending Course Preview</h2>
      </div>

      {/* Thumbnail */}
      <div style={{ marginBottom: 32 }}>
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt="Course Thumbnail"
            style={{
              width: "100%",
            maxHeight: 260,
            objectFit: "cover",
            borderRadius: 12,
            boxShadow: "0 3px 12px rgba(0,0,0,0.12)",
          }}
        />
        ) : (
          <p>No Thumbnail uploaded</p>
        )}
      </div>

      {/* DETAILS SECTION */}
      <div style={{ lineHeight: 1.8, fontSize: 17, color: "#333" }}>
        <Detail label="Title" value={course.landingTitle} />
        <Detail label="Subtitle" value={course.landingSubtitle} />
        <Detail label="Description" value={course.landingDesc} />

        <DetailList
          label="Learning Objectives"
          items={course.learningObjectives}
        />
        <DetailList label="Requirements" items={course.requirements} />

        <Detail label="Structure" value={course.structure} />

        {/* -----------------------------------------
                   CURRICULUM SECTION
        ------------------------------------------ */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={sectionTitleStyle}>Curriculum</h3>

          {course.curriculum && course.curriculum.length > 0 ? (
            course.curriculum.map((section, i) => (
              <div
                key={i}
                style={{
                  padding: 16,
                  marginBottom: 16,
                  background: "#f9fafb",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                }}
              >
                {/* Section Title */}
                <h4
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 12,
                    color: "#4b5563",
                  }}
                >
                  {section.title}
                </h4>

                {/* Lectures inside the Section */}
                {section.items?.map((item, idx) => {
                  const matchedVideo = videos.find(
                    (v) => v._id === item.videoId
                  );

                  return (
                    <div
                      key={idx}
                      style={{
                        marginBottom: 12,
                        padding: "12px 14px",
                        background: "#ffffff",
                        borderRadius: 8,
                        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                        border: "1px solid #f3f4f6",
                      }}
                    >
                      {/* Lecture Title */}
                      <strong style={{ fontSize: 16 }}>{item.title}</strong>

                      {/* Video Link */}
                      {matchedVideo ? (
                        <div style={{ marginTop: 6 }}>
                          <video
                            controls
                            style={{
                              marginTop: 10,
                              width: "100%",
                              maxHeight: "300px",
                              borderRadius: 8,
                              background: "#000",
                            }}
                          >
                            <source src={matchedVideo.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ) : (
                        <p style={{ color: "#9ca3af", marginTop: 4 }}>
                          No video uploaded
                        </p>
                      )}

                      {/* Documents */}
                      {item.documents?.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                          <strong>Documents:</strong>
                          <ul style={{ paddingLeft: 16, marginTop: 4 }}>
                            {item.documents.map((doc, d) => (
                              <li key={d}>
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ color: "#2563eb", fontWeight: 500 }}
                                >
                                  {doc.fileName}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <p style={{ color: "#6b7280" }}>No curriculum added.</p>
          )}
        </div>

        {/* OTHER FIELDS */}
        <Detail label="Captions" value={course.captions} />
        <Detail label="Accessibility" value={course.accessibility} />
        <Detail label="Price" value={course.price} />
        <Detail label="Promo Code" value={course.promoCode} />
        <Detail label="Promo Description" value={course.promoDesc} />
        <Detail label="Welcome Message" value={course.welcomeMsg} />
        <Detail label="Congrats Message" value={course.congratsMsg} />

        <Detail
          label="Instructor"
          value={`${course.instructor?.name} (${course.instructor?.email})`}
        />

        <Detail label="Status" value={course.status} />
        <Detail
          label="Submitted On"
          value={new Date(course.createdAt).toLocaleString()}
        />
      </div>
    </Card>
  );
};

/* ---------- REUSABLE COMPONENTS ---------- */

const Detail = ({ label, value }) => (
  <p style={{ marginBottom: 10 }}>
    <strong>{label}: </strong> {value || "—"}
  </p>
);

const DetailList = ({ label, items }) => (
  <div style={{ marginBottom: 12 }}>
    <strong>{label}:</strong>
    {items && items.length > 0 ? (
      <ul style={{ paddingLeft: 20 }}>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    ) : (
      <p style={{ color: "#6b7280", marginTop: 4 }}>
        No {label.toLowerCase()} added.
      </p>
    )}
  </div>
);

const sectionTitleStyle = {
  fontSize: 20,
  fontWeight: 800,
  marginBottom: 16,
  color: "#1f2937",
};

export default PendingCourseDetails;
