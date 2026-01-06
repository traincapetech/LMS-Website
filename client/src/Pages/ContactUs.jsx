import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { publicAPI } from "../utils/api";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await publicAPI.contactUs(formData);
      if (res.data) {
        setStatus({
          type: "success",
          message: "Thank you! Your message has been sent successfully.",
        });
      }
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to send message. Please try again later.";
      setStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-6 mt-20 font-poppins">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Contact <span className="text-blue-600">TrainCape LMS 🚀</span>
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto font-inter">
            Have questions about our courses or training programs? We’re here to
            help you grow faster
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4 font-inter">
              <FaEnvelope className="text-blue-600 text-xl mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Email</h3>
                <p className="text-slate-600">support@traincapetech.in</p>
              </div>
            </div>

            <div className="flex items-start gap-4 font-inter">
              <FaPhoneAlt className="text-blue-600 text-xl mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Phone</h3>
                <p className="text-slate-600">+44 1253 928501</p>
              </div>
            </div>

            <div className="flex items-start gap-4 font-inter">
              <FaMapMarkerAlt className="text-blue-600 text-xl mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Location
                </h3>
                <p className="text-slate-600">
                  Khandolia Plaza, 118C, Dabri - Palam Rd, Vaishali, Vaishali
                  Colony, Dashrath Puri, New Delhi, Delhi, 110045
                </p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
              TrainCape LMS provides industry-ready training programs with
              expert instructors and real-world projects.
            </p>

            <div className="w-full h-[350px] overflow-hidden rounded-2xl border border-blue-600/50">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14010.963168155562!2d77.08198!3d28.607552!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d05ecdc6529c1%3A0x7419fbbcac72b568!2sTraincape%20Technology%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1767340198004!5m2!1sen!2sin"
               className="w-full h-full"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-lg space-y-6"
          >
            {status.message && (
              <div
                className={`p-4 rounded-lg text-sm ${
                  status.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {status.message}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea
                name="message"
                rows="4"
                required
                value={formData.message}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              disabled={loading}
              className={`w-full font-semibold py-3 rounded-lg transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
