// Dashboard.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import "./Dashboard.css";
import axios from "axios";
import "./UploadLecture.css";
import { useParams } from "react-router-dom";

import initialData from "./initialData";
import useSections from "../Pages/hooks/useSection";
import useUploads from "../Pages/hooks/useUpload";
import useQuiz from "../Pages/hooks/useQuiz";

import VideoUpload from "./VideoUpload";
import DocumentUpload from "./DocumentUpload";
import QuizPage from "./QuizPage";

const API_BASE = "http://localhost:5001";

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
  // ---------- UI state ----------
  const [active, setActive] = useState("intended");

  // ---------- Form state ----------
  const [learningObjectives, setLearningObjectives] = useState(["", "", "", ""]);
  const [requirements, setRequirements] = useState([""]);
  const [courseFor, setCourseFor] = useState("");
  const [structure, setStructure] = useState("");
  const [testVideo, setTestVideo] = useState(null);      // File object
  const [testVideoUrl, setTestVideoUrl] = useState("");  // Uploaded URL
  const [filmEdit, setFilmEdit] = useState("");
  const [sampleVideo, setSampleVideo] = useState(null);
  const [sampleVideoUrl, setSampleVideoUrl] = useState("");
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

  // ---------- Section hooks (must come BEFORE loading) ----------
  const {
    sections,
    addSection,
    editSection,
    deleteSection,
    toggleSectionPublish,
    addItem,
    editItem,
    deleteItem,
    toggleExpand,
    setSections,
  } = useSections(initialData);
  // URL param
  const { courseId } = useParams();
  const uploads = useUploads(setSections, courseId);
  // upload helpers for lectures (existing)
  const quiz = useQuiz(setSections);

  // inline editing
  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);



  // ---------- debounced autosave refs ----------
  const saveTimeoutRef = useRef(null);
  const metaSaveTimeoutRef = useRef(null);
  const mountedRef = useRef(false);

  // ---------- Icons (kept same) ----------
  const Icon = {
    Edit: (/* ...same SVG... */ <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>),
    Delete: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V3h6v3" />
    </svg>),
    ChevronDown: (<svg width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l4 4 4-4" /></svg>),
    ChevronUp: (<svg width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13l4-4 4 4" /></svg>),
    Unpublish: (<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l8 8M12 4L4 12" /></svg>),
    Plus: (<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v10M3 8h10" /></svg>),
  };

  // ---------- Load pending draft on mount ----------
  useEffect(() => {
    if (!courseId) return;
    const url = `${API_BASE}/api/pending-courses/${courseId}`;
    axios.get(url)
      .then(res => {
        const data = res.data || {};
        setSections(data.curriculum || []);
        setLearningObjectives(data.learningObjectives || ["", "", "", ""]);
        setRequirements(data.requirements || [""]);
        setCourseFor(data.courseFor || "");
        setStructure(data.structure || "");
        setTestVideoUrl(data.testVideoUrl || "");
        setFilmEdit(data.filmEdit || "");
        setSampleVideoUrl(data.sampleVideoUrl || "");
        setCaptions(data.captions || "");
        setAccessibility(data.accessibility || "");
        setLandingTitle(data.landingTitle || "");
        setLandingSubtitle(data.landingSubtitle || "");
        setLandingDesc(data.landingDesc || "");
        setPrice(data.price || "");
        setPromoCode(data.promoCode || "");
        setPromoDesc(data.promoDesc || "");
        setWelcomeMsg(data.welcomeMsg || "");
        setCongratsMsg(data.congratsMsg || "");
        setThumbnailUrl(data.thumbnailUrl || "");
      })
      .catch(err => {
        console.error("Error loading pending course:", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // ---------- Helper: patch draft fields to backend ----------
  const patchDraft = useCallback(async (payload = {}) => {
    if (!courseId) return;
    const token = localStorage.getItem("token");
    try {
      await axios.patch(`${API_BASE}/api/pending-courses/${courseId}`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      console.error("Draft patch error:", err);
    }
  }, [courseId]);

  // ---------- Autosave curriculum (debounced) ----------
  useEffect(() => {
    if (!courseId) return;
    // avoid autosave on initial mount load (mountedRef)
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      patchDraft({ curriculum: sections });
    }, 900);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [sections, courseId, patchDraft]);

  // ---------- Autosave metadata (debounced) ----------
  useEffect(() => {
    if (!courseId) return;
    if (!mountedRef.current) return; // don't save while initial loading

    if (metaSaveTimeoutRef.current) clearTimeout(metaSaveTimeoutRef.current);
    metaSaveTimeoutRef.current = setTimeout(() => {
      patchDraft({
        learningObjectives,
        requirements,
        courseFor,
        structure,
        filmEdit,
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
        thumbnailUrl,
        testVideoUrl,
        sampleVideoUrl
      });
    }, 900);

    return () => {
      if (metaSaveTimeoutRef.current) clearTimeout(metaSaveTimeoutRef.current);
    };
  }, [
    learningObjectives,
    requirements,
    courseFor,
    structure,
    filmEdit,
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
    thumbnailUrl,
    testVideoUrl,
    sampleVideoUrl,
    courseId,
    patchDraft
  ]);

  // ---------- Thumbnail upload handler ----------
  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnailFile(file);

    // local preview
    const localUrl = URL.createObjectURL(file);
    setThumbnailUrl(localUrl);

    // upload to server
    const form = new FormData();
    form.append("thumbnail", file);
    try {
      const res = await axios.post(`${API_BASE}/api/upload/thumbnail`, form, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.data?.url) {
        setThumbnailUrl(res.data.url);
      }
      URL.revokeObjectURL(localUrl);
    } catch (err) {
      console.error("Thumbnail upload failed:", err);
      alert("Thumbnail upload failed — preview will be used until you re-upload.");
      // keep local preview
    }
  };

  // ---------- Upload a test/sample video (returns url) ----------
  const uploadVideoFile = async (file) => {
    if (!file) return "";
    const form = new FormData();
    form.append("video", file);
    try {
      const res = await axios.post(`${API_BASE}/api/upload/video`, form, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      return res.data?.url || "";
    } catch (err) {
      console.error("Video upload failed:", err);
      throw err;
    }
  };

  // ---------- Validation: adjust to required fields only; curriculum is sections ----------
  const allFieldsFilled = () => {
    // You can change which fields are required here.
    return (
      learningObjectives.every((obj) => obj.trim() !== "") &&
      courseFor.trim() !== "" &&
      structure.trim() !== "" &&
      landingTitle.trim() !== "" &&
      landingSubtitle.trim() !== "" &&
      landingDesc.trim() !== "" &&
      price.trim() !== ""
    );
  };

  const markAllTouched = () => {
    setTouched({
      learningObjectives: learningObjectives.map((_, i) => true),
      requirements: requirements.map((_, i) => true),
      courseFor: true,
      structure: true,
      landingTitle: true,
      landingSubtitle: true,
      landingDesc: true,
      price: true,
    });
  };

  const handleThumbnailUpload = async (file) => {
    const form = new FormData();
    form.append("thumbnail", file);

    try {
      const res = await axios.post(`${API_BASE}/api/upload/thumbnail`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      return res.data.url || "";
    } catch (err) {
      console.error("Thumbnail upload failed:", err);
      return thumbnailUrl; // fallback to local preview
    }
  };

  // ---------- Submit for review ----------
  const handleSubmitForReview = async () => {
    try {

      // 🔹 Get token here (this was missing)
      const token = localStorage.getItem("token");

      // Upload files
      let finalTestVideoUrl = testVideoUrl;
      if (testVideo) finalTestVideoUrl = await uploadVideoFile(testVideo);

      let finalSampleVideoUrl = sampleVideoUrl;
      if (sampleVideo) finalSampleVideoUrl = await uploadVideoFile(sampleVideo);

      let finalThumbnailUrl = thumbnailUrl;
      if (thumbnailFile) finalThumbnailUrl = await handleThumbnailUpload(thumbnailFile);

      // Convert curriculum
      const curriculumPayload = sections.map((section) => ({
        sectionTitle: section.title,
        items: section.items.map((item) => ({
          type: item.type,
          title: item.title,
          videoUrl: item.videoUrl || "",
          documents: (item.contents || []).map((doc) => ({
            fileUrl: doc.fileUrl,
            fileName: doc.filename
          })),
          quizId: item.quizId || null
        }))
      }));

      const instructorObj = JSON.parse(localStorage.getItem("user"));

      const courseData = {
        learningObjectives,
        requirements,
        courseFor,
        structure,

        testVideo: finalTestVideoUrl,
        sampleVideo: finalSampleVideoUrl,
        thumbnailUrl: finalThumbnailUrl,

        filmEdit,
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

        curriculum: curriculumPayload,

        instructor: instructorObj?._id
      };

      // 🔹 Now token correctly exists
      const res = await axios.post(
        `http://localhost:5001/api/pending-courses/apply`,
        courseData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Course submitted for admin review!");

    } catch (err) {
      console.error(err);
      alert("Submit failed");
    }
  };


  // ---------- Render content function (kept similar to your existing one) ----------
  const renderContent = () => {
    switch (active) {
      case "intended":
        return (
          <div>
            <h2 className="dash-heading">Intended learners</h2>
            <p className="dash-desc">These descriptions will be visible on your Course Landing Page.</p>

            <div className="dash-section">
              <h3>What will students learn?</h3>
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
              <button className="add-more-btn" type="button" onClick={() => setLearningObjectives([...learningObjectives, ""])} style={{ marginBottom: 16 }}>
                + Add more
              </button>
            </div>

            <div className="dash-section">
              <h3>Requirements / prerequisites</h3>
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
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <button type="button" onClick={() => setRequirements(requirements.filter((_, idx) => idx !== i))} style={{ color: '#c00', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }} disabled={requirements.length === 1}>×</button>
                </div>
              ))}
              <button className="add-more-btn" type="button" onClick={() => setRequirements([...requirements, ""])}>+ Add more</button>
            </div>

            <div className="dash-section">
              <h3>Who is this course for?</h3>
              <input type="text" className="input-box" placeholder="Example: Beginners interested in Python for data science" value={courseFor} onChange={e => { setCourseFor(e.target.value); setTouched(t => ({ ...t, courseFor: true })); }} />
              {touched.courseFor && courseFor.trim() === "" && <span style={{ color: '#e11d48', fontSize: 13 }}>This field is required</span>}
            </div>
          </div>
        );

      case "structure":
        return (
          <div>
            <h2 className="dash-heading">Course structure</h2>
            <textarea className="input-box" rows={6} placeholder="Outline sections..." value={structure} onChange={e => { setStructure(e.target.value); setTouched(t => ({ ...t, structure: true })); }} />
            {touched.structure && structure.trim() === "" && <span style={{ color: '#e11d48', fontSize: 13 }}>This field is required</span>}
          </div>
        );

      case "setup":
        return (
          <div>
            <h2 className="dash-heading">Setup & test video</h2>
            <p className="dash-desc">Upload a short test video so the team can check audio/video quality.</p>
            <div style={{ marginBottom: 16 }}>
              <input type="file" accept="video/*" onChange={e => { setTestVideo(e.target.files[0]); setTouched(t => ({ ...t, testVideo: true })); }} style={{ marginBottom: 8, padding: 8, border: '2px dashed #ccc', borderRadius: 4, width: '100%' }} />
              {testVideo && <div style={{ color: '#5624d0', padding: 8, background: '#f3f0ff', borderRadius: 4, marginTop: 8 }}>✅ Selected: {testVideo.name} ({(testVideo.size / 1024 / 1024).toFixed(2)} MB)</div>}
            </div>
          </div>
        );

      case "film":
        return (
          <div>
            <h2 className="dash-heading">Film & edit</h2>
            <textarea className="input-box" rows={4} placeholder="Describe filming/editing plan (optional)" value={filmEdit} onChange={e => { setFilmEdit(e.target.value); setTouched(t => ({ ...t, filmEdit: true })); }} />
            <div style={{ marginTop: 12 }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Sample Video (Optional)</label>
              <input type="file" accept="video/*" onChange={e => { setSampleVideo(e.target.files[0]); }} style={{ padding: 8, border: '2px dashed #ccc', borderRadius: 4, width: '100%' }} />
              {sampleVideo && <div style={{ color: '#5624d0', padding: 8, background: '#f3f0ff', borderRadius: 4, marginTop: 8 }}>✅ Selected: {sampleVideo.name}</div>}
            </div>
          </div>
        );

      case "curriculum":
        return (
          <div>
            <h2 className="dash-heading">Curriculum</h2>
            <div className="upload-container">
              {sections.map((section) => (
                <div key={section.id} className="section-block">
                  <div className="section-header">
                    {editingSection === section.id ? (
                      <input className="inline-input" autoFocus defaultValue={section.title} onBlur={(e) => { editSection(section.id, e.target.value.trim()); setEditingSection(null); }} onKeyDown={(e) => { if (e.key === "Enter") { editSection(section.id, e.target.value.trim()); setEditingSection(null); } }} />
                    ) : <strong>{section.title}</strong>}
                    <div className="header-actions">
                      <button className="icon-btn" onClick={() => setEditingSection(section.id)}>{Icon.Edit}</button>
                      <button className="icon-btn danger" onClick={() => deleteSection(section.id)}>{Icon.Delete}</button>
                    </div>
                  </div>

                  {section.items.map((item) => (
                    <div key={item.id} className="item-block">
                      <div className="item-header">
                        {editingItem === item.id ? (
                          <input className="inline-input" autoFocus defaultValue={item.title} onBlur={(e) => { editItem(section.id, item.id, e.target.value.trim()); setEditingItem(null); }} onKeyDown={(e) => { if (e.key === "Enter") { editItem(section.id, item.id, e.target.value.trim()); setEditingItem(null); } }} />
                        ) : <span>{item.type.toUpperCase()}: {item.title}</span>}
                        <div className="item-actions">
                          <button className="icon-btn" title="Edit" onClick={() => setEditingItem(item.id)}>{Icon.Edit}</button>
                          <button className="icon-btn danger" title="Delete" onClick={() => deleteItem(section.id, item.id)}>{Icon.Delete}</button>
                          <button className="icon-btn" onClick={() => toggleExpand(section.id, item.id)}>{item.expanded ? Icon.ChevronUp : Icon.ChevronDown}</button>
                        </div>
                      </div>

                      {item.expanded && (
                        <div className="item-content">
                          {item.type === "lecture" && (
                            <>
                              <VideoUpload onUpload={(file) => uploads.uploadVideo(section.id, item.id, file)} />
                              <DocumentUpload onUpload={(file) => uploads.uploadDocument(section.id, item.id, file)} />
                              {item.contents?.length > 0 && <ul className="content-list">{item.contents.map(c => <li key={c.id}>{c.type} — {c.filename}</li>)}</ul>}
                            </>
                          )}

                          {item.type === "quiz" && (
                            <QuizPage sectionId={section.id} itemId={item.id} questions={item.questions} quiz={quiz} />
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="add-buttons">
                    <button className="cb-btn small" onClick={() => addItem(section.id, "lecture")}>{Icon.Plus} Lecture</button>
                    <button className="cb-btn small" onClick={() => addItem(section.id, "quiz")}>{Icon.Plus} Quiz</button>
                  </div>
                </div>
              ))}

              <button className="add-section-btn" onClick={addSection}>{Icon.Plus} Add Section</button>
            </div>
          </div>
        );

      case "captions":
        return (
          <div>
            <h2 className="dash-heading">Captions (optional)</h2>
            <textarea className="input-box" rows={3} placeholder="Describe caption plan" value={captions} onChange={e => { setCaptions(e.target.value); setTouched(t => ({ ...t, captions: true })); }} />
          </div>
        );

      case "accessibility":
        return (
          <div>
            <h2 className="dash-heading">Accessibility (optional)</h2>
            <textarea className="input-box" rows={3} placeholder="Accessibility notes" value={accessibility} onChange={e => { setAccessibility(e.target.value); setTouched(t => ({ ...t, accessibility: true })); }} />
          </div>
        );

      case "landing":
        return (
          <div>
            <h2 className="dash-heading">Course landing page</h2>
            <input type="text" className="input-box" placeholder="Course Title" value={landingTitle} onChange={e => { setLandingTitle(e.target.value); setTouched(t => ({ ...t, landingTitle: true })); }} />
            <input type="text" className="input-box" placeholder="Subtitle" value={landingSubtitle} onChange={e => { setLandingSubtitle(e.target.value); setTouched(t => ({ ...t, landingSubtitle: true })); }} />
            <textarea className="input-box" rows={4} placeholder="Full course description..." value={landingDesc} onChange={e => { setLandingDesc(e.target.value); setTouched(t => ({ ...t, landingDesc: true })); }} />

            <div style={{ margin: '18px 0' }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Course Thumbnail Image</label>
              <input type="file" accept="image/*" onChange={handleThumbnailChange} style={{ marginTop: 8, padding: 8, border: '2px dashed #ccc', borderRadius: 4, width: '100%' }} />
              {thumbnailFile && <div style={{ marginTop: 8, color: '#666' }}>📁 Selected file: {thumbnailFile.name} ({(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB)</div>}
              {thumbnailUrl && <div style={{ marginTop: 10 }}><div style={{ marginBottom: 8, fontWeight: 600 }}>Thumbnail Preview:</div><img src={thumbnailUrl} alt="Thumbnail" style={{ width: 180, height: 120, borderRadius: 8, objectFit: 'contain', border: '2px solid #e5e7eb' }} onError={(e) => { console.error("Image failed:", e.target.src); }} /></div>}
            </div>
          </div>
        );

      case "pricing":
        return (
          <div>
            <h2 className="dash-heading">Pricing</h2>
            <select className="input-box" value={price} onChange={e => { setPrice(e.target.value); setTouched(t => ({ ...t, price: true })); }}>
              <option value="">Select price</option>
              <option value="Free">Free</option>
              <option value="$9.99">$9.99</option>
              <option value="$19.99">$19.99</option>
            </select>
          </div>
        );

      case "promotions":
        return (
          <div>
            <h2 className="dash-heading">Promotions</h2>
            <input type="text" className="input-box" placeholder="Promo Code" value={promoCode} onChange={e => { setPromoCode(e.target.value); setTouched(t => ({ ...t, promoCode: true })); }} />
            <input type="text" className="input-box" placeholder="Discount description" value={promoDesc} onChange={e => { setPromoDesc(e.target.value); setTouched(t => ({ ...t, promoDesc: true })); }} />
          </div>
        );

      case "messages":
        return (
          <div>
            <h2 className="dash-heading">Course messages</h2>
            <textarea className="input-box" rows={3} placeholder="Welcome message..." value={welcomeMsg} onChange={e => { setWelcomeMsg(e.target.value); setTouched(t => ({ ...t, welcomeMsg: true })); }} />
            <textarea className="input-box" rows={3} placeholder="Congratulations message..." value={congratsMsg} onChange={e => { setCongratsMsg(e.target.value); setTouched(t => ({ ...t, congratsMsg: true })); }} />
          </div>
        );

      default:
        return <div style={{ color: '#888', fontSize: 18, textAlign: 'center', marginTop: 40 }}>Coming soon...</div>;
    }
  };

  // ---------- UI ----------
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f7fa' }}>
      <aside style={{ width: 270, background: '#fff', borderRight: '1px solid #eee', paddingTop: 40 }}>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {steps.map((step) => (
              <li key={step.key}>
                <button
                  className={active === step.key ? 'sidebar-btn active' : 'sidebar-btn'}
                  style={{
                    width: '100%', textAlign: 'left', padding: '16px 32px',
                    background: active === step.key ? '#f3f0ff' : 'none',
                    border: 'none', borderLeft: active === step.key ? '4px solid #7c3aed' : '4px solid transparent',
                    color: active === step.key ? '#5624d0' : '#232323', fontWeight: active === step.key ? 700 : 500,
                    fontSize: 17, cursor: 'pointer', outline: 'none'
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

      <main style={{ flex: 1, padding: 48, maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        {renderContent()}

        <button
          style={{
            position: 'fixed', left: 300, bottom: 40,
            background: 'linear-gradient(to right, #5624d0, #7c3aed)', color: 'white',
            padding: '16px 38px', fontSize: '1.2rem', border: 'none', borderRadius: 10, cursor: 'pointer',
            fontWeight: 700, boxShadow: '0 4px 16px rgba(124,58,237,0.13)', zIndex: 100
          }}
          onClick={handleSubmitForReview}
        >
          Submit for Review
        </button>

        {submitError && <div style={{ color: 'red', fontWeight: 600, marginTop: 18, textAlign: 'center' }}>{submitError}</div>}
      </main>
    </div>
  );
};

export default Dashboard;
