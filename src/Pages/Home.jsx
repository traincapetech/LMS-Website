import React from "react";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img4 from "../assets/img4.png";
import {
  FaRobot,
  FaPenNib,
  FaBrain,
  FaComments,
  FaUserTie,
  FaNetworkWired,
  FaMicrosoft,
  FaAws,
  FaGoogle,
  FaProjectDiagram,
  FaApple,
  FaCalculator,
  FaAutoprefixer,
  FaCertificate,
  FaChartLine,
  FaCogs,
  FaHandsHelping,
} from "react-icons/fa";
import { SiUnity, SiCisco } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-text">
          <h1>Welcome to Traincape LMS</h1>
          <p>
            Traincape is your all-in-one Learning Management System. Learn new
            skills, earn certifications, or teach students from around the globe
            with ease and flexibility.
          </p>
          <button className="explore-btn" onClick={() => navigate("/courses")}>Explore Courses</button>
        </div>
        <div className="hero-image">
          <img src={img1} alt="Traincape LMS" />
        </div>
      </div>

      {/* Career Accelerator Section */}
      <div className="career-section">
        <h2>Ready to reimagine your career?</h2>
        <p>
          Get the skills and real-world experience employers want with Career
          Accelerators.
        </p>

        <div className="career-cards">
          {/* Cards (3) */}
          {/* ... keep same cards as above ... */}
        </div>
        <div className="career-button">
          <button onClick={() => navigate("/courses")}>All Career Accelerators</button>
        </div>
      </div>

      {/* Skills Section */}
      <div className="skills-section">
        <h2>All the skills you need in one place</h2>
        <p>
          From critical skills to technical topics, Traincape supports your
          professional development.
        </p>

        <div className="tabs">
          {[
            "ChatGPT",
            "Data Science",
            "Python",
            "Machine Learning",
            "Deep Learning",
            "AI",
            "Statistics",
          ].map((tab, index) => (
            <div key={index} className={`tab ${index === 0 ? "active" : ""}`}>
              <strong>{tab}</strong>
              <span>{Math.floor(Math.random() * 10) + 1}M+ learners</span>
            </div>
          ))}
        </div>

        <div className="course-grid">
          {/* 4 AI Courses */}
          {/* ... keep same cards as above ... */}
        </div>
      </div>

      {/* Partners Section */}
      <div className="partners-section">
        <h2>Explore Our Certification Courses</h2>
        <div className="partners-grid">
          {[
            { name: "IBM Certifications", icon: <FaUserTie size={40} color="#1f3c88" /> },
            { name: "Digital Marketing", icon: <FaGoogle size={40} color="#ea4335" /> },
            { name: "PMI Project Mgmt", icon: <FaProjectDiagram size={40} color="#2b5797" /> },
            { name: "IT Specialist", icon: <FaAws size={40} color="#ff9900" /> },
            { name: "App Dev with Swift", icon: <FaApple size={40} color="#333" /> },
            { name: "Tally Certifications", icon: <FaCalculator size={40} color="#009688" /> },
            { name: "Microsoft Office", icon: <FaMicrosoft size={40} color="#00a4ef" /> },
            { name: "Autodesk Certified", icon: <FaAutoprefixer size={40} color="#17a2b8" /> },
            { name: "Unity Certified", icon: <SiUnity size={40} color="#000" /> },
            { name: "Cisco Certified", icon: <SiCisco size={40} color="#006db3" /> },
          ].map((course, index) => (
            <div
              className="partner-card"
              key={index}
              onClick={() => navigate("/subpage")}
              style={{ cursor: "pointer" }}
            >
              <div className="icon-wrap">{course.icon}</div>
              <h3>{course.name}</h3>
              <p>Specialized certifications to enhance your professional edge.</p>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Goals Section */}
      <div className="goals-section">
        <h2>Learning focused on your goals</h2>
        <div className="goals-container">
          <div className="goals-left">
            {[
              {
                title: "Hands-on training",
                desc: "Upskill with AI-powered coding, practice tests, and quizzes.",
                icon: <FaHandsHelping size={30} />,
              },
              {
                title: "Certification prep",
                desc: "Prep for recognized certifications with real challenges.",
                icon: <FaCertificate size={30} />,
              },
              {
                title: "Insights and analytics",
                desc: "Advanced learning insights to track and optimize progress.",
                icon: <FaChartLine size={30} />,
              },
              {
                title: "Customizable content",
                desc: "Tailored learning paths for your team and organization.",
                icon: <FaCogs size={30} />,
              },
            ].map((item, i) => (
              <div className="goal-card" key={i}>
                <div className="goal-icon">{item.icon}</div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="goals-right">
             <img src={img2} 
              alt="Learning Goals"
              className="goals-img"
            />
          </div>
        </div>
        <section className="pricing-section">
  <h2 className="pricing-title">Accelerate Growth — For You or Your Organization</h2>
  <p className="pricing-subtitle">
    Reach goals faster with one of our plans. Try one free today or contact sales to learn more.
  </p>
  <div className="pricing-cards">
    {/* Personal Plan */}
    <div className="pricing-card">
      <div className="plan-header">
        <span className="plan-icon"><i className="fas fa-user"></i></span>
        <div>
          <h3>Personal Plan</h3>
          <p>For you</p>
        </div>
      </div>
      <p className="plan-price">
        <span className="original-price">₹500</span>{" "}
        <span className="discounted-price">₹400 /month</span>
      </p>
      <p className="plan-discount">20% off for the first 1 year(s)</p>
      <button className="plan-btn">Start subscription →</button>
      <ul className="plan-features">
        <li><i className="fas fa-check-circle check-icon"></i> Access to 26,000+ top courses</li>
        <li><i className="fas fa-check-circle check-icon"></i> Certification prep</li>
        <li><i className="fas fa-check-circle check-icon"></i> Goal-focused recommendations</li>
        <li><i className="fas fa-check-circle check-icon"></i> AI-powered coding exercises</li>
      </ul>
    </div>

    {/* Team Plan */}
    <div className="pricing-card">
      <div className="plan-header">
        <span className="plan-icon"><i className="fas fa-users"></i></span>
        <div>
          <h3>Team Plan</h3>
          <p>For your team</p>
        </div>
      </div>
      <p className="plan-price">₹2,000 /month per user</p>
      <button className="plan-btn">Start subscription →</button>
      <ul className="plan-features">
        <li><i className="fas fa-check-circle check-icon"></i> Access to 13,000+ top courses</li>
        <li><i className="fas fa-check-circle check-icon"></i> Certification prep</li>
        <li><i className="fas fa-check-circle check-icon"></i> Goal-focused recommendations</li>
        <li><i className="fas fa-check-circle check-icon"></i> AI-powered coding exercises</li>
        <li><i className="fas fa-check-circle check-icon"></i> Analytics and adoption reports</li>
      </ul>
    </div>

    {/* Enterprise Plan */}
    <div className="pricing-card">
      <div className="plan-header">
        <span className="plan-icon"><i className="fas fa-building"></i></span>
        <div>
          <h3>Enterprise Plan</h3>
          <p>For your whole organization</p>
        </div>
      </div>
      <p className="plan-price">Contact sales for pricing</p>
      <button className="plan-btn">Request a demo →</button>
      <ul className="plan-features">
        <li><i className="fas fa-check-circle check-icon"></i> Access to 30,000+ top courses</li>
        <li><i className="fas fa-check-circle check-icon"></i> Certification prep</li>
        <li><i className="fas fa-check-circle check-icon"></i> Goal-focused recommendations</li>
        <li><i className="fas fa-check-circle check-icon"></i> AI-powered coding exercises</li>
        <li><i className="fas fa-check-circle check-icon"></i> Advanced analytics and insights</li>
        <li><i className="fas fa-check-circle check-icon"></i> Dedicated customer success team</li>
        <li><i className="fas fa-check-circle check-icon"></i> International course collection (15+ languages)</li>
        <li><i className="fas fa-check-circle check-icon"></i> Customizable content</li>
        <li><i className="fas fa-check-circle check-icon"></i> Hands-on tech training with add-on</li>
        <li><i className="fas fa-check-circle check-icon"></i> Strategic implementation services</li>
      </ul>
    </div>
  </div>
</section>

<section className="testimonials-section">
  <h2 className="testimonials-heading">See what others are achieving through learning</h2>
  <div className="testimonials-container">
    {[
      {
        quote: "Because of this course I was able to clear my two interviews... Thanks for making such wonderful content.",
        name: "Diksha S",
        initials: "DS",
        course: "Business Intelligence (BI)",
        link: "#"
      },
      {
        quote: "This has helped me so much in my career...I joined as a frontend engineer and eventually transitioned to full stack engineer with the help of this course.",
        name: "Chethan B",
        initials: "CB",
        course: "Go (golang)",
        link: "#"
      },
      {
        quote: "Today, I am a software developer, and I credit a significant part of my success to the solid foundation laid by this course.",
        name: "Batchu K",
        initials: "BK",
        course: "Java",
        link: "#"
      },
      {
        quote: "I would highly recommend this Web Development Bootcamp to anyone interested in pursuing a career in web development or looking to enhance their skills in this field.",
        name: "Ankit K",
        initials: "AK",
        course: "Web Development",
        link: "#"
      }
    ].map((testimonial, index) => (
      <div className="testimonial-card" key={index}>
        <p className="testimonial-quote">“{testimonial.quote}”</p>
        <div className="testimonial-profile">
          <div className="testimonial-avatar">{testimonial.initials}</div>
          <div className="testimonial-name">{testimonial.name}</div>
        </div>
        <a href={testimonial.link} className="testimonial-link">
          View this {testimonial.course} course
        </a>
      </div>
    ))}
  </div>
</section>

<section className="ai-section">
  <div className="ai-content">
    <h2 className="ai-title">AI for Business Leaders</h2>
    <p className="ai-description">
      Build an AI-habit for you and your team that builds hands-on skills to help you lead effectively.
    </p>
    <button className="ai-button">Start Learning →</button>
  </div>

  <div className="ai-image-wrapper">
           <img src={img4}alt="AI Stack" className="ai-stack-image" />
  </div>
</section>
<section className="trending-now-plain">
  <h2 className="trending-title">Trending Now</h2>
  <div className="trending-columns">
    <div className="trending-column">
      <h3>ChatGPT is a top skill</h3>
      <a href="#" className="purple-link">See ChatGPT courses →</a>
      <p className="learner-count">4,759,049 learners</p>
      <button className="outline-btn">Show all trending skills ↗</button>
    </div>

    <div className="trending-column">
      <h4>Development</h4>
      <ul>
        <li><a href="#">Python →</a><span>48,715,474 learners</span></li>
        <li><a href="#">Web Development</a><span>14,181,896 learners</span></li>
        <li><a href="#">Data Science</a><span>7,974,796 learners</span></li>
      </ul>
    </div>

    <div className="trending-column">
      <h4>Design</h4>
      <ul>
        <li><a href="#">Blender</a><span>2,986,829 learners</span></li>
        <li><a href="#">Graphic Design</a><span>4,571,255 learners</span></li>
        <li><a href="#">UX Design</a><span>2,102,082 learners</span></li>
      </ul>
    </div>

    <div className="trending-column">
      <h4>Business</h4>
      <ul>
        <li><a href="#">PMI Project Management Professional (PMP)</a><span>2,669,350 learners</span></li>
        <li><a href="#">Microsoft Power BI</a><span>4,816,152 learners</span></li>
        <li><a href="#">CAPM</a><span>443,400 learners</span></li>
      </ul>
    </div>
  </div>
</section>
      </div>
    </div>
  );
};

export default Home;
