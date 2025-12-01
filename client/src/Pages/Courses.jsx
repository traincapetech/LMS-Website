import React, { useState, useEffect, useContext } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CartContext } from "../App";
import axios from "axios";

const Courses = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useContext(CartContext);

  // ADD TO CART
  const handleAddToCart = (course, e) => {
    e.preventDefault();
    e.stopPropagation();

    const courseToAdd = {
      id: course._id,
      title: course.title,
      description: course.subtitle,
      price: course.price,
      thumbnailUrl: course.thumbnailUrl,
      isApiCourse: true,
    };

    localStorage.setItem("courseToAdd", JSON.stringify(courseToAdd));
    navigate("/cart");
  };

  // FETCH COURSES (DYNAMIC ONLY)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const res = await axios.get("http://localhost:5001/api/courses");

        const apiCourses = res.data.map((course) => ({
          ...course,
          id: course._id,
          subtitle: course.subtitle || course.description,
          instructor: {
            name: course.instructor?.name || "Instructor",
          },
          originalPrice: course.price ? course.price * 1.5 : 100,
          discount: 33,
          whatYouWillLearn: course.learningObjectives || [],
          courseContent: {
            totalLectures:
              course.curriculum?.reduce(
                (sum, sec) => sum + sec.items.length,
                0
              ) || 0,
            totalLength: "Self-paced",
          },
          isApiCourse: true,
        }));

        setCourses(apiCourses);
        setFiltered(apiCourses);

      } catch (err) {
        console.log(err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // SEARCH FILTER (Dynamic)
  useEffect(() => {
    if (!searchQuery) {
      setFiltered(courses);
    } else {
      const q = searchQuery.toLowerCase();

      const results = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          c.instructor?.name.toLowerCase().includes(q)
      );

      setFiltered(results);
    }
  }, [searchQuery, courses]);

  /* ------------------ UI ------------------ */

  if (loading) {
    return (
      <div
        style={{
          background: "#f7f7fa",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#5624d0" }}>Loading courses...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2 style={{ color: "red" }}>{error}</h2>
        <p>Try again later.</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#f7f7fa", minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* SEARCH HEADER */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            {searchQuery ? `Search Results for "${searchQuery}"` : "Explore Our Courses"}
          </h1>
          {searchQuery && (
            <p style={{ color: "#6a6f73" }}>
              Found {filtered.length} course{filtered.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <h2>No Courses Found</h2>
            <p>Try different keywords.</p>
            <Link
              to="/courses"
              style={{
                padding: "10px 20px",
                background: "#a435f0",
                color: "#fff",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              View All Courses
            </Link>
          </div>
        ) : (
          /* COURSE GRID (same layout) */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {filtered.map((course) => (
              <Link
                key={course._id}
                to={`/course/${course._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 8,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  }}
                >
                  {/* IMAGE */}
                  <div style={{ position: "relative" }}>
                    <img
                      src={course.thumbnailUrl}
                      style={{
                        width: "100%",
                        height: 180,
                        objectFit: "cover",
                      }}
                      onError={(e) =>
                        (e.target.src =
                          "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg")
                      }
                      alt={course.title}
                    />

                    {/* NEW badge */}
                    {course.isApiCourse && (
                      <span
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: "#28a745",
                          color: "#fff",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: 12,
                        }}
                      >
                        New
                      </span>
                    )}
                  </div>

                  {/* DETAILS */}
                  <div style={{ padding: 16 }}>
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        height: 42,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {course.title}
                    </h3>

                    <p
                      style={{
                        fontSize: 12,
                        height: 32,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        color: "#6a6f73",
                        marginBottom: 6,
                      }}
                    >
                      {course.subtitle}
                    </p>

                    <div style={{ fontSize: 12, color: "#6a6f73" }}>
                      {course.instructor.name}
                    </div>

                    {/* Rating */}
                    <div style={{ marginTop: 6 }}>
                      <span style={{ color: "#b4690e", fontWeight: 600 }}>
                        {course.rating}
                      </span>{" "}
                      <span style={{ color: "#b4690e" }}>★</span>
                      <span style={{ color: "#6a6f73" }}>
                        {" "}
                        ({course.ratingsCount})
                      </span>
                    </div>

                    {/* PRICE */}
                    <div style={{ marginTop: 10, fontSize: 18, fontWeight: 700 }}>
                      ₹{course.price}
                      <span
                        style={{
                          fontSize: 14,
                          marginLeft: 8,
                          color: "#6a6f73",
                          textDecoration: "line-through",
                        }}
                      >
                        ₹{course.originalPrice}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(course, e)}
                      style={{
                        width: "100%",
                        marginTop: 10,
                        padding: "10px 0",
                        background: "#7c3aed",
                        borderRadius: 6,
                        border: "none",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
