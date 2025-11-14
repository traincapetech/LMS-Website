import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

// Worker for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const ResourceView = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const fileUrl = location.state?.fileUrl;
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Default scale
  const scale = 0.9;

  useEffect(() => {
    renderPDF();
  }, [fileUrl]);

  const renderPDF = async () => {
    if (!fileUrl) return;

    setLoading(true);
    const container = containerRef.current;
    container.innerHTML = "";

    try {
      const pdf = await pdfjsLib.getDocument(fileUrl).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const viewport = page.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.borderRadius = "6px";

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        container.appendChild(canvas);
      }
    } catch (error) {
      console.error("Error rendering PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  // Download PDF
 // Download PDF directly (no new tab)
const handleDownload = async () => {
  try {
    const response = await fetch(fileUrl, { mode: "cors" });
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileUrl.split("/").pop() || "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Direct download failed:", error);
  }
};

  if (!fileUrl) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>❌ File URL Missing</h2>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 20px",
            background: "#7e22ce",
            color: "#fff",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            marginTop: 20,
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#111",
          color: "#fff",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FaArrowLeft
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer", fontSize: 18 }}
          />
          <h3 style={{ margin: 0 }}>Resource</h3>
        </div>

        <FaDownload
          onClick={handleDownload}
          style={{ cursor: "pointer", fontSize: 20 }}
          title="Download PDF"
        />
      </div>

      {/* PDF Pages */}
      <div
        ref={containerRef}
         className="pdf-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "20px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          alignItems: "center",
        }}
      ></div>

      {loading && (
        <p style={{ textAlign: "center", padding: 20 }}>Loading PDF...</p>
      )}
    </div>
  );
};

export default ResourceView;
