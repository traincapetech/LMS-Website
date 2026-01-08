import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import ReviewStats from './ReviewStats';
import { reviewAPI, enrollmentAPI } from '@/utils/api';
import { toast } from 'sonner';

const ReviewList = ({ courseId }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [myReview, setMyReview] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Filters
    const [filterRating, setFilterRating] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ pages: 1 });

    // Edit mode
    const [editingReview, setEditingReview] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Get current user
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = user?._id || user?.id;

    // Fetch data
    useEffect(() => {
        fetchData();
    }, [courseId, filterRating, sortBy, page]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch reviews with filters
            const reviewsRes = await reviewAPI.getCourseReviews(courseId, {
                rating: filterRating,
                sort: sortBy,
                page,
                limit: 10,
                search: searchQuery
            });
            setReviews(reviewsRes.data.data || []);
            setPagination(reviewsRes.data.pagination || { pages: 1 });

            // Fetch stats
            const statsRes = await reviewAPI.getReviewStats(courseId);
            setStats(statsRes.data.data);

            // Check if logged in
            if (currentUserId) {
                // Check enrollment - only if token exists
                const token = localStorage.getItem('token');
                try {
                    if (token) {
                        const enrollRes = await enrollmentAPI.checkEnrollment(courseId);
                        setIsEnrolled(enrollRes.data.isEnrolled);
                    }
                } catch (e) {
                    // Silently ignore 401 errors - don't let it trigger logout
                    if (e.response?.status !== 401) {
                        console.log('Enrollment check failed:', e);
                    }
                    setIsEnrolled(false);
                }

                // Get my review - use direct fetch to avoid logout on 401
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        const myReviewRes = await reviewAPI.getMyReview(courseId);
                        setMyReview(myReviewRes.data.data);
                    }
                } catch (e) {
                    // Silently ignore 401 errors - don't let it trigger logout
                    if (e.response?.status !== 401) {
                        console.log('Failed to get my review:', e);
                    }
                    setMyReview(null);
                }
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = () => {
        setPage(1);
        fetchData();
    };

    // Handle submit review
    const handleSubmitReview = async (data) => {
        try {
            setSubmitting(true);
            if (editingReview) {
                await reviewAPI.updateReview(editingReview._id, data);
                toast.success('Review updated!');
            } else {
                await reviewAPI.createReview(data);
                toast.success('Review submitted!');
            }
            setEditingReview(null);
            setShowForm(false);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle helpful
    const handleHelpful = async (reviewId) => {
        if (!currentUserId) {
            toast.error('Please login to vote');
            return;
        }
        try {
            const res = await reviewAPI.markHelpful(reviewId);
            // Update local state
            setReviews(prev => prev.map(r =>
                r._id === reviewId
                    ? {
                        ...r,
                        helpful: res.data.isHelpful
                            ? [...r.helpful, currentUserId]
                            : r.helpful.filter(id => id !== currentUserId),
                        helpfulCount: res.data.helpfulCount
                    }
                    : r
            ));
        } catch (error) {
            toast.error('Failed to update vote');
        }
    };

    // Handle report
    const handleReport = async (reviewId) => {
        const reason = prompt('Why are you reporting this review?');
        if (!reason) return;

        try {
            await reviewAPI.reportReview(reviewId, reason);
            toast.success('Review reported');
        } catch (error) {
            toast.error('Failed to report review');
        }
    };

    // Handle delete
    const handleDelete = async (reviewId) => {
        if (!confirm('Are you sure you want to delete your review?')) return;

        try {
            await reviewAPI.deleteReview(reviewId);
            toast.success('Review deleted');
            setMyReview(null);
            fetchData();
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    // Handle edit
    const handleEdit = (review) => {
        setEditingReview(review);
        setShowForm(true);
    };

    if (loading && reviews.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                Loading reviews...
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
                Student Feedback
            </h2>

            {/* Stats */}
            {stats && <ReviewStats stats={stats} />}

            {/* Review Form or Prompt */}
            {isEnrolled && !myReview && !showForm && (
                <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>You are enrolled in this course. Share your experience!</span>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-semibold cursor-pointer"
                    >
                        Write a Review
                    </button>
                </div>
            )}

            {!isEnrolled && currentUserId && (
                <div style={{
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fcd34d',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '24px',
                    color: '#92400e'
                }}>
                    Enroll in this course to leave a review
                </div>
            )}

            {showForm && (
                <ReviewForm
                    courseId={courseId}
                    existingReview={editingReview}
                    onSubmit={handleSubmitReview}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingReview(null);
                    }}
                    isSubmitting={submitting}
                />
            )}

            {/* My Review (if exists and not editing) */}
            {myReview && !showForm && (
                <div style={{ marginBottom: '24px' }}>
                    <h3 className="text-blue-600" style={{ fontWeight: '600', marginBottom: '12px' }}>
                        Your Review
                    </h3>
                    <ReviewCard
                        review={myReview}
                        currentUserId={currentUserId}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            )}

            {/* Filters */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '24px',
                alignItems: 'center'
            }}>
                {/* Search */}
                <div className="flex items-stretch min-w-[200px] max-w-[300px]">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search reviews"
                        className="flex-1 px-3 py-2.5 border border-r-0 border-gray-300 rounded-l-md outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md flex items-center justify-center"
                    >
                        <FaSearch />
                    </button>
                </div>

                {/* Filter by rating */}
                <select
                    value={filterRating}
                    onChange={(e) => { setFilterRating(e.target.value); setPage(1); }}
                    style={{
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <option value="all">All ratings</option>
                    <option value="5">5 stars</option>
                    <option value="4">4 stars</option>
                    <option value="3">3 stars</option>
                    <option value="2">2 stars</option>
                    <option value="1">1 star</option>
                </select>

                {/* Sort */}
                <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                    style={{
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <option value="recent">Most Recent</option>
                    <option value="helpful">Most Helpful</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                </select>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#6b7280',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                }}>
                    No reviews yet. Be the first to leave a review!
                </div>
            ) : (
                reviews.map((review) => (
                    <ReviewCard
                        key={review._id}
                        review={review}
                        currentUserId={currentUserId}
                        onHelpful={handleHelpful}
                        onReport={handleReport}
                        onEdit={review.user?._id === currentUserId ? handleEdit : undefined}
                        onDelete={review.user?._id === currentUserId ? handleDelete : undefined}
                    />
                ))
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '24px'
                }}>
                    {[...Array(pagination.pages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-4 py-2 rounded-md cursor-pointer ${page === i + 1 ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewList;
