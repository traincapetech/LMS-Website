import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authAPI } from "@/utils/api";

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
      await authAPI.forgotPassword(email);
      setMessage("OTP sent successfully");
      toast.success("OTP sent successfully");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await authAPI.verifyOtp({ email, otp });
      setMessage("OTP verified successfully");
      toast.success("OTP verified successfully");
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
      toast.error(err.response?.data?.message || "Invalid OTP");
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
      await authAPI.resetPassword({ email, newPassword });
      setMessage("Password reset successfully");
      toast.success("Password reset successfully");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset password");
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 font-inter animate-fadeIn"
      style={{
        background:
          "radial-gradient(circle at 10% 20%, #ede9fe, #d1c4e9, #c4b5fd)",
      }}
    >
      <div
        className="bg-Background"
        style={{
          backdropFilter: "blur(12px)",
          padding: "40px 30px",
          borderRadius: "16px",
          boxShadow: "0 12px 36px rgba(86, 36, 208, 0.18)",
          maxWidth: "430px",
          width: "100%",
          textAlign: "center",
          position: "relative",
          animation: "slideIn 0.7s ease-out",
          transition: "transform 0.3s, box-shadow 0.3s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.01)";
          e.currentTarget.style.boxShadow =
            "0 14px 40px rgba(86, 36, 208, 0.25)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow =
            "0 12px 36px rgba(86, 36, 208, 0.18)";
        }}
      >
        <h2
          style={{
            fontSize: "2.2rem",

            fontWeight: 700,
            marginBottom: "24px",
            textShadow: "0 2px 4px rgba(86, 36, 208, 0.1)",
          }}
        >
          {step === 1 && "Forgot Password"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "Reset Password"}
        </h2>

        {step === 1 && (
          <form
            onSubmit={handleSendOtp}
            className="flex flex-col"
            style={{ gap: "18px", marginBottom: "20px" }}
          >
            <p style={{ color: "#6a6f73", marginBottom: "16px" }}>
              Enter your email address and we'll send you an OTP to reset your
              password.
            </p>
            <div
              onMouseOver={(e) =>
                (e.currentTarget.style.borderColor = "#7c3aed")
              }
              onMouseOut={(e) => (e.currentTarget.style.borderColor = "#ccc")}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="logininput"
              />
            </div>
            <Button disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleVerifyOtp}
            className="flex flex-col"
            style={{ gap: "18px", marginBottom: "20px" }}
          >
            <p style={{ color: "#6a6f73", marginBottom: "16px" }}>
              We've sent a 6-digit OTP to your email. Please enter it below.
            </p>
            <div
              className="flex items-center"
             
            >
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="logininput"
                maxLength="6"
                required
              />
            </div>
            <Button disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        )}

        {step === 3 && (
          <form
            onSubmit={handleResetPassword}
            className="flex flex-col"
            style={{ gap: "18px", marginBottom: "20px" }}
          >
            <p style={{ color: "#6a6f73", marginBottom: "16px" }}>
              Enter your new password below.
            </p>
            <div
              className="flex items-center"
              
            >
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="logininput"
                required
              />
            </div>
            <div
              className="flex items-center"
             
            >
             
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="logininput"
                required
              />
            </div>
            <Button disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        )}

        {message && (
          <div
            style={{
              color:
                message.includes("success") ||
                message.includes("sent") ||
                message.includes("verified")
                  ? "green"
                  : "red",
              marginBottom: 10,
              padding: "8px 12px",
              borderRadius: "6px",
              background:
                message.includes("success") ||
                message.includes("sent") ||
                message.includes("verified")
                  ? "#d4edda"
                  : "#f8d7da",
            }}
          >
            {message}
          </div>
        )}

        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          Remember your password?{" "}
          <Link
            to="/login"
            style={{
              color: "#5624d0",
              fontWeight: 600,
              textDecoration: "none",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.textDecoration = "underline")
            }
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
