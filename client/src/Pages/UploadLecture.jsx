import { useState } from "react";
import "./UploadLecture.css";

import initialData from "./initialData";
import useSections from "../Pages/hooks/useSection";
import useUploads from "../Pages/hooks/useUpload";
import useQuiz from "../Pages/hooks/useQuiz";

import VideoUpload from "./VideoUpload";
import DocumentUpload from "./DocumentUpload";
import QuizPage from "./QuizPage";

export default function UploadLecture() {

    /* ----------------------------------------
       INLINE ICONS
    ---------------------------------------- */
    const Icon = {
        Edit: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>

        ),

        Delete: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V3h6v3" />
            </svg>

        ),

        ChevronDown: (
            <svg width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l4 4 4-4" />
            </svg>
        ),

        ChevronUp: (
            <svg width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 13l4-4 4 4" />
            </svg>
        ),

        // Publish: (
        //     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
        //         strokeLinecap="round" strokeLinejoin="round">
        //         <path d="M5 8l4-4 4 4M9 4v8" />
        //     </svg>
        // ),

        Unpublish: (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l8 8M12 4L4 12" />
            </svg>
        ),

        Plus: (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v10M3 8h10" />
            </svg>
        ),
    };


    /* ----------------------------------------
       HOOK STATES
    ---------------------------------------- */
    const {
        sections,
        addSection,
        editSection,
        deleteSection,
        toggleSectionPublish,
        addItem,
        editItem,
        deleteItem,
        toggleExpand,
        setSections,
    } = useSections(initialData);

    const uploads = useUploads(setSections);
    const quiz = useQuiz(setSections);

    // inline editing
    const [editingSection, setEditingSection] = useState(null);
    const [editingItem, setEditingItem] = useState(null);


    /* ----------------------------------------
       MAIN UI
    ---------------------------------------- */
    return (
        <div className="upload-container">

            {sections.map((section) => (
                <div key={section.id} className="section-block">

                    {/* ----------------------------
              SECTION HEADER
          ---------------------------- */}
                    <div className="section-header">

                        {/* INLINE EDIT SECTION TITLE */}
                        {editingSection === section.id ? (
                            <input
                                className="inline-input"
                                autoFocus
                                defaultValue={section.title}
                                onBlur={(e) => {
                                    editSection(section.id, e.target.value.trim());
                                    setEditingSection(null);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        editSection(section.id, e.target.value.trim());
                                        setEditingSection(null);
                                    }
                                }}
                            />
                        ) : (
                            <strong>{section.title}</strong>
                        )}

                        <div className="header-actions">

                            {/* EDIT ICON */}
                            <button className="icon-btn" onClick={() => setEditingSection(section.id)}>
                                {Icon.Edit}
                            </button>

                            {/* DELETE */}
                            <button className="icon-btn danger" onClick={() => deleteSection(section.id)}>
                                {Icon.Delete}
                            </button>

                            {/* PUBLISH */}
                            <button className="icon-btn" onClick={() => toggleSectionPublish(section.id)}>
                                {section.published ? "Publish" :"Unpublish" }
                            </button>

                        </div>
                    </div>


                    {/* ----------------------------
              ITEMS INSIDE SECTION
          ---------------------------- */}
                    {section.items.map((item) => (
                        <div key={item.id} className="item-block">

                            <div className="item-header">

                                {/* INLINE EDIT ITEM TITLE */}
                                {editingItem === item.id ? (
                                    <input
                                        className="inline-input"
                                        autoFocus
                                        defaultValue={item.title}
                                        onBlur={(e) => {
                                            editItem(section.id, item.id, e.target.value.trim());
                                            setEditingItem(null);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                editItem(section.id, item.id, e.target.value.trim());
                                                setEditingItem(null);
                                            }
                                        }}
                                    />
                                ) : (
                                    <span>{item.type.toUpperCase()}: {item.title}</span>
                                )}

                                <div className="item-actions">

                                    {/* EDIT ITEM */}
                                    <button className="icon-btn" onClick={() => setEditingItem(item.id)}>
                                        {Icon.Edit}
                                    </button>

                                    {/* DELETE ITEM */}
                                    <button className="icon-btn danger" onClick={() => deleteItem(section.id, item.id)}>
                                        {Icon.Delete}
                                    </button>

                                    {/* EXPAND / COLLAPSE */}
                                    <button className="icon-btn" onClick={() => toggleExpand(section.id, item.id)}>
                                        {item.expanded ? Icon.ChevronUp : Icon.ChevronDown}
                                    </button>

                                </div>
                            </div>


                            {/* ----------------------------
                  ITEM CONTENT
              ---------------------------- */}
                            {item.expanded && (
                                <div className="item-content">

                                    {/* LECTURE CONTENT */}
                                    {item.type === "lecture" && (
                                        <>
                                            <VideoUpload
                                                onUpload={(file) => uploads.uploadVideo(section.id, item.id, file)}
                                            />

                                            <DocumentUpload
                                                onUpload={(file) => uploads.uploadDocument(section.id, item.id, file)}
                                            />

                                            {item.contents?.length > 0 && (
                                                <ul className="content-list">
                                                    {item.contents.map((c) => (
                                                        <li key={c.id}>{c.type} — {c.filename}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    )}

                                    {/* QUIZ CONTENT */}
                                    {item.type === "quiz" && (
                                        <QuizPage
                                            sectionId={section.id}
                                            itemId={item.id}
                                            questions={item.questions}
                                            quiz={quiz}
                                        />
                                    )}

                                </div>
                            )}

                        </div>
                    ))}


                    {/* ----------------------------
              ADD LECTURE + QUIZ BUTTONS
          ---------------------------- */}
                    <div className="add-buttons">
                        <button className="cb-btn small" onClick={() => addItem(section.id, "lecture")}>
                            {Icon.Plus} Lecture
                        </button>

                        <button className="cb-btn small" onClick={() => addItem(section.id, "quiz")}>
                            {Icon.Plus} Quiz
                        </button>
                    </div>

                </div>
            ))}


            {/* ----------------------------
          ADD SECTION BUTTON
      ---------------------------- */}
            <button className="add-section-btn" onClick={addSection}>
                {Icon.Plus} Add Section
            </button>

        </div>
    );
}
