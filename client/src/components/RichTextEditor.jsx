import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

/**
 * RichTextEditor - Rich text editor using React Quill New (React 19 compatible)
 * Toolbar: Bold, Italic, Link, Image, Code
 * @param {string} value - Current HTML value
 * @param {function} onChange - Callback when text changes
 * @param {string} placeholder - Placeholder text
 */
const RichTextEditor = ({ value = "", onChange, placeholder = "Write your response" }) => {
    // Quill modules configuration
    const modules = {
        toolbar: [
            ['bold', 'italic'],
            ['link', 'image'],
            ['code-block'],
        ],
    };

    // Allowed formats
    const formats = [
        'bold', 'italic',
        'link', 'image',
        'code-block'
    ];

    return (
        <div className="rich-text-editor">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
            <style>{`
                .rich-text-editor .ql-container {
                    min-height: 100px;
                    font-size: 14px;
                }
                .rich-text-editor .ql-editor {
                    min-height: 100px;
                }
                .rich-text-editor .ql-toolbar {
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                    background: #f9fafb;
                }
                .rich-text-editor .ql-container {
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }
                .rich-text-editor .ql-editor.ql-blank::before {
                    color: #9ca3af;
                    font-style: normal;
                }
                .rich-text-editor:focus-within .ql-toolbar,
                .rich-text-editor:focus-within .ql-container {
                    border-color: #2563eb;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
