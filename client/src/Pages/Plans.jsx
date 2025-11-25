import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Plans.css";
import { FiCheck, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";

// Import images
import kartikeyImg from "../assets/kartikey.jpg";
import shubhImg from "../assets/shubh.jpg";
import vikasImg from "../assets/vikas.jpg";
import ashuImg from "../assets/ashu.jpg";

const Plans = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // --- DATA (Aapka Purana Data) ---
  const plans = [
    {
      title: "Personal",
      tagline: "For individuals",
      price: billingCycle === "monthly" ? "₹500" : "₹4,800",
      period: billingCycle === "monthly" ? "/mo" : "/yr",
      save: billingCycle === "yearly" ? "Save 20%" : "",
      features: [
        { text: "Access to 26,000+ top courses", included: true },
        { text: "Certification prep", included: true },
        { text: "Goal-focused recommendations", included: true },
        { text: "AI-powered coding exercises", included: false },
        { text: "Offline downloads", included: false },
      ],
      buttonText: "Start Free Trial",
      isPopular: false,
    },
    {
      title: "Team",
      tagline: "Best for growing teams",
      price: billingCycle === "monthly" ? "₹2,000" : "₹19,200",
      period: billingCycle === "monthly" ? "/user/mo" : "/user/yr",
      save: billingCycle === "yearly" ? "Save 20%" : "",
      features: [
        { text: "Everything in Personal", included: true },
        { text: "Analytics & adoption reports", included: true },
        { text: "Team collaboration tools", included: true },
        { text: "Admin dashboard", included: true },
        { text: "Dedicated support", included: true },
      ],
      buttonText: "Sign Up with Team",
      isPopular: true, // Highlights this card (Orange)
    },
    {
      title: "Enterprise",
      tagline: "For large organizations",
      price: "Custom",
      period: "",
      save: "",
      features: [
        { text: "Unlimited Access", included: true },
        { text: "SSO & Advanced Security", included: true },
        { text: "Custom Course Creation", included: true },
        { text: "LMS Integration", included: true },
        { text: "Strategic implementation", included: true },
      ],
      buttonText: "Contact Sales",
      isPopular: false,
    },
  ];

  const testimonials = [
    {
      name: "Kartikey",
      role: "Software Engineer",
      img: kartikeyImg,
      quote: "Because of this course I was able to clear my two interviews and land my dream job.",
    },
    {
      name: "Vikas",
      role: "Tech Lead",
      img: vikasImg,
      quote: "I credit my success to the solid foundation this course gave me. The instructors are world-class.",
    },
    {
      name: "Ashu",
      role: "Web Developer",
      img: ashuImg,
      quote: "Highly recommended. The real-world projects and best practices are game-changers.",
    },
  ];

  const faqs = [
    {
      question: "How are courses selected for the plans?",
      answer: "Each course is curated from 250,000+ courses based on learner insights and top ratings.",
    },
    {
      question: "How is Personal Plan different from buying a course?",
      answer: "Personal Plan gives you unlimited access to a library for a subscription fee, unlike one-time payments.",
    },
    {
      question: "What is Traincape Business Pro?",
      answer: "Business Pro offers advanced features like hands-on labs, analytics, and a customer success manager.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes! You can cancel your subscription at any time from your account settings.",
    },
  ];

  return (
    <div className="plans-page dark-mode">
      {/* Background Glows (Orange Effect) */}
      <div className="glow-effect glow-top"></div>
      <div className="glow-effect glow-bottom"></div>

      <div className="content-wrapper">
        {/* HEADER */}
        <motion.div 
          className="plans-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="brand-pill">Traincape Pricing</span>
          <h1>Simple and Affordable Pricing Plans</h1>
          <p>Start learning and improving your skills today.</p>

          {/* Toggle */}
          <div className="billing-toggle">
            <span className={billingCycle === "monthly" ? "active" : ""}>Monthly</span>
            <div 
              className={`switch ${billingCycle === "yearly" ? "toggled" : ""}`}
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            >
              <div className="slider"></div>
            </div>
            <span className={billingCycle === "yearly" ? "active" : ""}>Yearly</span>
          </div>
        </motion.div>

        {/* CARDS */}
        <div className="cards-grid">
          {plans.map((plan, index) => (
            <motion.div 
              key={index} 
              className={`pricing-card ${plan.isPopular ? "popular" : ""}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              {plan.isPopular && <div className="popular-badge">Most Popular</div>}
              
              <div className="card-header">
                <h3>{plan.title}</h3>
                <div className="price-block">
                  <h2>{plan.price}</h2>
                  <span>{plan.period}</span>
                </div>
                <p className="desc">{plan.tagline}</p>
              </div>

              <button className={`action-btn ${plan.isPopular ? "btn-orange" : "btn-dark"}`}>
                {plan.buttonText}
              </button>

              <div className="divider"></div>

              <ul className="features">
                {plan.features.map((feat, i) => (
                  <li key={i} className={!feat.included ? "disabled" : ""}>
                    <div className="icon-box">
                      {feat.included ? <FiCheck /> : <FiX />}
                    </div>
                    {feat.text}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* TESTIMONIALS */}
        <div className="section-title">
          <h2>Success Stories</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              className="testi-card"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="quote-mark">“</div>
              <p>{t.quote}</p>
              <div className="user">
                <img src={t.img} alt={t.name} />
                <div>
                  <h5>{t.name}</h5>
                  <span>{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="section-title">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-wrapper">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${openFaqIndex === i ? "open" : ""}`} onClick={() => toggleFaq(i)}>
              <div className="faq-head">
                {faq.question}
                {openFaqIndex === i ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              <div className="faq-body">{faq.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Plans;