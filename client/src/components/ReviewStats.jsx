import React from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const ReviewStats = ({ stats }) => {
    const { averageRating = 0, totalReviews = 0, percentages = {} } = stats || {};

    // Render average rating stars
    const renderAverageStars = () => {
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(fullStars)].map((_, i) => (
                    <FaStar key={`full-${i}`} style={{ color: '#f4c150', fontSize: '18px' }} />
                ))}
                {hasHalfStar && <FaStarHalfAlt style={{ color: '#f4c150', fontSize: '18px' }} />}
                {[...Array(emptyStars)].map((_, i) => (
                    <FaStar key={`empty-${i}`} style={{ color: '#d1d5db', fontSize: '18px' }} />
                ))}
            </div>
        );
    };

    // Rating bar component
    const RatingBar = ({ stars, percentage }) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                minWidth: '80px'
            }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>{stars} stars</span>
            </div>
            <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                <div
                    className="h-full bg-blue-600 rounded transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span style={{
                fontSize: '14px',
                color: '#6b7280',
                minWidth: '40px',
                textAlign: 'right'
            }}>
                {percentage}%
            </span>
        </div>
    );

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '40px',
            padding: '20px',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            marginBottom: '24px',
            flexWrap: 'wrap'
        }}>
            {/* Left: Average rating */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '120px'
            }}>
                <div style={{
                    fontSize: '56px',
                    fontWeight: '700',
                    color: '#1f2937',
                    lineHeight: 1
                }}>
                    {averageRating.toFixed(1)}
                </div>
                {renderAverageStars()}
                <div style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    marginTop: '8px'
                }}>
                    {totalReviews} {totalReviews === 1 ? 'rating' : 'ratings'}
                </div>
            </div>

            {/* Right: Distribution bars */}
            <div style={{ flex: 1, minWidth: '250px' }}>
                {[5, 4, 3, 2, 1].map((stars) => (
                    <RatingBar
                        key={stars}
                        stars={stars}
                        percentage={percentages[stars] || 0}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReviewStats;
