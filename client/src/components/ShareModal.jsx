import React, { useState } from "react";
import { FaWhatsapp, FaTimes, FaCopy, FaCheck } from "react-icons/fa";

/**
 * ShareModal - Udemy-style share modal with WhatsApp and Copy link options
 * @param {boolean} isOpen - Modal visibility state
 * @param {function} onClose - Close modal callback
 * @param {string} courseTitle - Course title for share message
 * @param {string} courseId - Course ID for generating share URL
 */
const ShareModal = ({ isOpen, onClose, courseTitle, courseId }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    // Generate share URL - use production domain
    const baseUrl = window.location.hostname === "localhost"
        ? window.location.origin
        : "https://cognify.traincapetech.in";
    const shareUrl = `${baseUrl}/course/${courseId}`;
    const shareMessage = `Check out this course: ${courseTitle}`;
    
    // Copy to clipboard
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Share on WhatsApp
    const handleWhatsAppShare = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
            `${shareMessage}\n${shareUrl}`
        )}`;
        window.open(whatsappUrl, "_blank");
    };

    // Close on backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Share this course
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* URL Input with Copy Button */}
                    <div className="flex items-center gap-2 mb-6">
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm truncate"
                        />
                        <button
                            onClick={handleCopy}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${copied
                                ? "bg-green-600 text-white"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                                }`}
                        >
                            {copied ? (
                                <span className="flex items-center gap-1">
                                    <FaCheck size={14} /> Copied
                                </span>
                            ) : (
                                "Copy"
                            )}
                        </button>
                    </div>

                    {/* Share Icons */}
                    <div className="flex items-center justify-center gap-4">
                        {/* WhatsApp */}
                        <button
                            onClick={handleWhatsAppShare}
                            className="w-12 h-12 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors"
                            title="Share on WhatsApp"
                        >
                            <FaWhatsapp size={24} />
                        </button>

                        {/* Copy Link Icon */}
                        <button
                            onClick={handleCopy}
                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${copied
                                ? "border-green-500 text-green-500 bg-green-50"
                                : "border-purple-600 text-purple-600 hover:bg-purple-50"
                                }`}
                            title="Copy Link"
                        >
                            {copied ? <FaCheck size={20} /> : <FaCopy size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
