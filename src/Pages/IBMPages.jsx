import React from 'react';
import './IBM.css';
import { FaHtml5, FaDatabase, FaPython, FaCloud, FaNodeJs, FaJsSquare, FaCuttlefish, FaCode, FaBrain, FaChartBar, FaServer, FaProjectDiagram, FaFlask, FaNetworkWired, FaTools, FaLaptopCode, FaCube, FaHdd, FaRobot, FaLaptop, FaBug } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
  
const ibmCourses = [
  { title: "IBM Web Development using HTML", icon: <FaHtml5 size={50} color="#e44d26" /> },
  { title: "IBM Software Foundation Course C", icon: <FaCuttlefish size={50} color="#00599C" /> },
  { title: "IBM Software Foundation Course C++ Certification Course", icon: <FaCode size={50} color="#00599C" /> },
  { title: "IBM RDBMS - Database Fundamentals Certification Course", icon: <FaDatabase size={50} color="#4b5563" /> },
  { title: "IBM SQL and Relational Database 101 Certification Course", icon: <FaDatabase size={50} color="#22c55e" /> },
  { title: "IBM Deep Learning with TensorFlow Certification Course", icon: <FaBrain size={50} color="#f9a03c" /> },
  { title: "IBM Data Science Methodology Certification Course", icon: <FaChartBar size={50} color="#6b7280" /> },
  { title: "IBM Python for Data Science Certification Course", icon: <FaPython size={50} color="#3776ab" /> },
  { title: "IBM Rest API Certification Course", icon: <FaServer size={50} color="#ff6c37" /> },
  { title: "IBM Scala 101 Certification Course", icon: <FaProjectDiagram size={50} color="#c72c48" /> },
  { title: "IBM Agile Methodologies Certification Course", icon: <FaFlask size={50} color="#0052cc" /> },
  { title: "IBM DevOps Fundamentals Certification Course", icon: <FaTools size={50} color="#6366f1" /> },
  { title: "IBM Data Analysis with Python Certification Course", icon: <FaPython size={50} color="#2563eb" /> },
  { title: "IBM Cloud Fundamental Certification Course", icon: <FaCloud size={50} color="#0ea5e9" /> },
  { title: "IBM Intro to Containers, Kubernetes and OpenShift V2", icon: <FaCube size={50} color="#2563eb" /> },
  { title: "IBM Big Data, Hadoop and Ecosystems Course", icon: <FaHdd size={50} color="#fcd34d" /> },
  { title: "IBM Node JS Certification Course", icon: <FaNodeJs size={50} color="#3c873a" /> },
  { title: "IBM NoSQL – MongoDB Certification Course", icon: <FaNetworkWired size={50} color="#10b981" /> },
  { title: "IBM Machine Learning with Python Certification Course", icon: <FaRobot size={50} color="#2d6a9f" /> },
  { title: "IBM JavaScript Certification Course", icon: <FaJsSquare size={50} color="#facc15" /> },
];

const IBMPages = () => {
  const navigate = useNavigate();

  // Map course titles to their corresponding route paths
  const courseRoutes = {
    "IBM Web Development using HTML": "/html",
    "IBM Software Foundation Course C": "/c",
    "IBM Software Foundation Course C++ Certification Course": "/cpp",
    // Add more mappings as you create more files/routes
  };

  const handleKnowMore = (title) => {
    const route = courseRoutes[title];
    if (route) {
      navigate(route);
    } else {
      alert("Page not available yet!");
    }
  };

  return (
    <div className="ibm-container">
      <div className="ibm-header">
        <h1>IBM Certification Courses</h1>
        <p>
          IBM Certification Courses help learners gain skills in the latest emerging technologies including AI/ML, Analytics, Blockchain, Cloud, Cybersecurity, Data Science, and more.
        </p>
        <div className="breadcrumb">Home &gt; Course Details &gt; IBM</div>
      </div>

      <div className="cards-grid">
        {ibmCourses.map((course, idx) => (
          <div className="cert-card" key={idx}>
            <div className="cert-icon">{course.icon}</div>
            <h2 className="cert-title">{course.title}</h2>
            <button
              className="know-more"
              onClick={() => handleKnowMore(course.title)}
            >
              Know More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IBMPages;
