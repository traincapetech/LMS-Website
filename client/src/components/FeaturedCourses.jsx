import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useStore } from "@/Store/store";

const FeaturedCourses = ({ courses }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useStore();

  return (
    <section className="w-full py-20 bg-Background font-poppins">
      <motion.div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-semibold text-[#0F172A] mb-4">
            Featured <span className="text-blue-600">Courses</span>
          </h2>
          <p className="text-TextPrimary mb-10 font-inter">
            Learn from top instructors and upgrade your skills with our most
            popular and high-rated courses.
          </p>
        </motion.div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.slice(0, 6).map((course, index) => {
            const isWishlisted = isInWishlist(course.id || course._id);
            return (
              <Link
                to={`/course/${course.id}`}
                key={course.id || course._id || index}
              >
                <motion.div
                  style={{ cursor: "pointer" }}
                  initial={{ opacity: 0, y: 50 }} // Gayab aur neeche
                  whileInView={{ opacity: 1, y: 0 }} // Dikhna aur upar aana
                  viewport={{ once: false }} // ✅ CHANGE: Har baar animation repeat hoga
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="bg-white relative rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <img
                    src={course.thumbnailUrl}
                    alt={course.subtitle}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />

                  <span className="absolute top-3 right-3 px-2 py-1 bg-green-500 rounded-sm text-white text-sm">
                    {course.isApiCourse ? "New" : ""}
                  </span>

                  <button
                    className="absolute top-3 left-3 p-2 bg-white/80 rounded-full hover:bg-white transition z-10 shadow-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      if (isWishlisted)
                        removeFromWishlist(course.id || course._id);
                      else addToWishlist(course.id || course._id);
                    }}
                  >
                    {isWishlisted ? (
                      <FaHeart className="text-red-500 text-lg" />
                    ) : (
                      <FaRegHeart className="text-gray-700 text-lg" />
                    )}
                  </button>

                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-2">{course.title}</h3>
                    <p className="font-inter text-sm mb-3">{course.subtitle}</p>
                    <p className="text-sm text-gray-500 mb-3">
                      by{" "}
                      <span className="font-medium text-gray-700">
                        {course.instructor.name}
                      </span>
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <FaStar className="text-yellow-400" />
                      <span className="font-medium">{course.rating}</span>
                      <span className="text-gray-500 text-sm">
                        ({course.students} students)
                      </span>
                    </div>

                    <Button className="w-full bg-blue-600 text-white  hover:bg-blue-700 transition">
                      View Course
                    </Button>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
        <Link to="/courses" className=" flex items-center justify-center">
          <Button className="mt-10 bg-Accent hover:bg-Accent/80">
            View All Courses
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default FeaturedCourses;
