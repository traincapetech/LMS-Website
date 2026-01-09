import axios from "axios";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : "https://lms-backend-5s5x.onrender.com/api",
  timeout: 60000, // 60 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      // Don't auto-logout for non-critical endpoints that may be called without auth
      const url = error.config?.url || '';
      const skipLogoutRoutes = [
        '/reviews',  // All review routes (GET, POST, PUT, DELETE)
        '/enrollments/check/',
        '/discussion/',
        '/progress/'
      ];
      const shouldSkipLogout = skipLogoutRoutes.some(route => url.includes(route));

      if (!shouldSkipLogout) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect to login if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error - server might be down");
    }

    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  signup: (userData) => api.post("/auth/signup", userData),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
  verifyOtp: (data) => api.post("/auth/verify-otp", data),
};

export const profileAPI = {
  getProfile: () => api.get("/profile"),
  updateProfile: (data) => api.put("/profile", data),
  getInstructors: () => api.get("/profile/instructors"),
  getWishlist: () => api.get("/profile/get-wishlist"),
  addToWishlist: (courseId) =>
    api.post("/profile/add-to-wishlist", { courseId }),
  removeFromWishlist: (courseId) =>
    api.delete(`/profile/remove-from-wishlist/${courseId}`),
};

export const coursesAPI = {
  getAllCourses: () => api.get("/courses"),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post("/courses", data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

export const pendingCoursesAPI = {
  getPendingCourses: () => api.get("/pending-courses"),
  approvePendingCourse: (id) => api.put(`/pending-courses/${id}/approve`),
  rejectPendingCourse: (id) => api.put(`/pending-courses/${id}/reject`),
  createPendingCourse: (data) => api.post("/pending-courses/create", data),
};

export const cartAPI = {
  getCart: () => api.get("/cart"),
  addToCart: (courseId) => api.post("/cart/add", { courseId }),
  removeFromCart: (courseId) => api.delete(`/cart/remove/${courseId}`),
  applyCoupon: (couponCode) => api.post("/cart/apply-coupon", { couponCode }),
  removeCoupon: () => api.delete("/cart/remove-coupon"),
};

export const couponsAPI = {
  getCoupons: () => api.get("/coupons"),
  createCoupon: (data) => api.post("/coupons", data),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`),
  generateDefault: () => api.post("/coupons/generate-default"),
  getAvailableCoupons: () => api.get("/coupons/available"),
};

export const adminAPI = {
  getInstructorRequests: () => api.get("/instructor-requests/"),
  approveInstructorRequest: (id) =>
    api.put(`/instructor-requests/${id}/approve`),
  rejectInstructorRequest: (id) => api.put(`/instructor-requests/${id}/reject`),
  getPendingCourses: () => api.get("/pending-courses/"),
  approvePendingCourse: (id) => api.put(`/pending-courses/${id}/approve`),
  rejectPendingCourse: (id) => api.put(`/pending-courses/${id}/reject`),
};

export const otpAPI = {
  sendOtp: (data) => api.post("/send-otp", data),
  verifyOtp: (data) => api.post("/otp/verify-otp", data),
};

export const uploadAPI = {
  uploadThumbnail: (formData, id) =>
    api.post(`/upload/thumbnail/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export const newsletterAPI = {
  subscribe: (email) => api.post("/newsletter/subscribe", { email }),
  unsubscribe: (email) => api.post("/newsletter/unsubscribe", { email }),
  getSubscribers: () => api.get("/newsletter"),
  sendNewsletter: (data) => api.post("/newsletter/send", data),
};

export const publicAPI = {
  getStats: () => api.get("/public/stats"),
  contactUs: (data) => api.post("/public/contact", data),
};

export const enrollmentAPI = {
  enroll: (courseId) => api.post("/enrollments/enroll", { courseId }),
  getMyEnrollments: () => api.get("/enrollments/my-enrollments"),
  checkEnrollment: (courseId) => api.get(`/enrollments/check/${courseId}`),
  unenroll: (courseId) => api.delete(`/enrollments/unenroll/${courseId}`),
  getStats: () => api.get("/enrollments/stats"),
};

export const progressAPI = {
  markLectureComplete: (data) => api.post("/progress/lecture/complete", data),
  updateLastAccessed: (data) => api.post("/progress/lecture/access", data),
  getCourseProgress: (courseId) => api.get(`/progress/course/${courseId}`),
  markQuizComplete: (data) => api.post("/progress/quiz/complete", data),
};

export const discussionAPI = { // Discussion/Messaging API
  // Private 1:1 chat between students and instructors
  // Send message in private conversation
  // recipientId is required - usually instructor ID for student messages
  sendMessage: (courseId, message, recipientId) =>
    api.post(`/discussion/${courseId}`, { message, recipientId }),

  // Get private messages between current user and instructor
  // Returns only messages in this private conversation (privacy ensured)
  getCourseMessages: (courseId) =>
    api.get(`/discussion/${courseId}`),

  // NEW: Get instructor's student conversations (instructor-only)
  // Returns list of students who have messaged in instructor's courses
  getInstructorConversations: () =>
    api.get('/discussion/instructor/conversations'),

  // NEW: Get specific student conversation (instructor-only)
  getStudentConversation: (courseId, studentId) =>
    api.get(`/discussion/instructor/${courseId}/${studentId}`),

  // Get unread message count across all enrolled courses
  // Only counts messages sent TO current user (recipient field)
  getUnreadCount: () => {
    const lastCheck = localStorage.getItem('lastMessageCheck');
    return api.get('/discussion/unread-count', {
      headers: lastCheck ? { 'X-Last-Check': lastCheck } : {}
    });
  }
};

export const reviewAPI = {
  getCourseReviews: (courseId, params) => api.get(`/reviews/course/${courseId}`, { params }),
  getMyReview: (courseId) => api.get(`/reviews/course/${courseId}/my-review`),
  getReviewStats: (courseId) => api.get(`/reviews/course/${courseId}/stats`),
  createReview: (data) => api.post('/reviews', data),
  updateReview: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
  markHelpful: (reviewId) => api.post(`/reviews/${reviewId}/helpful`),
  reportReview: (reviewId, reason) => api.post(`/reviews/${reviewId}/report`, { reason }),
  addResponse: (reviewId, response) => api.post(`/reviews/${reviewId}/response`, { response }),
};

export const questionAPI = {
  getQuestions: (courseId, params) => api.get(`/questions/course/${courseId}`, { params }),
  getFeatured: (courseId) => api.get(`/questions/course/${courseId}/featured`),
  getQuestion: (id) => api.get(`/questions/${id}`),
  createQuestion: (data) => api.post('/questions', data),
  addReply: (id, body) => api.post(`/questions/${id}/reply`, { body }),
  upvoteQuestion: (id) => api.post(`/questions/${id}/upvote`),
  upvoteReply: (id, replyId) => api.post(`/questions/${id}/reply/${replyId}/upvote`),
  followQuestion: (id) => api.post(`/questions/${id}/follow`),
};

export const noteAPI = {
  getNotes: (courseId, params) => api.get(`/notes/course/${courseId}`, { params }),
  createNote: (data) => api.post('/notes', data),
  updateNote: (id, content) => api.put(`/notes/${id}`, { content }),
  deleteNote: (id) => api.delete(`/notes/${id}`),
};

export default api;
