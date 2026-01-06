import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "What is TrainCape LMS?",
    answer:
      "TrainCape LMS is a learning management system designed to help students and professionals gain industry-ready skills through expert-led courses, hands-on projects, and certifications.",
  },
  {
    question: "Who can enroll in TrainCape courses?",
    answer:
      "Anyone can enroll—students, working professionals, freshers, and career switchers. Our courses are designed for beginners to advanced learners.",
  },
  {
    question: "Do I get a certificate after course completion?",
    answer:
      "Yes, you will receive a verified certificate after successfully completing the course and assessments.",
  },
  {
    question: "Are the courses self-paced or instructor-led?",
    answer:
      "We offer both self-paced courses and instructor-led live training programs, depending on the course you choose.",
  },
  {
    question: "How long will I have access to the course?",
    answer:
      "You will have lifetime access to the course content, including future updates.",
  },
  {
    question: "Do you provide placement assistance?",
    answer:
      "Yes, we provide placement assistance including resume building, mock interviews, and job referrals for eligible programs.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, debit cards, credit cards, net banking, and other secure online payment methods.",
  },
  {
    question: "Can I contact support if I face any issues?",
    answer:
      "Absolutely! You can contact our support team via email, WhatsApp, or the Contact Us page.",
  },
];

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 mt-16 font-poppins">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h1>
          <p className="text-slate-600 mt-4 font-inter">
            Find answers to the most common questions about TrainCape LMS
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-blue-600 rounded-xl shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-lg font-medium text-blue-600">
                  {faq.question}
                </span>
                <FaChevronDown
                  className={`text-blue-600 transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-slate-600 font-inter">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;
