// components/UploadLecture/LectureContent/VideoUpload.jsx
import React, { useRef ,useState} from "react";

export default function VideoUpload({ onUpload }) {
    const ref = useRef(null);
    
  const [selectedFile, setSelectedFile] = useState(null);

    return (
        <div className="upload-box">
            <div className="upload-title">Upload Video</div>

            <button onClick={() => ref.current.click()} className="cb-btn">
                Select Video
            </button>

            <input
                type="file"
                accept="video/*"
                ref={ref}
                style={{ display: "none" }}
                onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            {/* Show confirmation UI */}
            {selectedFile && (
                <div className="upload-preview">
                    <p><strong>Selected:</strong> {selectedFile.name}</p>

                    <button
                        className="cb-btn small"
                        onClick={() => {
                            onUpload(selectedFile);
                            setSelectedFile(null);  // clear after upload
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
