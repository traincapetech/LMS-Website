import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import UserProfileDropdown from "./UserProfileDropdown";
import { getAllCourses, searchCourses } from "../Pages/CourseData";

const Navbar = ({ cartCount = 0 }) => {
  const [user, setUser] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasPublishedCourses, setHasPublishedCourses] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const [loginHover, setLoginHover] = useState(false);
  const [isSearchHover, setIsSearchHover] = useState(false);


  const navLinkBaseStyle = {
    textDecoration: "none",
    color: "#111",
    padding: "6px 12px",
    borderRadius: "6px", // reactangle shape
    transition: "background-color 0.2s ease, color 0.2s ease",
  };

  const handleNavHover = (e, isHover) => {
    e.target.style.backgroundColor = isHover
      ? "rgba(86, 36, 208, 0.08)"
      : "transparent";
    e.target.style.color = isHover ? "#5624d0" : "#111";
  };

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Fetch latest profile from backend
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(
          "https://lms-backend-5s5x.onrender.com/api/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
        }
      } catch {}
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    function handleStorageChange() {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch if instructor has published courses
  useEffect(() => {
    const fetchInstructorCourses = async () => {
      if (user && user.role === "instructor") {
        try {
          const res = await fetch(
            "https://lms-backend-5s5x.onrender.com/api/courses"
          );
          const data = await res.json();
          if (Array.isArray(data)) {
            setHasPublishedCourses(
              data.some(
                (c) =>
                  c.published &&
                  c.instructor &&
                  (c.instructor._id === user._id || c.instructor === user._id)
              )
            );
          }
        } catch {}
      } else {
        setHasPublishedCourses(false);
      }
    };
    fetchInstructorCourses();
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    }
    if (dropdownOpen || mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, mobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    window.location.href = "/login";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  // Helper to get user initial
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 1);
  };

  return (
    <>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          borderBottom: "1px solid #ccc",
          backgroundColor: "rgba(86, 36, 208, 0.1)",

          fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
          position: "relative",
          height: "70px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#111" }}>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "800",
                color: "#111",
                cursor: "pointer",
              }}
            >
              Traincape LMS
            </h1>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div
          style={{
            display: !isMobile ? "flex" : "none",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            margin: "0 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: isSearchHover ? "#f3f4f6" : "#ffffff",
              borderRadius: "8px",
              padding: "0 16px", // sirf left-right padding
              width: "100%",
              border: isSearchFocused ? "2px solid #400303" : "1px solid #ddd",
              boxShadow: isSearchFocused
                ? "0 0 0 2px rgba(86, 36, 208, 0.15)"
                : "none",
              transition: "all 0s ease",
              
            }}
            onMouseEnter={() => setIsSearchHover(true)}
            onMouseLeave={() => setIsSearchHover(false)}
          >
            <form onSubmit={handleSearch} style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Search for courses, skills, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  color: "#111",
                  fontSize: "16px",
                  padding: "12px 0", // equal top & bottom padding
                  boxSizing: "border-box",
                  boxShadow: "none",
                  marginBottom: "0px",
                }}
              />
            </form>
            <FiSearch
              style={{
                marginLeft: "16px",
                color: "#9ca3af",
                fontSize: "20px",
                cursor: "pointer",
              }}
              onClick={handleSearch}
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div
          style={{
            display: !isMobile ? "flex" : "none",
            alignItems: "center",
            gap: "16px",
            fontSize: "18px",
            fontWeight: "600",
          }}
        >
          <Link
            to="/plans"
            style={navLinkBaseStyle}
            onMouseEnter={(e) => handleNavHover(e, true)}
            onMouseLeave={(e) => handleNavHover(e, false)}
          >
            Plans & Pricing
          </Link>

          <Link
            to="/courses"
            style={navLinkBaseStyle}
            onMouseEnter={(e) => handleNavHover(e, true)}
            onMouseLeave={(e) => handleNavHover(e, false)}
          >
            Courses
          </Link>

          <a
            href="https://traincapetech.in/"
            target="_blank"
            rel="noopener noreferrer"
            style={navLinkBaseStyle}
            onMouseEnter={(e) => handleNavHover(e, true)}
            onMouseLeave={(e) => handleNavHover(e, false)}
          >
            Business
          </a>

          <Link
            to="/teach"
            style={navLinkBaseStyle}
            onMouseEnter={(e) => handleNavHover(e, true)}
            onMouseLeave={(e) => handleNavHover(e, false)}
          >
            Teach
          </Link>

          {/* Admin Links */}
          {user && user.role === "admin" && (
            <>
              <a
                href="/admin"
                style={{
                  textDecoration: "none",
                  fontWeight: "bold",
                  color: "#dc2626",
                }}
              >
                Admin
              </a>
              <Link
                to="/admin/instructors"
                style={{ textDecoration: "none", color: "#111" }}
              >
                Instructors
              </Link>
            </>
          )}

          {/* Instructor Dashboard */}
          {user &&
            (user.role === "instructor" || user.role === "admin") &&
            hasPublishedCourses && (
              <Link
                to="/instructor-dashboard"
                style={{ textDecoration: "none", color: "#111" }}
              >
                Instructor Dashboard
              </Link>
            )}

          {/* Cart */}
