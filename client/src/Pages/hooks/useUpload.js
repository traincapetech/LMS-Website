// useUpload.js (updated)
import axios from "axios";
const API_BASE = "http://localhost:5001";

const useUploads = (setSections, courseId) => {
  const token = localStorage.getItem("token");

  const getInstructorId = () => {
    try {
      const tk = localStorage.getItem("token");
      if (!tk) return null;
      const payload = JSON.parse(atob(tk.split(".")[1]));
      return payload.id || payload._id || null;
    } catch (err) {
      console.error("Error decoding JWT:", err);
      return null;
    }
  };


const uploadThumbnail = async (file) => {
  try {
    if (!courseId) return;

    const form = new FormData();
    form.append("thumbnail", file);

    const res = await axios.post(
      `${API_BASE}/api/upload/thumbnail/${courseId}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`, // FIXED
        },
      }
    );

    return res.data.thumbnailUrl;
  } catch (err) {
    console.error("Thumbnail upload failed", err);
  }
};



  const uploadVideo = async (sectionId, itemId, file, progressCallback = () => { }) => {
    try {
      if (!courseId) { console.error("useUploads: courseId missing"); return; }

      const form = new FormData();
      form.append("video", file);
      form.append("title", file.name);
      form.append("duration", "0"); // if you have real duration compute it
      // optional: send sectionId/itemId for server-side bookkeeping (not required)
      form.append("sectionId", sectionId);
      form.append("itemId", itemId);

      const res = await axios.post(`${API_BASE}/api/upload/videos/${courseId}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          progressCallback(percent);
        }
      });

      const { videoId, url } = res.data;
      // Save both videoId and videoUrl into item in state
      setSections(prev =>
        prev.map(section =>
          section.id === sectionId
            ? {
              ...section,
              items: section.items.map(it =>
                it.id === itemId
                  ? { ...it, videoId, videoUrl: url, uploadProgress: 100, uploadComplete: true }
                  : it
              )
            }
            : section
        )
      );
    } catch (err) {
      console.error("Video upload failed", err);
      alert("Video upload failed - check console");
    }
  };

const uploadDocument = async (sectionId, itemId, file, progressCallback = () => {}) => {
  try {
    if (!courseId) return;

    const form = new FormData();
    form.append("file", file);

    const res = await axios.post(
      `${API_BASE}/api/upload/document/${courseId}/${sectionId}/${itemId}`,
      form,
      {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          progressCallback(percent);
        },
      }
    );

    const doc = res.data.document;

    // Update UI
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((it) =>
                it.id === itemId
                  ? { ...it, documents: [...(it.documents || []), doc] }
                  : it
              ),
            }
          : section
      )
    );
  } catch (err) {
    console.error("Document upload failed:", err);
  }
};


  return { uploadThumbnail, uploadVideo, uploadDocument };
};

export default useUploads;
