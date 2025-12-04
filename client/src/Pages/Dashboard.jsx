// Dashboard.jsx
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import axios from "axios";
import "./curriculum.css";
import { useParams, useNavigate } from "react-router-dom";
import initialData from "./initialData";
import useSections from "../Pages/hooks/useSection";
import useQuiz from "../Pages/hooks/useQuiz";
import useUpload from "../Pages/hooks/useUpload";

  const API_BASE = import.meta.env.VITE_API_BASE_URL||"http://localhost:5001";

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

export default function Dashboard() {
  const [active, setActive] = useState("intended");


  // form fields
  const [learningObjectives, setLearningObjectives] = useState(["", "", "", ""]);
  const [requirements, setRequirements] = useState([""]);
  const [courseFor, setCourseFor] = useState("");
  const [structure, setStructure] = useState("");
  const [testVideo, setTestVideo] = useState(null); // File
  const [testVideoUrl, setTestVideoUrl] = useState("");
  const [filmEdit, setFilmEdit] = useState("");
  const [sampleVideo, setSampleVideo] = useState(null); // File
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
  const [isNew, setIsNew] = useState(true);

  const navigate = useNavigate();
  const { pendingCourseId } = useParams();
  const courseId = pendingCourseId;
  // sections state
  const {
    sections,
    addSection,
    editSection,
    deleteSection,
    addItem,
    editItem,
    deleteItem,
    toggleExpand,
    setSections,
  } = useSections(initialData);

  const uploads = useUpload(setSections, courseId);
  const quiz = useQuiz(setSections);

  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // ---------- Load pending draft ----------
  useEffect(() => {
    if (!courseId) return;
    axios
      .get(`${API_BASE}/api/pending-courses/${courseId}`)
      .then((res) => {
        const data = res.data || {};
        setIsNew(!!data.isNew);

        // map curriculum into local structure (no backend file refs as editable)
        setSections(
          (data.curriculum || []).map((section) => ({
            id: section.id || section._id,
            title: section.title,
            published: section.published,
            items: (section.items || []).map((item) => ({
              id: item.id || item._id,
              type: item.type,
              title: item.title,
              expanded: false,
              // Show existing uploaded preview if available
              videoId: item.videoId || null,
              videoUrl: item.videoUrl || "", // frontend convenience only
              // local-only fields (initially empty)
              videoFile: null,
              documents: item.documents?.map(d => ({ fileUrl: d.fileUrl, fileName: d.fileName })) || [],
              // for quizzes
              questions: item.questions || [],
              quizId: item.quizId || null
            }))
          }))
        );

        setLearningObjectives(data.learningObjectives || ["", "", "", ""]);
        setRequirements(data.requirements || [""]);
        setCourseFor(data.courseFor || "");
        setStructure(data.structure || "");
        setTestVideoUrl(data.testVideo || "");
        setFilmEdit(data.filmEdit || "");
        setSampleVideoUrl(data.sampleVideo || "");
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
      .catch((err) => {
        console.error("Error loading pending course:", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // ---------- Thumbnail local select & preview ----------
  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // instant preview
    const localPreview = URL.createObjectURL(file);
    setThumbnailUrl(localPreview);

    // upload to R2
    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("thumbnail", file);

    try {
      const res = await axios.post(
        `${API_BASE}/api/upload/thumbnail/${courseId}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Uploaded thumbnail R2 URL:", res.data.thumbnailUrl);
      setThumbnailUrl(res.data.thumbnailUrl);   // IMPORTANT
      setThumbnailFile(null);                   // stop blob from going to final form
    } catch (err) {
      console.error("Thumbnail upload failed:", err);
      alert("Thumbnail upload failed");
    }
  };
  ;

  // ---------- Validation ----------
  const allFieldsFilled = () => {
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

  // ---------- FINAL SUBMIT (FormData) ----------
  const handleSubmitForReview = async () => {
    try {
      if (!allFieldsFilled()) {
        markAllTouched();
        setSubmitError("Please fill required fields.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setSubmitError("");

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in.");
        return;
      }

      // 1) If no pendingCourseId — create one first
      let finalCourseId = courseId;
      console.log("final course id :", finalCourseId)
      if (!finalCourseId) {
        const createRes = await axios.post(
          `${API_BASE}/api/pending-courses/create`,
          {
            courseType: "course",
            category: "Uncategorized",
            timeCommitment: "Unknown",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        finalCourseId = createRes.data?.pendingCourseId;
        if (!finalCourseId) throw new Error("Failed to create pending course");
      }

      // 2) Build payload metadata (no files)
      const curriculumMeta = sections.map((section) => ({
        id: section.id || undefined,
        title: section.title || "New Section",
        items: (section.items || []).map((item) => ({
          id: item.id || undefined,
          type: item.type,
          title: item.title,
          // keep existing videoId (if previously uploaded) so server knows not to replace
          videoId: item.videoId || null,
          // documents meta (we will include new files separately)
          documents: (item.documents || []).map((d) => ({
            fileUrl: d.fileUrl || "",
            fileName: d.fileName || d.filename || ""
          })),
          quizId: item.quizId || null
        }))
      }));

      const courseMeta = {
        learningObjectives,
        requirements,
        courseFor,
        structure,
        // don't include file buffers here - add actual files to form
        testVideo: testVideo ? null : testVideoUrl,
        sampleVideo: sampleVideo ? null : sampleVideoUrl,
        thumbnailUrl: thumbnailUrl || "",
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
        curriculum: curriculumMeta,
        instructor: JSON.parse(localStorage.getItem("user") || "{}"),
      };

      // 3) Build FormData
      const form = new FormData();
      form.append("data", JSON.stringify(courseMeta));

      // optional top-level files
      if (thumbnailFile) form.append("thumbnail", thumbnailFile);
      if (testVideo) form.append("testVideo", testVideo);
      if (sampleVideo) form.append("sampleVideo", sampleVideo);

      // Append per-item video files + per-item documents
      sections.forEach((section, sIndex) => {
        section.items.forEach((item, iIndex) => {
          // video file
          if (item.videoFile) {
            form.append(`curriculum[${sIndex}][items][${iIndex}][video]`, item.videoFile);
          }
          // documents (multiple)
          (item.documents || []).forEach((doc, dIndex) => {
           
            if (doc && doc.file && typeof doc.file.name === "string") {
              form.append(`curriculum[${sIndex}][items][${iIndex}][documents][${dIndex}]`, doc.file);
            }
          });

          form.append(`curriculum[${sIndex}][items][${iIndex}][type]`, item.type);
          form.append(`curriculum[${sIndex}][items][${iIndex}][title]`, item.title || "");
          if (item.id) form.append(`curriculum[${sIndex}][items][${iIndex}][id]`, item.id);
          if (item.videoId) form.append(`curriculum[${sIndex}][items][${iIndex}][videoId]`, String(item.videoId));
        });

        // also append section title
        form.append(`curriculum[${sIndex}][title]`, section.title || "");
        if (section.id) form.append(`curriculum[${sIndex}][id]`, section.id);
      });

      // 4) Send multipart PUT to server
      const url = `${API_BASE}/api/pending-courses/update/${finalCourseId}`;
      await axios.put(url, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          // NOTE: do NOT set Content-Type manually; let browser set boundary
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });


      setIsNew(false);
      alert("Course submitted for admin review!");
      navigate("/instructor-dashboard");
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Submit failed — check console.");
    }
  };

  // ---------- RENDER helpers ----------
  const Icon = {
    Edit: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>),
    Delete: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V3h6v3" /></svg>),
    ChevronDown: (<svg width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2"><path d="M6 9l4 4 4-4" /></svg>),
    ChevronUp: (<svg width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2"><path d="M6 13l4-4 4 4" /></svg>),
    Plus: (<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v10M3 8h10" /></svg>)
  };

  // ---------- Render content ----------
  const renderContent = () => {
    switch (active) {
      case "intended": {
        return (
          <div>
            <h2 className="dash-heading">Intended learners</h2>
            <p className="dash-desc">These descriptions will be visible on your Course Landing Page.</p>

            <div className="dash-section">
              <h3>What will students learn?</h3>
              {learningObjectives.map((obj, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      className="input-box"
                      placeholder={`Example: Learning outcome ${i + 1}`}
                      maxLength={160}
                      value={obj}
                      onChange={(e) => {
                        const newArr = [...learningObjectives];
                        newArr[i] = e.target.value;
                        setLearningObjectives(newArr);
                        setTouched((t) => ({ ...t, learningObjectives: (t.learningObjectives || []).map((v, idx) => (idx === i ? true : v)) }));
                      }}
                      style={{ flex: 1, marginRight: 8 }}
                    />
                    <span style={{ color: "#888", fontSize: 13 }}>{160 - obj.length}</span>
                  </div>
                </div>
              ))}
              <button className="add-more-btn" type="button" onClick={() => setLearningObjectives([...learningObjectives, ""])} style={{ marginBottom: 16 }}>
                + Add more
              </button>
            </div>

            <div className="dash-section">
              <h3>Requirements / prerequisites</h3>
              {requirements.map((req, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                  <input
                    type="text"
                    className="input-box"
                    placeholder="Example: No programming experience needed."
                    value={req}
                    onChange={(e) => {
                      const newArr = [...requirements];
                      newArr[i] = e.target.value;
                      setRequirements(newArr);
                      setTouched((t) => ({ ...t, requirements: (t.requirements || []).map((v, idx) => (idx === i ? true : v)) }));
                    }}
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <button type="button" onClick={() => setRequirements(requirements.filter((_, idx) => idx !== i))} style={{ color: "#c00", background: "none", border: "none", fontSize: 18, cursor: "pointer" }} disabled={requirements.length === 1}>×</button>
                </div>
              ))}
              <button className="add-more-btn" type="button" onClick={() => setRequirements([...requirements, ""])}>+ Add more</button>
            </div>

            <div className="dash-section">
              <h3>Who is this course for?</h3>
              <input type="text" className="input-box" placeholder="Example: Beginners interested in Python for data science" value={courseFor} onChange={(e) => { setCourseFor(e.target.value); setTouched((t) => ({ ...t, courseFor: true })); }} />
            </div>
          </div>
        );
      }

      case "structure": {
        return (
          <div>
            <h2 className="dash-heading">Course structure</h2>
            <textarea className="input-box" rows={6} placeholder="Outline sections..." value={structure} onChange={(e) => { setStructure(e.target.value); setTouched((t) => ({ ...t, structure: true })); }} />
          </div>
        );
      }

      case "setup (optional)": {
        return (
          <div>
            <h2 className="dash-heading">Setup & test video</h2>
            <p className="dash-desc">Upload a short test video so the team can check audio/video quality.</p>
            <div style={{ marginBottom: 16 }}>
              <input type="file" accept="video/*" onChange={(e) => { setTestVideo(e.target.files[0]); setTouched((t) => ({ ...t, testVideo: true })); }} style={{ marginBottom: 8, padding: 8, border: "2px dashed #ccc", borderRadius: 4, width: "100%" }} />
              {testVideo && <div style={{ color: "#5624d0", padding: 8, background: "#f3f0ff", borderRadius: 4, marginTop: 8 }}>✅ Selected: {testVideo.name} ({(testVideo.size / 1024 / 1024).toFixed(2)} MB)</div>}
            </div>
          </div>
        );
      }

      case "film(optional)": {
        return (
          <div>
            <h2 className="dash-heading">Film & edit</h2>
            <textarea className="input-box" rows={4} placeholder="Describe filming/editing plan (optional)" value={filmEdit} onChange={(e) => { setFilmEdit(e.target.value); setTouched((t) => ({ ...t, filmEdit: true })); }} />
            <div style={{ marginTop: 12 }}>
              <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>Sample Video (Optional)</label>
              <input type="file" accept="video/*" onChange={(e) => { setSampleVideo(e.target.files[0]); }} style={{ padding: 8, border: "2px dashed #ccc", borderRadius: 4, width: "100%" }} />
              {sampleVideo && <div style={{ color: "#5624d0", padding: 8, background: "#f3f0ff", borderRadius: 4, marginTop: 8 }}>✅ Selected: {sampleVideo.name}</div>}
            </div>
          </div>
        );
      }

      case "curriculum": {
        return (
          <div>
            <h2 className="dash-heading">Curriculum</h2>
            <div className="upload-container">
              {sections.map((section) => (
                <div key={section.id} className="section-block">

                  {/* ---------------------------- SECTION HEADER ---------------------------- */}
                  <div className="section-header">
                    {editingSection === section.id ? (
                      <input
                        className="inline-input"
                        autoFocus
                        defaultValue={section.title}
                        onBlur={(e) => {
                          editSection(section.id, e.target.value.trim());
                          setEditingSection(null);
                        }}
                      />
                    ) : (
                      <strong>{section.title}</strong>
                    )}

                    <div className="header-actions">
                      <button className="icon-btn" onClick={() => setEditingSection(section.id)}>{Icon.Edit}</button>
                      <button className="icon-btn danger" onClick={() => deleteSection(section.id)}>{Icon.Delete}</button>
                    </div>
                  </div>

                  {/* ---------------------------- SECTION ITEMS ---------------------------- */}
                  {section.items.map((item) => (
                    <div key={item.id} className="item-block">

                      <div className="item-header">
                        {editingItem === item.id ? (
                          <input
                            className="inline-input"
                            autoFocus
                            defaultValue={item.title}
                            onBlur={(e) => {
                              editItem(section.id, item.id, e.target.value.trim());
                              setEditingItem(null);
                            }}
                          />
                        ) : (
                          <span>{item.type.toUpperCase()}: {item.title}</span>
                        )}

                        <div className="item-actions">
                          <button className="icon-btn" onClick={() => setEditingItem(item.id)}>{Icon.Edit}</button>
                          <button
                            className="icon-btn danger"
                            onClick={() => deleteItem(section.id, item.id)}
                          >
                            {Icon.Delete}
                          </button>
                          <button className="icon-btn" onClick={() => toggleExpand(section.id, item.id)}>
                            {item.expanded ? Icon.ChevronUp : Icon.ChevronDown}
                          </button>
                        </div>
                      </div>

                      {/* ---------------------------- ITEM EXPANDED VIEW ---------------------------- */}
                      {item.expanded && (
                        <div className="item-content">

                          {/* ---------------------------- LECTURE TYPE ---------------------------- */}
                          {item.type === "lecture" && (
                            <>
                              <label style={{ fontWeight: 600 }}>Lecture Video</label>

                              {/* -------------------- VIDEO UPLOAD (NEW) -------------------- */}
                              <input
                                type="file"
                                accept="video/*"
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;

                                  // instant UI progress setup
                                  setSections(prev =>
                                    prev.map(sec =>
                                      sec.id === section.id
                                        ? {
                                          ...sec,
                                          items: sec.items.map(it =>
                                            it.id === item.id
                                              ? { ...it, uploadProgress: 0 }
                                              : it
                                          )
                                        }
                                        : sec
                                    )
                                  );

                                  try {
                                    await uploads.uploadVideo(
                                      section.id,
                                      item.id,
                                      file,
                                      (percent) => {
                                        setSections(prev =>
                                          prev.map(sec =>
                                            sec.id === section.id
                                              ? {
                                                ...sec,
                                                items: sec.items.map(it =>
                                                  it.id === item.id
                                                    ? { ...it, uploadProgress: percent }
                                                    : it
                                                )
                                              }
                                              : sec
                                          )
                                        );
                                      }
                                    );

                                    alert("Video uploaded!");
                                  } catch (err) {
                                    console.error("Video upload failed:", err);
                                    alert("Upload failed");
                                  }
                                }}
                              />

                              {/* SHOW VIDEO STATUS */}
                              {item.uploadProgress >= 0 && item.uploadProgress < 100 && (
                                <div style={{ color: "#5624d0", marginTop: 6 }}>
                                  Uploading... {item.uploadProgress}%
                                </div>
                              )}

                              {item.videoUrl && (
                                <div style={{ marginTop: 8 }}>
                                  🎥 Uploaded: <a href={item.videoUrl} target="_blank">Watch video</a>
                                </div>
                              )}
                            </>
                          )}

                          {/* ---------------------------- DOCUMENTS ---------------------------- */}
                          <label style={{ marginTop: 12, fontWeight: 600 }}>Documents</label>

                          <input
                            type="file"
                            multiple
                            onChange={async (e) => {
                              const files = Array.from(e.target.files);

                              for (const file of files) {
                                try {
                                  await uploads.uploadDocument(section.id, item.id, file);
                                } catch (err) {
                                  console.error("Doc upload failed:", err);
                                }
                              }
                            }}
                          />



                          {/* SHOW DOCS */}
                          {item.documents && item.documents.length > 0 && (
                            <ul style={{ marginTop: 10 }}>
                              {item.documents.map((d, idx) => (
                                <li key={idx}>
                                  📄 <a href={d.fileUrl} target="_blank">{d.fileName}</a>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* ---------------------------- QUIZ TYPE ---------------------------- */}
                          {item.type === "quiz" && (
                            <div style={{ marginTop: 8 }}>
                              <QuizPage sectionId={section.id} itemId={item.id} questions={item.questions} quiz={quiz} />
                            </div>
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
      }


      case "captions(optional)": {
        return <div><h2 className="dash-heading">Captions (optional)</h2><textarea className="input-box" rows={3} value={captions} onChange={(e) => setCaptions(e.target.value)} /></div>;
      }

      case "accessibility(optional)": {
        return <div><h2 className="dash-heading">Accessibility (optional)</h2><textarea className="input-box" rows={3} value={accessibility} onChange={(e) => setAccessibility(e.target.value)} /></div>;
      }

      case "landing": {
        return (
          <div>
            <h2 className="dash-heading">Course landing page</h2>
            <input type="text" className="input-box" placeholder="Course Title" value={landingTitle} onChange={(e) => setLandingTitle(e.target.value)} />
            <input type="text" className="input-box" placeholder="Subtitle" value={landingSubtitle} onChange={(e) => setLandingSubtitle(e.target.value)} />
            <textarea className="input-box" rows={4} placeholder="Full course description..." value={landingDesc} onChange={(e) => setLandingDesc(e.target.value)} />

            <div style={{ margin: "18px 0" }}>
              <label style={{ fontWeight: 600 }}>Course Thumbnail Image</label>
              <input type="file" accept="image/*" onChange={handleThumbnailChange} style={{ marginTop: 8 }} />
              {thumbnailUrl && <div style={{ marginTop: 10 }}><img src={thumbnailUrl} alt="Thumbnail preview" style={{ width: 180, height: 120, objectFit: "contain", borderRadius: 8 }} /></div>}
            </div>
          </div>
        );
      }

      case "pricing": {
        return (
          <div>
            <h2 className="dash-heading">Pricing</h2>
            <select className="input-box" value={price} onChange={(e) => setPrice(e.target.value)}>
              <option value="">Select price</option>
              <option value="Free">Free</option>
              <option value="9.99">₹9.99</option>
              <option value="19.99">₹19.99</option>
            </select>
          </div>
        );
      }

      case "promotions": {
        return (
          <div>
            <h2 className="dash-heading">Promotions</h2>
            <input type="text" className="input-box" placeholder="Promo Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
            <input type="text" className="input-box" placeholder="Discount description" value={promoDesc} onChange={(e) => setPromoDesc(e.target.value)} />
          </div>
        );
      }

      case "messages": {
        return (
          <div>
            <h2 className="dash-heading">Course messages</h2>
            <textarea className="input-box" rows={3} placeholder="Welcome message..." value={welcomeMsg} onChange={(e) => setWelcomeMsg(e.target.value)} />
            <textarea className="input-box" rows={3} placeholder="Congratulations message..." value={congratsMsg} onChange={(e) => setCongratsMsg(e.target.value)} />
          </div>
        );
      }

      default:
        return <div style={{ color: "#888", fontSize: 18, textAlign: "center", marginTop: 40 }}>Coming soon...</div>;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f7fa" }}>
      <aside style={{ width: 270, background: "#fff", borderRight: "1px solid #eee", paddingTop: 40 }}>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {steps.map((step) => (
              <li key={step.key}>
                <button className={active === step.key ? "sidebar-btn active" : "sidebar-btn"} style={{
                  width: "100%", textAlign: "left", padding: "16px 32px",
                  background: active === step.key ? "#f3f0ff" : "none",
                  border: "none", borderLeft: active === step.key ? "4px solid #7c3aed" : "4px solid transparent",
                  color: active === step.key ? "#5624d0" : "#232323", fontWeight: active === step.key ? 700 : 500,
                  fontSize: 17, cursor: "pointer", outline: "none",
                }} onClick={() => setActive(step.key)}>{step.label}</button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 48, maxWidth: 900, margin: "0 auto", position: "relative" }}>
        {renderContent()}
        <button style={{
          position: "fixed", left: 300, bottom: 40, background: "linear-gradient(to right, #5624d0, #7c3aed)",
          color: "white", padding: "16px 38px", fontSize: "1.2rem", border: "none", borderRadius: 10, cursor: "pointer",
          fontWeight: 700, boxShadow: "0 4px 16px rgba(124,58,237,0.13)", zIndex: 100,
        }} onClick={handleSubmitForReview}>Submit for Review</button>

        {submitError && <div style={{ color: "red", fontWeight: 600, marginTop: 18, textAlign: "center" }}>{submitError}</div>}
      </main>
    </div>
  );
}
