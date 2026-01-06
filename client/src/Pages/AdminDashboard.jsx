import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://lms-backend-5s5x.onrender.com";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if user is admin
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  if (!user || user.role !== "admin") {
    return (
      <div style={{ textAlign: "center", marginTop: 60, padding: "0 20px" }}>
        <h2>Access denied. Admins only.</h2>
        <button
          style={{
            marginTop: 20,
            padding: "12px 32px",
            background: "#7c3aed",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: "1.1rem",
            cursor: "pointer",
          }}
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Fetch instructor requests and pending courses
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        // Instructor requests
        const res1 = await fetch(`${BASE_URL}/api/instructor-requests/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data1 = await res1.json();
        if (!res1.ok)
          throw new Error(
            data1.message || "Failed to fetch instructor requests"
          );
        setRequests(data1);
        // Pending courses
        const res2 = await fetch(`${BASE_URL}/api/pending-courses/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data2 = await res2.json();
        if (!res2.ok)
          throw new Error(data2.message || "Failed to fetch pending courses");
        setPendingCourses(data2);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  // Approve or reject instructor request
  const handleAction = async (id, action) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/instructor-requests/${id}/${action}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to ${action}`);
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id
            ? { ...req, status: action === "approve" ? "approved" : "rejected" }
            : req
        )
      );
      alert(data.message);
    } catch (err) {
      alert(err.message);
    }
  };

  // Approve or reject pending course
  const handleCourseAction = async (id, action) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/pending-courses/${id}/${action}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to ${action}`);
      setPendingCourses((prev) =>
        prev.map((req) =>
          req._id === id
            ? { ...req, status: action === "approve" ? "approved" : "rejected" }
            : req
        )
      );
      alert(data.message);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      className="mt-20 mx-auto"
      style={{
        maxWidth: 1200,

        padding: "40px 24px",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "48px",
        }}
      >
        <h1
          style={{
            fontWeight: 800,
            fontSize: "42px",
            marginBottom: "16px",
            color: "#1e293b",
            letterSpacing: "-0.025em",
          }}
        >
          Admin Dashboard
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "#64748b",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Manage instructor requests, pending courses, and system settings
        </p>
      </div>

      {/* Navigation Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          marginBottom: "48px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onClick={() => navigate("/admin/instructors")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            👨‍🏫
          </div>
          <h3
            style={{
              fontWeight: "700",
              fontSize: "20px",
              color: "#1e293b",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            Manage Instructors
          </h3>
          <p
            style={{
              color: "#64748b",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            View all instructors and their published courses
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onClick={() => navigate("/admin/coupons")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            🎫
          </div>
          <h3
            style={{
              fontWeight: "700",
              fontSize: "20px",
              color: "#1e293b",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            Manage Coupons
          </h3>
          <p
            style={{
              color: "#64748b",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            Create and manage discount coupons
          </p>
        </div>
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onClick={() => navigate("/admin/newsletter")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            📧
          </div>
          <h3
            style={{
              fontWeight: "700",
              fontSize: "20px",
              color: "#1e293b",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            Newsletter
          </h3>
          <p
            style={{
              color: "#64748b",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            Send emails to subscribers
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>Loading...</div>
      ) : error ? (
        <div
          style={{
            color: "red",
            padding: "20px",
            background: "#fef2f2",
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      ) : (
        <>
          <h3
            style={{ marginBottom: 16, fontSize: "clamp(1.1rem, 3vw, 1.3rem)" }}
          >
            Instructor Requests
          </h3>
          {requests.length === 0 ? (
            <div
              style={{
                marginBottom: 32,
                textAlign: "center",
                padding: "20px",
                background: "#f9fafb",
                borderRadius: 8,
              }}
            >
              No instructor requests found.
            </div>
          ) : (
            <div style={{ overflowX: "auto", marginBottom: 32 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "600px",
                  fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                }}
              >
                <thead>
                  <tr style={{ background: "#f3f0ff" }}>
                    <th
                      style={{
                        padding: "12px 8px",
                        border: "1px solid #eee",
                        textAlign: "left",
                      }}
                    >
                      Name
                    </th>
                    <th
                      style={{
                        padding: "12px 8px",
                        border: "1px solid #eee",
                        textAlign: "left",
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        padding: "12px 8px",
                        border: "1px solid #eee",
                        textAlign: "left",
                      }}
                    >
                      Bio
                    </th>
                    <th
                      style={{
                        padding: "12px 8px",
                        border: "1px solid #eee",
                        textAlign: "left",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: "12px 8px",
                        border: "1px solid #eee",
                        textAlign: "left",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req._id}
                      style={{
                        background:
                          req.status === "pending" ? "#fff" : "#f9fafb",
                      }}
                    >
                      <td
                        style={{
                          padding: "10px 8px",
                          border: "1px solid #eee",
                          wordBreak: "break-word",
                        }}
                      >
                        {req.name}
                      </td>
                      <td
                        style={{
                          padding: "10px 8px",
                          border: "1px solid #eee",
                          wordBreak: "break-word",
                        }}
                      >
                        {req.email}
                      </td>
                      <td
                        style={{
                          padding: "10px 8px",
                          border: "1px solid #eee",
                          wordBreak: "break-word",
                          maxWidth: "200px",
                        }}
                      >
                        {req.bio}
                      </td>
                      <td
                        style={{
                          padding: "10px 8px",
                          border: "1px solid #eee",
                          textTransform: "capitalize",
                        }}
                      >
                        {req.status}
                      </td>
                      <td
                        style={{
                          padding: "10px 8px",
                          border: "1px solid #eee",
                        }}
                      >
                        {req.status === "pending" ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              style={{
                                background: "#22c55e",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                              }}
                              onClick={() => handleAction(req._id, "approve")}
                            >
                              Accept
                            </button>
                            <button
                              style={{
                                background: "#ef4444",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                              }}
                              onClick={() => handleAction(req._id, "reject")}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            style={{
                              color:
                                req.status === "approved"
                                  ? "#22c55e"
                                  : "#ef4444",
                            }}
                          >
                            {req.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h3
            style={{ marginBottom: 16, fontSize: "clamp(1.1rem, 3vw, 1.3rem)" }}
          >
            Pending Course Requests
          </h3>
          {pendingCourses.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                background: "#f9fafb",
                borderRadius: 8,
              }}
            >
              No pending course requests found.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "800px",
                  fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                }}
              >
                <thead>
                  <tr style={{ background: "#f3f0ff" }}>
                    <th
                      style={{
                        padding: "12px 6px",
                        border: "1px solid #eee",
                        textAlign: "left",
                      }}
                    >
                      Title
                    </th>
                    <th
                      style={{
                        padding: "12px 6px",
                        border: "1px solid #eee",
                        textAlign: "left",
                      }}
                    >
                      Objectives
                    </th>
                    <th
                      style={{
                        padding: "12px 6px",
                        border: "1px solid #eee",
                        textAlign: "left",
                      }}
                    >
                      Requirements
                    </th>
                    <th
                      style={{
                        padding: "12px 6px",
                        border: "1px solid #eee",
                        textAlign: "left",
                      }}
                    >
                      Structure
                    </th>
                    <th
                      style={{
                        padding: "12px 6px",
                        border: "1px solid #eee",
                        textAlign: "left",
                      }}
                    >
                      Curriculum
                    </th>
                    <th
                      style={{
                        padding: "12px 6px",
                        border: "1px solid #eee",
                        textAlign: "left",
                      }}
                    >
                      Instructor
                    </th>
                    <th
                      style={{
                        padding: "12px 6px",
                        border: "1px solid #eee",
                        textAlign: "left",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: "12px 6px",
                        border: "1px solid #eee",
                        textAlign: "left",
                      }}
                    >
                      Actions
                    </th>
                    <th
                      style={{
                        padding: "12px 6px",
                        border: "1px solid #eee",
                        textAlign: "left",
                      }}
                    >
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingCourses.map((req) => (
                    <tr
                      key={req._id}
                      style={{
                        background:
                          req.status === "pending" ? "#fff" : "#f9fafb",
                      }}
                    >
                      <td
                        style={{
                          padding: "10px 6px",
                          border: "1px solid #eee",
                          wordBreak: "break-word",
                          maxWidth: "120px",
                        }}
                      >
                        {req.landingTitle}
                      </td>
                      <td
                        style={{
                          padding: "10px 6px",
                          border: "1px solid #eee",
                          wordBreak: "break-word",
                          maxWidth: "120px",
                          fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)",
                        }}
                      >
                        {req.learningObjectives?.slice(0, 2).join(", ")}
                        {req.learningObjectives?.length > 2 ? "..." : ""}
                      </td>
                      <td
                        style={{
                          padding: "10px 6px",
                          border: "1px solid #eee",
                          wordBreak: "break-word",
                          maxWidth: "120px",
                          fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)",
                        }}
                      >
                        {req.requirements?.slice(0, 2).join(", ")}
                        {req.requirements?.length > 2 ? "..." : ""}
                      </td>
                      <td
                        style={{
                          padding: "10px 6px",
                          border: "1px solid #eee",
                          wordBreak: "break-word",
                          maxWidth: "120px",
                          fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)",
                        }}
                      >
                        {req.structure}
                      </td>
                      <td
                        style={{
                          padding: "10px 6px",
                          border: "1px solid #eee",
                          wordBreak: "break-word",
                          maxWidth: "120px",
                          fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)",
                        }}
                      >
                        {" "}
                        {req.curriculum?.map((s) => s.title).join(", ")}
                      </td>
                      <td
                        style={{
                          padding: "10px 6px",
                          border: "1px solid #eee",
                          wordBreak: "break-word",
                          maxWidth: "120px",
                          fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)",
                        }}
                      >
                        {req.instructor?.name} ({req.instructor?.email})
                      </td>
                      <td
                        style={{
                          padding: "10px 6px",
                          border: "1px solid #eee",
                          textTransform: "capitalize",
                        }}
                      >
                        {req.status}
                      </td>
                      <td
                        style={{
                          padding: "10px 6px",
                          border: "1px solid #eee",
                        }}
                      >
                        {req.status === "pending" ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "4px",
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              style={{
                                background: "#22c55e",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                padding: "4px 8px",
                                cursor: "pointer",
                                fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)",
                              }}
                              onClick={() =>
                                handleCourseAction(req._id, "approve")
                              }
                            >
                              Accept
                            </button>
                            <button
                              style={{
                                background: "#ef4444",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                padding: "4px 8px",
                                cursor: "pointer",
                                fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)",
                              }}
                              onClick={() =>
                                handleCourseAction(req._id, "reject")
                              }
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            style={{
                              color:
                                req.status === "approved"
                                  ? "#22c55e"
                                  : "#ef4444",
                            }}
                          >
                            {req.status}
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "10px 6px",
                          border: "1px solid #eee",
                        }}
                      >
                        <button
                          style={{
                            background: "#6366f1",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "4px 8px",
                            cursor: "pointer",
                            fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)",
                          }}
                          onClick={() =>
                            navigate(`/preview/pending-course/${req._id}`)
                          }
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