<div style={{ position: "relative" }}>
  <Link
    to="/cart"
    style={{
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "6px 10px",
      borderRadius: "6px",
      border: "1px solid #000",      // black outline
      backgroundColor: "#ffffff",
      textDecoration: "none",
    }}
  >
    <FiShoppingCart
      style={{
        fontSize: "20px",
        cursor: "pointer",
        color: "#000",
      }}
    />

    {cartCount > 0 && (
      <span
        style={{
          position: "absolute",
          top: -6,
          right: -6,
          background: "red",
          color: "white",
          borderRadius: "50%",
          padding: "2px 6px",
          fontSize: 12,
          fontWeight: "bold",
        }}
      >
        {cartCount}
      </span>
    )}
  </Link>
</div>


          {/* User Authentication */}
          {!user ? (
            <>
              <Link
                to="/login"
                onMouseEnter={() => setLoginHover(true)}
                onMouseLeave={() => setLoginHover(false)}
                style={{
                  border: "1px solid #444",
                  backgroundColor: loginHover? "rgba(86, 36, 208, 0.7)": "rgba(86, 36, 208, 0.3)",
                  padding: "7px 14px",
                  cursor: "pointer",
                  color: "#111",
                  textDecoration: "none",
                  transition: "background-color 0.3s ease", // Smooth color change
                  fontWeight: "bold",
                  borderRadius: "6px", 
                }}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "7px 14px",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "none",
                  borderRadius: "6px",
                }}
              >
                Sign up
              </Link>
            </>
          ) : (
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <div
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#222",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 18,
                  overflow: "hidden",
                }}
                onClick={() => setDropdownOpen((open) => !open)}
                title="Account"
              >
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              {dropdownOpen && (
                <UserProfileDropdown
                  user={user}
                  cartCount={cartCount}
                  onLogout={handleLogout}
                  onProfilePhotoUpload={(photoUrl) => {
                    const updatedUser = { ...user, photoUrl };
                    setUser(updatedUser);
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div
          style={{
            display: isMobile ? "flex" : "none",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Mobile Search Icon */}
          <div style={{ display: isMobile ? "block" : "none" }}>
            <FiSearch
              style={{ fontSize: "22px", cursor: "pointer" }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>

          {/* Mobile Cart */}
          <div style={{ position: "relative" }}>
            <Link to="/cart">
              <FiShoppingCart style={{ fontSize: "22px", cursor: "pointer" }} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              color: "#111",
              cursor: "pointer",
              border: "none",
              background: "none",
            }}
          >
            {mobileMenuOpen ? (
              <FiX style={{ fontSize: "24px" }} />
            ) : (
              <FiMenu style={{ fontSize: "24px" }} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {mobileMenuOpen && (
        <div
          style={{
            display: isMobile ? "block" : "none",
            borderTop: "1px solid #ccc",
            backgroundColor: "#f9fafb",
            padding: "12px 20px",
          }}
        >
          <form onSubmit={handleSearch} style={{ display: "flex" }}>
            <input
              type="text"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                backgroundColor: "#7c3aed",
                color: "white",
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FiSearch style={{ width: "20px", height: "20px" }} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          style={{
            display: isMobile ? "block" : "none",
            backgroundColor: "white",
            borderBottom: "1px solid #ccc",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: "100vh",
            overflowY: "auto",
            animation: "slideDown 0.3s ease-out",
          }}
        >
          {/* Mobile Menu Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: "#f8f9fa",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#111",
                margin: 0,
              }}
            >
              Menu
            </h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#111",
                padding: "4px",
              }}
            >
              <FiX />
            </button>
          </div>

          <div style={{ padding: "8px 16px" }}>
            {/* Navigation Links */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
              }}
            >
              <Link
                to="/plans"
                style={{
                  display: "block",
                  padding: "16px 12px",
                  color: "#111",
                  textDecoration: "none",
                  borderBottom: "1px solid #f0f0f0",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderRadius: "8px",
                  marginBottom: "4px",
                  transition: "background-color 0.2s",
                }}
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                💰 Plans & Pricing
              </Link>
              <Link
                to="/courses"
                style={{
                  display: "block",
                  padding: "16px 12px",
                  color: "#111",
                  textDecoration: "none",
                  borderBottom: "1px solid #f0f0f0",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderRadius: "8px",
                  marginBottom: "4px",
                  transition: "background-color 0.2s",
                }}
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                📚 Courses
              </Link>
              <a
                href="https://traincapetech.in/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "16px 12px",
                  color: "#111",
                  textDecoration: "none",
                  borderBottom: "1px solid #f0f0f0",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderRadius: "8px",
                  marginBottom: "4px",
                  transition: "background-color 0.2s",
                }}
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                🏢 Business
              </a>
              <Link
                to="/teach"
                style={{
                  display: "block",
                  padding: "16px 12px",
                  color: "#111",
                  textDecoration: "none",
                  borderBottom: "1px solid #f0f0f0",
                  fontSize: "16px",
                  fontWeight: "500",
                  borderRadius: "8px",
                  marginBottom: "4px",
                  transition: "background-color 0.2s",
                }}
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                👨‍🏫 Teach
              </Link>

              {/* Admin Mobile Links */}
              {user && user.role === "admin" && (
                <>
                  <Link
                    to="/admin"
                    style={{
                      display: "block",
                      padding: "16px 12px",
                      color: "#dc2626",
                      fontWeight: "bold",
                      textDecoration: "none",
                      borderBottom: "1px solid #f0f0f0",
                      fontSize: "16px",
                      borderRadius: "8px",
                      marginBottom: "4px",
                      transition: "background-color 0.2s",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#fef2f2")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    ⚙️ Admin
                  </Link>
                  <Link
                    to="/admin/instructors"
                    style={{
                      display: "block",
                      padding: "16px 12px",
                      color: "#111",
                      textDecoration: "none",
                      borderBottom: "1px solid #f0f0f0",
                      fontSize: "16px",
                      fontWeight: "500",
                      borderRadius: "8px",
                      marginBottom: "4px",
                      transition: "background-color 0.2s",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    👥 Instructors
                  </Link>
                </>
              )}

              {/* Instructor Dashboard Mobile */}
              {user &&
                (user.role === "instructor" || user.role === "admin") &&
                hasPublishedCourses && (
                  <Link
                    to="/instructor-dashboard"
                    style={{
                      display: "block",
                      padding: "16px 12px",
                      color: "#111",
                      textDecoration: "none",
                      borderBottom: "1px solid #f0f0f0",
                      fontSize: "16px",
                      fontWeight: "500",
                      borderRadius: "8px",
                      marginBottom: "4px",
                      transition: "background-color 0.2s",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    📊 Instructor Dashboard
                  </Link>
                )}
            </div>

            {/* User Authentication Mobile */}
            {!user ? (
              <div
                style={{
                  paddingTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <Link
                  to="/login"
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    padding: "14px 16px",
                    border: "2px solid #e5e7eb",
                    backgroundColor: "transparent",
                    color: "#111",
                    fontWeight: "600",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#f8f9fa";
                    e.target.style.borderColor = "#d1d5db";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.borderColor = "#e5e7eb";
                  }}
                >
                  🔐 Log in
                </Link>
                <Link
                  to="/signup"
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    padding: "14px 16px",
                    backgroundColor: "#111",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#374151")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#111")
                  }
                >
                  ✨ Sign up
                </Link>
              </div>
            ) : (
              <div
                style={{
                  paddingTop: "16px",
                  borderTop: "2px solid #e5e7eb",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 12px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        backgroundColor: "#374151",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px",
                        overflow: "hidden",
                      }}
                    >
                      {user.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt="Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        getInitials(user.name)
                      )}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#111",
                          fontSize: "16px",
                          marginBottom: "2px",
                        }}
                      >
                        {user.name}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          textTransform: "capitalize",
                          fontWeight: "500",
                        }}
                      >
                        {user.role}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      color: "#dc2626",
                      fontWeight: "600",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#fef2f2")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add CSS for slide down animation */}
      <style>
        {`
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
