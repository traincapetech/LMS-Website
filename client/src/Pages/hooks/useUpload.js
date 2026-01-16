// useUpload.js (updated)
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "https://lms-backend-5s5x.onrender.com/api";

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
        `${API_BASE}/upload/thumbnail/${courseId}`,
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

  const uploadVideo = async (
    sectionId,
    itemId,
    file,
    progressCallback = () => {}
  ) => {
    try {
      if (!courseId) {
        console.error("useUploads: courseId missing");
        return;
      }

      const form = new FormData();
      form.append("video", file);
      form.append("title", file.name);
      form.append("duration", "0"); // if you have real duration compute it
      // optional: send sectionId/itemId for server-side bookkeeping (not required)
      form.append("sectionId", sectionId);
      form.append("itemId", itemId);

      const res = await axios.post(
        `${API_BASE}/upload/videos/${courseId}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            progressCallback(percent);
          },
        }
      );

      // Validate response structure
      if (!res.data || !res.data.videoId || !res.data.url) {
        console.error("❌ Invalid upload response:", res.data);
        throw new Error("Invalid response from server - missing videoId or url");
      }

      const { videoId, url } = res.data;
      console.log("✅ Video upload successful:", { videoId, url });
      
      // Save both videoId and videoUrl into item in state
      setSections((prev) =>
        prev.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                items: section.items.map((it) =>
                  it.id === itemId
                    ? {
                        ...it,
                        videoId,
                        videoUrl: url,
                        uploadProgress: 100,
                        uploadComplete: true,
                      }
                    : it
                ),
              }
            : section
        )
      );
    } catch (err) {
      // Only show error if it's actually an upload error, not a 404 from a different request
      if (err.response?.status === 404 && !err.config?.url?.includes('/upload/')) {
        console.warn("⚠️ 404 error from non-upload route (may be unrelated):", err.config?.url);
        // Don't show alert for unrelated 404s
        return;
      }
      
      console.error("❌ Video upload failed", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Video upload failed";
      console.error("Error details:", {
        status: err.response?.status,
        url: err.config?.url,
        data: err.response?.data,
        message: errorMessage,
      });
      
      // Only alert if it's actually an upload error
      if (err.config?.url?.includes('/upload/')) {
        alert(`Video upload failed: ${errorMessage}`);
      }
    }
  };

  const uploadDocument = async (
    sectionId,
    itemId,
    file,
    progressCallback = () => {}
  ) => {
    try {
      if (!courseId) {
        console.error("❌ uploadDocument: courseId is missing!");
        return;
      }

      console.log("📤 Starting document upload:", {
        courseId,
        sectionId,
        itemId,
        fileName: file.name,
        fileSize: file.size,
      });

      const form = new FormData();
      form.append("file", file);

      const res = await axios.post(
        `${API_BASE}/upload/document/${courseId}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            progressCallback(percent);
          },
        }
      );

      // Validate response structure
      if (!res.data || !res.data.document) {
        console.error("❌ Invalid document upload response:", res.data);
        throw new Error("Invalid response from server - missing document");
      }

      const doc = res.data.document;
      console.log("✅ Document uploaded successfully:", doc);

      // Update UI
      setSections((prev) => {
        console.log("🔄 Updating sections state. Current sections:", prev);

        const updated = prev.map((section) => {
          // Match by both id and _id to handle inconsistencies
          const sectionMatches =
            String(section.id) === String(sectionId) ||
            String(section._id) === String(sectionId);

          if (sectionMatches) {
            console.log("✓ Found matching section:", section.id || section._id);

            return {
              ...section,
              items: section.items.map((it) => {
                // Match by both id and _id
                const itemMatches =
                  String(it.id) === String(itemId) ||
                  String(it._id) === String(itemId);

                if (itemMatches) {
                  console.log("✓ Found matching item:", it.id || it._id);
                  console.log("  Current documents:", it.documents);
                  const newDocuments = [...(it.documents || []), doc];
                  console.log("  Updated documents:", newDocuments);

                  return { ...it, documents: newDocuments };
                }
                return it;
              }),
            };
          }
          return section;
        });

        console.log("🔄 Updated sections:", updated);
        return updated;
      });

      console.log("✅ Document upload complete!");
    } catch (err) {
      // Only show error if it's actually an upload error, not a 404 from a different request
      if (err.response?.status === 404 && !err.config?.url?.includes('/upload/')) {
        console.warn("⚠️ 404 error from non-upload route (may be unrelated):", err.config?.url);
        // Don't show error for unrelated 404s
        return;
      }
      
      console.error("❌ Document upload failed:", err);
      console.error("Error details:", {
        status: err.response?.status,
        url: err.config?.url,
        data: err.response?.data || err.message,
      });
      
      // Only alert if it's actually an upload error
      if (err.config?.url?.includes('/upload/')) {
        alert(`Document upload failed: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  return { uploadThumbnail, uploadVideo, uploadDocument };
};

export default useUploads;
