import { create } from "zustand";
import {
  coursesAPI,
  cartAPI,
  couponsAPI,
  newsletterAPI,
  profileAPI,
} from "@/utils/api";
import { toast } from "sonner";

const apiCourses = (data) => {
  const transform = (c) => ({
    ...c,
    id: c._id,
    title: c.title,
    subtitle: c.subtitle || c.description,
    thumbnailUrl: c.thumbnailUrl || c.thumbnail || "",
    instructor: c.instructor || {
      name: c.instructor?.name || "Instructor",
    },
    price: c.price || 0,
    originalPrice: c.price ? c.price * 1.5 : 100,
    discount: 33,
    rating: c.rating || 0,
    ratingsCount: c.ratingsCount || 0,
    learners: c.learners || 0,
    language: c.language || "English",
    lastUpdated: c.updatedAt?.split("T")[0] || "2025",
    description: c.description || "",
    whatYouWillLearn: c.learningObjectives || [],
    requirements: c.requirements || [],
    includes: ["Full lifetime access", "Certificate of completion"],
    curriculum: c.curriculum || [],
    pendingCourseId: c.pendingCourseId,
    courseContent: {
      totalLectures:
        c.curriculum?.reduce((sum, sec) => sum + sec.items.length, 0) || 0,
      totalLength: "Self-paced",
    },
    isApiCourse: true,
  });

  if (Array.isArray(data)) {
    return data.map(transform);
  }
  return transform(data);
};

export const useStore = create((set, get) => ({
  courses: [],
  coursesById: null,
  loading: false,
  error: null,
  setCourses: (courses) => set({ courses }),
  setCoursesById: (coursesById) => set({ coursesById }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  fetchCourses: async () => {
    try {
      set({ loading: true });
      const res = await coursesAPI.getAllCourses();
      const transformedCourses = apiCourses(res.data);
      set({ courses: transformedCourses });
    } catch (error) {
      set({ error: error.message || "Failed to fetch courses" });
    } finally {
      set({ loading: false });
    }
  },
  fetchCoursesById: async (id) => {
    try {
      set({ loading: true });
      const res = await coursesAPI.getCourse(id);
      const transformedCourses = apiCourses(res.data);
      set({ coursesById: transformedCourses });
    } catch (error) {
      set({ error: error.message || "Failed to fetch courses" });
    } finally {
      set({ loading: false });
    }
  },
  // Login Panel State
  isRightPanelActive: false,
  setIsRightPanelActive: (active) => set({ isRightPanelActive: active }),


// Pending Courses State
pendingCourses: [],
setPendingCourses: (pendingCourses) => set({ pendingCourses }),


  // Cart State
  backendCart: null,
  availableCoupons: [],
  couponMessage: "",
  couponApplied: false,
  discountAmount: 0,

  fetchBackendCart: async () => {
    try {
      set({ loading: true });
      const token = localStorage.getItem("token");
      if (!token) {
        set({ loading: false });
        // Optionally clear backendCart if needed
        set({ backendCart: null });
        return;
      }

      const res = await cartAPI.getCart();
      set({ backendCart: res.data });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }
    } finally {
      set({ loading: false });
    }
  },

  fetchAvailableCoupons: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await couponsAPI.getAvailableCoupons();
      set({ availableCoupons: res.data });
    } catch (error) {
      console.error("Failed to fetch available coupons:", error);
    }
  },

  addToCart: async (courseId) => {
    try {
      await cartAPI.addToCart(courseId);
      // Refresh backend cart
      const res = await cartAPI.getCart();
      set({ backendCart: res.data });
      return true;
    } catch (error) {
      console.error("Error adding course to cart:", error);
      throw error;
    }
  },

  removeFromCart: async (courseId) => {
    try {
      await cartAPI.removeFromCart(courseId);
      // Refresh backend cart
      const res = await cartAPI.getCart();
      set({ backendCart: res.data });
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  },

  applyCoupon: async (couponCode) => {
    try {
      const res = await cartAPI.applyCoupon(couponCode);
      set({
        couponApplied: true,
        couponMessage: "Coupon applied successfully!",
        discountAmount: res.data.discountAmount,
        backendCart: res.data.cart,
      });
    } catch (error) {
      set({
        couponMessage:
          error.response?.data?.message || "Failed to apply coupon",
        couponApplied: false,
      });
    }
  },

  removeCoupon: async () => {
    try {
      await cartAPI.removeCoupon();
      const res = await cartAPI.getCart();
      set({
        couponApplied: false,
        couponMessage: "",
        discountAmount: 0,
        backendCart: res.data,
      });
    } catch (error) {
      console.error("Failed to remove coupon:", error);
    }
  },

  setCouponMessage: (message) => set({ couponMessage: message }),

  // Newsletter
  subscribing: false,
  subscribers: [],
  subject: "",
  message: "",
  sending: false,
  setSubscribing: (subscribing) => set({ subscribing }),
  setSubscribers: (subscribers) => set({ subscribers }),
  setSubject: (subject) => set({ subject }),
  setMessage: (message) => set({ message }),
  setSending: (sending) => set({ sending }),

  subscribe: async (email) => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    // Basic validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    set({ subscribing: true });
    try {
      await newsletterAPI.subscribe(email);
      toast.success("Subscribed successfully!");
      set({ subscribing: false });
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Subscription failed. Please try again."
      );
    } finally {
      set({ subscribing: false });
    }
  },

  fetchSubscribers: async () => {
    set({ loading: true });
    try {
      const res = await newsletterAPI.getSubscribers();
      set({ subscribers: res.data.subscribers || [] });
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      toast.error("Failed to fetch subscribers");
      set({ subscribers: [] });
    } finally {
      set({ loading: false });
    }
  },

  sendSubscribers: async (subject, message) => {
    try {
      set({ sending: true });
      const res = await newsletterAPI.sendNewsletter({
        subject,
        html: message.replace(/\n/g, "<br>"), // Simple newline to BR conversion
      });
      toast.success(res.data.message);
      set({ subject: "", message: "" });
    } catch (error) {
      console.error("Failed to send newsletter:", error);
      toast.error("Failed to send newsletter");
    } finally {
      set({ sending: false });
    }
  },

  unSubscribe: async (email) => {
    try {
      await newsletterAPI.unsubscribe(email);
      toast.success("Unsubscribed successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Unsubscription failed. Please try again."
      );
    }
  },

  //wishlist
  wishlist: [],
  setWishlist: (wishlist) => set({ wishlist }),
  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const res = await profileAPI.getWishlist();
      set({ wishlist: res.data });
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      set({ loading: false });
    }
  },

  addToWishlist: async (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      await profileAPI.addToWishlist(courseId);
      // Refresh wishlist
      const res = await profileAPI.getWishlist();
      set({ wishlist: res.data });
      toast.success("Added to wishlist");
    } catch (error) {
      console.error("Error adding course to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  },

  removeFromWishlist: async (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to remove from wishlist");
      return;
    }
    try {
      await profileAPI.removeFromWishlist(courseId);
      // Refresh wishlist
      const res = await profileAPI.getWishlist();
      set({ wishlist: res.data });
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  },
  isInWishlist: (courseId) => {
    return (
      get().wishlist?.some(
        (item) => item._id === courseId || item === courseId
      ) || false
    );
  },
}));
