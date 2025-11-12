import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

// ✅ Local worker for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const ResourceView = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const fileUrl = location.state?.fileUrl;
  const [pdfText, setPdfText] = useState("Loading PDF content...");

  useEffect(() => {
    const extractPdfText = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(fileUrl).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str).join(" ");
          fullText += strings + "\n\n";
        }

        setPdfText(fullText || "No text found in PDF.");
      } catch (error) {
        console.error("Error extracting PDF text:", error);
        setPdfText("❌ Unable to extract content from PDF.");
      }
    };

    if (fileUrl) extractPdfText();
  }, [fileUrl]);

  // ✨ Format extracted text into readable HTML
  const formatText = (text) => {
    // Highlight filenames like "1. authRoutes.js"
    let formatted = text.replace(
      /(\d+\.\s*[A-Za-z0-9_-]+\.js)/g,
      '<h3 style="color:#7e22ce;margin-top:16px;font-weight:700;">📘 $1</h3>'
    );

    // Highlight HTTP methods (GET, POST, PUT, DELETE)
    formatted = formatted.replace(
      /\b(GET|POST|PUT|DELETE|PATCH)\b/g,
      '<span style="color:#16a34a;font-weight:600;">$1</span>'
    );

    // Highlight words like "Features:" or "Purpose:"
    formatted = formatted.replace(
      /\b(Features|Purpose|Security|Helper Function|Validation|Example|Response|Request)\b:/g,
      '<span style="color:#2563eb;font-weight:600;">$1:</span>'
    );

    // Convert newlines to paragraphs
    formatted = formatted
      .split("\n")
      .map((line) => `<p style="margin:8px 0;line-height:1.7;">${line.trim()}</p>`)
      .join("");

    return formatted;
  };

  if (!fileUrl) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#555" }}>
        <h2>❌ Resource Not Found</h2>
        <p>The file link is missing or invalid.</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "6px",
            background: "#7e22ce",
            color: "#fff",
            border: "none",
            cursor: "pointer",
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
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#111",
          color: "#fff",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <FaArrowLeft
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer", fontSize: "18px" }}
        />
        <h3 style={{ margin: 0, fontWeight: "600" }}>Resource Content</h3>
      </div>

      {/* Formatted PDF text */}
      <div
        style={{
          flex: 1,
          padding: "30px 60px",
          overflowY: "auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          margin: "20px auto",
          width: "85%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          fontFamily: "Inter, sans-serif",
          color: "#1f2937",
        }}
        dangerouslySetInnerHTML={{ __html: formatText(pdfText) }}
      />
    </div>
  );
};

export default ResourceView;
