import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img4 from "../assets/img4.png";

// App.css is automatically applied if imported in App.js
// import "../App.css"; 

const HeroSection = () => {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slides = [img1, img2, img4];
  const AUTOPLAY_MS = 3000;
  const TRANSITION_MS = 600;

  const total = slides.length;

  // --- Slider Logic ---
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused]);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const slideWidth = container.clientWidth;
    track.style.transition = `transform ${TRANSITION_MS}ms ease`;
    track.style.transform = `translateX(-${current * slideWidth}px)`;

    if (current === total) {
      const handle = () => {
        track.style.transition = "none";
        track.style.transform = `translateX(0px)`;
        setTimeout(() => {
          setCurrent(0);
        }, 20);
        track.removeEventListener("transitionend", handle);
      };
      track.addEventListener("transitionend", handle);
    }
  }, [current, total]);

  useEffect(() => {
    const onResize = () => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;
      track.style.transition = "none";
      const slideWidth = container.clientWidth;
      const indexToUse = current > total ? 0 : current;
      track.style.transform = `translateX(-${indexToUse * slideWidth}px)`;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [current, total]);

  const goPrev = () => {
    const container = containerRef.current;
    if (!container) return;
    if (current === 0) {
      const track = trackRef.current;
      const w = container.clientWidth;
      track.style.transition = "none";
      track.style.transform = `translateX(-${total * w}px)`;
      setTimeout(() => setCurrent(total - 1), 20);
    } else {
      setCurrent((c) => c - 1);
    }
  };

  const goNext = () => {
    setCurrent((c) => c + 1);
  };

  return (
    <section className="hero-section">
      
      {/* LEFT SIDE: Text Content */}
      <div className="hero-text">
        <h1>
          Traincape LMS
        </h1>
        <h2>  
          <span className="text-blue-1000">Build the Future You Deserve</span>
        </h2>
        
        <p>
          Traincape is your all-in-one Learning Management System. Learn new skills, 
          earn certifications, or teach students from around the globe with ease and flexibility.
        </p>
        <button onClick={() => navigate("/courses")} className="explore-btn">
          Explore Courses
        </button>
      </div>

      {/* RIGHT SIDE: Slider acting as 'hero-image' */}
      <div className="hero-image" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        
        {/* Slider Container */}
        <div
          className="slider-container"
          style={{
            width: "100%",
            maxWidth: "600px",
            borderRadius: "1.2rem",
            overflow: "hidden",
            position: "relative", // Important for absolute buttons
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          ref={containerRef}
        >
          {/* CHANGES DONE HERE:
             Removed inline styles and added CSS classes 'slider-nav-btn', 'prev-btn', 'next-btn'
          */}
          
          <button onClick={goPrev} className="slider-nav-btn prev-btn">
            ‹
          </button>

          <button onClick={goNext} className="slider-nav-btn next-btn">
            ›
          </button>

          {/* Track */}
          <div ref={trackRef} style={{ display: "flex", width: "max-content" }}>
            {/* Real Slides */}
            {slides.map((s, i) => (
              <div key={`slide-${i}`} onClick={() => navigate("/courses")} style={{ width: "600px", flexShrink: 0 }}>
                <img 
                  src={s} 
                  alt={`slide-${i}`} 
                  style={{ width: "100%", height: "400px", objectFit: "cover", display: "block" }} 
                />
              </div>
            ))}
            {/* Cloned Slides */}
            {slides.map((s, i) => (
              <div key={`clone-${i}`} style={{ width: "600px", flexShrink: 0 }}>
                <img 
                  src={s} 
                  alt={`clone-${i}`} 
                  style={{ width: "100%", height: "400px", objectFit: "cover", display: "block" }} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CSS Patch specifically for responsive sizing */}
      <style>{`
        @media (max-width: 768px) {
           .slider-container, .slider-container div {
              max-width: 100% !important;
           }
           .slider-container img {
              height: 250px !important; 
           }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
