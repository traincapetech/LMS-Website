import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../App";
import { useStore } from "../Store/store";
import { Spinner } from "@/components/ui/spinner";
import { IoMdArrowDropright } from "react-icons/io";
import { GoVideo } from "react-icons/go";
<<<<<<< HEAD
=======
import { enrollmentAPI } from "@/utils/api";
import { toast } from "sonner";
>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoInfinity } from "react-icons/go";
import { Input } from "@/components/ui/input";
const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { coursesById: course, loading, error, fetchCoursesById } = useStore();

  const { addToCart } = useContext(CartContext);

<<<<<<< HEAD
=======
  // Enrollment state
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [enrollmentProgress, setEnrollmentProgress] = useState(null);

>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02
  // Expand/Collapse
  const [expanded, setExpanded] = useState({});
  const [expandedAll, setExpandedAll] = useState(false);

  const toggleSection = (i) => {
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  // ⭐ Fetch course details (FULLY dynamic)
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCoursesById(id);
  }, [id, fetchCoursesById]);
<<<<<<< HEAD
=======

  // Check enrollment status
  useEffect(() => {
    const checkEnrollment = async () => {
      const token = localStorage.getItem("token");
      if (!token || !id) {
        setCheckingEnrollment(false);
        return;
      }

      try {
        const res = await enrollmentAPI.checkEnrollment(id);
        setIsEnrolled(res.data.isEnrolled);
        setEnrollmentProgress(res.data.progress);
      } catch (err) {
        // User not enrolled or not logged in
        setIsEnrolled(false);
      } finally {
        setCheckingEnrollment(false);
      }
    };

    if (id) {
      checkEnrollment();
    }
  }, [id]);

  // Handle enrollment
  const handleEnroll = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to enroll in courses");
      navigate("/login");
      return;
    }

    try {
      const res = await enrollmentAPI.enroll(id);
      setIsEnrolled(true);
      toast.success("Successfully enrolled in course!");
      // Navigate to first lecture or course content
      if (course?.curriculum?.[0]?.items?.[0]) {
        const firstLecture = course.curriculum[0].items[0];
        navigate(`/lecture/${firstLecture.itemId}?courseId=${id}`, {
          state: {
            lectureId: firstLecture.itemId,
            courseId: id,
          },
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to enroll in course");
    }
  };

  // Handle start learning (for enrolled users)
  const handleStartLearning = () => {
    if (!course?.curriculum?.[0]?.items?.[0]) return;
    const firstLecture = course.curriculum[0].items[0];
    navigate(`/lecture/${firstLecture.itemId}?courseId=${id}`, {
      state: {
        lectureId: firstLecture.itemId,
        courseId: id,
      },
    });
  };
>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02
  console.log("mohit", course);
  // ⭐ Add to cart
  const handleAddToCart = () => {
    localStorage.setItem(
      "courseToAdd",
      JSON.stringify({
        id: course.id,
        title: course.title,
        description: course.subtitle,
        price: course.price,
        thumbnailUrl: course.thumbnailUrl,
        isApiCourse: true,
      })
    );

    navigate("/cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleApplyCoupon = () => navigate("/cart");

  // ⭐ LOADING UI
  if (loading) {
    return (
      <div className="flex items-center w-full h-screen justify-center">
        <Spinner className="text-blue-600 size-12" />
      </div>
    );
  }

  // ⭐ ERROR UI
  if (error || !course) {
    return (
      <div
        style={{
          background: "#181821",
          minHeight: "100vh",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, color: "#f4c150" }}>
            {error || "Course not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-Background min-h-screen w-full mt-30 mb-20 font-poppins">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row px-5 py-5 md:p-0 gap-20">
        {/* MAIN CONTENT */}
        <div style={{ flex: 2 }}>
          {/* Title */}
          <div className="space-y-8">
            <div className="text-4xl font-semibold">{course.title}</div>
            <div className="font-inter text-TextSecondary">
              {course.subtitle}
            </div>

            <div className="text-TextSecondary">
              Created by{" "}
              <span className="font-semibold">{course.instructor?.name}</span>
            </div>

            <div className="text-TextSecondary flex gap-2 mb-5">
              <span>Last updated {course.lastUpdated}</span> ·{" "}
              <span>{course.language}</span>
            </div>
          </div>
          <div className="space-y-10">
            {/* What you'll learn */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">What you'll learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="font-inter">
                  {course.whatYouWillLearn?.map((item, idx) => (
                    <li key={idx} className="mb-2">
                      <span className="text-blue-600 mr-2">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="font-inter">
                  {course.requirements?.map((item, idx) => (
                    <li key={idx} className="mb-2">
                      <span className="text-blue-600 mr-2">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-inter">{course.description}</div>
              </CardContent>
            </Card>

            {/* ⭐ Course Content (Dynamic) */}
            {/* ⭐ Improved Course Content UI */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-inter">
                  {course.curriculum?.length} sections •{" "}
                  {course.curriculum?.reduce((n, s) => n + s.items.length, 0)}{" "}
                  lectures
                </div>
                <div
                  className="my-5 cursor-pointer"
                  onClick={() => setExpandedAll((prev) => !prev)}
                >
                  {expandedAll ? "Collapse all" : "Expand all"}
                </div>

                {course.curriculum?.map((section, sIdx) => (
                  <div
                    className="bg-Background rounded-md w-full p-3 mb-5"
                    key={sIdx}
                  >
                    {/* HEADER */}
                    <div
                      className="flex justify-between cursor-pointer"
                      onClick={() => toggleSection(sIdx)}
                    >
                      <div className="flex gap-2">
                        <span>
                          <IoMdArrowDropright
                            className={`text-2xl transition-all duration-300 ${
                              expanded[sIdx] ? "rotate-90" : ""
                            }`}
                          />
                        </span>
                        <span>{section.title}</span>
                      </div>

                      <span className="text-sm">
                        {section.items.length} lectures
                      </span>
                    </div>

                    {/* ITEMS */}
                    {(expandedAll || expanded[sIdx]) && (
                      <div className="mt-3 transition-all duration-300">
                        {section.items.map((item, iIdx) => (
                          <div
                            className="flex items-center gap-2 cursor-pointer px-3 py-2"
                            key={iIdx}
                            onClick={() =>
                              navigate(
                                `/lecture/${item.itemId}?courseId=${course.id}`,
                                {
                                  state: {
                                    lectureId: item.itemId,
                                    videoId: item.videoId,
                                    courseId: course.id,
                                    pendingCourseId: course.pendingCourseId,
                                  },
                                }
                              )
                            }
                          >
                            <span>
                              <GoVideo />
                            </span>
                            <span className="hover:underline">
                              {item.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Includes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Includes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3">This course includes:</div>
                <ul className="list-disc list-inside">
                  {course.includes?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <Card className="p-0 overflow-hidden">
            <img
              src={course.thumbnailUrl}
              alt="Course Thumbnail"
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.src =
                  "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg";
              }}
            />

            <CardContent className="flex flex-col">
              <div className="flex items-center gap-3 mb-5">
<<<<<<< HEAD
                <span className="text-2xl font-semibold">${course.price}</span>

                <span className="text-blue-600 text-sm">
                  {course.discount}% off
                </span>
              </div>
              <Button
                className="bg-Accent hover:bg-Accent/80 mb-5"
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>
              <Button
                variant="outline"
                className="border border-Accent text-Accent mb-5"
                onClick={handleBuyNow}
              >
                Buy now
              </Button>
=======
                <span className="text-2xl font-semibold">
                  {course.price === 0 || course.price === "0" ? "Free" : `₹${course.price}`}
                </span>
                {course.price > 0 && course.discount && (
                  <span className="text-blue-600 text-sm">
                    {course.discount}% off
                  </span>
                )}
              </div>

              {/* Show different buttons based on enrollment status */}
              {checkingEnrollment ? (
                <div className="mb-5 text-center">
                  <Spinner className="text-blue-600 size-6 mx-auto" />
                </div>
              ) : isEnrolled ? (
                <>
                  {enrollmentProgress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Your Progress</span>
                        <span className="font-semibold">
                          {enrollmentProgress.progressPercentage || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${enrollmentProgress.progressPercentage || 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <Button
                    className="bg-green-600 hover:bg-green-700 mb-5"
                    onClick={handleStartLearning}
                  >
                    {enrollmentProgress?.progressPercentage > 0
                      ? "Continue Learning"
                      : "Start Learning"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border border-gray-300 mb-5"
                    onClick={() => navigate("/my-learning")}
                  >
                    View in My Learning
                  </Button>
                </>
              ) : (
                <>
                  {course.price === 0 || course.price === "0" ? (
                    <Button
                      className="bg-Accent hover:bg-Accent/80 mb-5"
                      onClick={handleEnroll}
                    >
                      Enroll for Free
                    </Button>
                  ) : (
                    <>
                      <Button
                        className="bg-Accent hover:bg-Accent/80 mb-5"
                        onClick={handleAddToCart}
                      >
                        Add to cart
                      </Button>
                      <Button
                        variant="outline"
                        className="border border-Accent text-Accent mb-5"
                        onClick={handleBuyNow}
                      >
                        Buy now
                      </Button>
                    </>
                  )}
                </>
              )}
>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02
              <div className="flex items-center gap-2 mb-3">
                <GoInfinity />
                Full Lifetime Access
              </div>
              <div className="flex items-center mb-5 justify-center">
                <input
                  className="rounded-l-md px-3 py-[9px] border"
                  placeholder="Enter coupon code"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="rounded-r-md bg-Accent hover:bg-Accent/80 px-3 text-white py-2.5"
                >
                  Apply
                </button>
              </div>{" "}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
