// useUpload.js
import axios from "axios";

const API_BASE = "http://localhost:5001";

const useUploads = (setSections, courseId) => {
  const token = localStorage.getItem("token");

  if (!courseId) {
    console.error("❌ useUploads ERROR: courseId missing!");
  }

  // ------------------ DECODE INSTRUCTOR FROM JWT ------------------
  const getInstructorId = () => {
    try {
      const tk = localStorage.getItem("token");
      if (!tk) return null;

      const payload = JSON.parse(atob(tk.split(".")[1]));
      console.log("🔍 JWT Payload Decoded:", payload);

      return payload.id || payload._id || null;
    } catch (err) {
      console.error("❌ Error decoding JWT:", err);
      return null;
    }
  };

  // ---------------------------------------------------------
  //  VIDEO UPLOAD WITH PROGRESS
  // ---------------------------------------------------------
  const uploadVideo = async (sectionId, itemId, file, progressCallback = () => {}) => {
    try {
      if (!courseId) {
        console.error("❌ uploadVideo failed: courseId missing");
        return;
      }

      console.log("🎬 Uploading VIDEO:", file.name);
      console.log("➡️ sectionId:", sectionId, "itemId:", itemId);

      const instructorId = getInstructorId();

      const form = new FormData();
      form.append("video", file);
      form.append("title", file.name);
      form.append("duration", "0");
      form.append("instructor", instructorId);

      console.log("📤 Sending video upload request...");

      const res = await axios.post(
        `${API_BASE}/api/videos/upload/${courseId}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            console.log(`📡 Video Upload Progress: ${percent}%`);
            progressCallback(percent);
          }
        }
      );

      console.log("✅ Video upload response:", res.data);

      const url = res.data?.url;

      // Update React state with video URL
      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                items: section.items.map((item) =>
                  item.id === itemId ? { ...item, videoUrl: url, uploadProgress: 100 } : item
                ),
              }
            : section
        )
      );

    } catch (err) {
      console.error("❌ Video upload FAILED:", err);
      if (err.response) {
        console.error("❌ Server Response:", err.response.data);
      }
      alert("Video upload failed — check console for details.");
    }
  };

  // ---------------------------------------------------------
  //  DOCUMENT UPLOAD WITH PROGRESS
  // ---------------------------------------------------------
// ------------------ UPLOAD DOCUMENT ------------------
const uploadDocument = async (sectionId, itemId, file, progressCallback = () => {}) => {
  try {
    if (!courseId) {
      console.error("❌ uploadDocument failed: courseId missing");
      return;
    }

    console.log("📄 Uploading DOCUMENT:", file.name);

    const form = new FormData();
    form.append("file", file); // ⭐ FIXED HERE

    const res = await axios.post(
      `${API_BASE}/api/document/upload/${courseId}`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          console.log(`📡 Document Upload Progress: ${percent}%`);
          progressCallback(percent);
        }
      }
    );

    console.log("✅ Document upload response:", res.data);

    const docData = {
      id: Date.now(),
      type: "document",
      filename: res.data.document.fileName,
      fileUrl: res.data.document.fileUrl,
    };

    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((it) =>
                it.id === itemId
                  ? {
                      ...it,
                      contents: [...(it.contents || []), docData],
                      docProgress: 100,
                      docFileName: file.name,
                      docComplete: true
                    }
                  : it
              ),
            }
          : section
      )
    );

  } catch (err) {
    console.error("❌ Document upload FAILED:", err);
    if (err.response) console.error("❌ Server Response:", err.response.data);
    alert("Document upload failed — check your backend logs.");
  }
};


  // ---------------------------------------------------------
  return { uploadVideo, uploadDocument };
};

export default useUploads;
