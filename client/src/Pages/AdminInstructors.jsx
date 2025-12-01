import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../App";
import axios from "axios";

const AdminInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useContext(CartContext);

  // ADMIN PROTECTION
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "admin") {
    return (
      <div style={{ textAlign: "center", marginTop: 60 }}>
        <h2>Access denied. Admins only.</h2>
        <button
  style={{
    marginTop: 20,
    padding: "12px 32px",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 10px rgba(124, 58, 237, 0.3)",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#6d28d9";
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(109, 40, 217, 0.35)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#7c3aed";
    e.currentTarget.style.transform = "translateY(0px)";
    e.currentTarget.style.boxShadow = "0 4px 10px rgba(124, 58, 237, 0.3)";
  }}
  onClick={() => navigate("/login")}
>
  Go to Login
</button>
      </div>
    );
  }

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch all instructors
        const res1 = await fetch("https://lms-backend-5s5x.onrender.com/api/profile/instructors");
        const data1 = await res1.json();
        if (!res1.ok) throw new Error(data1.message || "Failed to fetch instructors");
        setInstructors(data1);
        // Fetch all published courses
                  const res2 = await fetch("https://lms-backend-5s5x.onrender.com/api/courses");
        const data2 = await res2.json();
        if (!res2.ok) throw new Error(data2.message || "Failed to fetch courses");
        setCourses(data2.filter(c => c.published));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleAddToCart = async (course) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to add items to cart');
        return;
      }

                  const response = await axios.post('https://lms-backend-5s5x.onrender.com/api/cart/add', {
        courseId: course._id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // Also add to local cart context for immediate UI update
        addToCart({
          id: course._id,
          title: course.title,
          description: course.description,
          price: course.price,
          thumbnailUrl: course.thumbnailUrl
        });
        alert('Course added to cart successfully!');
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message === 'Course already in cart') {
        alert('Course is already in your cart!');
      } else {
        alert('Failed to add course to cart. Please try again.');
      }
    }
  };

  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      marginTop: 60, 
      fontSize: '18px',
      color: '#666'
    }}>
      Loading instructors and courses...
    </div>
  );
  
  if (error) return (
    <div style={{ 
      color: '#e11d48', 
      textAlign: 'center', 
      marginTop: 60,
      fontSize: '16px'
    }}>
      {error}
    </div>
  );

  return (
    <div style={{ 
      maxWidth: 1400, 
      margin: '0 auto', 
      padding: '40px 24px',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '48px'
      }}>
        <h1 style={{ 
          fontWeight: 800, 
          fontSize: '42px', 
          marginBottom: '16px',
          color: '#1e293b',
          letterSpacing: '-0.025em'
        }}>
          Instructor Dashboard
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#64748b',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Manage and view all instructors and their published courses
        </p>
      </div>

      {instructors.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#64748b',
          fontSize: '18px',
          padding: '60px 20px'
        }}>
          No instructors found.
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', 
          gap: '32px'
        }}>
          {instructors.map(instr => {
            const instructorCourses = courses.filter(c => 
              c.instructor && (c.instructor._id === instr._id || c.instructor === instr._id)
            );
            
            return (
              <div key={instr._id} style={{ 
                background: '#ffffff', 
                borderRadius: '16px', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
              }}>
                
                {/* Instructor Header */}
                <div style={{ 
                  padding: '24px 24px 20px 24px',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '12px'
                  }}>
                    {/* Instructor Avatar */}
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '24px'
                    }}>
                      {instr.name ? instr.name.charAt(0).toUpperCase() : 'I'}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '700', 
                        fontSize: '20px', 
                        color: '#1e293b',
                        marginBottom: '4px'
                      }}>
                        {instr.name}
                      </div>
                      <div style={{ 
                        color: '#64748b', 
                        fontSize: '14px',
                        marginBottom: '4px'
                      }}>
                        {instr.email}
                      </div>
                      {instr.headline && (
                        <div style={{ 
                          color: '#7c3aed', 
                          fontSize: '13px',
                          fontWeight: '600'
                        }}>
                          {instr.headline}
            </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '24px',
                    marginTop: '16px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontWeight: '700', 
                        fontSize: '20px',
                        color: '#1e293b'
                      }}>
                        {instructorCourses.length}
                      </div>
                      <div style={{ 
                        fontSize: '12px',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Courses
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontWeight: '700', 
                        fontSize: '20px',
                        color: '#1e293b'
                      }}>
                        ₹{instructorCourses.reduce((total, course) => total + (course.price || 0), 0)}
                      </div>
                      <div style={{ 
                        fontSize: '12px',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Total Value
                      </div>
                    </div>
                  </div>
                </div>

                {/* Courses Section */}
                <div style={{ padding: '0 24px 24px 24px' }}>
                  <div style={{ 
                    fontWeight: '600', 
                    fontSize: '16px', 
                    marginBottom: '16px',
                    color: '#1e293b'
                  }}>
                    Published Courses
                  </div>
                  
                  {instructorCourses.length === 0 ? (
                    <div style={{ 
                      color: '#94a3b8', 
                      fontSize: '14px',
                      textAlign: 'center',
                      padding: '20px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      No published courses yet
                    </div>
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '16px'
                    }}>
                      {instructorCourses.map(course => (
                        <div key={course._id} style={{ 
                          background: '#f8fafc', 
                          borderRadius: '12px', 
                          padding: '16px',
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}>
                          
                          <div style={{ 
                            display: 'flex', 
                            gap: '12px',
                            alignItems: 'flex-start'
                          }}>
                            {/* Course Thumbnail */}
                            {course.thumbnailUrl ? (
                              <img 
                                src={course.thumbnailUrl} 
                                alt={course.title} 
                                style={{ 
                                  width: '80px', 
                                  height: '60px', 
                                  objectFit: 'cover', 
                                  borderRadius: '8px',
                                  flexShrink: 0
                                }}
                                onError={(e) => {
                                  e.target.src = "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg";
                                }}
                              />
                            ) : (
                              <div style={{
                                width: '80px',
                                height: '60px',
                                backgroundColor: '#e2e8f0',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#94a3b8',
                                fontSize: '12px',
                                flexShrink: 0
                              }}>
                                No Image
                              </div>
                            )}
                            
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ 
                                fontWeight: '600', 
                                fontSize: '15px',
                                color: '#1e293b',
                                marginBottom: '4px',
                                lineHeight: '1.3'
                              }}>
                                {course.title}
                              </div>
                              <div style={{ 
                                color: '#64748b', 
                                fontSize: '13px',
                                marginBottom: '8px',
                                lineHeight: '1.4'
                              }}>
                                {course.description && course.description.length > 80 
                                  ? course.description.substring(0, 80) + '...' 
                                  : course.description}
                              </div>
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <div style={{ 
                                  color: '#7c3aed', 
                                  fontWeight: '700', 
                                  fontSize: '16px'
                                }}>
                                  ₹{course.price || '0'}
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(course);
                                  }}
                                  style={{
                                    background: '#7c3aed',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
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
                          </div>
                  </div>
                ))}
              </div>
            )}
          </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminInstructors; 