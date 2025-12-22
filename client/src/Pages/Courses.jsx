import React, { useState, useEffect, useContext } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CartContext } from "../App";
import { useStore } from "../Store/store";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";


const Courses = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const navigate = useNavigate();

  const {
    courses,
    loading,
    error,
    fetchCourses,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist,
  } = useStore();
  const [filtered, setFiltered] = useState([]);

  const { addToCart } = useContext(CartContext);

  // ADD TO CART
  const handleAddToCart = (course, e) => {
    e.preventDefault();
    e.stopPropagation();

    const courseToAdd = {
      id: course._id,
      title: course.title,
      description: course.subtitle,
      price: course.price,
      thumbnailUrl: course.thumbnailUrl,
      isApiCourse: true,
    };

    localStorage.setItem("courseToAdd", JSON.stringify(courseToAdd));
    navigate("/cart");
  };

  // FETCH COURSES (DYNAMIC ONLY)
  useEffect(() => {
    fetchCourses();
    fetchWishlist();
  }, [fetchCourses, fetchWishlist]);

  // SEARCH FILTER (Dynamic)
  useEffect(() => {
    if (!searchQuery) {
      setFiltered(courses);
    } else {
      const q = searchQuery.toLowerCase();

      const results = courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          c.instructor?.name.toLowerCase().includes(q)
      );

      setFiltered(results);
    }
  }, [searchQuery, courses]);

  /* ------------------ UI ------------------ */

  if (loading) {
    return (
      <div className="flex items-center w-full h-screen justify-center">
        <Spinner className="text-blue-600 size-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2 style={{ color: "red" }}>{error}</h2>
        <p>Try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full mt-30 mb-10 font-poppins">
      <div className="max-w-6xl mx-auto">
        {/* SEARCH HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold">
            {searchQuery ? `Search Results for` : `Explore Our`}{" "}
            {searchQuery ? (
              <span className="text-blue-600">{searchQuery}</span>
            ) : (
              <span className="text-blue-600">Courses</span>
            )}
          </h1>
          {searchQuery && (
            <p className="text-TextPrimary mt-3">
              Found {filtered.length} course{filtered.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 ? (
          <div className=" flex flex-col space-y-3 items-center mx-auto justify-center text-center bg-Background p-10 rounded-2xl mt-10 shadow-md w-xl h-58">
            <h2 className="text-2xl font-semibold">No Courses Found</h2>
            <p className="text-TextPrimary mt-3">Try different keywords.</p>
            <Link to="/courses">
              <Button className="w-full mt-5">View All Courses</Button>
            </Link>
          </div>
        ) : (
          /* COURSE GRID (same layout) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((course, index) => {
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
                      <h3 className="text-xl font-medium mb-2">
                        {course.title}
                      </h3>
                      <p className="font-inter text-sm mb-3">
                        {course.subtitle}
                      </p>
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
          // <div
          //   style={{
          //     display: "grid",
          //     gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          //     gap: "24px",
          //   }}
          // >
          //   {filtered.map((course) => (
          //     <Link
          //       key={course._id}
          //       to={`/course/${course._id}`}
          //       style={{ textDecoration: "none", color: "inherit" }}
          //     >
          //       <div
          //         style={{
          //           background: "#fff",
          //           borderRadius: 8,
          //           overflow: "hidden",
          //           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          //           transition: "0.2s",
          //         }}
          //         onMouseOver={(e) => {
          //           e.currentTarget.style.transform = "translateY(-4px)";
          //           e.currentTarget.style.boxShadow =
          //             "0 4px 16px rgba(0,0,0,0.15)";
          //         }}
          //         onMouseOut={(e) => {
          //           e.currentTarget.style.transform = "translateY(0px)";
          //           e.currentTarget.style.boxShadow =
          //             "0 2px 8px rgba(0,0,0,0.1)";
          //         }}
          //       >
          //         {/* IMAGE */}
          //         <div style={{ position: "relative" }}>
          //           <img
          //             src={course.thumbnailUrl}
          //             style={{
          //               width: "100%",
          //               height: 180,
          //               objectFit: "cover",
          //             }}
          //             onError={(e) =>
          //               (e.target.src =
          //                 "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg")
          //             }
          //             alt={course.title}
          //           />

          //           {/* NEW badge */}
          //           {course.isApiCourse && (
          //             <span
          //               style={{
          //                 position: "absolute",
          //                 top: 8,
          //                 right: 8,
          //                 background: "#28a745",
          //                 color: "#fff",
          //                 padding: "2px 8px",
          //                 borderRadius: 4,
          //                 fontSize: 12,
          //               }}
          //             >
          //               New
          //             </span>
          //           )}
          //         </div>

          //         {/* DETAILS */}
          //         <div style={{ padding: 16 }}>
          //           <h3
          //             style={{
          //               fontSize: 16,
          //               fontWeight: 700,
          //               height: 42,
          //               overflow: "hidden",
          //               display: "-webkit-box",
          //               WebkitLineClamp: 2,
          //               WebkitBoxOrient: "vertical",
          //             }}
          //           >
          //             {course.title}
          //           </h3>

          //           <p
          //             style={{
          //               fontSize: 12,
          //               height: 32,
          //               overflow: "hidden",
          //               display: "-webkit-box",
          //               WebkitLineClamp: 2,
          //               WebkitBoxOrient: "vertical",
          //               color: "#6a6f73",
          //               marginBottom: 6,
          //             }}
          //           >
          //             {course.subtitle}
          //           </p>

          //           <div style={{ fontSize: 12, color: "#6a6f73" }}>
          //             {course.instructor.name}
          //           </div>

          //           {/* Rating */}
          //           <div style={{ marginTop: 6 }}>
          //             <span style={{ color: "#b4690e", fontWeight: 600 }}>
          //               {course.rating}
          //             </span>{" "}
          //             <span style={{ color: "#b4690e" }}>★</span>
          //             <span style={{ color: "#6a6f73" }}>
          //               {" "}
          //               ({course.ratingsCount})
          //             </span>
          //           </div>

          //           {/* PRICE */}
          //           <div
          //             style={{ marginTop: 10, fontSize: 18, fontWeight: 700 }}
          //           >
          //             ₹{course.price}
          //             <span
          //               style={{
          //                 fontSize: 14,
          //                 marginLeft: 8,
          //                 color: "#6a6f73",
          //                 textDecoration: "line-through",
          //               }}
          //             >
          //               ₹{course.originalPrice}
          //             </span>
          //           </div>

          //           <button
          //             onClick={(e) => handleAddToCart(course, e)}
          //             style={{
          //               width: "100%",
          //               marginTop: 10,
          //               padding: "10px 0",
          //               background: "#7c3aed",
          //               borderRadius: 6,
          //               border: "none",
          //               color: "#fff",
          //               cursor: "pointer",
          //               fontWeight: "600",
          //             }}
          //           >
          //             Add to Cart
          //           </button>
          //         </div>
          //       </div>
          //     </Link>
          //   ))}
          // </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
