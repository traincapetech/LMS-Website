import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PendingCourseDetails = () => {
  const { pendingCourseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:5001/api/pending-courses/${pendingCourseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
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

  if (loading) return <div style={{ textAlign: 'center', marginTop: 60 }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 60 }}>{error}</div>;
  if (!course) return null;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #e5e7eb' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 24, background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 700, cursor: 'pointer' }}>Back</button>
      <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 24 }}>Pending Course Details</h2>
      {/* Thumbnail or image if available */}
      {course.thumbnailUrl && (
        <div style={{ marginBottom: 24 }}>
          <img src={course.thumbnailUrl} alt="Course Thumbnail" style={{ width: 220, height: 140, objectFit: 'cover', borderRadius: 10, boxShadow: '0 2px 8px #e5e7eb' }} />
        </div>
      )}
      <div style={{ fontSize: 16, color: '#232323', lineHeight: 1.7 }}>
        <strong>Title:</strong> {course.landingTitle}<br/>
        <strong>Subtitle:</strong> {course.landingSubtitle}<br/>
        <strong>Description:</strong> {course.landingDesc}<br/>
        <strong>Objectives:</strong> <ul>{course.learningObjectives?.map((o,i) => <li key={i}>{o}</li>)}</ul>
        <strong>Requirements:</strong> <ul>{course.requirements?.map((r,i) => <li key={i}>{r}</li>)}</ul>
        <strong>Structure:</strong> {course.structure}<br/>
        <strong>Curriculum:</strong> {course.curriculum}<br/>
        <strong>Captions:</strong> {course.captions}<br/>
        <strong>Accessibility:</strong> {course.accessibility}<br/>
        <strong>Price:</strong> {course.price}<br/>
        <strong>Promo Code:</strong> {course.promoCode}<br/>
        <strong>Promo Desc:</strong> {course.promoDesc}<br/>
        <strong>Welcome Msg:</strong> {course.welcomeMsg}<br/>
        <strong>Congrats Msg:</strong> {course.congratsMsg}<br/>
        <strong>Instructor:</strong> {course.instructor?.name} ({course.instructor?.email})<br/>
        <strong>Status:</strong> {course.status}<br/>
        <strong>Submitted:</strong> {new Date(course.createdAt).toLocaleString()}<br/>
      </div>
    </div>
  );
};

export default PendingCourseDetails; 