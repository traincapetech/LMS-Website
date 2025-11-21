import React from "react";
import { Link } from "react-router-dom";
import "../index.css"; // Ensure this line exists in index.js or here if needed

const Footer = () => {
  const handleCourseClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-columns">
          <div className="footer-col">
            <h3>In-demand Careers</h3>
            <ul>
              <li><Link to="/course/data-scientist" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Data Scientist</Link></li>
              <li><Link to="/course/full-stack-web-developer" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Full Stack Web Developer</Link></li>
              <li><Link to="/course/cloud-engineer" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Cloud Engineer</Link></li>
              <li><Link to="/course/project-management" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Project Manager</Link></li>
              <li><Link to="/course/game-developer" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Game Developer</Link></li>
              <li className="highlight">See all Career Accelerators</li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Web Development</h3>
            <ul>
              <li><Link to="/course/web-development" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Web Development</Link></li>
              <li><Link to="/course/javascript" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>JavaScript</Link></li>
              <li><Link to="/course/react-js" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>React JS</Link></li>
              <li><Link to="/course/angular" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Angular</Link></li>
              <li><Link to="/course/java" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Java</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>IT Certifications</h3>
            <ul>
              <li><Link to="/course/aws-cloud-practitioner" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Amazon AWS</Link></li>
              <li><Link to="/course/aws-cloud-practitioner" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>AWS Cloud Practitioner</Link></li>
              <li><Link to="/course/azure-fundamentals" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>AZ-900: Azure Fundamentals</Link></li>
              <li><Link to="/course/solutions-architect" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Solutions Architect</Link></li>
              <li><Link to="/course/kubernetes" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Kubernetes</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Leadership</h3>
            <ul>
              <li><Link to="/course/leadership" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Leadership</Link></li>
              <li><Link to="/course/management-skills" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Management Skills</Link></li>
              <li><Link to="/course/project-management" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Project Management</Link></li>
              <li><Link to="/course/productivity" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Productivity</Link></li>
              <li><Link to="/course/emotional-intelligence" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Emotional Intelligence</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Certifications by Skill</h3>
            <ul>
              <li><Link to="/course/cybersecurity-certification" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Cybersecurity Certification</Link></li>
              <li><Link to="/course/project-management" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Project Management Certification</Link></li>
              <li><Link to="/course/cloud-certification" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Cloud Certification</Link></li>
              <li><Link to="/course/data-analytics-certification" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>Data Analytics Certification</Link></li>
              <li><Link to="/course/hr-certification" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleCourseClick}>HR Certification</Link></li>
              <li className="highlight">See all Certifications</li>
            </ul>
          </div>
        </div>

        {/* Middle Section */}
        <div className="footer-links">
          <div className="footer-link-col">
            <h4>About</h4>
            <ul>
              <li>About us</li>
              <li>Careers</li>
              <li>Contact us</li>
              <li>Blog</li>
              <li>Investors</li>
            </ul>
          </div>
          <div className="footer-link-col">
            <h4>Discover Traincape</h4>
            <ul>
              <li>Get the app</li>
              <li>Teach on Traincape</li>
              <li><u>Plans and Pricing</u></li>
              <li>Affiliate</li>
              <li>Help and Support</li>
            </ul>
          </div>
          <div className="footer-link-col">
            <h4>Traincape for Business</h4>
            <ul>
              <li>Traincape Business</li>
            </ul>
          </div>
          <div className="footer-link-col">
            <h4>Legal & Accessibility</h4>
            <ul>
              <li>Accessibility statement</li>
              <li>Privacy policy</li>
              <li>Sitemap</li>
              <li>Terms</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-logo">
            <span className="logo">Traincape</span> © 2025 Traincape, Inc.
          </div>
          <div className="footer-settings">
            <span className="link">Cookie settings</span>
            <span className="link">🌐 English</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
