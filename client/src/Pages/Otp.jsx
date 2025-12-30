import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { otpAPI } from "@/utils/api";
import "./Otp.css";

const Otp = ({ email, otpFromServer, onSuccess }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call backend to verify OTP
      const res = await otpAPI.verifyOtp({ email, enteredOtp: otp });

      // Save user to localStorage
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      alert(res.data.message || "OTP verified successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("OTP Verification Error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <h2>Verify Your Email</h2>
      <p>
        We’ve sent an OTP to <strong>{email}</strong>
      </p>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>
      </form>
    </div>
  );
};

export default Otp;
