import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
              const res = await axios.post("https://lms-backend-5s5x.onrender.com/api/auth/forgot-password", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
        const res = await axios.post("https://lms-backend-5s5x.onrender.com/api/otp/verify-otp", { email, otp });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
              const res = await axios.post("https://lms-backend-5s5x.onrender.com/api/auth/reset-password", { 
        email, 
        newPassword 
      });
      setMessage(res.data.message);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 font-inter animate-fadeIn"
      style={{
        background: 'radial-gradient(circle at 10% 20%, #ede9fe, #d1c4e9, #c4b5fd)',
      }}
    >
      <div
        className="bg-white/95"
        style={{
          backdropFilter: 'blur(12px)',
          padding: '40px 30px',
          borderRadius: '16px',
          boxShadow: '0 12px 36px rgba(86, 36, 208, 0.18)',
          maxWidth: '430px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          animation: 'slideIn 0.7s ease-out',
          transition: 'transform 0.3s, box-shadow 0.3s',
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'scale(1.01)';
          e.currentTarget.style.boxShadow = '0 14px 40px rgba(86, 36, 208, 0.25)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 12px 36px rgba(86, 36, 208, 0.18)';
        }}
      >
        <h2
          style={{
            fontSize: '2.2rem',
            color: '#5624d0',
            fontWeight: 700,
            marginBottom: '24px',
            textShadow: '0 2px 4px rgba(86, 36, 208, 0.1)',
          }}
        >
          {step === 1 && "Forgot Password"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "Reset Password"}
        </h2>

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col" style={{ gap: '18px', marginBottom: '20px' }}>
            <p style={{ color: '#6a6f73', marginBottom: '16px' }}>
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
            <div
              className="flex items-center"
              style={{
                background: '#f3f0ff',
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '10px 14px',
                transition: 'border 0.3s ease',
              }}
              onMouseOver={e => (e.currentTarget.style.borderColor = '#7c3aed')}
              onMouseOut={e => (e.currentTarget.style.borderColor = '#ccc')}
            >
            <i className="fas fa-envelope" style={{ color: '#7c3aed', fontSize: '1.1rem' }}></i>
            <input
              type="email"
              value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
              className="flex-1 border-none outline-none bg-transparent"
              style={{ fontSize: '1rem', color: '#333', marginLeft: '10px' }}
              required
            />
          </div>
          <button
            type="submit"
              style={{
                background: 'linear-gradient(to right, #5624d0, #7c3aed)',
                color: 'white',
                padding: '12px 16px',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'transform 0.3s, background 0.3s',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
              }}
            disabled={loading}
            onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(to right, #7c3aed, #5624d0)')}
            onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(to right, #5624d0, #7c3aed)')}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col" style={{ gap: '18px', marginBottom: '20px' }}>
            <p style={{ color: '#6a6f73', marginBottom: '16px' }}>
              We've sent a 6-digit OTP to your email. Please enter it below.
            </p>
            <div
              className="flex items-center"
              style={{
                background: '#f3f0ff',
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '10px 14px',
                transition: 'border 0.3s ease',
              }}
              onMouseOver={e => (e.currentTarget.style.borderColor = '#7c3aed')}
              onMouseOut={e => (e.currentTarget.style.borderColor = '#ccc')}
            >
              <i className="fas fa-key" style={{ color: '#7c3aed', fontSize: '1.1rem' }}></i>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="flex-1 border-none outline-none bg-transparent"
                style={{ fontSize: '1rem', color: '#333', marginLeft: '10px' }}
                maxLength="6"
                required
              />
            </div>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(to right, #5624d0, #7c3aed)',
                color: 'white',
                padding: '12px 16px',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'transform 0.3s, background 0.3s',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
              }}
              disabled={loading}
              onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(to right, #7c3aed, #5624d0)')}
              onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(to right, #5624d0, #7c3aed)')}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col" style={{ gap: '18px', marginBottom: '20px' }}>
            <p style={{ color: '#6a6f73', marginBottom: '16px' }}>
              Enter your new password below.
            </p>
            <div
              className="flex items-center"
              style={{
                background: '#f3f0ff',
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '10px 14px',
                transition: 'border 0.3s ease',
              }}
              onMouseOver={e => (e.currentTarget.style.borderColor = '#7c3aed')}
              onMouseOut={e => (e.currentTarget.style.borderColor = '#ccc')}
            >
              <i className="fas fa-lock" style={{ color: '#7c3aed', fontSize: '1.1rem' }}></i>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="flex-1 border-none outline-none bg-transparent"
                style={{ fontSize: '1rem', color: '#333', marginLeft: '10px' }}
                required
              />
            </div>
            <div
              className="flex items-center"
              style={{
                background: '#f3f0ff',
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '10px 14px',
                transition: 'border 0.3s ease',
              }}
              onMouseOver={e => (e.currentTarget.style.borderColor = '#7c3aed')}
              onMouseOut={e => (e.currentTarget.style.borderColor = '#ccc')}
            >
              <i className="fas fa-lock" style={{ color: '#7c3aed', fontSize: '1.1rem' }}></i>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="flex-1 border-none outline-none bg-transparent"
                style={{ fontSize: '1rem', color: '#333', marginLeft: '10px' }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(to right, #5624d0, #7c3aed)',
                color: 'white',
                padding: '12px 16px',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'transform 0.3s, background 0.3s',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
              }}
              disabled={loading}
              onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(to right, #7c3aed, #5624d0)')}
              onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(to right, #5624d0, #7c3aed)')}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {message && (
          <div style={{ 
            color: message.includes("success") || message.includes("sent") || message.includes("verified") ? "green" : "red", 
            marginBottom: 10,
            padding: '8px 12px',
            borderRadius: '6px',
            background: message.includes("success") || message.includes("sent") || message.includes("verified") ? '#d4edda' : '#f8d7da'
          }}>
            {message}
          </div>
        )}

        <p style={{ fontSize: '0.9rem', color: '#555' }}>
          Remember your password?{' '}
          <Link
            to="/login"
            style={{
              color: '#5624d0',
              fontWeight: 600,
              textDecoration: 'none',
            }}
            onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword; 