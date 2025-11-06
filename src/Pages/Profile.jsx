import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("https://lms-backend-5s5x.onrender.com/api/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
        }
      } catch {}
    };
    fetchProfile();
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 32, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #e5e7eb' }}>
      <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 24 }}>Profile</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p style={{
        marginTop: 18,
        fontWeight: 600,
        color: user?.role === 'admin'
          ? '#ef4444'
          : user?.role === 'instructor'
            ? '#10b981'
            : '#6366f1'
      }}>
        {user?.role === "admin"
          ? "You are an admin."
          : user?.role === "instructor"
            ? "You are an instructor."
            : "You are a student."}
      </p>
    </div>
  );
};

export default Profile; 