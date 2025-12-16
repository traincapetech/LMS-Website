import React, { useState } from "react";
import "./login.css";
import { Button } from "@/components/ui/button";
import { useStore } from "../Store/store";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "@/utils/api";

const Login1 = () => {
  const { isRightPanelActive, setIsRightPanelActive } = useStore();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const navigate = useNavigate();

  const handleChangeLogin = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };
  const handleChangeSignup = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await authAPI.signup({ ...signupForm, role: "student" });
      setMessage(res.data.message || "Signup successful!");
      // Store token and user info as needed
      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.location.reload(); // Force Navbar to update
      }
      setTimeout(() => {
        navigate("/");
      }, 1000); // Navigate to home after 1 second
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      console.log("=== LOGIN DEBUG ===");
      console.log("Attempting login with:", loginForm.email);
      console.log("Form data:", loginForm);

      const res = await authAPI.login(loginForm);
      console.log("Full login response:", res);
      console.log("Response data:", res.data);
      console.log("Token in response:", res.data.token);
      console.log("Token type:", typeof res.data.token);
      console.log("Token length:", res.data.token?.length);

      setMessage("Login successful!");

      // Store token and user info as needed
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        console.log("Token stored successfully");
        console.log("Stored token:", localStorage.getItem("token"));
        console.log(
          "Token exists after storage:",
          !!localStorage.getItem("token")
        );
        console.log(
          "Token length after storage:",
          localStorage.getItem("token")?.length
        );

        // Test the token immediately
        setTimeout(() => {
          const storedToken = localStorage.getItem("token");
          console.log("Token after 1 second:", storedToken);
          console.log("Token still exists:", !!storedToken);
        }, 1000);
      } else {
        console.error("NO TOKEN IN RESPONSE!");
        console.log("Response keys:", Object.keys(res.data));
        setMessage("Login failed - no token received");
        return;
      }

      setTimeout(() => {
        window.location.href = "/";
      }, 1000); // Navigate to home after 1 second
      // Redirect or update UI as needed
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response);
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };
  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  return (
    <div className="flex  justify-center items-center min-h-screen py-10 w-full font-poppins">
      <div
        className={`container-loginform  ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
      >
        <div className="form-container sign-in-container">
          <form onSubmit={handleSubmitLogin} className="loginform">
            <h1 className="text-2xl font-bold">Sign in</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span className="py-2 text-sm">or use your account</span>
            <input
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleChangeLogin}
              placeholder="Email"
            />
            <div className="relative w-full">
              <input
                type={showLoginPassword ? "text" : "password"}
                name="password"
                value={loginForm.password}
                onChange={handleChangeLogin}
                placeholder="Password"
              />
              <span
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute right-4 top-4 cursor-pointer"
              >
                {showLoginPassword ? (
                  <i className="fas fa-eye text-gray-500"></i>
                ) : (
                  <i className="fas fa-eye-slash text-gray-500"></i>
                )}
              </span>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm pb-5 hover:underline"
            >
              Forgot your password?
            </Link>
            {message && (
              <p className="text-sm text-center py-2 text-red-500">{message}</p>
            )}
            <Button className="w-full">
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            <p className="mobile-toggle text-sm mt-4">
              Don't have an account?{" "}
              <span
                className="font-bold cursor-pointer text-blue-600"
                onClick={handleSignUpClick}
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubmitSignUp} className="loginform">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <div className="social-container">
              <a href="#" className="social">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-google-plus-g"></i>
              </a>
              <a href="#" className="social">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span className="py-2 text-sm">
              or use your email for registration
            </span>
            <input
              className="logininput"
              type="text"
              name="name"
              value={signupForm.name}
              onChange={handleChangeSignup}
              placeholder="Name"
            />
            <input
              className="logininput"
              type="email"
              name="email"
              value={signupForm.email}
              onChange={handleChangeSignup}
              placeholder="Email"
            />
            <div className="relative w-full">
              <input
                className="logininput"
                type={showSignupPassword ? "text" : "password"}
                name="password"
                value={signupForm.password}
                onChange={handleChangeSignup}
                placeholder="Password"
              />
              <span
                onClick={() => setShowSignupPassword(!showSignupPassword)}
                className="absolute right-4 top-4 cursor-pointer"
              >
                {showSignupPassword ? (
                  <i className="fas fa-eye text-gray-500"></i>
                ) : (
                  <i className="fas fa-eye-slash text-gray-500"></i>
                )}
              </span>
            </div>
            {message && (
              <p className="text-sm text-center py-2 text-red-500">{message}</p>
            )}
            <Button className="w-full">
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
            <p className="mobile-toggle text-sm mt-4">
              Already have an account?{" "}
              <span
                className="font-bold cursor-pointer text-blue-600"
                onClick={handleSignInClick}
              >
                Sign In
              </span>
            </p>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left space-y-5">
              <h1 className="font-bold text-4xl ">Welcome Back!</h1>
              <p className="font-inter text-sm px-3 text-white">
                To keep connected with us please login with your personal info
              </p>
              <Button
                className="bg-transparent border rounded-full px-10 py-5 hover:bg-transparent mt-4"
                id="signIn"
                onClick={handleSignInClick}
              >
                Sign In
              </Button>
            </div>
            <div className="overlay-panel overlay-right space-y-5">
              <h1 className="font-bold text-4xl ">Hello, Learners!</h1>
              <p className="font-inter text-sm px-3 text-white">
                Enter your personal details and start journey with us
              </p>
              <Button
                className="bg-transparent border rounded-full px-10 py-5 hover:bg-transparent mt-4"
                id="signUp"
                onClick={handleSignUpClick}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login1;
