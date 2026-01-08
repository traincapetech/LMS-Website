import React from 'react';
import { FaStar, FaThumbsUp, FaFlag, FaUser } from 'react-icons/fa';

const ReviewCard = ({
    review,
    currentUserId,
    onHelpful,
    onReport,
    onEdit,
    onDelete,
    isInstructor = false
}) => {
    const {
        _id,
        user,
        rating,
        title,
        content,
        createdAt,
        helpful = [],
        helpfulCount = 0,
        instructorResponse
    } = review;

    const isOwner = currentUserId && user?._id === currentUserId;
    const hasVotedHelpful = currentUserId && helpful.includes(currentUserId);
    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Render star rating
    const renderStars = (count) => {
        return [...Array(5)].map((_, i) => (
            <FaStar
                key={i}
                style={{
                    color: i < count ? '#f4c150' : '#d1d5db',
                    fontSize: '14px'
                }}
            />
        ));
    };

    return (
        <div style={{
            borderBottom: '1px solid #e5e7eb',
            padding: '20px 0',
        }}>
            {/* User info row */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                {user?.photoUrl ? (
                    <img
                        src={user.photoUrl}
                        alt={user.name}
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginRight: '12px'
                        }}
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-3 text-white font-semibold text-lg">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}
                <div>
                    <div style={{ fontWeight: '600', color: '#111' }}>{user?.name || 'Anonymous'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>{renderStars(rating)}</div>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>{formattedDate}</span>
                    </div>
                </div>
            </div>

            {/* Review content */}
            {title && (
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>{title}</h4>
            )}
            <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '16px' }}>{content}</p>

            {/* Instructor response */}
            {instructorResponse?.content && (
                <div className="bg-gray-100 border-l-4 border-blue-600 px-4 py-3 mb-4 rounded-r">
                    <div className="font-semibold text-blue-600 mb-1 text-sm">
                        Instructor Response
                    </div>
                    <p className="text-gray-600 text-sm">{instructorResponse.content}</p>
                </div>
            )}

            {/* Actions row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Helpful button */}
                <button
                    onClick={() => onHelpful && onHelpful(_id)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'none',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        color: hasVotedHelpful ? '#2563eb' : '#6b7280',
                        fontSize: '13px'
                    }}
                >
                    <FaThumbsUp />
                    <span>Helpful ({helpfulCount || helpful.length})</span>
                </button>

                {/* Report button (not for owner) */}
                {!isOwner && (
                    <button
                        onClick={() => onReport && onReport(_id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#9ca3af',
                            fontSize: '13px'
                        }}
                    >
                        <FaFlag />
                        <span>Report</span>
                    </button>
                )}

                {/* Owner actions */}
                {isOwner && (
                    <>
                        <button
                            onClick={() => onEdit && onEdit(review)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#2563eb',
                                fontSize: '13px',
                                textDecoration: 'underline'
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete && onDelete(_id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#ef4444',
                                fontSize: '13px',
                                textDecoration: 'underline'
                            }}
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReviewCard;
