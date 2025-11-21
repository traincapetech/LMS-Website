// components/UploadLecture/LectureContent/DocumentUpload.jsx
import React, { useRef, useState } from "react";

export default function DocumentUpload({ onUpload }) {
    const ref = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <div className="upload-box">
            <div className="upload-title">Upload Document</div>

            <button className="cb-btn" onClick={() => ref.current.click()}>
                Select Document
            </button>

            <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.txt,.csv"
                ref={ref}
                style={{ display: "none" }}
                onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            {selectedFile && (
                <div className="upload-preview">
                    <p><strong>Selected:</strong> {selectedFile.name}</p>

                    <button
                        className="cb-btn small"
                        onClick={() => {
                            onUpload(selectedFile);
                            setSelectedFile(null);
                        }}
                    >
                        Submit Upload
                    </button>

                    <button
                        className="cb-btn small danger"
                        onClick={() => setSelectedFile(null)}
                    >
                        Cancel
                    </button>
                </div>
            )}


        </div>
    );
}
