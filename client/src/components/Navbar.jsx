import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiHeart,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import UserProfileDropdown from "./UserProfileDropdown";
import { getAllCourses, searchCourses } from "../Pages/CourseData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        className={`fixed left-0 top-0 w-full z-50 font-poppins flex items-center justify-between px-5 py-2 ${
          scrolled
            ? "bg-transparent backdrop-blur-2xl border-b border-textSecondary"
            : ""
        }`}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#111" }}>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "500",
                color: "#111",
                cursor: "pointer",
              }}
            >
              Traincape LMS
            </h1>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="w-1/3 hidden md:hidden lg:block ">
          <div
            className="pt-4"
            onMouseEnter={() => setIsSearchHover(true)}
            onMouseLeave={() => setIsSearchHover(false)}
          >
            <form className="relative w-full" onSubmit={handleSearch}>
              <Input
                className="w-full pr-10 py-4"
                type="text"
                placeholder="Search for courses, skills, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <FiSearch
                className="absolute right-3 top-2 text-xl cursor-pointer text-TextSecondary"
                onClick={handleSearch}
              />
            </form>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div
          style={{
            display: !isMobile ? "flex" : "none",
            alignItems: "center",
            gap: "16px",
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
            <Link to="/cart">
              <Button variant="outline">
                <FiShoppingCart className="size-5" />
              </Button>

              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "1px 8px",
                    fontSize: 12,
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
              <Link to="/login">
                <Button>Log in</Button>
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

      {/* Mobile Search Bar
      {mobileMenuOpen && (
       
      )} */}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden fixed  top-0 left-0 right-0 z-50 h-screen bg-white rounded-lg px-5 w-full"
        >
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center py-5 border-b border-textSecondary">
            <h2 className="text-xl font-semibold">Traincape LMS</h2>
            <button onClick={() => setMobileMenuOpen(false)}>
              <FiX className="text-2xl cursor-pointer" />
            </button>
          </div>

          <div className="my-5">
            <form className="relative" onSubmit={handleSearch}>
              <Input
                className="w-full pr-10 py-4"
                type="text"
                placeholder="Search for Courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <FiSearch className="absolute right-3 top-2 text-xl cursor-pointer text-TextSecondary" />
            </form>
          </div>
          <div className="w-full ">
            {/* Navigation Links */}
            <div className="flex flex-col gap-10 px-4 w-full mt-10">
              <Link
                to="/plans"
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Plans & Pricing
              </Link>
              <Link
                to="/courses"
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Courses
              </Link>
              <a
                href="https://traincapetech.in/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Business
              </a>
              <Link
                to="/teach"
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f8f9fa")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Teach
              </Link>

              {/* Admin Mobile Links */}
              {user && user.role === "admin" && (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#fef2f2")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    Admin
                  </Link>
                  <Link
                    to="/admin/instructors"
                    onClick={() => setMobileMenuOpen(false)}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    Instructors
                  </Link>
                </>
              )}

              {/* Instructor Dashboard Mobile */}
              {user &&
                (user.role === "instructor" || user.role === "admin") &&
                hasPublishedCourses && (
                  <Link
                    to="/instructor-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#f8f9fa")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    Instructor Dashboard
                  </Link>
                )}
            </div>

            {/* User Authentication Mobile */}
            <div className="absolute bottom-0 left-0 w-full px-5 py-5">
              {!user ? (
                <div className="flex flex-col gap-5">
                  <Link
                    to="/login"
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
                    <Button variant={"outline"} className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#374151")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#111")
                    }
                  >
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              ) : (
                <div>
                  <div
                    className="bg-gray-100"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 12px",
                      // backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <div className="flex items-center">
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
                        <div className="text-lg font-semibold">{user.name}</div>
                        <div>{user.role}</div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#fef2f2")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              )}{" "}
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
