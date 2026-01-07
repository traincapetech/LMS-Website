import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Create.css";
import { pendingCoursesAPI } from "@/utils/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const categories = [
  "Development", "Business", "Finance & Accounting", "IT & Software",
  "Office Productivity", "Personal Development", "Design", "Marketing",
  "Lifestyle", "Photography & Video", "Health & Fitness", "Music",
  "Teaching & Academics", "I don't know yet"
];

const Create = () => {
  const [step, setStep] = useState(1);
  const [courseType, setCourseType] = useState("");
  const [category, setCategory] = useState("");
  const [timeCommitment, setTimeCommitment] = useState("");
  const navigate = useNavigate();

  const handleContinue = async () => {
    // Step navigation
    if (step < 4) return setStep(step + 1);

    // -----------------------------------------
    // 🔐 Step 4 → check token before proceeding
    // -----------------------------------------
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      alert("You must be logged in to create a course!");
      return;
    }

    if (!user || user.role !== "instructor") {
      toast.info("Only instructors can create courses!");
      return;
    }

    // -----------------------------------------
    // 🚀 Create Pending Course API Call
    // -----------------------------------------
    try {
      const res = await pendingCoursesAPI.createPendingCourse({
        courseType,
        category,
        timeCommitment
      });
     
      if (!res.data.success) {
        alert(res.data.message || "Course creation failed!");
        return;
      }

      if (!res.data.pendingCourseId) {
        alert("Error: pendingCourseId missing from server response.");
        return;
      }

      // -----------------------------------------
      // 🎯 Redirect to dashboard/:id
      // -----------------------------------------
      navigate(`/dashboard/${res.data.pendingCourseId}`);

    } catch (err) {
      console.error("Create course error:", err);
      alert("Server error. Please try again.");
    }
  };



  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="create-page mt-10 font-poppins">
      <Card className="create-wrapper">
        <div className="step-indicator">Step {step} of 4</div>

        {step === 1 && (
          <>
            <h2 className="create-heading">
              What type of course are you creating?
            </h2>
            <div className="card-grid">
              <div
                className={`card ${courseType === "course" ? "active" : ""}`}
                onClick={() => setCourseType("course")}
              >
                <h3 className="text-lg">🎥 Full Course</h3>
                <p className="font-inter text-sm pt-2">
                  Build a complete course with videos, quizzes, and materials.
                </p>
              </div>
              <div
                className={`card ${courseType === "practice" ? "active" : ""}`}
                onClick={() => setCourseType("practice")}
              >
                <h3 className="text-lg">📝 Practice Test</h3>
                <p className="font-inter text-sm pt-2">
                  Help students prepare with mock tests and assessments.
                </p>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="create-heading">Choose a category</h2>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="create-select"
            >
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="create-heading">Weekly time commitment?</h2>
            <div className="radio-group">
              {[
                "I’m very busy right now (0–2 hours)",
                "I’ll work on this on the side (2–4 hours)",
                "I have lots of flexibility (5+ hours)",
                "I haven’t yet decided if I have time",
              ].map((option, idx) => (
                <label key={idx} className="radio-label">
                  <input
                    type="radio"
                    value={option}
                    checked={timeCommitment === option}
                    onChange={(e) => setTimeCommitment(e.target.value)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="create-heading">You're ready to begin!</h2>
            <p className="create-subtext">
              Let’s head to your course dashboard and start creating your
              content.
            </p>
          </>
        )}

        <div className="btn-group">
          {step > 1 && (
            <Button className="px-5 py-5 bg-blue-600" onClick={handleBack}>
              ⬅ Back
            </Button>
          )}
          <Button
            className="px-5 py-5 bg-blue-600"
            onClick={handleContinue}
            disabled={step === 1 && !courseType}
          >
            {step === 4 ? "Launch Dashboard 🚀" : "Continue ➡"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Create;
