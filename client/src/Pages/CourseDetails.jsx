import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../App";

  const API_BASE = import.meta.env.VITE_API_BASE_URL||"http://localhost:5001";
const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useContext(CartContext);

  // Expand/Collapse
  const [expanded, setExpanded] = useState({});
  const [expandedAll, setExpandedAll] = useState(false);

  const toggleSection = (i) => {
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  // ⭐ Fetch course details (FULLY dynamic)
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCourse = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_BASE}/api/courses/${id}`);
        const c = res.data;

        setCourse({
          id: c._id,
          title: c.title,
          subtitle: c.subtitle || c.description,
          instructor: c.instructor || { name: "Instructor" },

          thumbnailUrl: c.thumbnailUrl || "",
          price: c.price || 0,
          originalPrice: (c.price || 0) * 1.5,
          discount: 33,

          rating: c.rating || 0,
          ratingsCount: c.ratingsCount || 0,
          learners: c.learners || 0,

          language: c.language || "English",
          lastUpdated: c.updatedAt?.split("T")[0] || "2025",

          description: c.description || "",
          whatYouWillLearn: c.learningObjectives || [],
          requirements: c.requirements || [],
          includes: ["Full lifetime access", "Certificate of completion"],

          curriculum: c.curriculum || [],
          pendingCourseId: c.pendingCourseId,
        });
      } catch (err) {
        console.log(err);
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // ⭐ Add to cart
  const handleAddToCart = () => {
    localStorage.setItem(
      "courseToAdd",
      JSON.stringify({
        id: course.id,
        title: course.title,
        description: course.subtitle,
        price: course.price,
        thumbnailUrl: course.thumbnailUrl,
        isApiCourse: true,
      })
    );

    navigate("/cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleApplyCoupon = () => navigate("/cart");

  // ⭐ LOADING UI
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
          <div style={{ fontSize: 24, color: "#f4c150" }}>Loading course...</div>
          <div style={{ color: "#b1b1b1" }}>Please wait.</div>
        </div>
      </div>
    );
  }

  // ⭐ ERROR UI
  if (error || !course) {
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
          <div style={{ fontSize: 24, color: "#f4c150" }}>
            {error || "Course not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#181821", minHeight: "100vh", color: "#fff", padding: 0 }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "40px 24px 0 24px",
          display: "flex",
          gap: 32,
        }}
      >
        {/* MAIN CONTENT */}
        <div style={{ flex: 2 }}>
          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{course.title}</div>
            <div style={{ fontSize: 20, color: "#d1d7dc", margin: "12px 0 18px 0" }}>
              {course.subtitle}
            </div>

            <div style={{ fontSize: 15, color: "#b1b1b1", margin: "10px 0" }}>
              Created by{" "}
              <span style={{ color: "#fff", fontWeight: 600 }}>
                {course.instructor.name}
              </span>
            </div>

            <div style={{ fontSize: 14, color: "#b1b1b1", margin: "6px 0" }}>
              <span>Last updated {course.lastUpdated}</span> ·{" "}
              <span>{course.language}</span>
            </div>
          </div>

          {/* What you'll learn */}
          <div style={{ background: "#22223b", borderRadius: 8, padding: 24, marginBottom: 32 }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
              What you'll learn
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {course.whatYouWillLearn.map((item, idx) => (
                <li
                  key={idx}
                  style={{ marginBottom: 8, fontSize: 16, display: "flex" }}
                >
                  <span style={{ marginRight: 12, color: "#f4c150", fontSize: 18 }}>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div style={{ background: "#22223b", borderRadius: 8, padding: 24, marginBottom: 32 }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
              Requirements
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {course.requirements.map((item, idx) => (
                <li
                  key={idx}
                  style={{ marginBottom: 8, fontSize: 16, display: "flex" }}
                >
                  <span style={{ marginRight: 12, color: "#f4c150", fontSize: 18 }}>
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Description */}
          <div style={{ background: "#22223b", borderRadius: 8, padding: 24, marginBottom: 32 }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
              Description
            </div>
            <div style={{ fontSize: 16, lineHeight: 1.6 }}>{course.description}</div>
          </div>

          {/* ⭐ Course Content (Dynamic) */}
          {/* ⭐ Improved Course Content UI */}
          <div
            style={{
              background: "#1f1f2e",
              borderRadius: 10,
              padding: 24,
              marginBottom: 32,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
              Course content
            </div>

            <div style={{ fontSize: 15, color: "#c7c7c7", marginBottom: 18 }}>
              {course.curriculum.length} sections •{" "}
              {course.curriculum.reduce((n, s) => n + s.items.length, 0)} lectures
            </div>

            <div
              style={{
                fontSize: 14,
                color: "#a778ff",
                marginBottom: 20,
                cursor: "pointer",
                fontWeight: 600,
              }}
              onClick={() => setExpandedAll((prev) => !prev)}
            >
              {expandedAll ? "Collapse all" : "Expand all"}
            </div>

            {course.curriculum.map((section, sIdx) => (
              <div
                key={sIdx}
                style={{
                  background: "#2a2a3b",
                  padding: "16px 18px",
                  borderRadius: 8,
                  marginBottom: 14,
                  transition: "0.2s ease",
                }}
              >
                {/* HEADER */}
                <div
                  onClick={() => toggleSection(sIdx)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        fontSize: 20,
                        color: "#a778ff",
                        transform: expanded[sIdx] || expandedAll ? "rotate(90deg)" : "rotate(0)",
                        transition: "0.3s",
                      }}
                    >
                      ▶
                    </span>
                    <span style={{ fontSize: 18, fontWeight: 600 }}>
                      {section.title}
                    </span>
                  </div>

                  <span style={{ fontSize: 14, color: "#b1b1b1" }}>
                    {section.items.length} lectures
                  </span>
                </div>

                {/* ITEMS */}
                {(expandedAll || expanded[sIdx]) && (
                  <div style={{ marginTop: 14 }}>
                    {section.items.map((item, iIdx) => (

                      <div
                        key={iIdx}
                        onClick={() =>

                        navigate(`/lecture/${item._id}?courseId=${course.id}`, {
                            state: {
                              lectureId: item._id,
                              videoId: item.videoId,
                              courseId: course.id,
                              pendingCourseId: course.pendingCourseId,
                            },
                          })
                        }
                        style={{
                          padding: "10px 14px",
                          background: "#343449",
                          borderRadius: 6,
                          marginBottom: 10,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          transition: "0.2s",
                          border: "1px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#3d3d55";
                          e.currentTarget.style.border = "1px solid #5b5b79";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#343449";
                          e.currentTarget.style.border = "1px solid transparent";
                        }}
                      >
                        <span style={{ fontSize: 18 }}>🎬</span>
                        <span style={{ fontSize: 16 }}>{item.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>


          {/* Includes */}
          <div style={{ background: "#22223b", borderRadius: 8, padding: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
              This course includes:
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {course.includes.map((item, idx) => (
                <li
                  key={idx}
                  style={{ marginBottom: 8, fontSize: 16, display: "flex" }}
                >
                  <span style={{ marginRight: 12, color: "#f4c150", fontSize: 18 }}>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div
            style={{
              background: "#23272f",
              borderRadius: 8,
              padding: 20,
            }}
          >
            <img
              src={course.thumbnailUrl}
              alt="Course Thumbnail"
              style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
              onError={(e) => {
                e.target.src =
                  "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg";
              }}
            />

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>
                  ${course.price}
                </span>
                <span
                  style={{
                    fontSize: 18,
                    color: "#b1b1b1",
                    textDecoration: "line-through",
                    marginLeft: 12,
                  }}
                >
                  ${course.originalPrice}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    color: "#f4c150",
                    marginLeft: 8,
                  }}
                >
                  {course.discount}% off
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                width: "100%",
                background: "#a435f0",
                color: "#fff",
                padding: "14px 0",
                fontWeight: 700,
                borderRadius: 6,
                marginBottom: 12,
                cursor: "pointer",
              }}
            >
              Add to cart
            </button>

            <button
              onClick={handleBuyNow}
              style={{
                width: "100%",
                background: "transparent",
                color: "#a435f0",
                padding: "12px 0",
                fontWeight: 700,
                border: "2px solid #a435f0",
                borderRadius: 6,
                marginBottom: 12,
              }}
            >
              Buy now
            </button>

            <div style={{ color: "#b1b1b1", textAlign: "center" }}>
              Full Lifetime Access
            </div>

            <div
              onClick={handleApplyCoupon}
              style={{
                marginTop: 16,
                color: "#a435f0",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Apply Coupon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
