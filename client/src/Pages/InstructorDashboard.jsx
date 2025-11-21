// import React, { useEffect, useState } from "react";

// const InstructorDashboard = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [user] = useState(() => JSON.parse(localStorage.getItem("user")));

//   useEffect(() => {
//     const fetchCourses = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await fetch("https://lms-backend-5s5x.onrender.com/api/courses");
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Failed to fetch courses");
//         if (user && user.role === 'admin') {
//           setCourses(data.filter(c => c.published));
//         } else if (user && user.role === 'instructor') {
//           setCourses(data.filter(c => c.published && c.instructor && (c.instructor._id === user._id || c.instructor === user._id)));
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (user && (user.role === 'instructor' || user.role === 'admin')) fetchCourses();
//   }, []); // Only on mount

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this course?")) return;
//     try {
//       const token = localStorage.getItem("token");
//               const res = await fetch(`https://lms-backend-5s5x.onrender.com/api/courses/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to delete course");
//       setCourses(courses.filter(c => c._id !== id));
//       alert("Course deleted");
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   if (!user || (user.role !== 'instructor' && user.role !== 'admin')) return <div style={{ textAlign: 'center', marginTop: 60 }}>Access denied.</div>;
//   if (loading) return <div style={{ textAlign: 'center', marginTop: 60 }}>Loading...</div>;
//   if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 60 }}>{error}</div>;

//   return (
//     <div style={{ maxWidth: 1100, margin: '40px auto', padding: 32 }}>
//       <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 32, textAlign: 'center' }}>My Published Courses</h2>
//       {courses.length === 0 ? (
//         <div style={{ textAlign: 'center', color: '#888' }}>You don’t have any published courses yet.</div>
//       ) : (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
//           {courses.map(course => (
//             <div key={course._id} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #e5e7eb', padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 420 }}>
//               {course.thumbnailUrl && (
//                 <img src={course.thumbnailUrl} alt={course.title} style={{ width: '100%', height: 180, objectFit: 'cover', borderTopLeftRadius: 14, borderTopRightRadius: 14 }} />
//               )}
//               <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column' }}>
//                 <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, minHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</h3>
//                 <div style={{ color: '#555', fontSize: 15, marginBottom: 8, minHeight: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.description}</div>
//                 <div style={{ color: '#7c3aed', fontWeight: 700, fontSize: 20, marginTop: 'auto' }}>₹{course.price}</div>
//                 {user.role === 'admin' && (
//                   <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
//                     <button onClick={() => handleDelete(course._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
//                     <button style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default InstructorDashboard; 
// src/pages/InstructorCourses.jsx
import React, { useState, useMemo } from "react";
import "./InstructorDashboard.css";
import { useNavigate } from "react-router-dom";
const mockCourses = [
  {
    id: "1",
    title: "Full-Stack Web Development Bootcamp",
    subtitle: "Learn HTML, CSS, JavaScript, React, Node.js and more",
    status: "Published", // "Draft" | "Unpublished"
    students: 1243,
    rating: 4.6,
    reviews: 321,
    lastUpdated: "Nov 2025",
    language: "English",
    price: 449,
    currency: "₹",
    image:
      "https://img-c.udemycdn.com/course/240x135/851712_fc61_6.jpg", // use your own later
    isBestseller: true,
  },
  {
    id: "2",
    title: "Node.js & Express API Masterclass",
    subtitle: "Build production-ready REST APIs and authentication",
    status: "Draft",
    students: 0,
    rating: null,
    reviews: 0,
    lastUpdated: "Oct 2025",
    language: "English",
    price: 0,
    currency: "₹",
    image:
      "https://img-c.udemycdn.com/course/240x135/995016_ebf4_3.jpg",
    isBestseller: false,
  },
  {
    id: "3",
    title: "MongoDB Essentials",
    subtitle: "Learn MongoDB, Mongoose and Aggregation Framework",
    status: "Unpublished",
    students: 121,
    rating: 4.2,
    reviews: 19,
    lastUpdated: "Sep 2025",
    language: "English",
    price: 349,
    currency: "₹",
    image:
      "https://img-c.udemycdn.com/course/240x135/1906852_93c6.jpg",
    isBestseller: false,
  },
];

