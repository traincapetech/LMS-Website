import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Create.css";

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

  const handleContinue = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Final step: launch dashboard
      console.log({ courseType, category, timeCommitment });
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="create-page">
      <div className="create-wrapper">
        <div className="step-indicator">Step {step} of 4</div>

        {step === 1 && (
          <>
            <h2 className="create-heading">What type of course are you creating?</h2>
            <div className="card-grid">
              <div
                className={`card ${courseType === "course" ? "active" : ""}`}
                onClick={() => setCourseType("course")}
              >
                <h3>🎥 Full Course</h3>
                <p>Build a complete course with videos, quizzes, and materials.</p>
              </div>
              <div
                className={`card ${courseType === "practice" ? "active" : ""}`}
                onClick={() => setCourseType("practice")}
              >
                <h3>📝 Practice Test</h3>
                <p>Help students prepare with mock tests and assessments.</p>
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
                <option key={index} value={cat}>{cat}</option>
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
                "I haven’t yet decided if I have time"
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
              Let’s head to your course dashboard and start creating your content.
            </p>
          </>
        )}

        <div className="btn-group">
          {step > 1 && (
            <button className="btn back-btn" onClick={handleBack}>
              ⬅ Back
            </button>
          )}
          <button
            className="btn primary-btn"
            onClick={handleContinue}
            disabled={step === 1 && !courseType}
          >
            {step === 4 ? "Launch Dashboard 🚀" : "Continue ➡"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;
