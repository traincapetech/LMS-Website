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
// Note: Ensure this import path is correct for your project structure
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

  // ✅ CHANGED: Text color to White (#FFFFFF)
  const navLinkBaseStyle = {
    textDecoration: "none",
    color: "#FFFFFF", 
    padding: "6px 12px",
    borderRadius: "6px",
    transition: "background-color 0.2s ease, color 0.2s ease",
  };

  // ✅ CHANGED: MouseLeave color back to White
  const handleNavHover = (e, isHover) => {
    e.target.style.backgroundColor = isHover
      ? "rgba(255, 255, 255, 0.1)" // Light transparent white on hover
      : "transparent";
    e.target.style.color = "#FFFFFF"; 
  };

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
          borderBottom: "1px solid #222", // Darker border
          backgroundColor: "#050505",     // ✅ Black Background
          fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
          position: "relative",
          height: "70px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#FFFFFF" }}> {/* ✅ White Logo */}
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "800",
                color: "#FFFFFF", // ✅ White Text
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
              backgroundColor: "#ffffff", // Keep White for search bar as per image
              borderRadius: "8px",
              padding: "0 16px",
              width: "100%",
              border: isSearchFocused ? "2px solid #a67cff" : "1px solid #ddd",
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
                  color: "#111", // Black text inside white search bar
                  fontSize: "16px",
                  padding: "12px 0",
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
                  color: "#dc2626", // Red for admin remains
                }}
              >
                Admin
              </a>
              <Link
                to="/admin/instructors"
                style={{ textDecoration: "none", color: "#FFFFFF" }}
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
                style={{ textDecoration: "none", color: "#FFFFFF" }}
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
                border: "1px solid #FFFFFF", // ✅ White outline
                backgroundColor: "transparent",
                textDecoration: "none",
              }}
            >
              <FiShoppingCart
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#FFFFFF", // ✅ White Icon
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
                  border: "1px solid #FFFFFF", // ✅ White border
                  backgroundColor: loginHover
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                  padding: "7px 14px",
                  cursor: "pointer",
                  color: "#FFFFFF", // ✅ White text
                  textDecoration: "none",
                  transition: "background-color 0.3s ease",
                  fontWeight: "bold",
                  borderRadius: "6px",
                }}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                style={{
                  backgroundColor: "#FFFFFF", // ✅ White background
                  color: "#000000",           // ✅ Black text
                  padding: "7px 14px",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
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
                  background: "#333",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 18,
                  overflow: "hidden",
                  border: "1px solid #fff", // White border around profile
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
              style={{ fontSize: "22px", cursor: "pointer", color: "#FFF" }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>

          {/* Mobile Cart */}
          <div style={{ position: "relative" }}>
            <Link to="/cart">
              <FiShoppingCart style={{ fontSize: "22px", cursor: "pointer", color: "#FFF" }} />
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
              color: "#FFFFFF", // ✅ White Menu Icon
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
            borderTop: "1px solid #333",
            backgroundColor: "#111", // Dark for mobile menu
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
                border: "1px solid #444",
                backgroundColor: "#222",
                color: "#fff",
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
            backgroundColor: "#050505", // Dark BG
            borderBottom: "1px solid #333",
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
              borderBottom: "1px solid #333",
              backgroundColor: "#111",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#FFF",
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
                color: "#FFF",
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
                  color: "#FFF", // White Text
                  textDecoration: "none",
                  borderBottom: "1px solid #333",
                  fontSize: "16px",
                  fontWeight: "500",
                  marginBottom: "4px",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                💰 Plans & Pricing
              </Link>
              <Link
                to="/courses"
                style={{
                  display: "block",
                  padding: "16px 12px",
                  color: "#FFF",
                  textDecoration: "none",
                  borderBottom: "1px solid #333",
                  fontSize: "16px",
                  fontWeight: "500",
                  marginBottom: "4px",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                📚 Courses
              </Link>
              <Link
                to="/teach"
                style={{
                  display: "block",
                  padding: "16px 12px",
                  color: "#FFF",
                  textDecoration: "none",
                  borderBottom: "1px solid #333",
                  fontSize: "16px",
                  fontWeight: "500",
                  marginBottom: "4px",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                👨‍🏫 Teach
              </Link>

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
                      border: "2px solid #444",
                      backgroundColor: "transparent",
                      color: "#FFF",
                      fontWeight: "600",
                      textDecoration: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
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
                      backgroundColor: "#FFF",
                      color: "black",
                      textDecoration: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ✨ Sign up
                  </Link>
                </div>
              ) : (
                <div
                  style={{
                    paddingTop: "16px",
                    borderTop: "2px solid #333",
                    marginTop: "8px",
                  }}
                >
                  <button
                    onClick={handleLogout}
                    style={{
                      color: "#dc2626",
                      fontWeight: "600",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontSize: "16px",
                      padding: "8px 12px",
                      width: "100%",
                      textAlign: "left"
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
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