import { create } from "zustand";
import { coursesAPI } from "@/utils/api";

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

export const useStore = create((set) => ({
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
}));
