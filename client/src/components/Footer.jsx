import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
import { FaLinkedinIn } from "react-icons/fa";
import { useStore } from "@/Store/store";
import { toast } from "sonner";
const Footer = () => {
  const [email, setEmail] = useState("");

  const {
    subscribe,
    subscribing,
    setSubscribing,
    courses,
    loading,
    error,
    fetchCourses,
  } = useStore();

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    // Basic validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubscribing(true);
    try {
      subscribe(email);
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Subscription failed. Please try again."
      );
    } finally {
      setSubscribing(false);
    }
  };
  const handleCourseClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="w-full bg-[#0A0A0A] text-gray-300 py-14 font-poppins">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        {/* BRAND AREA */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">TrainCape</h2>
          <p className="text-sm leading-relaxed">
            Empowering students and instructors with a modern learning
            experience. Learn, teach, and grow with TrainCape LMS.
          </p>
          <div className="flex gap-4 pt-2">
            <a
              href="https://www.facebook.com/people/Traincape-Technology-Pvt-Ltd/100083755432171/"
              className="hover:text-white transition"
            >
              <FaFacebook className="text-xl" />
            </a>
            <a
              href="https://www.instagram.com/traincape_technology/?igsh=MWR5c3EyOTI4dHJ5eg%3D%3D#"
              className="hover:text-white transition"
            >
              <BsInstagram className="text-xl" />
            </a>
            <a
              href="https://www.linkedin.com/company/traincape-technology/"
              className="hover:text-white transition"
            >
              <FaLinkedinIn className="text-xl" />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="/" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="/courses" className="hover:text-white transition">
                Courses
              </a>
            </li>
            <li>
              <a href="/#aboutus" className="hover:text-white transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="/faqs" className="hover:text-white transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="/help-center" className="hover:text-white transition">
                Help Center
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms-and-conditions"
                className="hover:text-white transition"
              >
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Subscribe</h3>
          <p className="text-sm mb-3">Get updates on new courses and offers.</p>
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={handleSubscribe}
              disabled={subscribing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            >
              {subscribing ? "Joining..." : "Join"}
            </button>
          </div>
        </div>
      </div>

      {/* COPYRIGHT BAR */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} TrainCape LMS. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
