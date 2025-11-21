// useUpload.js
import axios from "axios";

const API_BASE = "http://localhost:5001";

const useUploads = (setSections, courseId) => {
  // courseId MUST be passed from Dashboard
  const token = localStorage.getItem("token");

  if (!courseId) {
    console.error("❌ useUploads ERROR: courseId is missing!");
  }

  // ------------------ UPLOAD VIDEO ------------------
  const uploadVideo = async (sectionId, itemId, file) => {
    if (!courseId) {
      console.error("❌ uploadVideo failed: courseId is undefined");
      return;
    }

    const form = new FormData();
    form.append("video", file);

    const res = await axios.post(
      `${API_BASE}/api/videos/upload/${courseId}`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const url = res.data.url;

    // update UI
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, videoUrl: url } : item
              ),
            }
          : section
      )
    );
  };

  // ------------------ UPLOAD DOCUMENT ------------------
  const uploadDocument = async (sectionId, itemId, file) => {
    if (!courseId) {
      console.error("❌ uploadDocument failed: courseId is undefined");
      return;
    }

    const form = new FormData();
    form.append("document", file);

    const res = await axios.post(
      `${API_BASE}/api/document/upload/${courseId}`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const fileData = {
      id: Date.now(),
      type: "document",
      filename: res.data.fileName,
      fileUrl: res.data.url,
    };

    // update UI
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      contents: [...(item.contents || []), fileData],
                    }
                  : item
              ),
            }
          : section
      )
    );
  };

  return { uploadVideo, uploadDocument };
};

export default useUploads;
