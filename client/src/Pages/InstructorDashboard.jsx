import React, { useState, useMemo, useEffect } from "react";
import "./InstructorDashboard.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


const TABS = [
  { id: "courses", label: "Courses" },
  { id: "drafts", label: "Drafts" },
  { id: "archived", label: "Archived" },
  { id: "bundles", label: "Bundles" },
];

export default function InstructorDashboard() {
  const API_BASE = "http://localhost:5001";

  const [activeTab, setActiveTab] = useState("courses");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch courses from backend
  useEffect(() => {
    async function fetchCourses() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found!");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/pending-courses/my-courses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Fetched Data:", data);

        if (res.ok) {
          // Backend returns ARRAY directly
          setCourses(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch courses:", data.message);
        }
      } catch (err) {
        console.error("Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [API_BASE]);

  const handleCreateCourse = () => {
    navigate(`/create`);
  };

  // Filters & sorting
  const filteredCourses = useMemo(() => {
    let list = [...courses];

    // Tab filter (adjust if needed)
    if (activeTab === "drafts") {
      list = list.filter((c) => c.status === "draft");
    }

    // Additional status filter
    if (statusFilter !== "all") {
      list = list.filter((c) =>
        statusFilter === "published"
          ? c.status === "published"
          : c.status !== "published"
      );
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.landingTitle?.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [search, statusFilter, sortBy, activeTab, courses]);

  if (loading) return <div className="ic-loading">Loading courses...</div>;

  return (
    <div className="ic-page">
      {/* Header */}
      <div className="ic-header">
        <div>
          <h1 className="ic-title">Courses</h1>
          <p className="ic-subtitle">
            Manage your courses, drafts, bundles, and more in one place.
          </p>
        </div>

        <div className="ic-header-actions">
          <button className="ic-btn-outline">Create bundle</button>
          <button className="ic-btn-primary" onClick={handleCreateCourse}>
            + New course
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="ic-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={
              "ic-tab" + (activeTab === tab.id ? " ic-tab-active" : "")
            }
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      {activeTab !== "bundles" && (
        <div className="ic-filters">
          <div className="ic-search-wrap">
            <span className="ic-search-icon">🔍</span>
            <input
              className="ic-search-input"
              placeholder="Search your courses"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="ic-filter-group">
            <select
              className="ic-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="not_published">Not published</option>
            </select>

            <select
              className="ic-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest</option>
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="ic-content">
        {activeTab === "bundles" ? (
          <BundlesEmptyState />
        ) : filteredCourses.length === 0 ? (
          <EmptyCourses activeTab={activeTab} />
        ) : (
          <CourseList courses={filteredCourses} />
        )}
      </div>
    </div>
  );
}

// 🔥 FIXED Course Card for your backend fields
function CourseList({ courses }) {
  const navigate = useNavigate();

  const { pendingCourseId } = useParams();
  const handlePreview = (id) => {
    navigate(`/admin/pending-course/${id}`);
  }

  return (
    <div className="ic-course-list">
      {courses.map((course) => (
        <div className="ic-course-card" key={course._id}>
          <div className="ic-course-thumb">
            <img
              src={course.thumbnailUrl}
              alt={course.landingTitle}
            />
          </div>

          <div className="ic-course-main">
            <div className="ic-course-header-row">
              <div>
                <h3 className="ic-course-title">
                  {course.landingTitle || "Untitled Course"}
                </h3>
                <p className="ic-course-subtitle">
                  {course.landingSubtitle || "No subtitle added"}
                </p>
              </div>

              <div className="ic-course-status">
                <span
                  className={
                    "ic-status-badge ic-status-" +
                    (course.status || "pending").toLowerCase()
                  }
                >
                  {course.status || "Pending"}
                </span>
              </div>
            </div>

            <div className="ic-course-meta-row">
              <span className="ic-meta-item">
                Updated {course.updatedAt?.split("T")[0]}
              </span>
              <span className="ic-meta-dot">•</span>
              <span className="ic-meta-item">
                {course.instructor?.name || "Unknown Instructor"}
              </span>
            </div>

            <div className="ic-course-footer-row">
              <div className="ic-course-actions">
                <button
                  className="ic-link-btn"
                  onClick={() => navigate(`/instructor/edit/${course._id}`)}
                >
                  Edit / Manage
                </button>
                <button className="ic-link-btn" onClick={() => handlePreview(course._id)}>Preview</button>
                <button className="ic-link-btn">Promotions</button>
                <button className="ic-link-btn">More ▾</button>
              </div>

              <div className="ic-course-price">
                {course.price ? course.price : "Free"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyCourses({ activeTab }) {
  const label =
    activeTab === "drafts"
      ? "You don’t have any drafts yet."
      : activeTab === "archived"
        ? "You don’t have any archived courses."
        : "You don’t have any courses yet.";

  const desc =
    activeTab === "drafts"
      ? "Start creating a course and it will appear here as a draft."
      : activeTab === "archived"
        ? "Archived courses will appear here and won’t be listed for new students."
        : "Create a new course to start teaching and it will show up here.";

  return (
    <div className="ic-empty-state">
      <div className="ic-empty-icon">📚</div>
      <h3 className="ic-empty-title">{label}</h3>
      <p className="ic-empty-text">{desc}</p>
      <button className="ic-btn-primary">+ New course</button>
    </div>
  );
}

function BundlesEmptyState() {
  return (
    <div className="ic-empty-state">
      <div className="ic-empty-icon">🎁</div>
      <h3 className="ic-empty-title">No bundles yet</h3>
      <p className="ic-empty-text">
        Group multiple courses into a bundle and offer them together to your
        students at a single price.
      </p>
      <button className="ic-btn-outline">Create bundle</button>
    </div>
  );
}
