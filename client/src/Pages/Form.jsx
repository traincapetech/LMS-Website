import React, { useRef, useState } from "react";
import "./Form.css";
import instr from "../assets/instr.jpg";
import { useNavigate } from "react-router-dom";
import Otp from "./Otp";

const Form = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: form, 2: otp
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otpFromServer, setOtpFromServer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      // Call backend to generate/send OTP
              const res = await fetch("https://lms-backend-5s5x.onrender.com/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to send OTP");
        setLoading(false);
        return;
      }
      setOtpFromServer(data.otp); // For demo, assume backend returns OTP
      setStep(2);
    } catch (error) {
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // After OTP verification, go to course creation steps
  const handleOtpSuccess = () => {
    navigate("/create", { state: { name, email } });
  };

  return (
    <div className="form-container">
      <div className="form-image">
        <img src={instr} alt="Traincape Instructor" />
      </div>
      <div className="form-content">
        <h2>Instructor Application</h2>
        <p>Enter your name and email to begin the instructor application process.</p>
        {step === 1 && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <input type="text" name="fullName" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
            <input type="email" name="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
              {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
        )}
        {step === 2 && (
          <Otp email={email} otpFromServer={otpFromServer} onSuccess={handleOtpSuccess} />
        )}
      </div>
    </div>
  );
};

export default Form;