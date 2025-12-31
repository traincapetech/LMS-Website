import React, { useState, useEffect } from "react";
import cameo from "../assets/cameo.jpeg";
import { useNavigate } from "react-router-dom";
import "./teach.css";

const Teach = () => {
  const [activeTab, setActiveTab] = useState("plan");
  const navigate = useNavigate();
  const [count, setCount] = useState({
    students: 0,
    languages: 0,
    enrollments: 0,
    countries: 0,
    customers: 0,
  });
  useEffect(() => {
    const targets = {
      students: 80,
      languages: 75,
      enrollments: 1100,
      countries: 180,
      customers: 17200,
    };
    const interval = setInterval(() => {
      setCount((prev) => {
        const updated = { ...prev };
        Object.entries(targets).forEach(([key, value]) => {
          if (prev[key] < value) {
            updated[key] = Math.min(prev[key] + Math.ceil(value / 50), value);
          }
        });
        return updated;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="teach-container">
      {/* Hero Section */}
      <section className="teach-hero-section">
        <div className="teach-hero-content">
          <h1 className="teach-hero-title">
            Come teach with us
          </h1>
          <p className="teach-hero-description">
            Become an instructor and change lives — including your own
          </p>
          <button
            className="teach-hero-button"
            onClick={() => navigate("/form")}
          >
            Start Instructor Application
          </button>
        </div>
        <img
          src={cameo}
          alt="Teach Hero"
          className="teach-hero-image"
        />
      </section>

      {/* Reasons Section */}
      <section className="teach-reasons-section">
        <h2 className="teach-reasons-title">
          So many reasons to start
        </h2>
        <div className="teach-reasons-grid">
          {[{
            img: "https://cdn-icons-png.flaticon.com/512/1995/1995526.png",
            title: "Teach your way",
            desc: "Publish the course you want, in the way you want, and always have control of your own content.",
          }, {
            img: "https://img.icons8.com/ios-filled/100/mind-map.png",
            title: "Inspire learners",
            desc: "Teach what you know and help learners explore their interests, gain new skills, and advance their careers.",
          }, {
            img: "https://img.icons8.com/ios-filled/100/prize.png",
            title: "Get rewarded",
            desc: "Expand your professional network, build your expertise, and earn money on each paid enrollment.",
          }].map((item, idx) => (
            <div key={item.title} className="teach-reason-card">
              <img src={item.img} alt={item.title} className="teach-reason-icon" />
              <h3 className="teach-reason-title">
                {item.title}
              </h3>
              <p className="teach-reason-description">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Counters Section */}
      <section className="teach-counters-section">
        {[{
          value: `${count.students}M`,
          label: "Students",
        }, {
          value: `${count.languages}+`,
          label: "Languages",
        }, {
          value: `${(count.enrollments / 1000).toFixed(1)}B`,
          label: "Enrollments",
        }, {
          value: `${count.countries}+`,
          label: "Countries",
        }, {
          value: `${count.customers.toLocaleString()}+`,
          label: "Enterprise customers",
        }].map((item) => (
          <div key={item.label} className="teach-counter-item">
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </div>
        ))}
      </section>

      {/* How to Begin Section */}
      <section className="teach-how-to-section">
        <h2 className="teach-how-to-title">
          How to begin
        </h2>
        <div className="teach-tabs-container">
          {["plan", "record", "launch"].map((tab) => (
            <span
              key={tab}
              className={`teach-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "plan"
                ? "Plan your curriculum"
                : tab === "record"
                  ? "Record your video"
                  : "Launch your course"}
            </span>
          ))}
        </div>
        <div className="teach-content-container">
          <div className="teach-content-text">
            <p className="teach-content-paragraph">
              You start with your passion and knowledge. Then choose a promising topic with the help of our Marketplace Insights tool.
            </p>
            <p className="teach-content-paragraph">
              The way that you teach — what you bring to it — is up to you.
            </p>
            <h4 className="teach-content-heading">
              How we help you
            </h4>
            <p className="teach-content-paragraph">
              We offer plenty of resources on how to create your first course. And, our instructor dashboard and curriculum pages help keep you organized.
            </p>
          </div>
          <img
            src={cameo}
            alt="Curriculum Planning"
            className="teach-content-image"
          />
        </div>
      </section>

      {/* Instructor Call-to-Action Section */}
      <section className="teach-cta-section">
        <h2 className="teach-cta-title">
          Become an instructor today
        </h2>
        <p className="teach-cta-description">
          Join one of the world's largest online learning marketplaces.
        </p>
        <button
          className="teach-cta-button"
          onClick={() => navigate("/Form")}
        >
          Get started
        </button>
      </section>
    </div>
  );
};

export default Teach;
