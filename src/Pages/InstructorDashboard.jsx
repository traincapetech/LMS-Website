import React, { useEffect, useState } from "react";

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user] = useState(() => JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("https://lms-backend-5s5x.onrender.com/api/courses");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch courses");
        if (user && user.role === 'admin') {
          setCourses(data.filter(c => c.published));
        } else if (user && user.role === 'instructor') {
          setCourses(data.filter(c => c.published && c.instructor && (c.instructor._id === user._id || c.instructor === user._id)));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user && (user.role === 'instructor' || user.role === 'admin')) fetchCourses();
  }, []); // Only on mount

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const token = localStorage.getItem("token");
              const res = await fetch(`https://lms-backend-5s5x.onrender.com/api/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete course");
      setCourses(courses.filter(c => c._id !== id));
      alert("Course deleted");
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user || (user.role !== 'instructor' && user.role !== 'admin')) return <div style={{ textAlign: 'center', marginTop: 60 }}>Access denied.</div>;
  if (loading) return <div style={{ textAlign: 'center', marginTop: 60 }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 60 }}>{error}</div>;

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: 32 }}>
      <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 32, textAlign: 'center' }}>My Published Courses</h2>
      {courses.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888' }}>You don’t have any published courses yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          {courses.map(course => (
            <div key={course._id} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #e5e7eb', padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 420 }}>
              {course.thumbnailUrl && (
                <img src={course.thumbnailUrl} alt={course.title} style={{ width: '100%', height: 180, objectFit: 'cover', borderTopLeftRadius: 14, borderTopRightRadius: 14 }} />
              )}
              <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, minHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</h3>
                <div style={{ color: '#555', fontSize: 15, marginBottom: 8, minHeight: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.description}</div>
                <div style={{ color: '#7c3aed', fontWeight: 700, fontSize: 20, marginTop: 'auto' }}>₹{course.price}</div>
                {user.role === 'admin' && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <button onClick={() => handleDelete(course._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                    <button style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>Edit</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard; 