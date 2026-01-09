import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { enrollmentAPI, progressAPI } from "@/utils/api";
import { motion } from "framer-motion";
import {
  FaPlay,
  FaClock,
  FaCheckCircle,
  FaBook,
  FaChartLine,
  FaTrophy,
  FaFilter,
  FaSearch,
  FaStar,
  FaQuestionCircle,
} from "react-icons/fa";

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, in-progress, completed
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageProgress: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrollments();
    fetchStats();
  }, []);

  // Filter and search enrollments
  useEffect(() => {
    let filtered = enrollments;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((enrollment) => {
        const course = enrollment.course;
        const title = course?.title || course?.landingTitle || "";
        const instructor = course?.instructor?.name || "";
        return (
          title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          instructor.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply status filter
    if (filter === "completed") {
      filtered = filtered.filter(
        (enrollment) => enrollment.progress?.isCompleted
      );
    } else if (filter === "in-progress") {
      filtered = filtered.filter(
        (enrollment) =>
          !enrollment.progress?.isCompleted &&
          (enrollment.progress?.progressPercentage || 0) > 0
      );
    }

    setFilteredEnrollments(filtered);
  }, [enrollments, searchQuery, filter]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await enrollmentAPI.getMyEnrollments();
      setEnrollments(res.data.enrollments || []);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setError(err.response?.data?.message || "Failed to load your courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await enrollmentAPI.getStats();
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleContinueLearning = (enrollment) => {
    const course = enrollment.course;
    if (!course) return;

    // Navigate to last accessed lecture or first lecture
    if (enrollment.progress?.lastAccessedLecture) {
      navigate(
        `/lecture/${enrollment.progress.lastAccessedLecture.lectureId || enrollment.progress.lastAccessedLecture.itemId}?courseId=${course._id || course.id}`
      );
    } else {
      // Navigate to course details page
      navigate(`/course/${course._id || course.id}`);
    }
  };

  // Get total items (lectures + quizzes) for accurate progress
  const getTotalItems = (course) => {
    if (!course?.curriculum) return 0;
    return course.curriculum.reduce(
      (sum, section) =>
        sum +
        (section.items?.filter(
          (item) => item.type === "lecture" || item.type === "quiz"
        ).length || 0),
      0
    );
  };

  // Get completed items count
  const getCompletedItemsCount = (progress, course) => {
    if (!progress || !course?.curriculum) return 0;
    const completedLecs = progress.completedLectures || [];
    const completedQuizzes = progress.completedQuizzes || [];
    return completedLecs.length + completedQuizzes.length;
  };

  // Calculate progress percentage if not provided
  const calculateProgressPercentage = (progress, course) => {
    if (progress?.progressPercentage !== undefined) {
      return progress.progressPercentage;
    }
    const totalItems = getTotalItems(course);
    if (totalItems === 0) return 0;
    const completedItems = getCompletedItemsCount(progress, course);
    return Math.round((completedItems / totalItems) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center w-full h-screen justify-center">
        <Spinner className="text-blue-600 size-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 font-poppins">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">
            My Learning
          </h1>
          <p className="text-gray-600">
            Continue your learning journey and track your progress
          </p>
        </div>

        {/* Search and Filter Bar */}
        {enrollments.length > 0 && (
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className="flex items-center gap-2"
              >
                <FaFilter className="text-xs" />
                All ({enrollments.length})
              </Button>
              <Button
                variant={filter === "in-progress" ? "default" : "outline"}
                onClick={() => setFilter("in-progress")}
                className="flex items-center gap-2"
              >
                <FaClock className="text-xs" />
                In Progress (
                {
                  enrollments.filter(
                    (e) =>
                      !e.progress?.isCompleted &&
                      (e.progress?.progressPercentage || 0) > 0
                  ).length
                }
                )
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                onClick={() => setFilter("completed")}
                className="flex items-center gap-2"
              >
                <FaCheckCircle className="text-xs" />
                Completed (
                {enrollments.filter((e) => e.progress?.isCompleted).length})
              </Button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="p-6 bg-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaBook className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalEnrollments}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedCourses}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaClock className="text-yellow-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.inProgressCourses}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FaChartLine className="text-purple-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageProgress}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && enrollments.length === 0 && (
          <Card className="p-12 text-center bg-white">
            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No courses enrolled yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start learning by enrolling in courses that interest you
            </p>
            <Link to="/courses">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Browse Courses
              </Button>
            </Link>
          </Card>
        )}

        {/* Enrolled Courses Grid */}
        {filteredEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment, index) => {
              const course = enrollment.course;
              if (!course) return null;

              const progress = enrollment.progress || {
                progressPercentage: 0,
                completedLectures: [],
                completedQuizzes: [],
                isCompleted: false,
              };

              const totalItems = getTotalItems(course);
              const completedItems = getCompletedItemsCount(progress, course);
              const progressPercentage = calculateProgressPercentage(
                progress,
                course
              );
              const courseId = course._id || course.id;

              return (
                <motion.div
                  key={enrollment._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-white overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Course Thumbnail */}
                    <div className="relative">
                      <img
                        src={course.thumbnailUrl || "/default-course.jpg"}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg";
                        }}
                      />
                      {progress.isCompleted && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <FaTrophy className="text-xs" />
                          Completed
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      {/* Course Title */}
                      <Link to={`/course/${courseId}`}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition">
                          {course.title || course.landingTitle || "Untitled Course"}
                        </h3>
                      </Link>

                      {/* Instructor */}
                      <p className="text-sm text-gray-600 mb-4">
                        by{" "}
                        <span className="font-medium">
                          {course.instructor?.name || "Instructor"}
                        </span>
                      </p>

                      {/* Course Rating */}
                      {course.rating && (
                        <div className="flex items-center gap-1 mb-3">
                          <FaStar className="text-yellow-400 text-sm" />
                          <span className="text-sm font-medium text-gray-700">
                            {course.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({course.totalRatings || 0} ratings)
                          </span>
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Progress
                          </span>
                          <span className="text-sm font-semibold text-blue-600">
                            {progressPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all ${
                              progress.isCompleted
                                ? "bg-green-500"
                                : "bg-blue-600"
                            }`}
                            style={{
                              width: `${progressPercentage}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-500">
                            {completedItems} of {totalItems} items completed
                          </p>
                          {progress.completedLectures?.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <FaPlay className="text-xs" />
                              <span>
                                {progress.completedLectures.length} lectures
                              </span>
                            </div>
                          )}
                          {progress.completedQuizzes?.length > 0 && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <FaQuestionCircle className="text-xs" />
                              <span>
                                {progress.completedQuizzes.length} quizzes
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleContinueLearning(enrollment)}
                        >
                          <FaPlay className="mr-2" />
                          {progressPercentage > 0
                            ? "Continue Learning"
                            : "Start Learning"}
                        </Button>
                        <Link to={`/course/${courseId}`}>
                          <Button variant="outline">View</Button>
                        </Link>
                      </div>

                      {/* Last Accessed */}
                      {enrollment.lastAccessedAt && (
                        <p className="text-xs text-gray-500 mt-3">
                          Last accessed:{" "}
                          {new Date(enrollment.lastAccessedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : enrollments.length > 0 ? (
          <Card className="p-12 text-center bg-white">
            <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No courses found
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default MyLearning;