const TABS = [
  { id: "courses", label: "Courses" },
  { id: "drafts", label: "Drafts" },
  { id: "archived", label: "Archived" },
  { id: "bundles", label: "Bundles" },
];

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState("courses");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();
  const handleCreateCourse = () => {
    const courseId = "web-development"; // <- dynamically generate or fetch
    navigate(`/instructor/${courseId}/upload-video`);
  };
  const filteredCourses = useMemo(() => {
    let list = [...mockCourses];

    if (activeTab === "drafts") {
      list = list.filter((c) => c.status === "Draft");
    } else if (activeTab === "courses") {
      // all except archived (you can add archived flag later)
    }

    if (statusFilter !== "all") {
      list = list.filter((c) =>
        statusFilter === "published"
          ? c.status === "Published"
          : c.status !== "Published"
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      list = list.filter((c) =>
        c.title.toLowerCase().includes(query)
      );
    }

    if (sortBy === "newest") {
      // here just keeping original order, you can sort by date
    } else if (sortBy === "students") {
      list.sort((a, b) => b.students - a.students);
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [search, statusFilter, sortBy, activeTab]);

  return (
    <div className="ic-page">
      {/* Top header */}
      <div className="ic-header">
        <div>
          <h1 className="ic-title">Courses</h1>
          <p className="ic-subtitle">
            Manage your courses, drafts, bundles, and more in one place.
          </p>
        </div>

        <div className="ic-header-actions">
          <button className="ic-btn-outline">
            Create bundle
          </button>
          
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
              "ic-tab" +
              (activeTab === tab.id ? " ic-tab-active" : "")
            }
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters/Search (for courses, drafts, archived) */}
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
              <option value="students">Sort: Students</option>
              <option value="rating">Sort: Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Content area */}
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

function CourseList({ courses }) {
  return (
    <div className="ic-course-list">
      {courses.map((course) => (
        <div className="ic-course-card" key={course.id}>
          <div className="ic-course-thumb">
            <img src={course.image} alt={course.title} />
          </div>

          <div className="ic-course-main">
            <div className="ic-course-header-row">
              <div>
                <h3 className="ic-course-title">{course.title}</h3>
                <p className="ic-course-subtitle">
                  {course.subtitle}
                </p>
              </div>

              <div className="ic-course-status">
                <span
                  className={
                    "ic-status-badge ic-status-" +
                    course.status.toLowerCase()
                  }
                >
                  {course.status}
                </span>
              </div>
            </div>

            <div className="ic-course-meta-row">
              <span className="ic-meta-item">
                {course.rating
                  ? `★ ${course.rating.toFixed(1)} (${course.reviews})`
                  : "No ratings yet"}
              </span>
              <span className="ic-meta-dot">•</span>
              <span className="ic-meta-item">
                {course.students} students
              </span>
              <span className="ic-meta-dot">•</span>
              <span className="ic-meta-item">
                Updated {course.lastUpdated}
              </span>
              <span className="ic-meta-dot">•</span>
              <span className="ic-meta-item">
                {course.language}
              </span>
            </div>

            <div className="ic-course-footer-row">
              <div className="ic-course-actions">
                <button className="ic-link-btn">Edit / Manage</button>
                <button className="ic-link-btn">Preview</button>
                <button className="ic-link-btn">Promotions</button>
                <button className="ic-link-btn">More ▾</button>
              </div>

              <div className="ic-course-price">
                {course.price > 0
                  ? `${course.currency}${course.price}`
                  : "Free"}
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
        Group multiple courses into a bundle and offer them together
        to your students at a single price.
      </p>
      <button className="ic-btn-outline">Create bundle</button>
    </div>
  );
}
