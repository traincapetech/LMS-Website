import React, { useState, useEffect, useContext } from "react";
import { getAllCourses, searchCourses } from "./CourseData";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CartContext } from "../App";
import axios from "axios";

const Courses = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [courses, setCourses] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = async (course, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Store course information in localStorage to pass to cart page
    const courseToAdd = {
      id: course.id,
      title: course.title,
      description: course.subtitle,
      price: course.price,
      thumbnailUrl: course.thumbnailUrl,
      isApiCourse: course.isApiCourse
    };
    
    // Store the course info temporarily for the cart page
    localStorage.setItem('courseToAdd', JSON.stringify(courseToAdd));
    
    // Redirect to cart page
    navigate('/cart');
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (searchQuery) {
          // For search, use the static data
          const results = searchCourses(searchQuery);
          setCourses(results);
          setSearchResults({ query: searchQuery, count: results.length });
        } else {
          // Get both API courses and static courses
          let allCourses = [];
          
          // Get static courses from CourseData.js
          const staticCourses = getAllCourses();
          allCourses = [...staticCourses];
          
          // Try to get API courses and add them
          try {
            const response = await axios.get("https://lms-backend-5s5x.onrender.com/api/courses");
            const apiCourses = response.data.map(course => ({
              id: course._id,
              title: course.title,
              subtitle: course.subtitle || course.description,
              instructor: { 
                name: course.instructor?.name || "Instructor", 
                role: "Instructor", 
                avatar: "https://img-c.udemycdn.com/user/200_H/437533_72a6_2.jpg" 
              },
              rating: course.rating || 4.5,
              ratingsCount: course.ratingsCount || 100,
              learners: course.learners || 1000,
              lastUpdated: "1/2025",
              language: course.language || "English",
              autoLanguages: ["Spanish", "French"],
              bestseller: false,
              price: course.price || 99.99,
              originalPrice: (course.price || 99.99) * 1.5,
              discount: 33,
              thumbnailUrl: course.thumbnailUrl || "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
              whatYouWillLearn: course.learningObjectives || [
                "Learn the fundamentals",
                "Build real-world projects",
                "Master the concepts"
              ],
              requirements: [
                "Basic computer knowledge",
                "A computer with internet access",
                "Willingness to learn"
              ],
              description: course.description,
              courseContent: { totalSections: 10, totalLectures: 50, totalLength: "5h 30m" },
              includes: ["5.5 hours on-demand video", "10 articles", "50 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"],
              isApiCourse: true // Flag to identify API courses
            }));
            
            // Add API courses to the list
            allCourses = [...staticCourses, ...apiCourses];
          } catch (apiError) {
            console.log("API courses failed to load, showing only static courses:", apiError);
            // If API fails, we still have static courses
          }
          
          setCourses(allCourses);
          setSearchResults(null);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
        // Fallback to static data if everything fails
        setCourses(getAllCourses());
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [searchQuery]);

  if (loading) {
    return (
      <div style={{ background: '#f7f7fa', minHeight: '100vh', padding: '40px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#5624d0', marginBottom: '16px' }}>Loading courses...</div>
          <div style={{ color: '#6a6f73' }}>Please wait while we fetch the latest courses.</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#f7f7fa', minHeight: '100vh', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1c1d1f', marginBottom: '16px' }}>
            Explore Our Courses
          </h1>
          <div style={{ color: 'red', marginBottom: '24px', padding: '16px', background: '#f8d7da', borderRadius: '8px' }}>
            {error}
          </div>
          <p style={{ color: '#6a6f73', marginBottom: '24px' }}>
            Showing sample courses while we resolve the issue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f7f7fa', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1c1d1f', marginBottom: '24px', textAlign: 'center' }}>
       
        </h1>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#1c1d1f', marginBottom: 16 }}>
            {searchResults ? `Search Results for "${searchResults.query}"` : 'Explore Our Courses'}
          </h1>
          {searchResults && (
            <p style={{ fontSize: 18, color: '#6a6f73' }}>
              Found {searchResults.count} course{searchResults.count !== 1 ? 's' : ''}
            </p>
          )}
          
          {/* Coupon Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '12px',
            marginTop: '24px',
            display: 'inline-block',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}>
            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
              🎫 Special First-Time Purchase Offer!
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
              Use code <strong>WELCOME40</strong> or <strong>NEWUSER40</strong> for 40% off on your first purchase!
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              Add courses to cart and apply the coupon during checkout.
            </div>
          </div>
          
         
        </div>
        
      {courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#1c1d1f', marginBottom: '16px' }}>
              {searchResults ? 'No courses found' : 'No courses available'}
            </h2>
            <p style={{ color: '#6a6f73', marginBottom: '24px' }}>
              {searchResults 
                ? `No courses match your search for "${searchResults.query}". Try different keywords.`
                : 'Check back later for new courses!'
              }
            </p>
            {searchResults && (
              <Link 
                to="/courses" 
                style={{ 
                  background: '#a435f0', 
                  color: 'white', 
                  padding: '12px 24px', 
                  borderRadius: '6px', 
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                View All Courses
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {courses.map((course) => (
              <Link 
                key={course.id} 
                to={`/course/${course.id}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
                onClick={() => window.scrollTo(0, 0)}
              >
                <div style={{ 
                  background: '#fff', 
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
                >
                  {/* Course Image */}
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={course.thumbnailUrl} 
                      alt={course.title}
                      style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                      onError={(e) => {
                        // Fallback to default image if the uploaded image fails to load
                        e.target.src = "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg";
                      }}
                    />
                    {course.bestseller && (
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: '#eceb98',
                        color: '#6a6f09',
                        fontWeight: 700,
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '12px'
                      }}>
                        Bestseller
                      </span>
                    )}
                    {/* Show "New" badge for API courses */}
                    {course.isApiCourse && (
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#28a745',
                        color: 'white',
                        fontWeight: 700,
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '12px'
                      }}>
                        New
                      </span>
                    )}
                  </div>

                  {/* Course Info */}
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: 700, 
                      color: '#1c1d1f', 
                      marginBottom: '8px',
                      lineHeight: 1.3,
                      height: '42px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {course.title}
                    </h3>
                    
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#6a6f73', 
                      marginBottom: '8px',
                      height: '32px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {course.subtitle}
                    </p>

                    {/* Instructor */}
                    <div style={{ fontSize: '12px', color: '#6a6f73', marginBottom: '8px' }}>
                      {course.instructor.name}
                    </div>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#b4690e', marginRight: '4px' }}>
                        {course.rating}
                      </span>
                      <span style={{ color: '#b4690e', fontSize: '12px' }}>★</span>
                      <span style={{ fontSize: '12px', color: '#6a6f73', marginLeft: '4px' }}>
                        ({course.ratingsCount.toLocaleString()})
                      </span>
                    </div>

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: '#1c1d1f' }}>
                        ${course.price}
                      </span>
                      <span style={{ 
                        fontSize: '14px', 
                        color: '#6a6f73', 
                        textDecoration: 'line-through', 
                        marginLeft: '8px' 
                      }}>
                        ${course.originalPrice}
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#f4c150', 
                        fontWeight: 700, 
                        marginLeft: '8px' 
                      }}>
                        {course.discount}% off
                      </span>
                    </div>

                    {/* Course Stats */}
                    <div style={{ fontSize: '12px', color: '#6a6f73', marginBottom: '12px' }}>
                      {course.courseContent.totalLength} • {course.courseContent.totalLectures} lectures
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(course, e)}
                      style={{
                        width: '100%',
                        background: '#7c3aed',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '10px 16px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        marginTop: '8px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#6d28d9';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#7c3aed';
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Courses; 