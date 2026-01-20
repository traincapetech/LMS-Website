/**
 * CertificatePage.jsx
 * 
 * Udemy-style certificate view page
 * Shows certificate preview with Download and Share options
 * 
 * Route: /certificate/:courseId
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    FaDownload,
    FaShareAlt,
    FaWhatsapp,
    FaCopy,
    FaArrowLeft,
    FaStar,
    FaSpinner
} from "react-icons/fa";
import { certificateAPI } from "@/utils/api";
import Navbar from "@/components/Navbar";

const CertificatePage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    // State
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [certificate, setCertificate] = useState(null);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [error, setError] = useState(null);

    // Fetch certificate data on mount
    useEffect(() => {
        const fetchCertificateData = async () => {
            try {
                setLoading(true);
                const response = await certificateAPI.getCertificateData(courseId);
                setCertificate(response.data.certificate);
            } catch (err) {
                console.error("Failed to load certificate:", err);
                if (err.response?.status === 403) {
                    setError("Course must be 100% completed to view certificate");
                } else {
                    setError("Failed to load certificate data");
                }
                toast.error(err.response?.data?.message || "Failed to load certificate");
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCertificateData();
        }
    }, [courseId]);

    // Handle PDF download
    const handleDownload = async () => {
        try {
            setDownloading(true);
            const response = await certificateAPI.downloadCertificate(courseId);

            // Create blob and download
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Certificate_${certificate?.courseName?.replace(/[^a-z0-9]/gi, "_") || "Course"}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Certificate downloaded successfully! 🎉");
        } catch (err) {
            console.error("Download error:", err);
            toast.error("Failed to download certificate");
        } finally {
            setDownloading(false);
        }
    };

    // Handle share actions
    const handleShare = (platform) => {
        // Use production URL if on cognify domain, else use current origin
        const baseUrl = window.location.hostname.includes('cognify.traincapetech.in')
            ? 'https://cognify.traincapetech.in'
            : window.location.origin;
        const shareUrl = `${baseUrl}/certificate/${certificate?.courseId}`;
        const shareText = `I just completed "${certificate?.courseName}" on Traincape! 🎓\n${shareUrl}`;

        if (platform === "copy") {
            navigator.clipboard.writeText(shareUrl);
            toast.success("Certificate link copied to clipboard!");
        } else if (platform === "whatsapp") {
            window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
        }

        setShowShareMenu(false);
    };

    // Loading state
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
                        <p className="text-gray-600">Loading certificate...</p>
                    </div>
                </div>
            </>
        );
    }

    // Error state
    if (error) {
        return (
            <>
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center">
                        <div className="text-6xl mb-4">😔</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 pt-20">
                {/* Back button */}
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                    >
                        <FaArrowLeft /> Back to Course
                    </button>
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-12">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* LEFT SIDE: Certificate Preview */}
                        <div className="lg:w-2/3">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                {/* Certificate Preview Box */}
                                <div className="p-8 bg-gray-50">
                                    {/* Certificate Card */}
                                    <div
                                        className="bg-white mx-auto shadow-xl relative"
                                        style={{
                                            width: "100%",
                                            maxWidth: "742px",
                                            aspectRatio: "842/595",
                                            padding: "32px 40px"
                                        }}
                                    >
                                        {/* Left blue border accent */}
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-1.5"
                                            style={{ background: "linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)" }}
                                        />

                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="text-3xl font-bold text-gray-900">
                                                Traincape
                                            </div>
                                            <div className="text-right text-[10px] text-gray-500 leading-relaxed">
                                                Certificate no: {certificate?.certificateId}<br />
                                                Certificate url: cognify.traincapetech.in/certificate/{certificate?.certificateId}<br />
                                                Reference Number: {certificate?.referenceNumber}
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200 mb-5" />

                                        {/* Content */}
                                        <p
                                            className="text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase mb-4"
                                        >
                                            Certificate of Completion
                                        </p>

                                        <h1
                                            className="text-2xl md:text-4xl font-black text-gray-900 mb-4 leading-tight"
                                            style={{ fontFamily: "'Playfair Display', serif" }}
                                        >
                                            {certificate?.courseName}
                                        </h1>

                                        <p className="text-sm text-gray-500 mb-16">
                                            Instructors <span className="font-bold text-gray-900">{certificate?.instructorName}</span>
                                        </p>

                                        <h2
                                            className="text-2xl md:text-3xl font-black text-gray-900 mb-3"
                                            style={{ fontFamily: "'Playfair Display', serif" }}
                                        >
                                            {certificate?.studentName}
                                        </h2>

                                        <div className="flex gap-12 text-sm text-gray-500">
                                            <p>Date <span className="font-bold text-gray-900">{certificate?.completionDate}</span></p>
                                            <p>Length <span className="font-bold text-gray-900">{certificate?.courseDuration}</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Verification text below certificate */}
                                <div className="p-6 bg-white border-t">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        This certificate above verifies that <strong>{certificate?.studentName}</strong> successfully
                                        completed the course <strong>{certificate?.courseName}</strong> as taught
                                        by <strong>{certificate?.instructorName}</strong> on Traincape LMS. The certificate indicates
                                        the entire course was completed as validated by the student.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE: Sidebar */}
                        <div className="lg:w-1/3">
                            {/* Certificate Recipient Card */}
                            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                                <h3 className="font-bold text-gray-800 mb-4">Certificate Recipient:</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                        {certificate?.studentName?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-gray-800">{certificate?.studentName}</span>
                                </div>
                            </div>

                            {/* About the Course Card */}
                            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                                <h3 className="font-bold text-gray-800 mb-4">About the Course:</h3>

                                {/* Course thumbnail placeholder */}
                                {certificate?.courseThumbnail && (
                                    <img
                                        src={certificate.courseThumbnail}
                                        alt={certificate.courseName}
                                        className="w-full h-32 object-cover rounded-lg mb-4"
                                    />
                                )}

                                <h4
                                    className="font-semibold text-blue-600 text-sm mb-2 hover:underline cursor-pointer"
                                    onClick={() => navigate(`/courses/${certificate?.courseId}`)}
                                >
                                    {certificate?.courseName}
                                </h4>

                                <p className="text-xs text-gray-500 mb-2">
                                    {certificate?.instructorName}
                                </p>

                                {certificate?.courseRating && (
                                    <div className="flex items-center gap-2 text-sm mb-4">
                                        <span className="font-bold text-yellow-600">{certificate.courseRating}</span>
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={i < Math.floor(certificate.courseRating) ? "" : "text-gray-300"} />
                                            ))}
                                        </div>
                                        {certificate.courseReviewCount > 0 && (
                                            <span className="text-gray-500">({certificate.courseReviewCount})</span>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleDownload}
                                        disabled={downloading}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {downloading ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <FaDownload />
                                                Download
                                            </>
                                        )}
                                    </button>

                                    <div className="relative">
                                        <button
                                            onClick={() => setShowShareMenu(!showShareMenu)}
                                            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                                        >
                                            <FaShareAlt />
                                            Share
                                        </button>

                                        {/* Share dropdown menu */}
                                        {showShareMenu && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50">
                                                <button
                                                    onClick={() => handleShare("copy")}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                                                >
                                                    <FaCopy className="text-gray-600" />
                                                    <span>Copy Link</span>
                                                </button>
                                                <button
                                                    onClick={() => handleShare("whatsapp")}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                                                >
                                                    <FaWhatsapp className="text-green-500" />
                                                    <span>WhatsApp</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google Font for Playfair Display */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
            `}</style>
        </>
    );
};

export default CertificatePage;
