import React, { useState, useEffect } from "react";
import {
    FaSearch,
    FaChevronUp,
    FaComment,
    FaEye,
    FaStar,
    FaArrowLeft,
    FaFilter,
    FaChevronDown,
    FaEdit,
} from "react-icons/fa";
import { questionAPI } from "@/utils/api";
import { toast } from "sonner";
import RichTextEditor from "./RichTextEditor";

// Helper to decode HTML entities (moved outside component for QuestionCard access)
const decodeHtmlEntities = (text) => {
    if (!text) return "";
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return textarea.value;
};


/**
 * QnASection - Main Q&A component for course lectures
 * Shows featured questions, all questions, and allows asking new questions
 */
const QnASection = ({ courseId, currentLecture }) => {
    // State
    const [view, setView] = useState("list"); // "list" | "detail" | "ask"
    const [questions, setQuestions] = useState([]);
    const [featuredQuestions, setFeaturedQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [filter, setFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(0);

    // New question form
    const [newTitle, setNewTitle] = useState("");
    const [newBody, setNewBody] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Reply form
    const [replyBody, setReplyBody] = useState("");

    // Edit state
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editBody, setEditBody] = useState("");

    // Fetch questions
    useEffect(() => {
        if (courseId) {
            loadQuestions();
            loadFeaturedQuestions();
        }
    }, [courseId, search, sortBy, filter, page]);

    const loadQuestions = async () => {
        try {
            setLoading(true);
            const res = await questionAPI.getQuestions(courseId, {
                search,
                sortBy,
                filter,
                page,
                limit: 10,
            });
            setQuestions(res.data.questions || []);
            setTotalPages(res.data.pagination?.pages || 1);
            setTotalQuestions(res.data.pagination?.total || 0);
        } catch (err) {
            console.error("Load questions error:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadFeaturedQuestions = async () => {
        try {
            const res = await questionAPI.getFeatured(courseId);
            setFeaturedQuestions(res.data.questions || []);
        } catch (err) {
            console.error("Load featured questions error:", err);
        }
    };

    const handleViewQuestion = async (question) => {
        try {
            const res = await questionAPI.getQuestion(question._id);
            setSelectedQuestion(res.data.question);
            setView("detail");
        } catch (err) {
            toast.error("Failed to load question");
        }
    };

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) {
            toast.error("Please enter a question title");
            return;
        }

        setSubmitting(true);
        try {
            await questionAPI.createQuestion({
                courseId,
                title: newTitle,
                body: newBody,
                lectureId: currentLecture?._id || null,
                lectureTitle: currentLecture?.title || null,
            });
            toast.success("Question posted!");
            setNewTitle("");
            setNewBody("");
            setView("list");
            loadQuestions();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to post question");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddReply = async () => {
        if (!replyBody.trim()) {
            toast.error("Please enter a reply");
            return;
        }

        try {
            const res = await questionAPI.addReply(selectedQuestion._id, replyBody);
            setSelectedQuestion((prev) => ({
                ...prev,
                replies: [...prev.replies, res.data.reply],
                replyCount: res.data.replyCount,
            }));
            setReplyBody("");
            toast.success("Reply added!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add reply");
        }
    };

    const handleUpvoteQuestion = async (questionId) => {
        try {
            const res = await questionAPI.upvoteQuestion(questionId);
            // Update in list
            setQuestions((prev) =>
                prev.map((q) =>
                    q._id === questionId ? { ...q, upvoteCount: res.data.upvoteCount } : q
                )
            );
            // Update selected if viewing
            if (selectedQuestion?._id === questionId) {
                setSelectedQuestion((prev) => ({
                    ...prev,
                    upvoteCount: res.data.upvoteCount,
                }));
            }
        } catch (err) {
            toast.error("Please login to upvote");
        }
    };

    // Handle edit question
    const handleEditQuestion = (question) => {
        setEditingQuestion(question);
        setEditTitle(question.title);
        setEditBody(question.body || "");
        setView("edit");
    };

    // Get current user from localStorage
    const getCurrentUserId = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return user?._id || user?.id || null;
        } catch {
            return null;
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        if (days < 365) return `${Math.floor(days / 30)} months ago`;
        return `${Math.floor(days / 365)} years ago`;
    };

    // RENDER: Question List View
    const renderListView = () => (
        <div className="p-4 max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search all course questions"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <FaSearch />
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Filters:</span>
                    <select
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
                        defaultValue="all"
                    >
                        <option value="all">All lectures</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
                    >
                        <option value="recent">Most recent</option>
                        <option value="popular">Most upvoted</option>
                    </select>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
                    >
                        Filter questions
                        <FaChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                    {showFilters && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-[280px]">
                            {[
                                { value: "all", label: "All questions" },
                                { value: "following", label: "Questions I'm following" },
                                { value: "asked", label: "Questions I asked" },
                                { value: "unanswered", label: "Questions without responses" },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        setFilter(opt.value);
                                        setShowFilters(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${filter === opt.value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Featured Questions */}
            {featuredQuestions.length > 0 && (
                <div className="mb-8">
                    <h3 className="font-semibold text-gray-900 mb-3">
                        Featured questions in this course ({featuredQuestions.length})
                    </h3>
                    <div className="space-y-3">
                        {featuredQuestions.map((q) => (
                            <QuestionCard
                                key={q._id}
                                question={q}
                                onView={() => handleViewQuestion(q)}
                                onUpvote={() => handleUpvoteQuestion(q._id)}
                                formatDate={formatDate}
                                featured
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* All Questions */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                    All questions in this course ({totalQuestions})
                </h3>
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading questions...</div>
                ) : questions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No questions yet. Be the first to ask!
                    </div>
                ) : (
                    <div className="space-y-3">
                        {questions.map((q) => (
                            <QuestionCard
                                key={q._id}
                                question={q}
                                onView={() => handleViewQuestion(q)}
                                onUpvote={() => handleUpvoteQuestion(q._id)}
                                formatDate={formatDate}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page >= totalPages}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            See more
                        </button>
                    </div>
                )}
            </div>

            {/* Ask Question Button */}
            <div className="mt-8 pt-4 border-t flex items-center gap-4">
                <button
                    onClick={() => setView("ask")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Ask a new question
                </button>
            </div>
        </div>
    );

    // RENDER: Question Detail View
    const renderDetailView = () => {
        if (!selectedQuestion) return null;

        return (
            <div className="p-4 max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => setView("list")}
                    className="flex items-center gap-2 text-blue-600 mb-4 hover:underline"
                >
                    <FaArrowLeft /> Back to All Questions
                </button>

                {/* Question */}
                <div className="mb-6">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                            {selectedQuestion.author?.profilePhoto ? (
                                <img
                                    src={selectedQuestion.author.profilePhoto}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                                    {selectedQuestion.author?.name?.[0] || "?"}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {selectedQuestion.title}
                            </h2>
                            <div className="text-sm text-gray-500 mt-1">
                                {selectedQuestion.author?.name} •{" "}
                                {selectedQuestion.lectureTitle && (
                                    <span className="text-blue-600">
                                        {selectedQuestion.lectureTitle} •{" "}
                                    </span>
                                )}
                                {formatDate(selectedQuestion.createdAt)}
                            </div>
                            {selectedQuestion.body && (
                                <div
                                    className="mt-3 text-gray-700 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: selectedQuestion.body }}
                                />
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {getCurrentUserId() === selectedQuestion.author?._id && (
                                <button
                                    onClick={() => handleEditQuestion(selectedQuestion)}
                                    className="p-2 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600"
                                    title="Edit question"
                                >
                                    <FaEdit />
                                </button>
                            )}
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-sm text-gray-500">
                                    {selectedQuestion.upvoteCount}
                                </span>
                                <button
                                    onClick={() => handleUpvoteQuestion(selectedQuestion._id)}
                                    className="p-2 hover:bg-gray-100 rounded"
                                >
                                    <FaChevronUp className="text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Replies Header */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">
                        {selectedQuestion.replyCount} replies
                    </span>
                    <button className="text-blue-600 hover:underline text-sm">
                        Follow replies
                    </button>
                </div>

                {/* Replies List */}
                <div className="space-y-4 mb-6">
                    {selectedQuestion.replies?.map((reply, idx) => (
                        <div
                            key={reply._id || idx}
                            className={`flex items-start gap-3 p-4 rounded-lg ${reply.isInstructor ? "bg-blue-50 border border-blue-200" : "bg-gray-50"
                                }`}
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                {reply.author?.profilePhoto ? (
                                    <img
                                        src={reply.author.profilePhoto}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                                        {reply.author?.name?.[0] || "?"}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">
                                        {reply.author?.name}
                                    </span>
                                    {reply.isInstructor && (
                                        <>
                                            <span className="text-gray-400">—</span>
                                            <span className="text-blue-600 text-sm">Instructor</span>
                                            <FaStar className="text-blue-600" size={12} />
                                        </>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500 mb-2">
                                    {formatDate(reply.createdAt)}
                                </div>
                                <div
                                    className="text-gray-700 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: reply.body }}
                                />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-sm text-gray-500">{reply.upvoteCount}</span>
                                <button className="p-2 hover:bg-gray-100 rounded">
                                    <FaChevronUp className="text-gray-400" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reply Form */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Write your response
                    </label>
                    <RichTextEditor
                        value={replyBody}
                        onChange={setReplyBody}
                        placeholder="Write your response"
                    />
                    <div className="mt-3 flex justify-end">
                        <button
                            onClick={handleAddReply}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Add an answer
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // RENDER: Ask Question View
    const renderAskView = () => (
        <div className="p-4 max-w-4xl mx-auto">
            <button
                onClick={() => setView("list")}
                className="flex items-center gap-2 text-blue-600 mb-4 hover:underline"
            >
                <FaArrowLeft /> Back to All Questions
            </button>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ask a new question</h2>

            <form onSubmit={handleAskQuestion}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question title *
                    </label>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="What would you like to know?"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Details (optional)
                    </label>
                    <RichTextEditor
                        value={newBody}
                        onChange={setNewBody}
                        placeholder="Add more details to your question..."
                    />
                </div>

                {currentLecture && (
                    <p className="text-sm text-gray-500 mb-4">
                        Related to: <span className="text-blue-600">{currentLecture.title}</span>
                    </p>
                )}

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setView("list")}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {submitting ? "Posting..." : "Post question"}
                    </button>
                </div>
            </form>
        </div>
    );

    // RENDER: Edit Question View
    const renderEditView = () => {
        if (!editingQuestion) return null;

        return (
            <div className="p-4 max-w-4xl mx-auto">
                <button
                    onClick={() => setView("detail")}
                    className="flex items-center gap-2 text-blue-600 mb-4 hover:underline"
                >
                    <FaArrowLeft /> Back to Question
                </button>

                <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit question</h2>

                <form onSubmit={async (e) => {
                    e.preventDefault();
                    toast.info("Edit functionality coming soon!");
                    setView("detail");
                }}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question title *
                        </label>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Details
                        </label>
                        <RichTextEditor
                            value={editBody}
                            onChange={setEditBody}
                            placeholder="Edit your question details..."
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setView("detail")}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Save changes
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    // Main render
    return (
        <div className="bg-white rounded-lg">
            {view === "list" && renderListView()}
            {view === "detail" && renderDetailView()}
            {view === "ask" && renderAskView()}
            {view === "edit" && renderEditView()}
        </div>
    );
};

// Question Card Component
const QuestionCard = ({ question, onView, onUpvote, formatDate, featured }) => (
    <div
        className={`flex items-start gap-3 p-4 border rounded-lg hover:border-gray-400 cursor-pointer transition-colors ${featured ? "border-blue-200 bg-blue-50/50" : ""
            }`}
        onClick={onView}
    >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
            {question.author?.profilePhoto ? (
                <img
                    src={question.author.profilePhoto}
                    alt=""
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                    {question.author?.name?.[0] || "?"}
                </div>
            )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 line-clamp-1">{question.title}</h4>
            {question.body && (
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {decodeHtmlEntities(question.body).substring(0, 120)}...
                </p>
            )}
            <div className="text-xs text-gray-400 mt-2">
                {question.author?.name} •{" "}
                {question.lectureTitle && (
                    <span className="text-blue-600">{question.lectureTitle} • </span>
                )}
                {formatDate(question.createdAt)}
            </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1" title="Upvotes">
                <span>{question.upvoteCount}</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onUpvote();
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <FaChevronUp />
                </button>
            </div>
            <div className="flex items-center gap-1" title="Replies">
                <span>{question.replyCount}</span>
                <FaComment className="text-gray-400" />
            </div>
        </div>
    </div>
);

export default QnASection;
