import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PendingCourseDetails = () => {
  const { pendingCourseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [videos, setVideos] = useState([]);
  const [adminMessage, setAdminMessage] = useState("");
  const [adminPrice, setAdminPrice] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://lms-backend-5s5x.onrender.com";

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
        console.log("mohit", data);
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

  useEffect(() => {
    if (course?.price !== undefined && course?.price !== null) {
      setAdminPrice(String(course.price));
    }
  }, [course?.price]);

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

  const publishedCourse = course?.publishedCourse || null;
  const isUpdate = Boolean(course?.courseId);

  const hasChanged = (pendingValue, publishedValue) => {
    if (publishedValue === undefined || publishedValue === null) return false;
    if (Array.isArray(pendingValue) || Array.isArray(publishedValue)) {
      return JSON.stringify(pendingValue || []) !== JSON.stringify(publishedValue || []);
    }
    return String(pendingValue || "") !== String(publishedValue || "");
  };

  const changeMap = useMemo(() => {
    if (!course || !publishedCourse) return {};
    return {
      landingTitle: hasChanged(course.landingTitle, publishedCourse.landingTitle),
      landingSubtitle: hasChanged(course.landingSubtitle, publishedCourse.landingSubtitle),
      landingDesc: hasChanged(course.landingDesc, publishedCourse.landingDesc),
      price: hasChanged(course.price, publishedCourse.price),
      learningObjectives: hasChanged(course.learningObjectives, publishedCourse.learningObjectives),
      requirements: hasChanged(course.requirements, publishedCourse.requirements),
      structure: hasChanged(course.structure, publishedCourse.structure),
      captions: hasChanged(course.captions, publishedCourse.captions),
      accessibility: hasChanged(course.accessibility, publishedCourse.accessibility),
      promoCode: hasChanged(course.promoCode, publishedCourse.promoCode),
      promoDesc: hasChanged(course.promoDesc, publishedCourse.promoDesc),
      welcomeMsg: hasChanged(course.welcomeMsg, publishedCourse.welcomeMsg),
      congratsMsg: hasChanged(course.congratsMsg, publishedCourse.congratsMsg),
      curriculum: hasChanged(course.curriculum, publishedCourse.curriculum),
    };
  }, [course, publishedCourse]);

  /* -------------------------------------------
           LOADING + ERROR HANDLING
  ------------------------------------------- */
  if (loading) {
    return (
      <div className="flex items-center w-full h-screen justify-center">
        <Spinner className="text-blue-600 size-12" />
      </div>
    );
  }
  if (error)
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: 60 }}>
        {error}
      </div>
    );

  if (!course) return null;

  const handleCourseAction = async (action) => {
    try {
      const payload = {
        adminMessage,
      };
      if (action === "approve") {
        payload.adminPrice = adminPrice;
      }
      const res = await fetch(
        `${API_BASE}/api/pending-courses/${pendingCourseId}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Action failed");
      }
      alert(data.message || `Course ${action}ed`);
      navigate(-1);
    } catch (err) {
      alert(err.message);
    }
  };

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
      {isUpdate && (
        <div
          style={{
            marginBottom: 20,
            padding: "10px 14px",
            borderRadius: 8,
            background: "#eef2ff",
            color: "#3730a3",
            fontWeight: 600,
          }}
        >
          This is an update to an existing published course. Changes are highlighted.
        </div>
      )}

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
        <Detail label="Title" value={course.landingTitle} highlight={changeMap.landingTitle} />
        <Detail label="Subtitle" value={course.landingSubtitle} highlight={changeMap.landingSubtitle} />
        <Detail label="Description" value={course.landingDesc} highlight={changeMap.landingDesc} />

        <DetailList
          label="Learning Objectives"
          items={course.learningObjectives}
          highlight={changeMap.learningObjectives}
        />
        <DetailList label="Requirements" items={course.requirements} highlight={changeMap.requirements} />

        <Detail label="Structure" value={course.structure} highlight={changeMap.structure} />

        {/* -----------------------------------------
                   CURRICULUM SECTION
        ------------------------------------------ */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={sectionTitleStyle}>
            Curriculum{" "}
            {changeMap.curriculum && (
              <span style={highlightBadgeStyle}>Changed</span>
            )}
          </h3>

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
                      {item.type === "lecture" && (
                        <>
                          {" "}
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
                                <source
                                  src={matchedVideo.url}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : (
                            <p style={{ color: "#9ca3af", marginTop: 4 }}>
                              No video uploaded
                            </p>
                          )}
                        </>
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

                      {/* Quiz Questions */}
                      {item.type === "quiz" && (
                        <>
                          {item.quizQuestion?.length > 0 ? (
                            <div style={{ marginTop: 14 }}>
                              <strong style={{ color: "#4b5563" }}>
                                Quiz Questions:
                              </strong>
                              <div
                                style={{
                                  marginTop: 6,
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 10,
                                }}
                              >
                                {item.quizQuestion.map((q, qIdx) => (
                                  <div
                                    key={qIdx}
                                    style={{
                                      padding: 10,
                                      background: "#f8f9fa",
                                      borderRadius: 6,
                                      border: "1px solid #e9ecef",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: 15,
                                        fontWeight: 600,
                                        color: "#111",
                                      }}
                                    >
                                      {qIdx + 1}.{" "}
                                      {q.question || "No Question Text"}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: 12,
                                        color: "#666",
                                        marginTop: 2,
                                      }}
                                    >
                                      Type:{" "}
                                      <span style={{ fontWeight: 500 }}>
                                        {q.type}
                                      </span>
                                    </div>

                                    <div
                                      style={{ marginTop: 6, paddingLeft: 8 }}
                                    >
                                      {q.answers?.map((ans, aIdx) => (
                                        <div
                                          key={aIdx}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginTop: 3,
                                            fontSize: 14,
                                            color: ans.correct
                                              ? "#16a34a"
                                              : "#374151",
                                            fontWeight: ans.correct ? 600 : 400,
                                          }}
                                        >
                                          <span style={{ marginRight: 8 }}>
                                            {ans.correct ? "✅" : "⚪"}
                                          </span>
                                          {ans.text}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p style={{ color: "#9ca3af", marginTop: 4 }}>
                              No quiz uploaded
                            </p>
                          )}
                        </>
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
        <Detail label="Captions" value={course.captions} highlight={changeMap.captions} />
        <Detail label="Accessibility" value={course.accessibility} highlight={changeMap.accessibility} />
        <Detail label="Price" value={course.price} highlight={changeMap.price} />
        <Detail label="Promo Code" value={course.promoCode} highlight={changeMap.promoCode} />
        <Detail label="Promo Description" value={course.promoDesc} highlight={changeMap.promoDesc} />
        <Detail label="Welcome Message" value={course.welcomeMsg} highlight={changeMap.welcomeMsg} />
        <Detail label="Congrats Message" value={course.congratsMsg} highlight={changeMap.congratsMsg} />

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

      {user?.role === "admin" && course.status === "pending" && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "#f9fafb",
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
            Admin Review
          </h3>
          <div style={{ display: "grid", gap: 12 }}>
            <label style={{ fontSize: 14, fontWeight: 600 }}>
              Override Price (optional)
              <input
                type="number"
                min="0"
                step="0.01"
                value={adminPrice}
                onChange={(e) => setAdminPrice(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: 6,
                  padding: "8px 10px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                }}
              />
            </label>
            <label style={{ fontSize: 14, fontWeight: 600 }}>
              Admin Message (optional)
              <textarea
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                rows={3}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: 6,
                  padding: "8px 10px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                }}
              />
            </label>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button
                style={{ background: "#22c55e" }}
                onClick={() => handleCourseAction("approve")}
              >
                Approve with Price
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleCourseAction("reject")}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

/* ---------- REUSABLE COMPONENTS ---------- */

const Detail = ({ label, value, highlight }) => (
  <p style={{ marginBottom: 10 }}>
    <strong>{label}: </strong>{" "}
    <span style={highlight ? highlightValueStyle : undefined}>
      {value || "—"}
    </span>
    {highlight && <span style={highlightBadgeStyle}>Changed</span>}
  </p>
);

const DetailList = ({ label, items, highlight }) => (
  <div style={{ marginBottom: 12 }}>
    <strong>{label}:</strong>
    {highlight && <span style={highlightBadgeStyle}>Changed</span>}
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

const highlightBadgeStyle = {
  marginLeft: 8,
  padding: "2px 6px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 700,
  color: "#92400e",
  background: "#fef3c7",
};

const highlightValueStyle = {
  background: "#fef3c7",
  padding: "2px 6px",
  borderRadius: 6,
};

export default PendingCourseDetails;
