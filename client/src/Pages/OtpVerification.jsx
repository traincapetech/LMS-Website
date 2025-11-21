import React, { useState, useEffect } from "react";
import axios from "axios";

const OtpVerification = () => {
  const [form, setForm] = useState({ email: "", otp: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email") || "";
    setForm((prev) => ({ ...prev, email }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
              const res = await axios.post("https://lms-backend-5s5x.onrender.com/api/otp/verify-otp", form);
      setMessage(res.data.message || "OTP verified. Redirecting...");
      setTimeout(() => {
        window.location.href = `/set-new-password?email=${encodeURIComponent(form.email)}`;
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 font-inter animate-fadeIn" style={{ background: 'radial-gradient(circle at 10% 20%, #ede9fe, #d1c4e9, #c4b5fd)' }}>
      <div className="bg-white/95" style={{ backdropFilter: 'blur(12px)', padding: '40px 30px', borderRadius: '16px', boxShadow: '0 12px 36px rgba(86, 36, 208, 0.18)', maxWidth: '430px', width: '100%', textAlign: 'center', position: 'relative', animation: 'slideIn 0.7s ease-out', transition: 'transform 0.3s, box-shadow 0.3s' }}>
        <h2 style={{ fontSize: '2.2rem', color: '#5624d0', fontWeight: 700, marginBottom: '24px', textShadow: '0 2px 4px rgba(86, 36, 208, 0.1)' }}>
          OTP Verification
        </h2>
        <form className="flex flex-col" style={{ gap: '18px', marginBottom: '20px' }} onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="flex-1 border border-gray-300 rounded-md p-2"
            required
          />
          <input
            type="text"
            name="otp"
            value={form.otp}
            onChange={handleChange}
            placeholder="Enter OTP"
            className="flex-1 border border-gray-300 rounded-md p-2"
            required
          />
          <button
            type="submit"
            style={{ background: 'linear-gradient(to right, #5624d0, #7c3aed)', color: 'white', padding: '12px 16px', fontSize: '1rem', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, transition: 'transform 0.3s, background 0.3s', boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)' }}
            disabled={loading}
            onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(to right, #7c3aed, #5624d0)')}
            onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(to right, #5624d0, #7c3aed)')}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        {message && <div style={{ color: message.includes("verified") ? "green" : "red", marginBottom: 10 }}>{message}</div>}
        <p style={{ fontSize: '0.9rem', color: '#555' }}>
          <a href="/login" style={{ color: '#5624d0', fontWeight: 600, textDecoration: 'none' }} onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')} onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}>
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification; 