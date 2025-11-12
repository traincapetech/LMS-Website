
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "./CourseData";
import { CartContext } from "../App";
import axios from "axios";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    // Store course information in localStorage to pass to cart page
    const courseToAdd = {
      id: course.id,
      title: course.title,
      description: course.subtitle,
      price: course.price,
      thumbnailUrl: course.thumbnailUrl,
      isApiCourse: course.id && course.id.length > 20 // MongoDB ObjectId length
    };

    // Store the course info temporarily for the cart page
    localStorage.setItem('courseToAdd', JSON.stringify(courseToAdd));

    // Redirect to cart page
    navigate('/cart');
  };

  const handleBuyNow = () => {
    // First add to cart, then redirect to cart
    handleAddToCart().then(() => {
      window.location.href = '/cart';
    });
  };

  const handleApplyCoupon = () => {
    // Redirect to cart where they can apply coupons
    window.location.href = '/cart';
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        // First try to get from API
        try {
          const response = await axios.get(`https://lms-backend-5s5x.onrender.com/api/courses/${id}`);
          const apiCourse = response.data;

          // Transform API data to match the expected format
          const transformedCourse = {
            id: apiCourse._id,
            title: apiCourse.title,
            subtitle: apiCourse.subtitle || apiCourse.description,
            instructor: {
              name: apiCourse.instructor?.name || "Instructor",
              role: "Instructor",
              avatar: "https://img-c.udemycdn.com/user/200_H/437533_72a6_2.jpg"
            },
            rating: apiCourse.rating || 4.5,
            ratingsCount: apiCourse.ratingsCount || 100,
            learners: apiCourse.learners || 1000,
            lastUpdated: "1/2025",
            language: apiCourse.language || "English",
            autoLanguages: ["Spanish", "French"],
            bestseller: false,
            price: apiCourse.price || 99.99,
            originalPrice: (apiCourse.price || 99.99) * 1.5,
            discount: 33,
            thumbnailUrl: apiCourse.thumbnailUrl || "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
            whatYouWillLearn: apiCourse.learningObjectives || [
              "Learn the fundamentals",
              "Build real-world projects",
              "Master the concepts"
            ],
            requirements: [
              "Basic computer knowledge",
              "A computer with internet access",
              "Willingness to learn"
            ],
            description: apiCourse.description,
            courseContent: { totalSections: 10, totalLectures: 50, totalLength: "5h 30m" },
            includes: ["5.5 hours on-demand video", "10 articles", "50 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
          };

          setCourse(transformedCourse);
        } catch (apiError) {
          // If API fails, fallback to static data
          console.log("API failed, using static data:", apiError);
          const staticCourse = getCourseById(id);
          if (staticCourse) {
            setCourse(staticCourse);
          } else {
            setError("Course not found");
          }
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);


  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (!id) return;
        const res = await fetch(`http://localhost:5001/api/videos/${id}`);

        const videodata = await res.json();

        if (videodata.success && videodata.videos) {
          setVideos(videodata.videos); // ensure correct data structure
        } else {
          console.log("No videos found for this course");
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };

    fetchVideos();
  }, [id]);


  if (loading) {
    return (
      <div style={{ background: '#181821', minHeight: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#f4c150', marginBottom: '16px' }}>Loading course...</div>
          <div style={{ color: '#b1b1b1' }}>Please wait while we fetch the course details.</div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div style={{ background: '#181821', minHeight: '100vh', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#f4c150', marginBottom: '16px' }}>
            {error || "Course not found"}
          </div>
          <div style={{ color: '#b1b1b1' }}>
            The course you're looking for doesn't exist or has been removed.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#181821', minHeight: '100vh', color: '#fff', padding: 0 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 0 24px', display: 'flex', gap: 32 }}>
        {/* Main Content */}
        <div style={{ flex: 2 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{course.title}</div>
            <div style={{ fontSize: 20, color: '#d1d7dc', margin: '12px 0 18px 0' }}>{course.subtitle}</div>
            {course.bestseller && (
              <span style={{ background: '#eceb98', color: '#6a6f09', fontWeight: 700, borderRadius: 4, padding: '2px 10px', fontSize: 14, marginRight: 8 }}>Bestseller</span>
            )}
            <div style={{ fontSize: 15, color: '#b1b1b1', margin: '10px 0' }}>
              Created by <span style={{ color: '#fff', fontWeight: 600 }}>{course.instructor.name}</span>, {course.instructor.role}
            </div>
            <div style={{ fontSize: 14, color: '#b1b1b1', margin: '6px 0' }}>
              <span>Last updated {course.lastUpdated}</span> · <span>{course.language}</span>
              {course.autoLanguages && course.autoLanguages.length > 0 && (
                <> · <span>Auto: {course.autoLanguages.join(", ")}</span></>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#f4c150', marginRight: 6 }}>{course.rating}</span>
              <span style={{ color: '#b1b1b1', fontSize: 15 }}>★</span>
              <span style={{ color: '#b1b1b1', fontSize: 15, marginLeft: 8 }}>{course.ratingsCount.toLocaleString()} ratings</span>
              <span style={{ color: '#b1b1b1', fontSize: 15, marginLeft: 8 }}>{course.learners.toLocaleString()} learners</span>
            </div>
          </div>

          {/* What you'll learn */}
          <div style={{ background: '#22223b', borderRadius: 8, padding: 24, marginBottom: 32 }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>What you'll learn</div>
            <ul style={{ listStyle: 'none', padding: 0, color: '#fff' }}>
              {course.whatYouWillLearn.map((item, idx) => (
                <li key={idx} style={{ marginBottom: 8, fontSize: 16, display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ marginRight: 12, color: '#f4c150', fontSize: 18 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div style={{ background: '#22223b', borderRadius: 8, padding: 24, marginBottom: 32 }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Requirements</div>
            <ul style={{ listStyle: 'none', padding: 0, color: '#fff' }}>
              {course.requirements.map((item, idx) => (
                <li key={idx} style={{ marginBottom: 8, fontSize: 16, display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ marginRight: 12, color: '#f4c150', fontSize: 18 }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Description */}
          <div style={{ background: '#22223b', borderRadius: 8, padding: 24, marginBottom: 32 }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Description</div>
            <div style={{ fontSize: 16, lineHeight: 1.6, color: '#fff' }}>
              {course.description}
            </div>
          </div>

          {/* Course Content */}
          <div style={{ background: '#22223b', borderRadius: 8, padding: 24, marginBottom: 32 }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Course content</div>
            <div style={{ fontSize: 16, color: '#b1b1b1', marginBottom: 16 }}>
              {course.courseContent.totalSections} sections • {course.courseContent.totalLectures} lectures • {course.courseContent.totalLength} total length
            </div>
            <div style={{ fontSize: 14, color: '#f4c150', cursor: 'pointer' }}>Expand all sections</div>

            <div>
              <h2 style={{ color: "#f4c150", marginBottom: "15px" }}>Course Videos</h2>

              {videos.length > 0 ? (
                videos.map((video, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "10px",
                      padding: "12px 16px",
                      background: "#2a2a3b",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "background 0.3s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#3b3b4a")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#2a2a3b")}
                    onClick={() =>
                      navigate(`/play-video/${video._id}`, {
                        state: {
                          video,        // current clicked video
                          videos,       // all videos in this course ✅
                          courseId: {id},
                        },
                      })
                    }

                  >

                    <span style={{ color: "#fff", fontSize: "16px", fontWeight: "500" }}>
                      🎬 {video.title} 
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ color: "#b1b1b1" }}>No videos available for this course.</p>
              )}
            </div>

            {course.courseContent.sections && course.courseContent.sections.slice(0, 3).map((section, idx) => (
              <div key={idx} style={{ marginTop: 16, padding: '12px 0', borderBottom: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 16, color: '#fff' }}>{section.title}</span>
                  <span style={{ fontSize: 14, color: '#b1b1b1' }}>{section.lectures} lectures • {section.duration}</span>
                </div>
              </div>
            ))}
            {!course.courseContent.sections && (
              <div style={{ marginTop: 16, padding: '12px 0', color: '#b1b1b1', fontSize: 14 }}>
                Course sections will be available after enrollment
              </div>
            )}
          </div>


          {/* This course includes */}
          <div style={{ background: '#22223b', borderRadius: 8, padding: 24, marginBottom: 32 }}>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>This course includes:</div>
            <ul style={{ listStyle: 'none', padding: 0, color: '#fff' }}>
              {course.includes.map((item, idx) => (
                <li key={idx} style={{ marginBottom: 8, fontSize: 16, display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ marginRight: 12, color: '#f4c150', fontSize: 18 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>


          </div>

        </div>

        {/* Sidebar */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ background: '#23272f', borderRadius: 8, padding: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
            <img
              src={course.thumbnailUrl}
              alt="Course Preview"
              style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
              onError={(e) => {
                // Fallback to default image if the uploaded image fails to load
                e.target.src = "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg";
              }}
            />

            {/* Pricing */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>${course.price}</span>
                <span style={{ fontSize: 18, color: '#b1b1b1', textDecoration: 'line-through', marginLeft: 12 }}>${course.originalPrice}</span>
                <span style={{ fontSize: 14, color: '#f4c150', marginLeft: 8 }}>{course.discount}% off</span>
              </div>
              <div style={{ fontSize: 14, color: '#f4c150', marginBottom: 16 }}>
                ⏰ 1 day left at this price!
              </div>
            </div>

            {/* Buttons */}
            <button style={{ width: '100%', background: '#a435f0', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 6, padding: '14px 0', marginBottom: 12, cursor: 'pointer' }} onClick={handleAddToCart}>
              Add to cart
            </button>
            <button style={{ width: '100%', background: 'transparent', color: '#a435f0', fontWeight: 700, fontSize: 18, border: '2px solid #a435f0', borderRadius: 6, padding: '12px 0', marginBottom: 12, cursor: 'pointer' }} onClick={handleBuyNow}>
              Buy now
            </button>

            {/* Guarantees */}
            <div style={{ color: '#b1b1b1', fontSize: 15, textAlign: 'center', marginBottom: 16 }}>
              30-Day Money-Back Guarantee
            </div>
            <div style={{ color: '#b1b1b1', fontSize: 15, textAlign: 'center', marginBottom: 16 }}>
              Full Lifetime Access
            </div>

            {/* Share and Gift */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#a435f0', marginTop: 16 }}>
              <span style={{ cursor: 'pointer' }}>Share</span>
              <span style={{ cursor: 'pointer' }}>Gift this course</span>
              <span style={{ cursor: 'pointer' }} onClick={handleApplyCoupon}>Apply Coupon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails; 