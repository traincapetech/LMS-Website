// Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import "./Dashboard.css";
import axios from "axios";
import "./curriculum.css";
import { useParams, useNavigate } from "react-router-dom";
import initialData from "./initialData";
import useSections from "../Pages/hooks/useSection";
import useQuiz from "../Pages/hooks/useQuiz";
import useUpload from "../Pages/hooks/useUpload";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RxCross2 } from "react-icons/rx";
import { CiEdit } from "react-icons/ci";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://lms-backend-5s5x.onrender.com";

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
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [draftSettled, setDraftSettled] = useState(false); // New: Prevents auto-save until draft choice is made
  const draftRestoredRef = React.useRef(false); // Use Ref to avoid stale closures in axios callbacks

  // form fields
  const [learningObjectives, setLearningObjectives] = useState([
    "",
    "",
    "",
    "",
  ]);
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
  console.log("sections", sections);

  const uploads = useUpload(setSections, courseId);
  const quiz = useQuiz(setSections);

  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // ---------- AUTO-SAVE DRAFT TO LOCALSTORAGE ----------
  const saveDraftToLocalStorage = useCallback(() => {
    if (!courseId) return; // Only save if we have a courseId

    setIsSaving(true);

    const draftData = {
      courseId,
      timestamp: new Date().toISOString(),
      active,
      learningObjectives,
      requirements,
      courseFor,
      structure,
      testVideoUrl,
      filmEdit,
      sampleVideoUrl,
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
      sections: sections.map((s) => ({
        ...s,
        items: s.items.map((i) => ({
          ...i,
          videoFile: null, // Don't save File objects
        })),
      })),
    };

    localStorage.setItem(`course_draft_${courseId}`, JSON.stringify(draftData));
    setLastSaved(new Date());

    setTimeout(() => setIsSaving(false), 500);
  }, [
    courseId,
    active,
    learningObjectives,
    requirements,
    courseFor,
    structure,
    testVideoUrl,
    filmEdit,
    sampleVideoUrl,
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
    sections,
  ]);

  // ---------- AUTO-SAVE CURRICULUM TO BACKEND ----------
  const saveCurriculumToBackend = useCallback(async () => {
    if (!courseId || !draftSettled) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const curriculumMeta = sections.map((section) => ({
        id: section.id || section._id,
        title: section.title || "New Section",
        published: section.published || false,
        items: (section.items || []).map((item) => ({
          id: item.id || item._id,
          type: item.type,
          title: item.title,
          videoId: item.videoId || null,
          documents: (item.documents || []).map((d) => ({
            fileUrl: d.fileUrl || "",
            fileName: d.fileName || "",
          })),
          questions: item.questions || [],
          quizId: item.quizId || null,
        })),
      }));

      await axios.patch(
        `${API_BASE}/api/pending-courses/${courseId}`,
        { curriculum: curriculumMeta },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Curriculum auto-saved to backend");
    } catch (err) {
      console.error("❌ Failed to auto-save curriculum:", err);
    }
  }, [courseId, sections, draftSettled]);

  // Auto-save curriculum to backend when sections change
  useEffect(() => {
    if (!draftSettled) return;

    const timer = setTimeout(() => {
      saveCurriculumToBackend();
    }, 2000); // Save 2 seconds after last change

    return () => clearTimeout(timer);
  }, [saveCurriculumToBackend, draftSettled]);

  // Auto-save every time form data changes (debounced)
  useEffect(() => {
    // CRITICAL: Progress is only 'settled' once the user chooses to Resume or Start Fresh.
    // We should NEVER auto-save until the user has made that choice.
    if (!draftSettled) return;

    const timer = setTimeout(() => {
      saveDraftToLocalStorage();
    }, 1000); // Save after 1 second of inactivity

    return () => clearTimeout(timer);
  }, [saveDraftToLocalStorage, draftSettled]);

  // ---------- WARN BEFORE LEAVING PAGE ----------
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (courseId && !isNew) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [courseId, isNew]);

  // ---------- CHECK FOR EXISTING DRAFT ON MOUNT ----------
  useEffect(() => {
    if (!courseId) return;

    const draftKey = `course_draft_${courseId}`;
    const savedDraft = localStorage.getItem(draftKey);

    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        // Check if draft is recent (within last 6 months)
        const draftAge = Date.now() - new Date(draft.timestamp).getTime();
        const sixMonthsInMs = 6 * 30 * 24 * 60 * 60 * 1000;

        if (draftAge < sixMonthsInMs) {
          setHasDraft(true);
          setShowResumeModal(true);
        } else {
          // Remove old draft
          localStorage.removeItem(draftKey);
          setDraftSettled(true);
        }
      } catch (err) {
        console.error("Error parsing draft:", err);
        setDraftSettled(true);
      }
    } else {
      setDraftSettled(true); // No draft found, safe to save future changes
    }
  }, [courseId]);

  // ---------- RESUME FROM DRAFT ----------
  const resumeFromDraft = () => {
    const draftKey = `course_draft_${courseId}`;
    const savedDraft = localStorage.getItem(draftKey);

    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);

        setActive(draft.active || "intended");
        setLearningObjectives(draft.learningObjectives || ["", "", "", ""]);
        setRequirements(draft.requirements || [""]);
        setCourseFor(draft.courseFor || "");
        setStructure(draft.structure || "");
        setTestVideoUrl(draft.testVideoUrl || "");
        setFilmEdit(draft.filmEdit || "");
        setSampleVideoUrl(draft.sampleVideoUrl || "");
        setCaptions(draft.captions || "");
        setAccessibility(draft.accessibility || "");
        setLandingTitle(draft.landingTitle || "");
        setLandingSubtitle(draft.landingSubtitle || "");
        setLandingDesc(draft.landingDesc || "");
        setPrice(draft.price || "");
        setPromoCode(draft.promoCode || "");
        setPromoDesc(draft.promoDesc || "");
        setWelcomeMsg(draft.welcomeMsg || "");
        setCongratsMsg(draft.congratsMsg || "");
        setThumbnailUrl(draft.thumbnailUrl || "");

        if (draft.sections) {
          setSections(draft.sections);
        }

        draftRestoredRef.current = true; // Update ref immediately
        setDraftRestored(true); // Mark that draft was restored
        setDraftSettled(true); // Allow auto-save to resume
        setShowResumeModal(false);
        toast.success("✅ Draft restored! Continue where you left off.");
      } catch (err) {
        console.error("Error restoring draft:", err);
        setDraftSettled(true);
        toast.error("Failed to restore draft");
      }
    }
  };

  // ---------- START FRESH ----------
  const startFresh = () => {
    const draftKey = `course_draft_${courseId}`;
    localStorage.removeItem(draftKey);
    setHasDraft(false);
    setDraftSettled(true); // Start fresh, so it's safe to start auto-saving the new state
    setShowResumeModal(false);
  };

  // ---------- Load pending draft ----------
  useEffect(() => {
    if (!courseId) return;

    // Skip loading from backend if draft was restored
    if (draftRestored) {
      console.log(
        "Skipping backend load - draft was restored from localStorage"
      );
      return;
    }

    axios
      .get(`${API_BASE}/api/pending-courses/${courseId}`)
      .then((res) => {
        // IMPORTANT: Check the REF, not the state, to avoid stale closure.
        // If user restored a draft while this fetch was in flight, ABORT.
        if (draftRestoredRef.current) {
          console.log(
            "Axios fetch returned, but draft was restored. Ignoring."
          );
          return;
        }

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
              documents:
                item.documents?.map((d) => ({
                  fileUrl: d.fileUrl,
                  fileName: d.fileName,
                })) || [],
              // for quizzes
              questions: item.questions || [],
              quizId: item.quizId || null,
            })),
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
  }, [courseId, draftRestored]);

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
      setThumbnailUrl(res.data.thumbnailUrl); // IMPORTANT
      setThumbnailFile(null); // stop blob from going to final form
    } catch (err) {
      console.error("Thumbnail upload failed:", err);
      alert("Thumbnail upload failed");
    }
  };
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
      console.log("final course id :", finalCourseId);
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
            fileName: d.fileName || d.filename || "",
          })),
          quizId: item.quizId || null,
        })),
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
            form.append(
              `curriculum[${sIndex}][items][${iIndex}][video]`,
              item.videoFile
            );
          }
          // documents (multiple)
          (item.documents || []).forEach((doc, dIndex) => {
            if (doc && doc.file && typeof doc.file.name === "string") {
              form.append(
                `curriculum[${sIndex}][items][${iIndex}][documents][${dIndex}]`,
                doc.file
              );
            }
          });

          form.append(
            `curriculum[${sIndex}][items][${iIndex}][type]`,
            item.type
          );
          form.append(
            `curriculum[${sIndex}][items][${iIndex}][title]`,
            item.title || ""
          );
          if (item.id)
            form.append(`curriculum[${sIndex}][items][${iIndex}][id]`, item.id);
          if (item.videoId)
            form.append(
              `curriculum[${sIndex}][items][${iIndex}][videoId]`,
              String(item.videoId)
            );
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

      // Clear draft from localStorage on successful submission
      const draftKey = `course_draft_${finalCourseId}`;
      localStorage.removeItem(draftKey);

      setIsNew(false);
      toast.success("Course submitted for admin review!");
      navigate("/instructor-dashboard");
    } catch (err) {
      console.error("Submit failed:", err);
      toast.error("Submit failed — check console.");
    }
  };

  // ---------- RENDER helpers ----------
  const Icon = {
    Edit: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    ),
    Delete: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V3h6v3" />
      </svg>
    ),
    ChevronDown: (
      <svg
        width="16"
        height="16"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
      >
        <path d="M6 9l4 4 4-4" />
      </svg>
    ),
    ChevronUp: (
      <svg
        width="16"
        height="16"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
      >
        <path d="M6 13l4-4 4 4" />
      </svg>
    ),
    Plus: (
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M8 3v10M3 8h10" />
      </svg>
    ),
  };

  // ---------- Render content ----------
  const renderContent = () => {
    switch (active) {
      case "intended": {
        return (
          <div>
            <h2 className="text-4xl font-semibold my-10">Intended learners</h2>
            <p className="font-inter text-base pb-10">
              These descriptions will be visible on your Course Landing Page.
            </p>

            <div className="dash-section">
              <h3 className="text-xl font-semibold pb-5">
                What will students learn?
              </h3>
              {learningObjectives.map((obj, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      className="input-box  focus:outline focus:outline-blue-600"
                      placeholder={`Example: Learning outcome ${i + 1}`}
                      maxLength={160}
                      value={obj}
                      onChange={(e) => {
                        const newArr = [...learningObjectives];
                        newArr[i] = e.target.value;
                        setLearningObjectives(newArr);
                        setTouched((t) => ({
                          ...t,
                          learningObjectives: (t.learningObjectives || []).map(
                            (v, idx) => (idx === i ? true : v)
                          ),
                        }));
                      }}
                      style={{ flex: 1, marginRight: 8 }}
                    />
                    <span style={{ color: "#888", fontSize: 13 }}>
                      {160 - obj.length}
                    </span>
                  </div>
                </div>
              ))}
              <Button
                className=""
                type="button"
                onClick={() =>
                  setLearningObjectives([...learningObjectives, ""])
                }
                style={{ marginBottom: 16 }}
              >
                + Add more
              </Button>
            </div>

            <div className="dash-section">
              <h3 className="font-semibold pb-5 text-xl">
                Requirements / prerequisites
              </h3>
              {requirements.map((req, i) => (
                <div className="flex items-center mb-2" key={i}>
                  <input
                    type="text"
                    className="input-box"
                    placeholder="Example: No programming experience needed."
                    value={req}
                    onChange={(e) => {
                      const newArr = [...requirements];
                      newArr[i] = e.target.value;
                      setRequirements(newArr);
                      setTouched((t) => ({
                        ...t,
                        requirements: (t.requirements || []).map((v, idx) =>
                          idx === i ? true : v
                        ),
                      }));
                    }}
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setRequirements(
                        requirements.filter((_, idx) => idx !== i)
                      )
                    }
                    disabled={requirements.length === 1}
                  >
                    <RxCross2 className="text-xl text-red-500" />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => setRequirements([...requirements, ""])}
              >
                + Add more
              </Button>
            </div>

            <div className="dash-section">
              <h3 className="font-semibold pb-5 text-xl">
                Who is this course for?
              </h3>
              <input
                type="text"
                className="input-box"
                placeholder="Example: Beginners interested in Python for data science"
                value={courseFor}
                onChange={(e) => {
                  setCourseFor(e.target.value);
                  setTouched((t) => ({ ...t, courseFor: true }));
                }}
              />
            </div>
          </div>
        );
      }

      case "structure": {
        return (
          <div>
            <h2 className="dash-heading">Course structure</h2>
            <textarea
              className="input-box"
              rows={6}
              placeholder="Outline sections..."
              value={structure}
              onChange={(e) => {
                setStructure(e.target.value);
                setTouched((t) => ({ ...t, structure: true }));
              }}
            />
          </div>
        );
      }

      case "setup (optional)": {
        return (
          <div>
            <h2 className="dash-heading">Setup & test video</h2>
            <p className="dash-desc">
              Upload a short test video so the team can check audio/video
              quality.
            </p>
            <div style={{ marginBottom: 16 }}>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  setTestVideo(e.target.files[0]);
                  setTouched((t) => ({ ...t, testVideo: true }));
                }}
                style={{
                  marginBottom: 8,
                  padding: 8,
                  border: "2px dashed #ccc",
                  borderRadius: 4,
                  width: "100%",
                }}
              />
              {testVideo && (
                <div
                  style={{
                    color: "#5624d0",
                    padding: 8,
                    background: "#f3f0ff",
                    borderRadius: 4,
                    marginTop: 8,
                  }}
                >
                  ✅ Selected: {testVideo.name} (
                  {(testVideo.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>
          </div>
        );
      }

      case "film(optional)": {
        return (
          <div>
            <h2 className="dash-heading">Film & edit</h2>
            <textarea
              className="input-box"
              rows={4}
              placeholder="Describe filming/editing plan (optional)"
              value={filmEdit}
              onChange={(e) => {
                setFilmEdit(e.target.value);
                setTouched((t) => ({ ...t, filmEdit: true }));
              }}
            />
            <div style={{ marginTop: 12 }}>
              <label
                style={{ fontWeight: 600, display: "block", marginBottom: 8 }}
              >
                Sample Video (Optional)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  setSampleVideo(e.target.files[0]);
                }}
                style={{
                  padding: 8,
                  border: "2px dashed #ccc",
                  borderRadius: 4,
                  width: "100%",
                }}
              />
              {sampleVideo && (
                <div
                  style={{
                    color: "#5624d0",
                    padding: 8,
                    background: "#f3f0ff",
                    borderRadius: 4,
                    marginTop: 8,
                  }}
                >
                  ✅ Selected: {sampleVideo.name}
                </div>
              )}
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
                      <Button
                        variant="outline"
                        className=""
                        onClick={() => setEditingSection(section.id)}
                      >
                        <MdOutlineEdit className="size-5" />
                      </Button>
                      <Button
                        variant="outline"
                        className=""
                        onClick={() => deleteSection(section.id)}
                      >
                        <MdDeleteOutline className="size-5 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  {/* ---------------------------- SECTION ITEMS ---------------------------- */}
                  {section.items.map((item) => (
                    <div key={item.id} className="item-block">
                      <div className="item-header flex items-center justify-between">
                        <div>
                          {editingItem === item.id ? (
                            <input
                              className="inline-input"
                              autoFocus
                              defaultValue={item.title}
                              onBlur={(e) => {
                                editItem(
                                  section.id,
                                  item.id,
                                  e.target.value.trim()
                                );
                                setEditingItem(null);
                              }}
                            />
                          ) : (
                            <span>
                              {item.type.toUpperCase()}: {item.title}
                            </span>
                          )}
                        </div>

                        <div className="item-actions">
                          <Button
                            variant="outline"
                            className=""
                            onClick={() => setEditingItem(item.id)}
                          >
                            <MdOutlineEdit className="size-5" />
                          </Button>
                          <Button
                            variant="outline"
                            className=""
                            onClick={() => deleteItem(section.id, item.id)}
                          >
                            <MdDeleteOutline className="size-5 text-red-500" />
                          </Button>
                          <Button
                            variant="outline"
                            className="flex items-center justify-center p-0"
                            onClick={() => toggleExpand(section.id, item.id)}
                          >
                            {item.expanded ? (
                              <MdKeyboardArrowUp className="size-5" />
                            ) : (
                              <MdKeyboardArrowDown className="size-5" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* ---------------------------- ITEM EXPANDED VIEW ---------------------------- */}
                      {item.expanded && (
                        <div className="item-content">
                          <div className="flex items-center gap-5">
                            {/* ---------------------------- LECTURE TYPE ---------------------------- */}
                            <div>
                              {item.type === "lecture" && (
                                <>
                                  <Label>Lecture Video</Label>

                                  {/* -------------------- VIDEO UPLOAD (NEW) -------------------- */}

                                  <Input
                                    type="file"
                                    accept="video/*"
                                    className="mt-3"
                                    onChange={async (e) => {
                                      const file = e.target.files[0];
                                      if (!file) return;

                                      // instant UI progress setup
                                      setSections((prev) =>
                                        prev.map((sec) =>
                                          sec.id === section.id
                                            ? {
                                                ...sec,
                                                items: sec.items.map((it) =>
                                                  it.id === item.id
                                                    ? {
                                                        ...it,
                                                        uploadProgress: 0,
                                                      }
                                                    : it
                                                ),
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
                                            setSections((prev) =>
                                              prev.map((sec) =>
                                                sec.id === section.id
                                                  ? {
                                                      ...sec,
                                                      items: sec.items.map(
                                                        (it) =>
                                                          it.id === item.id
                                                            ? {
                                                                ...it,
                                                                uploadProgress:
                                                                  percent,
                                                              }
                                                            : it
                                                      ),
                                                    }
                                                  : sec
                                              )
                                            );
                                          }
                                        );

                                        toast.success("Video uploaded!");
                                      } catch (err) {
                                        console.error(
                                          "Video upload failed:",
                                          err
                                        );
                                        toast.error("Upload failed");
                                      }
                                    }}
                                  />

                                  {/* SHOW VIDEO STATUS */}
                                  {item.uploadProgress >= 0 &&
                                    item.uploadProgress < 100 && (
                                      <div
                                        style={{
                                          color: "#5624d0",
                                          marginTop: 6,
                                        }}
                                      >
                                        Uploading... {item.uploadProgress}%
                                      </div>
                                    )}

                                  {item.videoUrl && (
                                    <div style={{ marginTop: 8 }}>
                                      🎥 Uploaded:{" "}
                                      <a href={item.videoUrl} target="_blank">
                                        Watch video
                                      </a>
                                    </div>
                                  )}
                                </>
                              )}{" "}
                            </div>

                            {/* ---------------------------- DOCUMENTS ---------------------------- */}
                            <div>
                              <Label>Documents</Label>

                              <Input
                                type="file"
                                multiple
                                className="mt-3"
                                onChange={async (e) => {
                                  const files = Array.from(e.target.files);

                                  for (const file of files) {
                                    try {
                                      await uploads.uploadDocument(
                                        section.id,
                                        item.id,
                                        file
                                      );
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
                                      📄{" "}
                                      <a href={d.fileUrl} target="_blank">
                                        {d.fileName}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>

                          {/* ---------------------------- QUIZ TYPE ---------------------------- */}
                          {item.type === "quiz" && (
                            <div style={{ marginTop: 8 }}>
                              <QuizPage
                                sectionId={section.id}
                                itemId={item.id}
                                questions={item.questions}
                                quiz={quiz}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex gap-2 mt-5">
                    <Button onClick={() => addItem(section.id, "lecture")}>
                      {Icon.Plus} Lecture
                    </Button>
                    <Button onClick={() => addItem(section.id, "quiz")}>
                      {Icon.Plus} Quiz
                    </Button>
                  </div>
                </div>
              ))}

              <Button onClick={addSection}>{Icon.Plus} Add Section</Button>
            </div>
          </div>
        );
      }

      case "captions(optional)": {
        return (
          <div>
            <h2 className="dash-heading">Captions (optional)</h2>
            <textarea
              className="input-box"
              rows={3}
              value={captions}
              onChange={(e) => setCaptions(e.target.value)}
            />
          </div>
        );
      }

      case "accessibility(optional)": {
        return (
          <div>
            <h2 className="dash-heading">Accessibility (optional)</h2>
            <textarea
              className="input-box"
              rows={3}
              value={accessibility}
              onChange={(e) => setAccessibility(e.target.value)}
            />
          </div>
        );
      }

      case "landing": {
        return (
          <div>
            <h2 className="dash-heading">Course landing page</h2>
            <input
              type="text"
              className="input-box"
              placeholder="Course Title"
              value={landingTitle}
              onChange={(e) => setLandingTitle(e.target.value)}
            />
            <input
              type="text"
              className="input-box"
              placeholder="Subtitle"
              value={landingSubtitle}
              onChange={(e) => setLandingSubtitle(e.target.value)}
            />
            <textarea
              className="input-box"
              rows={4}
              placeholder="Full course description..."
              value={landingDesc}
              onChange={(e) => setLandingDesc(e.target.value)}
            />

            <div style={{ margin: "18px 0" }}>
              <Label style={{ fontWeight: 600 }}>Course Thumbnail Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                style={{ marginTop: 8 }}
              />
              {thumbnailUrl && (
                <div style={{ marginTop: 10 }}>
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail preview"
                    style={{
                      width: 180,
                      height: 120,
                      objectFit: "contain",
                      borderRadius: 8,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      }

      case "pricing": {
        return (
          <div>
            <h2 className="dash-heading">Pricing</h2>
            <select
              className="input-box"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            >
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
            <input
              type="text"
              className="input-box"
              placeholder="Promo Code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <input
              type="text"
              className="input-box"
              placeholder="Discount description"
              value={promoDesc}
              onChange={(e) => setPromoDesc(e.target.value)}
            />
          </div>
        );
      }

      case "messages": {
        return (
          <div>
            <h2 className="dash-heading">Course messages</h2>
            <textarea
              className="input-box"
              rows={3}
              placeholder="Welcome message..."
              value={welcomeMsg}
              onChange={(e) => setWelcomeMsg(e.target.value)}
            />
            <textarea
              className="input-box"
              rows={3}
              placeholder="Congratulations message..."
              value={congratsMsg}
              onChange={(e) => setCongratsMsg(e.target.value)}
            />
          </div>
        );
      }

      default:
        return (
          <div
            style={{
              color: "#888",
              fontSize: 18,
              textAlign: "center",
              marginTop: 40,
            }}
          >
            Coming soon...
          </div>
        );
    }
  };

  return (
    <>
      {/* Resume Draft Modal */}
      {showResumeModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "12px",
              maxWidth: "500px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ marginBottom: "16px", color: "#5624d0" }}>
              📝 Resume Course Creation?
            </h2>
            <p style={{ marginBottom: "24px", color: "#666", lineHeight: 1.6 }}>
              We found an incomplete draft for this course. Would you like to
              continue where you left off, or start fresh?
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={resumeFromDraft}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  background: "linear-gradient(to right, #5624d0, #7c3aed)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ✅ Resume Draft
              </button>
              <button
                onClick={startFresh}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  background: "white",
                  color: "#5624d0",
                  border: "2px solid #5624d0",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🆕 Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Main Dashboard */}
      <div
        className="mt-10 font-poppins"
        style={{ display: "flex", minHeight: "100vh" }}
      >
        <aside className="mt-15 pt-5">
          <nav>
            <ul className="space-y-2">
              {steps.map((step) => (
                <li key={step.key}>
                  <button
                    className={` px-5 py-4 w-full text-left text-lg font-normal cursor-pointer
                      ${
                        active === step.key
                          ? "border-l-4 border-blue-600 text-blue-600 bg-blue-50"
                          : "hover:text-blue-600"
                      }`}
                    onClick={() => setActive(step.key)}
                  >
                    {step.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main
          style={{
            flex: 1,
            padding: 48,
            maxWidth: 900,
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Auto-save Indicator */}
          {courseId && (
            <div
              style={{
                position: "fixed",
                top: 100,
                right: 20,
                padding: "8px 16px",
                background: isSaving ? "#fff3cd" : "#d4edda",
                border: `1px solid ${isSaving ? "#ffc107" : "#28a745"}`,
                borderRadius: "6px",
                fontSize: "14px",
                color: isSaving ? "#856404" : "#155724",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                zIndex: 1000,
                transition: "all 0.3s ease",
              }}
            >
              {isSaving ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite" }}>
                    ⏳
                  </span>
                  <span>Saving draft...</span>
                </>
              ) : (
                <>
                  <span>✅</span>
                  <span>
                    Draft saved{" "}
                    {lastSaved && `at ${lastSaved.toLocaleTimeString()}`}
                  </span>
                </>
              )}
            </div>
          )}

          {renderContent()}
          <Button
            className="px-6 py-6 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            onClick={handleSubmitForReview}
          >
            Submit for Review
          </Button>

          {submitError && (
            <div
              style={{
                color: "red",
                fontWeight: 600,
                marginTop: 18,
                textAlign: "center",
              }}
            >
              {submitError}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
