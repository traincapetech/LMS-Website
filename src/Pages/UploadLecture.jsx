import React, { useState } from "react";
import "./UploadLecture.css";

/* ICONS */
const Icon = {
    Chevron: ({ open }) => (
        <svg width="14" height="14" viewBox="0 0 24 24" className="icon">
            <path
                d={open ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    Edit: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" className="icon">
            <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
                fill="currentColor"
            />
        </svg>
    ),

    Delete: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" className="icon">
            <path
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                fill="currentColor"
            />
        </svg>
    ),

    Handle: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" className="handle">
            <path
                d="M3 7h18M3 12h18M3 17h18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    ),

    Plus: () => <span className="plus">+</span>,

    ContentIcon: ({ type }) => {
        if (type === "video")
            return (
                <svg width="44" height="28" viewBox="0 0 44 28">
                    <rect width="44" height="28" rx="4" fill="#f0f0f0" />
                    <path d="M18 9l8 5-8 5z" fill="#bdbdbd" />
                </svg>
            );

        if (type === "mashup")
            return (
                <svg width="44" height="28" viewBox="0 0 44 28">
                    <rect width="44" height="28" rx="4" fill="#f0f0f0" />
                    <rect x="8" y="8" width="12" height="4" fill="#d0d0d0" />
                    <rect x="8" y="14" width="28" height="4" fill="#bfbfbf" />
                </svg>
            );

        return (
            <svg width="44" height="28" viewBox="0 0 44 28">
                <rect width="44" height="28" rx="4" fill="#f0f0f0" />
                <rect x="9" y="7" width="12" height="14" fill="#ddd" />
            </svg>
        );
    },
};

/* UTILS */
function makeId(prefix = "id") {
    return (
        prefix +
        "_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).slice(2, 8)
    );
}

function initialData() {
    return [
        {
            id: makeId("section"),
            title: "Section 1: Introduction",
            published: true,
            items: [
                {
                    id: makeId("lec"),
                    type: "lecture",
                    title: "Lecture 1: Introduction",
                    expanded: true,
                    contents: [],
                },
                {
                    id: makeId("lec"),
                    type: "lecture",
                    title: "Lecture 2: dfgsf",
                    expanded: false,
                    contents: [],
                },
                {
                    id: makeId("quiz"),
                    type: "quiz",
                    title: "Quiz 1: javascript",
                    expanded: false,
                    questions: [],
                },
                {
                    id: makeId("quiz"),
                    type: "quiz",
                    title: "Quiz 2: sdf",
                    expanded: false,
                    questions: [],
                },
            ],
        },
        {
            id: makeId("section"),
            title: "Unpublished Section: dfsd",
            published: false,
            items: [],
        },
    ];
}

