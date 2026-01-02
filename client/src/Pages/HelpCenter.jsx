import {
  FaBook,
  FaUserGraduate,
  FaCreditCard,
  FaHeadset,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const helpTopics = [
  {
    icon: <FaBook className="text-blue-500 text-3xl" />,
    title: "Courses & Learning",
    description: "Course access, content, progress tracking, and certificates",
  },
  {
    icon: <FaUserGraduate className="text-green-500 text-3xl" />,
    title: "Enrollment & Account",
    description: "Sign up, login issues, profile management",
  },
  {
    icon: <FaCreditCard className="text-purple-500 text-3xl" />,
    title: "Payments & Billing",
    description: "Fees, invoices, refunds, and payment methods",
  },
  {
    icon: <FaHeadset className="text-orange-500 text-3xl" />,
    title: "Technical Support",
    description: "Website issues, errors, and performance problems",
  },
];

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-slate-900">Help <span className="text-blue-600">Center</span></h1>
          <p className="text-slate-600 mt-4">How can we help you today?</p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for help topics..."
              className="w-full px-5 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {helpTopics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition"
            >
              <div className="mb-4 flex justify-center">{topic.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900">
                {topic.title}
              </h3>
              <p className="text-slate-600 text-sm mt-2">{topic.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Popular Help Links */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-16">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Popular Help Topics
          </h2>

          <ul className="space-y-4 text-slate-600">
            <li>• How to enroll in a course?</li>
            <li>• How to access my certificate?</li>
            <li>• I forgot my password. What should I do?</li>
            <li>• Payment was successful but course not visible</li>
            <li>• How to contact my instructor?</li>
          </ul>
        </div>

        {/* Contact Support CTA */}
        <div className="bg-blue-600 rounded-2xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold">Still need help?</h2>
          <p className="mt-3 text-blue-100">
            Our support team is always ready to assist you
          </p>

          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-slate-100 transition"
            >
              Contact Support
            </Link>

            <Link
              to="/faqs"
              className="border border-white px-6 py-3 rounded-xl font-medium hover:bg-white hover:text-blue-600 transition"
            >
              View FAQs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
