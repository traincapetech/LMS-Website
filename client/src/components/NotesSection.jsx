import React, { useState, useEffect, useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { noteAPI } from "@/utils/api";
import { toast } from "sonner";

/**
 * NotesSection - Udemy-style notes component
 * Features:
 * - "Create a new note at X:XX" input with video timestamp
 * - React Quill rich text editor
 * - Character count (1000 limit)
 * - All lectures / Sort filters
 * - Edit/Delete functionality
 */
const NotesSection = ({ courseId, currentLecture, videoRef, curriculum = [] }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [noteContent, setNoteContent] = useState("");
    const [editingNote, setEditingNote] = useState(null);
    const [currentTimestamp, setCurrentTimestamp] = useState(0);
    const [saving, setSaving] = useState(false);

    // Filters
    const [lectureFilter, setLectureFilter] = useState("all");
    const [sortBy, setSortBy] = useState("recent");

    // Quill modules configuration
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['code-block'],
        ],
    }), []);

    const formats = [
        'header',
        'bold', 'italic',
        'list', 'bullet',
        'code-block'
    ];

    // Get all lectures from curriculum
    const allLectures = useMemo(() => {
        const lectures = [];
        curriculum?.forEach(section => {
            section.items?.forEach(item => {
                if (item.type === "lecture") {
                    lectures.push({
                        id: item._id || item.itemId,
                        title: item.title
                    });
                }
            });
        });
        return lectures;
    }, [curriculum]);

    // Format timestamp to MM:SS
    const formatTimestamp = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Update timestamp from video
    useEffect(() => {
        if (!videoRef?.current) return;

        const updateTime = () => {
            setCurrentTimestamp(Math.floor(videoRef.current.currentTime));
        };

        const video = videoRef.current;
        video.addEventListener("timeupdate", updateTime);

        return () => video.removeEventListener("timeupdate", updateTime);
    }, [videoRef]);

    // Fetch notes
    useEffect(() => {
        if (!courseId) return;
        fetchNotes();
    }, [courseId, lectureFilter, sortBy]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const params = {
                sortBy: sortBy === "recent" ? "createdAt" : "timestamp",
                order: "desc"
            };
            if (lectureFilter !== "all") {
                params.lectureId = lectureFilter;
            }
            const res = await noteAPI.getNotes(courseId, params);
            setNotes(res.data.notes || []);
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setLoading(false);
        }
    };

    // Get character count (plain text only)
    const getCharCount = () => {
        return noteContent.replace(/<[^>]*>/g, "").trim().length;
    };

    const charCount = getCharCount();
    const maxChars = 1000;

    // Open editor to create new note
    const openNewNote = () => {
        setEditingNote(null);
        setNoteContent("");
        setIsEditorOpen(true);
    };

    // Open editor to edit existing note
    const openEditNote = (note) => {
        setEditingNote(note);
        setNoteContent(note.content);
        setIsEditorOpen(true);
    };

    // Close editor
    const closeEditor = () => {
        setIsEditorOpen(false);
        setEditingNote(null);
        setNoteContent("");
    };

    // Save note
    const handleSave = async () => {
        if (charCount === 0) {
            toast.error("Note content cannot be empty");
            return;
        }
        if (charCount > maxChars) {
            toast.error(`Note cannot exceed ${maxChars} characters`);
            return;
        }

        setSaving(true);
        try {
            if (editingNote) {
                // Update existing note
                await noteAPI.updateNote(editingNote._id, noteContent);
                toast.success("Note updated successfully");
            } else {
                // Create new note
                await noteAPI.createNote({
                    courseId,
                    lectureId: currentLecture?._id || currentLecture?.itemId,
                    lectureTitle: currentLecture?.title || "",
                    content: noteContent,
                    timestamp: currentTimestamp
                });
                toast.success("Note created successfully");
            }
            closeEditor();
            fetchNotes();
        } catch (error) {
            console.error("Error saving note:", error);
            toast.error(error.response?.data?.message || "Failed to save note");
        } finally {
            setSaving(false);
        }
    };

    // Delete note
    const handleDelete = async (noteId) => {
        if (!confirm("Are you sure you want to delete this note?")) return;

        try {
            await noteAPI.deleteNote(noteId);
            toast.success("Note deleted successfully");
            fetchNotes();
        } catch (error) {
            console.error("Error deleting note:", error);
            toast.error("Failed to delete note");
        }
    };

    return (
        <div className="notes-section" style={{ padding: "20px 0" }}>
            {/* Create Note Input / Editor */}
            {!isEditorOpen ? (
                <div
                    onClick={openNewNote}
                    style={{
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        padding: "12px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        marginBottom: "16px"
                    }}
                >
                    <span style={{ color: "#6b7280" }}>
                        Create a new note at {formatTimestamp(currentTimestamp)}
                    </span>
                    <FaPlus style={{ color: "#6b7280" }} />
                </div>
            ) : (
                <div style={{
                    border: "2px solid #7e22ce",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    backgroundColor: "#fff"
                }}>
                    {/* Timestamp Badge & Editor Header */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px 16px",
                        gap: "12px"
                    }}>
                        <span style={{
                            backgroundColor: "#7e22ce",
                            color: "#fff",
                            padding: "4px 12px",
                            borderRadius: "4px",
                            fontSize: "14px",
                            fontWeight: "600"
                        }}>
                            {formatTimestamp(editingNote?.timestamp ?? currentTimestamp)}
                        </span>
                    </div>

                    {/* React Quill Editor */}
                    <div style={{ padding: "0 16px" }}>
                        <ReactQuill
                            theme="snow"
                            value={noteContent}
                            onChange={setNoteContent}
                            modules={modules}
                            formats={formats}
                            placeholder="Write your note here..."
                            style={{
                                backgroundColor: "#fff",
                                minHeight: "120px"
                            }}
                        />
                    </div>

                    {/* Character Count & Actions */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 16px",
                        borderTop: "1px solid #e5e7eb",
                        marginTop: "10px"
                    }}>
                        <span style={{
                            color: charCount > maxChars ? "#dc2626" : "#6b7280",
                            fontSize: "14px"
                        }}>
                            {charCount}/{maxChars}
                        </span>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                onClick={closeEditor}
                                style={{
                                    padding: "8px 20px",
                                    border: "none",
                                    background: "transparent",
                                    color: "#374151",
                                    cursor: "pointer",
                                    fontWeight: "600"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || charCount === 0 || charCount > maxChars}
                                style={{
                                    padding: "8px 24px",
                                    border: "none",
                                    borderRadius: "4px",
                                    backgroundColor: saving ? "#9ca3af" : "#7e22ce",
                                    color: "#fff",
                                    cursor: saving ? "not-allowed" : "pointer",
                                    fontWeight: "600"
                                }}
                            >
                                {saving ? "Saving..." : "Save note"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div style={{
                display: "flex",
                gap: "12px",
                marginBottom: "20px",
                flexWrap: "wrap"
            }}>
                <select
                    value={lectureFilter}
                    onChange={(e) => setLectureFilter(e.target.value)}
                    style={{
                        padding: "8px 16px",
                        border: "1px solid #1f2937",
                        borderRadius: "4px",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        fontWeight: "500"
                    }}
                >
                    <option value="all">All lectures</option>
                    {allLectures.map(lecture => (
                        <option key={lecture.id} value={lecture.id}>
                            {lecture.title}
                        </option>
                    ))}
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                        padding: "8px 16px",
                        border: "1px solid #1f2937",
                        borderRadius: "4px",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        fontWeight: "500"
                    }}
                >
                    <option value="recent">Sort by most recent</option>
                    <option value="timestamp">Sort by timestamp</option>
                </select>
            </div>

            {/* Notes List */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                    Loading notes...
                </div>
            ) : notes.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#6b7280",
                    fontSize: "14px"
                }}>
                    Click the "Create a new note" box, the "+" button, or press "B" to make your first note.
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {notes.map(note => (
                        <div
                            key={note._id}
                            style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                padding: "16px",
                                backgroundColor: "#fff"
                            }}
                        >
                            {/* Note Header */}
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: "12px"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <span style={{
                                        backgroundColor: "#7e22ce",
                                        color: "#fff",
                                        padding: "4px 10px",
                                        borderRadius: "4px",
                                        fontSize: "13px",
                                        fontWeight: "600"
                                    }}>
                                        {formatTimestamp(note.timestamp)}
                                    </span>
                                    {note.lectureTitle && (
                                        <span style={{ fontSize: "13px", color: "#6b7280" }}>
                                            {note.lectureTitle}
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <button
                                        onClick={() => openEditNote(note)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "#6b7280",
                                            padding: "4px"
                                        }}
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note._id)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "#dc2626",
                                            padding: "4px"
                                        }}
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>

                            {/* Note Content */}
                            <div
                                className="note-content"
                                dangerouslySetInnerHTML={{ __html: note.content }}
                                style={{
                                    fontSize: "14px",
                                    lineHeight: "1.6",
                                    color: "#374151"
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Styles */}
            <style>{`
        .notes-section .ql-container {
          border: none !important;
          font-size: 14px;
        }
        .notes-section .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          background: #f9fafb;
        }
        .notes-section .ql-editor {
          min-height: 100px;
        }
        .notes-section .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        .note-content p {
          margin: 0 0 8px 0;
        }
        .note-content ul, .note-content ol {
          margin: 0 0 8px 0;
          padding-left: 24px;
        }
        .note-content pre {
          background: #1f2937;
          color: #f9fafb;
          padding: 12px;
          border-radius: 4px;
          overflow-x: auto;
        }
      `}</style>
        </div>
    );
};

export default NotesSection;
