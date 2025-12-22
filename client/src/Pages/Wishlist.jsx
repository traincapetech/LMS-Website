import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { FaStar, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useStore } from "../Store/store";

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist, fetchWishlist } = useStore();

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center w-full h-screen justify-center">
        <Spinner className="text-blue-600 size-12" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen mt-20 mb-10 font-poppins bg-Background">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold">
            My <span className="text-blue-600">Wishlist</span>
          </h1>
          <p className="text-TextPrimary mt-3">
            {wishlist.length} course{wishlist.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-md text-center max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
            <p className="text-gray-500 mt-2">
              Explore courses and save them for later.
            </p>
            <Link to="/courses">
              <Button className="mt-5">Browse Courses</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {wishlist.map((course, index) => (
              <motion.div
                key={course._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white relative rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <Link to={`/course/${course._id}`}>
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg";
                    }}
                  />
                </Link>

                <div className="p-6">
                  <Link to={`/course/${course._id}`}>
                    <h3 className="text-xl font-medium mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="font-inter text-sm mb-3 line-clamp-2 text-gray-600">
                      {course.subtitle}
                    </p>
                  </Link>

                  <div className="flex items-center gap-2 mb-4">
                    <FaStar className="text-yellow-400" />
                    <span className="font-medium">{course.rating || 0}</span>
                    <span className="text-gray-500 text-sm">
                      ({course.ratingsCount || 0} ratings)
                    </span>
                  </div>
                  <div
                    style={{ marginTop: 10, fontSize: 18, fontWeight: 700 }}
                    className="mb-4"
                  >
                    ₹{course.price}
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/course/${course._id}`} className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(course._id);
                      }}
                      title="Remove from Wishlist"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