export default function UploadLecture() {
    const [sections, setSections] = useState(initialData());
    const videoInputs = {};

    /* CRUD FUNCTIONS */

    function addSection() {
        const newSection = {
            id: makeId("section"),
            title: "New Section",
            published: false,
            items: [],
        };
        setSections((prev) => [...prev, newSection]);
    }

    function editSection(sectionId, title) {
        setSections((prev) =>
            prev.map((s) => (s.id === sectionId ? { ...s, title } : s))
        );
    }

    function deleteSection(sectionId) {
        setSections((prev) => prev.filter((s) => s.id !== sectionId));
    }

    function addItem(sectionId, kind) {
        const newItem = {
            id: makeId(kind),
            type: kind,
            title: kind === "lecture" ? "New Lecture" : "New Quiz",
            expanded: false,
            contents: kind === "lecture" ? [] : undefined,
            questions: kind === "quiz" ? [] : undefined,
        };

        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
            )
        );
    }

    function editItem(sectionId, itemId, title) {
        setSections((prev) =>
            prev.map((s) => {
                if (s.id !== sectionId) return s;

                return {
                    ...s,
                    items: s.items.map((it) =>
                        it.id === itemId ? { ...it, title } : it
                    ),
                };
            })
        );
    }

    function deleteItem(sectionId, itemId) {
        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId
                    ? { ...s, items: s.items.filter((it) => it.id !== itemId) }
                    : s
            )
        );
    }

    function toggleExpand(sectionId, itemId) {
        setSections((prev) =>
            prev.map((s) => {
                if (s.id !== sectionId) return s;

                return {
                    ...s,
                    items: s.items.map((it) =>
                        it.id === itemId ? { ...it, expanded: !it.expanded } : it
                    ),
                };
            })
        );
    }

    function toggleSectionPublish(sectionId) {
        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId ? { ...s, published: !s.published } : s
            )
        );
    }

    function setContentType(sectionId, itemId, contentType) {
        setSections((prev) =>
            prev.map((s) => {
                if (s.id !== sectionId) return s;

                return {
                    ...s,
                    items: s.items.map((it) => {
                        if (it.id !== itemId) return it;

                        const newContents = [
                            ...(it.contents || []),
                            { id: makeId("content"), type: contentType },
                        ];

                        return { ...it, contents: newContents, expanded: true };
                    }),
                };
            })
        );
    }

    function addQuestion(sectionId, itemId) {
        setSections((prev) =>
            prev.map((s) => {
                if (s.id !== sectionId) return s;

                return {
                    ...s,
                    items: s.items.map((it) => {
                        if (it.id !== itemId) return it;

                        const newQs = [
                            ...(it.questions || []),
                            { id: makeId("q"), text: "New question" },
                        ];

                        return { ...it, questions: newQs, expanded: true };
                    }),
                };
            })
        );
    }

    function handleVideoUpload(sectionId, itemId, e) {
        const file = e.target.files[0];
        if (!file) return;

        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId
                    ? {
                        ...s,
                        items: s.items.map((it) =>
                            it.id === itemId
                                ? {
                                    ...it,
                                    contents: [
                                        ...it.contents,
                                        {
                                            id: makeId("content"),
                                            type: "video",
                                            filename: file.name,
                                            file,
                                        },
                                    ],
                                }
                                : it
                        ),
                    }
                    : s
            )
        );
    }



    /* UI */

    return (
        <div className="cb-root">
            {sections.map((section) => (
                <div className="cb-section" key={section.id}>
                    {/* SECTION HEADER */}
                    <div className="cb-section-header">
                        <div className="cb-section-title">

                            <strong>{section.title}</strong>

                            {/* EDIT SECTION */}
                            <span
                                className="cb-icon"
                                onClick={() => {
                                    const name = prompt("Enter new section name:", section.title);
                                    if (name?.trim()) editSection(section.id, name);
                                }}
                            >
                                <Icon.Edit />
                            </span>

                            {/* DELETE SECTION */}
                            <span
                                className="cb-icon"
                                onClick={() => {
                                    if (window.confirm("Delete this section?"))
                                        deleteSection(section.id);
                                }}
                            >
                                <Icon.Delete />
                            </span>

                            <span
                                className={`cb-publish ${section.published ? "published" : "unpublished"
                                    }`}
                            >
                                {section.published ? "Published" : "Unpublished"}
                            </span>
                        </div>

                        <button
                            className="cb-btn small"
                            onClick={() => toggleSectionPublish(section.id)}
                        >
                            {section.published ? "Unpublish" : "Publish"}
                        </button>
                    </div>

                    {/* SECTION BODY */}
                    <div className="cb-section-body">
                        {section.items.map((item) => (
                            <div className="cb-item" key={item.id}>
                                <div className="cb-item-top">

                                    {/* LEFT */}
                                    <div className="cb-item-left">
                                        <Icon.Handle />

                                        <div className="cb-item-title">
                                            <span className="cb-type">
                                                {item.type === "lecture" ? "Lecture" : "Quiz"}:
                                            </span>

                                            <span className="cb-title-text">{item.title}</span>

                                            {/* EDIT ITEM */}
                                            <span
                                                className="cb-icon"
                                                onClick={() => {
                                                    const title = prompt("Enter new title:", item.title);
                                                    if (title?.trim())
                                                        editItem(section.id, item.id, title);
                                                }}
                                            >
                                                <Icon.Edit />
                                            </span>

                                            {/* DELETE ITEM */}
                                            <span
                                                className="cb-icon"
                                                onClick={() => {
                                                    if (window.confirm("Delete this item?"))
                                                        deleteItem(section.id, item.id);
                                                }}
                                            >
                                                <Icon.Delete />
                                            </span>
                                        </div>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="cb-item-actions">
                                        {item.type === "lecture" && (
                                            <button
                                                className="cb-btn small outlined"
                                                onClick={() => toggleExpand(section.id, item.id)}
                                            >
                                                + Content
                                            </button>
                                        )}

                                        {item.type === "quiz" && (
                                            <button
                                                className="cb-btn small"
                                                onClick={() => addQuestion(section.id, item.id)}
                                            >
                                                + Questions
                                            </button>
                                        )}

                                        <button
                                            className="cb-icon"
                                            onClick={() => toggleExpand(section.id, item.id)}
                                        >
                                            <Icon.Chevron open={item.expanded} />
                                        </button>
                                    </div>
                                </div>

                                {/* EXPANDED CONTENT */}
                                {item.expanded && item.type === "lecture" && (
                                    <div className="cb-content-panel">
                                        <div className="cb-content-hint">
                                            Select the main type of content.
                                        </div>

                                        {/* <div className="cb-content-types">
                      <div
                        className="cb-content-type"
                        onClick={() =>
                          setContentType(section.id, item.id, "video")
                        }
                      >
                        <Icon.ContentIcon type="video" />
                        <div className="cb-ct-label">Video</div>
                      </div>
                    </div> */}

                                        <div className="cb-content-types">
                                            <div
                                                className="cb-content-type"
                                                onClick={() => videoInputs[item.id].click()}
                                            >
                                                <Icon.ContentIcon type="video" />
                                                <div className="cb-ct-label">Video</div>
                                            </div>

                                            <input
                                                type="file"
                                                accept="video/*"
                                                ref={(el) => (videoInputs[item.id] = el)}
                                                style={{ display: "none" }}
                                                onChange={(e) => handleVideoUpload(section.id, item.id, e)}
                                            />
                                        </div>


                                        {item.contents?.length > 0 && (
                                            <div className="cb-contents-list">
                                                {item.contents.map((c) => (
                                                    <div className="cb-content-row" key={c.id}>
                                                        <span className="cb-content-dot" /> {c.type}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* QUIZ PANEL */}
                                {item.expanded && item.type === "quiz" && (
                                    <div className="cb-content-panel">
                                        <div className="cb-content-hint">Quiz questions:</div>

                                        {(item.questions || []).map((q) => (
                                            <div className="cb-question" key={q.id}>
                                                {q.text}
                                            </div>
                                        ))}

                                        <button
                                            className="cb-btn small"
                                            onClick={() => addQuestion(section.id, item.id)}
                                        >
                                            + Add question
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* ADD ITEMS */}
                        <div className="cb-add-row">
                            <button
                                className="cb-btn"
                                onClick={() => addItem(section.id, "lecture")}
                            >
                                <Icon.Plus /> Lecture
                            </button>
                            <button
                                className="cb-btn ghost"
                                onClick={() => addItem(section.id, "quiz")}
                            >
                                + Quiz
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* ADD SECTION */}
            <div className="cb-footer-actions">
                <button className="cb-btn primary" onClick={addSection}>
                    + Section
                </button>
            </div>
            <div className="cb-footer-actions">

            </div>
        </div>
    );
}
