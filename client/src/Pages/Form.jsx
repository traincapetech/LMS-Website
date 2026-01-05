import React, { useEffect, useRef, useState } from "react";
import "./Form.css";
import instr from "../assets/instr.jpg";
import { useNavigate } from "react-router-dom";
import Otp from "./Otp";
import { Button } from "@/components/ui/button";
import { otpAPI } from "@/utils/api";

const Form = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: form, 2: otp
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otpFromServer, setOtpFromServer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      // Call backend to generate/send OTP
      const res = await otpAPI.sendOtp({ email, fullName: name });

      // Axios automatically throws on error, so if we're here, it succeeded
      alert(res.data.message || "OTP sent successfully!");
      setOtpFromServer(res.data.otp); // For demo, if backend returns OTP
      setStep(2);
    } catch (error) {
      console.error("OTP Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again later.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // After OTP verification, go to course creation steps
  const handleOtpSuccess = () => {
    navigate("/instructor-dashboard", { state: { name, email } });
=======
  // After OTP verification, redirect new instructors to course creation
  const handleOtpSuccess = () => {
    // New instructors should start by creating their first course
    navigate("/create", { state: { name, email } });
>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02
  };

  return (
    <div className="w-full h-screen font-poppins flex flex-col md:flex-row items-center justify-center gap-10 px-5 pt-20 md:pt-0">
      <div className="form-image">
        <img src={instr} alt="Traincape Instructor" />
      </div>
      <div className="form-content">
        <h2 className="font-medium text-3xl mb-5">Instructor Application</h2>
        <p className=" text-sm font-inter mb-5">
          Enter your name and email to begin the instructor application process.
        </p>
        {step === 1 && (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            <input
              type="text"
              name="fullName"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button disabled={loading} style={{ marginTop: 10 }}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        )}
        {step === 2 && (
          <Otp
            email={email}
            otpFromServer={otpFromServer}
            onSuccess={handleOtpSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Form;
