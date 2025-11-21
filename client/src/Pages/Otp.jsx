import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Otp.css";

const Otp = ({ email, otpFromServer, onSuccess }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call backend to verify OTP
      const res = await fetch("https://lms-backend-5s5x.onrender.com/api/otp/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, enteredOtp: otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "OTP verification failed");
        setLoading(false);
        return;
      }
      // Save user to localStorage
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <h2>Verify Your Email</h2>
      <p>We’ve sent an OTP to <strong>{email}</strong></p>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify & Continue"}</button>
      </form>
    </div>
  );
};

export default Otp;