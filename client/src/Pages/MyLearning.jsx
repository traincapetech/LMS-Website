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
} from "react-icons/fa";

const MyLearning = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const getTotalLectures = (course) => {
    if (!course?.curriculum) return 0;
    return course.curriculum.reduce(
      (sum, section) =>
        sum + (section.items?.filter((item) => item.type === "lecture").length || 0),
      0
    );
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
        {enrollments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment, index) => {
              const course = enrollment.course;
              if (!course) return null;

              const progress = enrollment.progress || {
                progressPercentage: 0,
                completedLectures: 0,
                isCompleted: false,
              };

              const totalLectures = getTotalLectures(course);
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

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Progress
                          </span>
                          <span className="text-sm font-semibold text-blue-600">
                            {progress.progressPercentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress.progressPercentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {progress.completedLectures} of {totalLectures} lectures
                          completed
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleContinueLearning(enrollment)}
                        >
                          <FaPlay className="mr-2" />
                          {progress.progressPercentage > 0
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
        )}
      </div>
    </div>
  );
};

export default MyLearning;

