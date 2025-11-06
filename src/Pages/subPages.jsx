import React from 'react';
import './Pages.css';
import { FaApple, FaMicrosoft, FaUnity, FaUserTie, FaProjectDiagram, FaCalculator } from 'react-icons/fa';
import { SiCisco, SiMeta, SiItunes, SiAdobe, SiAutodesk } from 'react-icons/si';
import { Link } from 'react-router-dom';

const certifications = [
  {
    name: "IBM Certifications",
    icon: <FaUserTie size={50} color="#006699" />,
    desc: "Enhance your IT infrastructure protection with our specialized cybersecurity services."
  },
  {
    name: "Digital Marketing Certification",
    icon: <SiMeta size={50} color="#4267B2" />,
    desc: "Safeguard your digital assets in today's challenging landscape."
  },
  {
    name: "PMI Project Management",
    icon: <FaProjectDiagram size={50} color="#F37021" />,
    desc: "We offer specialized cybersecurity services that ensure the protection of IT infrastructures and solutions."
  },
  {
    name: "Information Technology Specialist",
    icon: <SiItunes size={50} color="#2B8CC4" />,
    desc: "Empowering organizations to safeguard their digital assets in today's challenging landscape."
  },
  {
    name: "App Development with Swift",
    icon: <FaApple size={50} color="#FF5E00" />,
    desc: "We offer specialized cybersecurity services that ensure the protection of IT infrastructures and solutions."
  },
  {
    name: "Tally Certifications",
    icon: <FaCalculator size={50} />,
    desc: "We offer specialized cybersecurity services that ensure the protection of IT infrastructures and solutions."
  },
  {
    name: "Microsoft Office Specialist",
    icon: <FaMicrosoft size={50} color="#0078D4" />,
    desc: "We offer specialized cybersecurity services that ensure the protection of IT infrastructures and solutions."
  },
  {
    name: "Autodesk Certified User",
    icon: <SiAutodesk size={50} />,
    desc: "We offer specialized cybersecurity services that ensure the protection of IT infrastructures and solutions."
  },
  {
    name: "Microsoft Fundamentals",
    icon: <FaMicrosoft size={50} />,
    desc: "Learn the fundamentals and secure IT infrastructures and cloud solutions."
  },
  {
    name: "Adobe Certifications",
    icon: <SiAdobe size={50} color="#FF0000" />,
    desc: "Master design tools and create professional content with certified Adobe skills."
  },
  {
    name: "Unity Developer",
    icon: <FaUnity size={50} color="#000" />,
    desc: "Build immersive applications and games with Unity certification."
  },
  {
    name: "Cisco Networking",
    icon: <SiCisco size={50} color="#0099CC" />,
    desc: "Become a networking expert with Cisco Certified training."
  }
];

const SubPages = () => {
  return (
    <div className="subpages-container">
      <h1 className="page-title">Traincape Certifications</h1>
      <div className="cards-grid">
        {certifications.map((cert, index) => {
          const cardContent = (
            <div className="cert-card" key={index}>
              <div className="cert-icon">{cert.icon}</div>
              <h2 className="cert-title">{cert.name}</h2>
              <p className="cert-desc">{cert.desc}</p>
            </div>
          );
          if (cert.name === "IBM Certifications") {
            return (
              <Link to="/ibm" key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                {cardContent}
              </Link>
            );
          }
          return cardContent;
        })}
      </div>
    </div>
  );
};

export default SubPages;
