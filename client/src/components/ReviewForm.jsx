import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'sonner';

const ReviewForm = ({
    courseId,
    existingReview = null,
    onSubmit,
    onCancel,
    isSubmitting = false
}) => {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState(existingReview?.title || '');
    const [content, setContent] = useState(existingReview?.content || '');

    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setTitle(existingReview.title || '');
            setContent(existingReview.content);
        }
    }, [existingReview]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (content.length < 10) {
            toast.error('Review must be at least 10 characters');
            return;
        }

        onSubmit({
            courseId,
            rating,
            title: title.trim() || undefined,
            content: content.trim()
        });
    };

    const ratingLabels = {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
    };

    return (
        <form onSubmit={handleSubmit} style={{
            backgroundColor: '#f9fafb',
            padding: '24px',
            borderRadius: '8px',
            marginBottom: '24px'
        }}>
            <h3 style={{
                fontWeight: '600',
                fontSize: '18px',
                marginBottom: '16px',
                color: '#1f2937'
            }}>
                {existingReview ? 'Edit Your Review' : 'Write a Review'}
            </h3>

            {/* Star Rating */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#374151'
                }}>
                    Rating
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                style={{
                                    fontSize: '28px',
                                    cursor: 'pointer',
                                    color: star <= (hoverRating || rating) ? '#f4c150' : '#d1d5db',
                                    transition: 'color 0.15s ease'
                                }}
                            />
                        ))}
                    </div>
                    {(hoverRating || rating) > 0 && (
                        <span style={{
                            color: '#6b7280',
                            fontSize: '14px',
                            marginLeft: '8px'
                        }}>
                            {ratingLabels[hoverRating || rating]}
                        </span>
                    )}
                </div>
            </div>

            {/* Title (Optional) */}
            <div style={{ marginBottom: '16px' }}>
                <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#374151'
                }}>
                    Title (Optional)
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    maxLength={100}
                    style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                />
            </div>

            {/* Content */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '8px',
                    color: '#374151'
                }}>
                    Your Review
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What did you like or dislike? What did you use this course for?"
                    minLength={10}
                    maxLength={2000}
                    rows={5}
                    style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                    }}
                />
                <div style={{
                    textAlign: 'right',
                    fontSize: '12px',
                    color: '#9ca3af',
                    marginTop: '4px'
                }}>
                    {content.length}/2000
                </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        backgroundColor: '#7e22ce',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        border: 'none',
                        fontWeight: '600',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.7 : 1
                    }}
                >
                    {isSubmitting ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#6b7280',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            border: '1px solid #d1d5db',
                            fontWeight: '500',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default ReviewForm;
