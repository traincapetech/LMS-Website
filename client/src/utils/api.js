import axios from "axios";

// Create axios instance with default configuration
const api = axios.create({
  baseURL:
    "http://localhost:5001/api" || "https://lms-backend-5s5x.onrender.com/api",
  timeout: 60000, // 30 second timeout
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
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

export default api;
