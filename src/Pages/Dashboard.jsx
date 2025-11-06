import React, { useState } from "react";
import "./Dashboard.css";
import axios from "axios";

const steps = [
  { key: "intended", label: "Intended learners" },
  { key: "structure", label: "Course structure" },
  { key: "setup", label: "Setup & test video" },
  { key: "film", label: "Film & edit" },
  { key: "curriculum", label: "Curriculum" },
  { key: "captions", label: "Captions (optional)" },
  { key: "accessibility", label: "Accessibility (optional)" },
  { key: "landing", label: "Course landing page" },
  { key: "pricing", label: "Pricing" },
  { key: "promotions", label: "Promotions" },
  { key: "messages", label: "Course messages" },
];

const Dashboard = () => {
  const [active, setActive] = useState("intended");
  // State for forms (expand as needed)
  const [learningObjectives, setLearningObjectives] = useState(["", "", "", ""]);
  const [requirements, setRequirements] = useState([""]);
  const [courseFor, setCourseFor] = useState("");
  const [structure, setStructure] = useState("");
  const [testVideo, setTestVideo] = useState(null);
  const [filmEdit, setFilmEdit] = useState("");
  const [sampleVideo, setSampleVideo] = useState(null);
  const [curriculum, setCurriculum] = useState("");
  const [captions, setCaptions] = useState("");
  const [accessibility, setAccessibility] = useState("");
  const [landingTitle, setLandingTitle] = useState("");
  const [landingSubtitle, setLandingSubtitle] = useState("");
  const [landingDesc, setLandingDesc] = useState("");
  const [price, setPrice] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoDesc, setPromoDesc] = useState("");
  const [welcomeMsg, setWelcomeMsg] = useState("");
  const [congratsMsg, setCongratsMsg] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [touched, setTouched] = useState({});
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  // Helper to check if all fields are filled
  const allFieldsFilled = () => {
    return (
      learningObjectives.every((obj) => obj.trim() !== "") &&
      requirements.every((req) => req.trim() !== "") &&
      courseFor.trim() !== "" &&
      structure.trim() !== "" &&
      testVideo !== null && // Check if test video is uploaded
      filmEdit.trim() !== "" &&
      curriculum.trim() !== "" &&
      captions.trim() !== "" &&
      accessibility.trim() !== "" &&
      landingTitle.trim() !== "" &&
      landingSubtitle.trim() !== "" &&
      landingDesc.trim() !== "" &&
      price.trim() !== "" &&
      promoCode.trim() !== "" &&
      promoDesc.trim() !== "" &&
      welcomeMsg.trim() !== "" &&
      congratsMsg.trim() !== ""
    );
  };

  // Helper to mark all fields as touched
  const markAllTouched = () => {
    setTouched({
      learningObjectives: learningObjectives.map((_, i) => true),
      requirements: requirements.map((_, i) => true),
      courseFor: true,
      structure: true,
      testVideo: true,
      filmEdit: true,
      curriculum: true,
      captions: true,
      accessibility: true,
      landingTitle: true,
      landingSubtitle: true,
      landingDesc: true,
      price: true,
      promoCode: true,
      promoDesc: true,
      welcomeMsg: true,
      congratsMsg: true,
    });
  };

  // Content for each step
  const renderContent = () => {
    switch (active) {
      case "intended":
        return (
          <div>
            <h2 className="dash-heading">Intended learners</h2>
            <p className="dash-desc">
              The following descriptions will be publicly visible on your <a href="#">Course Landing Page</a> and will have a direct impact on your course performance. These descriptions will help learners decide if your course is right for them.
            </p>
            <div className="dash-section">
              <h3>What will students learn in your course?</h3>
              <p>You must enter at least 4 <a href="#">learning objectives or outcomes</a> that learners can expect to achieve after completing your course.</p>
              {learningObjectives.map((obj, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="input-box"
                      placeholder={`Example: Learning outcome ${i + 1}`}
                      maxLength={160}
                      value={obj}
                      onChange={e => {
                        const newArr = [...learningObjectives];
                        newArr[i] = e.target.value;
                        setLearningObjectives(newArr);
                        setTouched(t => ({ ...t, learningObjectives: t.learningObjectives ? t.learningObjectives.map((v, idx) => idx === i ? true : v) : [] }));
                      }}
                      style={{
                        flex: 1,
                        marginRight: 8,
                        border: touched.learningObjectives && touched.learningObjectives[i] && obj.trim() === "" ? '2px solid #e11d48' : undefined
                      }}
                    />
                    <span style={{ color: '#888', fontSize: 13 }}>{160 - obj.length}</span>
                  </div>
                  {touched.learningObjectives && touched.learningObjectives[i] && obj.trim() === "" && (
                    <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
                  )}
                </div>
              ))}
              <button
                className="add-more-btn"
                type="button"
                onClick={() => setLearningObjectives([...learningObjectives, ""])}
                style={{ marginBottom: 16 }}
              >
                + Add more to your response
              </button>
            </div>
            <div className="dash-section">
              <h3>What are the requirements or prerequisites for taking your course?</h3>
              <p>List the required skills, experience, tools or equipment learners should have prior to taking your course. If there are no requirements, use this space as an opportunity to lower the barrier for beginners.</p>
              {requirements.map((req, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <input
                    type="text"
                    className="input-box"
                    placeholder="Example: No programming experience needed."
                    value={req}
                    onChange={e => {
                      const newArr = [...requirements];
                      newArr[i] = e.target.value;
                      setRequirements(newArr);
                      setTouched(t => ({ ...t, requirements: t.requirements ? t.requirements.map((v, idx) => idx === i ? true : v) : [] }));
                    }}
                    style={{
                      flex: 1,
                      marginRight: 8,
                      border: touched.requirements && touched.requirements[i] && req.trim() === "" ? '2px solid #e11d48' : undefined
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setRequirements(requirements.filter((_, idx) => idx !== i))}
                    style={{ color: '#c00', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}
                    disabled={requirements.length === 1}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                className="add-more-btn"
                type="button"
                onClick={() => setRequirements([...requirements, ""])}
              >
                + Add more to your response
              </button>
            </div>
            <div className="dash-section">
              <h3>Who is this course for?</h3>
              <p>Write a clear description of your intended learners for Traincape.</p>
              <input
                type="text"
                className="input-box"
                placeholder="Example: Beginners interested in Python for data science"
                value={courseFor}
                onChange={e => { setCourseFor(e.target.value); setTouched(t => ({ ...t, courseFor: true })); }}
                style={{
                  width: '100%',
                  border: touched.courseFor && courseFor.trim() === "" ? '2px solid #e11d48' : undefined
                }}
              />
              {touched.courseFor && courseFor.trim() === "" && (
                <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
              )}
            </div>
          </div>
        );
      case "structure":
        return (
          <div>
            <h2 className="dash-heading">Course structure</h2>
            <p className="dash-desc">Outline the main sections and lectures of your course. This helps learners understand what to expect.</p>
            <textarea
              className="input-box"
              rows={6}
              placeholder="E.g. Section 1: Introduction, Section 2: Advanced Topics, ..."
              value={structure}
              onChange={e => { setStructure(e.target.value); setTouched(t => ({ ...t, structure: true })); }}
              style={{
                width: '100%',
                border: touched.structure && structure.trim() === "" ? '2px solid #e11d48' : undefined
              }}
            />
            {touched.structure && structure.trim() === "" && (
              <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
            )}
          </div>
        );
      case "setup":
        return (
          <div>
            <h2 className="dash-heading">Setup & test video</h2>
            <p className="dash-desc">Upload a short test video to check your audio and video quality. Our team will review and provide feedback.</p>
            <div style={{ marginBottom: 16 }}>
              <input
                type="file"
                accept="video/*"
                onChange={e => { 
                  const file = e.target.files[0];
                  setTestVideo(file); 
                  setTouched(t => ({ ...t, testVideo: true })); 
                  console.log("Test video selected:", file?.name);
                }}
                style={{ 
                  marginBottom: 8,
                  padding: '8px',
                  border: '2px dashed #ccc',
                  borderRadius: '4px',
                  width: '100%'
                }}
              />
              {testVideo && (
                <div style={{ 
                  color: '#5624d0', 
                  padding: '8px', 
                  background: '#f3f0ff', 
                  borderRadius: '4px',
                  marginTop: '8px'
                }}>
                  ✅ Selected: {testVideo.name} ({(testVideo.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
              {touched.testVideo && !testVideo && (
                <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
              )}
            </div>
          </div>
        );
      case "film":
        return (
          <div>
            <h2 className="dash-heading">Film & edit</h2>
            <p className="dash-desc">Share your filming and editing plan, or upload a sample video.</p>
            <textarea
              className="input-box"
              rows={4}
              placeholder="Describe your filming/editing plan or upload a sample."
              value={filmEdit}
              onChange={e => { setFilmEdit(e.target.value); setTouched(t => ({ ...t, filmEdit: true })); }}
              style={{
                width: '100%',
                marginBottom: 12,
                border: touched.filmEdit && filmEdit.trim() === "" ? '2px solid #e11d48' : undefined
              }}
            />
            {touched.filmEdit && filmEdit.trim() === "" && (
              <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
            )}
            <div style={{ marginTop: 12 }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Sample Video (Optional)</label>
              <input
                type="file"
                accept="video/*"
                onChange={e => { 
                  const file = e.target.files[0];
                  setSampleVideo(file); 
                  console.log("Sample video selected:", file?.name);
                }}
                style={{ 
                  padding: '8px',
                  border: '2px dashed #ccc',
                  borderRadius: '4px',
                  width: '100%'
                }}
              />
              {sampleVideo && (
                <div style={{ 
                  color: '#5624d0', 
                  padding: '8px', 
                  background: '#f3f0ff', 
                  borderRadius: '4px',
                  marginTop: '8px'
                }}>
                  ✅ Selected: {sampleVideo.name} ({(sampleVideo.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>
          </div>
        );
      case "curriculum":
        return (
          <div>
            <h2 className="dash-heading">Curriculum</h2>
            <p className="dash-desc">List the topics, lessons, or modules you will cover in your course.</p>
            <textarea
              className="input-box"
              rows={6}
              placeholder="E.g. Module 1: Basics, Module 2: Intermediate, ..."
              value={curriculum}
              onChange={e => { setCurriculum(e.target.value); setTouched(t => ({ ...t, curriculum: true })); }}
              style={{
                width: '100%',
                border: touched.curriculum && curriculum.trim() === "" ? '2px solid #e11d48' : undefined
              }}
            />
            {touched.curriculum && curriculum.trim() === "" && (
              <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
            )}
          </div>
        );
      case "captions":
        return (
          <div>
            <h2 className="dash-heading">Captions (optional)</h2>
            <p className="dash-desc">Add captions or subtitles to make your course accessible to a wider audience.</p>
            <textarea
              className="input-box"
              rows={3}
              placeholder="Describe your plan for captions/subtitles."
              value={captions}
              onChange={e => { setCaptions(e.target.value); setTouched(t => ({ ...t, captions: true })); }}
              style={{
                width: '100%',
                border: touched.captions && captions.trim() === "" ? '2px solid #e11d48' : undefined
              }}
            />
            {touched.captions && captions.trim() === "" && (
              <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
            )}
          </div>
        );
      case "accessibility":
        return (
          <div>
            <h2 className="dash-heading">Accessibility (optional)</h2>
            <p className="dash-desc">Describe how you will make your course accessible to all learners, including those with disabilities.</p>
            <textarea
              className="input-box"
              rows={3}
              placeholder="E.g. Provide transcripts, use accessible colors, etc."
              value={accessibility}
              onChange={e => { setAccessibility(e.target.value); setTouched(t => ({ ...t, accessibility: true })); }}
              style={{
                width: '100%',
                border: touched.accessibility && accessibility.trim() === "" ? '2px solid #e11d48' : undefined
              }}
            />
            {touched.accessibility && accessibility.trim() === "" && (
              <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
            )}
          </div>
        );
      case "landing":
        return (
          <div>
            <h2 className="dash-heading">Course landing page</h2>
            <p className="dash-desc">Add a strong title, subtitle, and course description to improve conversions.</p>
            <input
              type="text"
              className="input-box"
              placeholder="Course Title"
              value={landingTitle}
              onChange={e => { setLandingTitle(e.target.value); setTouched(t => ({ ...t, landingTitle: true })); }}
              style={{
                width: '100%',
                marginBottom: 12,
                border: touched.landingTitle && landingTitle.trim() === "" ? '2px solid #e11d48' : undefined
              }}
            />
            {touched.landingTitle && landingTitle.trim() === "" && (
              <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
            )}
            <input
              type="text"
              className="input-box"
              placeholder="Subtitle"
              value={landingSubtitle}
              onChange={e => { setLandingSubtitle(e.target.value); setTouched(t => ({ ...t, landingSubtitle: true })); }}
              style={{
                width: '100%',
                marginBottom: 12,
                border: touched.landingSubtitle && landingSubtitle.trim() === "" ? '2px solid #e11d48' : undefined
              }}
            />
            {touched.landingSubtitle && landingSubtitle.trim() === "" && (
              <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
            )}
            <textarea
              className="input-box"
              rows={4}
              placeholder="Full course description..."
              value={landingDesc}
              onChange={e => { setLandingDesc(e.target.value); setTouched(t => ({ ...t, landingDesc: true })); }}
              style={{
                width: '100%',
                border: touched.landingDesc && landingDesc.trim() === "" ? '2px solid #e11d48' : undefined
              }}
            />
            {touched.landingDesc && landingDesc.trim() === "" && (
              <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
            )}
            <div style={{ margin: '18px 0' }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Course Thumbnail Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={async e => {
                  const file = e.target.files[0];
                  setThumbnailFile(file);
                  if (file) {
                    console.log("Selected file:", file.name);
                    
                    // Create a local preview URL immediately
                    const localUrl = URL.createObjectURL(file);
                    setThumbnailUrl(localUrl);
                    console.log("Local preview URL created:", localUrl);
                    
                    // Try to upload to server
                    const formData = new FormData();
                    formData.append("thumbnail", file);
                    try {
                      console.log("Uploading image to server...");
                      const res = await axios.post("https://lms-backend-5s5x.onrender.com/api/upload/thumbnail", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                      });
                      console.log("Upload response:", res.data);
                      
                      // Update with server URL if upload successful
                      setThumbnailUrl(res.data.url);
                      console.log("Server URL set to:", res.data.url);
                      
                      // Clean up local URL
                      URL.revokeObjectURL(localUrl);
                    } catch (err) {
                      console.error("Upload error:", err);
                      // Keep the local URL if server upload fails
                      console.log("Keeping local preview URL due to upload failure");
                      alert("Warning: Image upload failed, but you can still preview the image. The course will be submitted with a local preview.");
                    }
                  }
                }}
                style={{ 
                  marginTop: 8,
                  padding: '8px',
                  border: '2px dashed #ccc',
                  borderRadius: '4px',
                  width: '100%'
                }}
              />
              {thumbnailFile && (
                <div style={{ 
                  marginTop: 8, 
                  color: '#666', 
                  fontSize: '14px',
                  padding: '8px',
                  background: '#f9f9f9',
                  borderRadius: '4px'
                }}>
                  📁 Selected file: {thumbnailFile.name} ({(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
              {thumbnailUrl && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ marginBottom: 8, fontWeight: 600, color: '#333' }}>Thumbnail Preview:</div>
                  <img 
                    src={thumbnailUrl} 
                    alt="Thumbnail Preview" 
                    style={{ 
                      width: 180, 
                      height: 120, 
                      borderRadius: 8, 
                      boxShadow: '0 2px 8px #e5e7eb',
                      objectFit: 'contain',
                      border: '2px solid #e5e7eb',
                      backgroundColor: '#f9f9f9'
                    }}
                    onError={(e) => {
                      console.error("Image failed to load:", e.target.src);
                      alert("Failed to load image preview. Please try uploading again.");
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case "pricing":
        return (
          <div>
            <h2 className="dash-heading">Pricing</h2>
            <p className="dash-desc">Choose a price tier or make the course free.</p>
            <select
              className="input-box"
              value={price}
              onChange={e => { setPrice(e.target.value); setTouched(t => ({ ...t, price: true })); }}
              style={{
                width: '100%',
                marginBottom: 12,
                border: touched.price && price.trim() === "" ? '2px solid #e11d48' : undefined
              }}
            >
              <option value="">Select price</option>
              <option value="Free">Free</option>
              <option value="$9.99">$9.99</option>
              <option value="$19.99">$19.99</option>
              <option value="$29.99">$29.99</option>
              <option value="$49.99">$49.99</option>
            </select>
            {touched.price && price.trim() === "" && (
              <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
            )}
          </div>
        );
      case "promotions":
        return (
          <div>
            <h2 className="dash-heading">Promotions</h2>
            <p className="dash-desc">Add promo code, discounts, or deals to attract more learners.</p>
            <input
              type="text"
              className="input-box"
              placeholder="Promo Code"
              value={promoCode}
              onChange={e => { setPromoCode(e.target.value); setTouched(t => ({ ...t, promoCode: true })); }}
              style={{
                width: '100%',
                marginBottom: 12,
                border: touched.promoCode && promoCode.trim() === "" ? '2px solid #e11d48' : undefined
              }}
            />
            {touched.promoCode && promoCode.trim() === "" && (
              <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
            )}
            <input
              type="text"
              className="input-box"
              placeholder="Discount description"
              value={promoDesc}
              onChange={e => { setPromoDesc(e.target.value); setTouched(t => ({ ...t, promoDesc: true })); }}
              style={{
                width: '100%',
                border: touched.promoDesc && promoDesc.trim() === "" ? '2px solid #e11d48' : undefined
              }}
            />
            {touched.promoDesc && promoDesc.trim() === "" && (
              <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
            )}
          </div>
        );
      case "messages":
        return (
          <div>
            <h2 className="dash-heading">Course messages</h2>
            <p className="dash-desc">Customize the messages learners receive when they join or complete your course on Traincape.</p>
            <textarea
              className="input-box"
              rows={3}
              placeholder="Welcome message..."
              value={welcomeMsg}
              onChange={e => { setWelcomeMsg(e.target.value); setTouched(t => ({ ...t, welcomeMsg: true })); }}
              style={{
                width: '100%',
                marginBottom: 12,
                border: touched.welcomeMsg && welcomeMsg.trim() === "" ? '2px solid #e11d48' : undefined
              }}
            />
            {touched.welcomeMsg && welcomeMsg.trim() === "" && (
              <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
            )}
            <textarea
              className="input-box"
              rows={3}
              placeholder="Congratulations message..."
              value={congratsMsg}
              onChange={e => { setCongratsMsg(e.target.value); setTouched(t => ({ ...t, congratsMsg: true })); }}
              style={{
                width: '100%',
                border: touched.congratsMsg && congratsMsg.trim() === "" ? '2px solid #e11d48' : undefined
              }}
            />
            {touched.congratsMsg && congratsMsg.trim() === "" && (
              <span style={{ color: '#e11d48', fontSize: 13, marginTop: 2 }}>This field is required</span>
            )}
          </div>
        );
      default:
        return <div style={{ color: '#888', fontSize: 18, textAlign: 'center', marginTop: 40 }}>Coming soon...</div>;
    }
  };

  // Submit for Review handler
  const handleSubmitForReview = async () => {
    setSubmitError("");
    if (!allFieldsFilled()) {
      markAllTouched();
      setSubmitError("Please fill in all required fields before submitting for review.");
      return;
    }
    const courseData = {
      learningObjectives,
      requirements,
      courseFor,
      structure,
      testVideo: testVideo ? testVideo.name : '',
      sampleVideo: sampleVideo ? sampleVideo.name : '',
      filmEdit,
      curriculum,
      captions,
      accessibility,
      landingTitle,
      landingSubtitle,
      landingDesc,
      price,
      promoCode,
      promoDesc,
      welcomeMsg,
      congratsMsg,
      instructor: JSON.parse(localStorage.getItem('user')),
      thumbnailUrl,
    };
    try {
      const token = localStorage.getItem('token');
              const res = await fetch('https://lms-backend-5s5x.onrender.com/api/pending-courses/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.message || 'Failed to submit for review');
      } else {
        alert('Course submitted for admin review!');
      }
    } catch (err) {
      setSubmitError('Error submitting for review');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f7fa' }}>
      <aside style={{ width: 270, background: '#fff', borderRight: '1px solid #eee', padding: '40px 0 0 0', minHeight: '100vh' }}>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {steps.map((step) => (
              <li key={step.key}>
                <button
                  className={active === step.key ? 'sidebar-btn active' : 'sidebar-btn'}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '16px 32px',
                    background: active === step.key ? '#f3f0ff' : 'none',
                    border: 'none',
                    borderLeft: active === step.key ? '4px solid #7c3aed' : '4px solid transparent',
                    color: active === step.key ? '#5624d0' : '#232323',
                    fontWeight: active === step.key ? 700 : 500,
                    fontSize: 17,
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onClick={() => setActive(step.key)}
                >
                  {step.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '48px 48px 48px 48px', maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        {renderContent()}
        <button
          style={{
            position: 'fixed',
            left: 300,
            bottom: 40,
            background: 'linear-gradient(to right, #5624d0, #7c3aed)',
            color: 'white',
            padding: '16px 38px',
            fontSize: '1.2rem',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 700,
            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.13)',
            zIndex: 100
          }}
          onClick={handleSubmitForReview}
        >
          Submit for Review
          </button>
        {submitError && (
          <div style={{ color: 'red', fontWeight: 600, marginTop: 18, marginBottom: 8, textAlign: 'center' }}>{submitError}</div>
          )}
        </main>
    </div>
  );
};

export default Dashboard;