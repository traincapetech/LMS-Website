import React, { useState } from "react";
import kartikeyImg from "../assets/kartikey.jpg";
import shubhImg from "../assets/shubh.jpg";
import vikasImg from "../assets/vikas.jpg";
import ashuImg from "../assets/ashu.jpg";

const faqs = [
  {
    question: "How are courses selected for the plans?",
    answer:
      "Each course included in our plans is curated from the 250,000+ courses in our overall catalog. Our content experts use insights from learners to identify top-rated, relevant courses on the most sought-after topics.",
  },
  {
    question: "How is Personal Plan different from buying a course?",
    answer:
      "The Personal Plan gives you access to a library of top-rated courses for a subscription fee, unlike one-time payments per course.",
  },
  {
    question: "What languages does Enterprise Plan have content for?",
    answer:
      "The Enterprise Plan includes content in 15+ international languages, including Spanish, French, German, Japanese, and more.",
  },
  {
    question: "What is Traincape Business Pro?",
    answer:
      "Business Pro offers advanced features like hands-on labs, certification prep, analytics, and a customer success manager.",
  },
];

const AccordionItem = ({ faq, index, isOpen, onClick }) => (
  <div 
    className={`border-b border-[#e0e0e0] py-5 cursor-pointer ${isOpen ? '' : ''} hover:bg-[#f1f3f6] transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg rounded-lg px-4`} 
    onClick={() => onClick(index)}
    style={{
      background: isOpen ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' : 'transparent',
      borderLeft: isOpen ? '4px solid #3b82f6' : '4px solid transparent',
      boxShadow: isOpen ? '0 4px 15px rgba(59, 130, 246, 0.1)' : 'none'
    }}
  >
    <div className="flex justify-between items-center">
      <h4 className="text-[18px] font-semibold transition-all duration-300" style={{
        color: isOpen ? '#1f2937' : '#374151',
        textShadow: isOpen ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
      }}>
        {faq.question}
      </h4>
      <span 
        className="transition-all duration-300 ease-in-out text-2xl font-bold"
        style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          color: isOpen ? '#3b82f6' : '#6b7280'
        }}
      >
        ▼
      </span>
    </div>
    {isOpen && (
      <p 
        className="mt-2 text-[15px] text-[#555] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif] animate-fadeIn"
        style={{
          animation: 'slideDown 0.3s ease-out',
          lineHeight: '1.6'
        }}
      >
        {faq.answer}
      </p>
    )}
  </div>
);

const Plans = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div 
      className="py-10 px-5 bg-gradient-to-r from-[#f5f7fa] to-[#e6ecf0] text-[#111] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]"
      style={{
        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '30%',
        width: '100px',
        height: '100px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite'
      }}></div>

      <section 
        className="text-center max-w-[700px] mx-auto mb-[50px]"
        style={{
          position: 'relative',
          zIndex: 2,
          animation: 'fadeInUp 0.8s ease-out'
        }}
      >
                 <h1 
           className="text-[36px] font-bold mb-2"
           style={{
             background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
             WebkitBackgroundClip: 'text',
             WebkitTextFillColor: 'transparent',
             backgroundClip: 'text',
             textShadow: '0 4px 8px rgba(0,0,0,0.1)',
             fontSize: '56px',
             fontWeight: '900',
             fontFamily: "'Poppins', 'Inter', 'Segoe UI', sans-serif",
             letterSpacing: '-0.02em',
             lineHeight: '1.1'
           }}
         >
           Choose a plan for success
         </h1>
         <p 
           className="text-[17px] text-[#555] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]"
           style={{
             color: 'rgba(255, 255, 255, 0.95)',
             fontSize: '22px',
             lineHeight: '1.5',
             textShadow: '0 2px 4px rgba(0,0,0,0.1)',
             fontFamily: "'Inter', 'Segoe UI', sans-serif",
             fontWeight: '400',
             letterSpacing: '0.01em'
           }}
         >
           Don't want to buy courses one by one? Pick a plan to help you, your team, or your organization achieve outcomes faster.
         </p>
      </section>

      <section 
        className="flex flex-wrap justify-center gap-[30px] mb-[50px]"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px',
          margin: '0 auto 80px'
        }}
      >
        {/* Plan Cards */}
        <div 
          className="bg-white rounded-2xl p-6 w-[310px] shadow-[0_6px_20px_rgba(0,0,0,0.08)] border-t-[6px] border-[#4a90e2] transition-transform duration-300 hover:-translate-y-1"
          style={{
            position: 'relative',
            overflow: 'hidden',
            animation: 'slideInUp 0.6s ease-out 0.1s both',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            borderTop: '6px solid #3b82f6'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-10px) scale(1.02)';
            e.target.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
          }}
        >
          {/* Decorative Element */}
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
            borderRadius: '0 20px 0 100px',
            opacity: '0.1'
          }}></div>
          
                     <h2 className="text-[22px] mb-1" style={{ 
             color: '#1f2937', 
             fontWeight: '800',
             fontFamily: "'Poppins', 'Inter', sans-serif",
             fontSize: '26px',
             letterSpacing: '-0.01em'
           }}>Personal Plan</h2>
           <p className="text-[14px] text-[#777] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]" style={{ 
             fontWeight: '500',
             fontFamily: "'Inter', sans-serif",
             fontSize: '15px',
             letterSpacing: '0.02em'
           }}>For you · Individual</p>
           <h3 className="text-[20px] my-2" style={{ 
             color: '#3b82f6', 
             fontWeight: '900', 
             fontSize: '32px',
             fontFamily: "'Poppins', sans-serif",
             letterSpacing: '-0.02em'
           }}>₹500/mo</h3>
           <p className="text-[13px] text-[#999] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]" style={{ 
             fontStyle: 'italic',
             fontFamily: "'Inter', sans-serif",
             fontSize: '14px',
             letterSpacing: '0.01em'
           }}>Billed monthly or annually. Cancel anytime.</p>
          <ul className="my-4 pl-0 list-none leading-[1.6]">
            {[
              'Access to 26,000+ top courses',
              'Certification prep',
              'Goal-focused recommendations',
              'AI-powered coding exercises',
              'Mobile app access',
              'Offline downloads'
            ].map((feature, index) => (
              <li 
                key={index} 
                className="text-[16px] transition-all duration-200 hover:translate-x-2"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '8px',
                  color: '#374151'
                }}
              >
                <span style={{ 
                  color: '#10b981', 
                  marginRight: '8px', 
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex justify-center items-center">
                         <button 
               className="px-5 py-2.5 bg-black text-white rounded-lg cursor-pointer text-[14px] transition-colors duration-300 hover:bg-[#333] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]"
               style={{
                 background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
                 boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                 fontWeight: '700',
                 fontSize: '16px',
                 padding: '16px 32px',
                 borderRadius: '16px',
                 position: 'relative',
                 overflow: 'hidden',
                 fontFamily: "'Poppins', 'Inter', sans-serif",
                 letterSpacing: '0.02em',
                 textTransform: 'uppercase',
                 border: 'none',
                 cursor: 'pointer',
                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
               }}
               onMouseEnter={(e) => {
                 e.target.style.transform = 'translateY(-3px) scale(1.02)';
                 e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.5)';
                 e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)';
               }}
               onMouseLeave={(e) => {
                 e.target.style.transform = 'translateY(0) scale(1)';
                 e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                 e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)';
               }}
               onClick={() => {
                 const plan = {
                   id: 'personal-plan',
                   name: 'Personal Plan',
                   price: 500,
                   type: 'subscription',
                   description: 'For you · Individual - Access to 26,000+ top courses',
                   features: [
                     'Access to 26,000+ top courses',
                     'Certification prep',
                     'Goal-focused recommendations',
                     'AI-powered coding exercises',
                     'Mobile app access',
                     'Offline downloads'
                   ]
                 };
                 
                 // Get existing cart from localStorage
                 const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
                 
                 // Check if plan already exists in cart
                 const existingIndex = existingCart.findIndex(item => item.id === plan.id);
                 
                                   if (existingIndex === -1) {
                    // Add to cart
                    existingCart.push(plan);
                    localStorage.setItem('cart', JSON.stringify(existingCart));
                    // Dispatch custom event to update cart count
                    window.dispatchEvent(new Event('cartUpdated'));
                    alert('Personal Plan added to cart! 🛒');
                  } else {
                    alert('Personal Plan is already in your cart! ✅');
                  }
               }}
             >
               Start Free Trial
             </button>
          </div>
        </div>

        <div 
          className="bg-white rounded-2xl p-6 w-[310px] shadow-[0_6px_20px_rgba(0,0,0,0.08)] border-t-[6px] border-[#27ae60] transition-transform duration-300 hover:-translate-y-1"
          style={{
            position: 'relative',
            overflow: 'hidden',
            animation: 'slideInUp 0.6s ease-out 0.2s both',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            borderTop: '6px solid #10b981',
            transform: 'scale(1.05)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-10px) scale(1.05)';
            e.target.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1.05)';
            e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
          }}
        >
          {/* Popular Badge */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(45deg, #10b981, #059669)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            animation: 'pulse 2s infinite'
          }}>
            Most Popular
          </div>
          
          {/* Decorative Element */}
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(45deg, #10b981, #059669)',
            borderRadius: '0 20px 0 100px',
            opacity: '0.1'
          }}></div>
          
          <h2 className="text-[22px] mb-1" style={{ 
            color: '#1f2937', 
            fontWeight: '800',
            fontFamily: "'Poppins', 'Inter', sans-serif",
            fontSize: '26px',
            letterSpacing: '-0.01em'
          }}>Team Plan</h2>
          <p className="text-[14px] text-[#777] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]" style={{ 
            fontWeight: '500',
            fontFamily: "'Inter', sans-serif",
            fontSize: '15px',
            letterSpacing: '0.02em'
          }}>For your team · 2 to 20 people</p>
          <h3 className="text-[20px] my-2" style={{ 
            color: '#10b981', 
            fontWeight: '900', 
            fontSize: '32px',
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: '-0.02em'
          }}>₹2,000/mo per user</h3>
          <p className="text-[13px] text-[#999] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]" style={{ 
            fontStyle: 'italic',
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            letterSpacing: '0.01em'
          }}>Billed annually. Cancel anytime.</p>
          <ul className="my-4 pl-0 list-none leading-[1.6]">
            {[
              'Access to 13,000+ top courses',
              'Certification prep',
              'Goal-focused recommendations',
              'AI-powered coding exercises',
              'Analytics and adoption reports',
              'Team collaboration tools',
              'Admin dashboard',
              'Progress tracking'
            ].map((feature, index) => (
              <li 
                key={index} 
                className="text-[16px] transition-all duration-200 hover:translate-x-2"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '8px',
                  color: '#374151'
                }}
              >
                <span style={{ 
                  color: '#10b981', 
                  marginRight: '8px', 
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex justify-center items-center">
                         <button 
               className="px-5 py-2.5 bg-black text-white rounded-lg cursor-pointer text-[14px] transition-colors duration-300 hover:bg-[#333] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]"
               style={{
                 background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                 boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                 fontWeight: '700',
                 fontSize: '16px',
                 padding: '16px 32px',
                 borderRadius: '16px',
                 position: 'relative',
                 overflow: 'hidden',
                 fontFamily: "'Poppins', 'Inter', sans-serif",
                 letterSpacing: '0.02em',
                 textTransform: 'uppercase',
                 border: 'none',
                 cursor: 'pointer',
                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
               }}
               onMouseEnter={(e) => {
                 e.target.style.transform = 'translateY(-3px) scale(1.02)';
                 e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.5)';
                 e.target.style.background = 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)';
               }}
               onMouseLeave={(e) => {
                 e.target.style.transform = 'translateY(0) scale(1)';
                 e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
                 e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)';
               }}
               onClick={() => {
                 const plan = {
                   id: 'team-plan',
                   name: 'Team Plan',
                   price: 2000,
                   type: 'subscription',
                   description: 'For your team · 2 to 20 people - Access to 13,000+ top courses',
                   features: [
                     'Access to 13,000+ top courses',
                     'Certification prep',
                     'Goal-focused recommendations',
                     'AI-powered coding exercises',
                     'Analytics and adoption reports',
                     'Team collaboration tools',
                     'Admin dashboard',
                     'Progress tracking'
                   ]
                 };
                 
                 // Get existing cart from localStorage
                 const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
                 
                 // Check if plan already exists in cart
                 const existingIndex = existingCart.findIndex(item => item.id === plan.id);
                 
                                   if (existingIndex === -1) {
                    // Add to cart
                    existingCart.push(plan);
                    localStorage.setItem('cart', JSON.stringify(existingCart));
                    // Dispatch custom event to update cart count
                    window.dispatchEvent(new Event('cartUpdated'));
                    alert('Team Plan added to cart! 🛒');
                  } else {
                    alert('Team Plan is already in your cart! ✅');
                  }
               }}
             >
               Start Team Trial
             </button>
          </div>
        </div>

        <div 
          className="bg-white rounded-2xl p-6 w-[310px] shadow-[0_6px_20px_rgba(0,0,0,0.08)] border-t-[6px] border-[#e67e22] transition-transform duration-300 hover:-translate-y-1"
          style={{
            position: 'relative',
            overflow: 'hidden',
            animation: 'slideInUp 0.6s ease-out 0.3s both',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            borderTop: '6px solid #f59e0b'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-10px) scale(1.02)';
            e.target.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
          }}
        >
          {/* Decorative Element */}
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(45deg, #f59e0b, #d97706)',
            borderRadius: '0 20px 0 100px',
            opacity: '0.1'
          }}></div>
          
          <h2 className="text-[22px] mb-1" style={{ 
            color: '#1f2937', 
            fontWeight: '800',
            fontFamily: "'Poppins', 'Inter', sans-serif",
            fontSize: '26px',
            letterSpacing: '-0.01em'
          }}>Enterprise Plan</h2>
          <p className="text-[14px] text-[#777] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]" style={{ 
            fontWeight: '500',
            fontFamily: "'Inter', sans-serif",
            fontSize: '15px',
            letterSpacing: '0.02em'
          }}>More than 20 people</p>
          <h3 className="text-[20px] my-2" style={{ 
            color: '#f59e0b', 
            fontWeight: '900', 
            fontSize: '32px',
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: '-0.02em'
          }}>Contact Sales</h3>
          <p className="text-[13px] text-[#999] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]" style={{ 
            fontStyle: 'italic',
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            letterSpacing: '0.01em'
          }}>Custom pricing for large organizations</p>
          <ul className="my-4 pl-0 list-none leading-[1.6]">
            {[
              'Access to 30,000+ top courses',
              'Certification prep',
              'Goal-focused recommendations',
              'AI-powered coding exercises',
              'Advanced analytics & insights',
              'Dedicated customer success team',
              'International content in 15 languages',
              'Custom content & tech training',
              'Strategic implementation services',
              'SSO & advanced security',
              'Custom integrations'
            ].map((feature, index) => (
              <li 
                key={index} 
                className="text-[16px] transition-all duration-200 hover:translate-x-2"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: '8px',
                  color: '#374151'
                }}
              >
                <span style={{ 
                  color: '#f59e0b', 
                  marginRight: '8px', 
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex justify-center items-center">
            <button 
              className="px-5 py-2.5 bg-black text-white rounded-lg cursor-pointer text-[14px] transition-colors duration-300 hover:bg-[#333] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
                fontWeight: '700',
                fontSize: '16px',
                padding: '16px 32px',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: "'Poppins', 'Inter', sans-serif",
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
                e.target.style.boxShadow = '0 12px 35px rgba(245, 158, 11, 0.5)';
                e.target.style.background = 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.3)';
                e.target.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)';
              }}
              onClick={() => window.open('https://traincapetech.in/contact-us', '_blank')}
            >
              Contact Sales Team
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials come before FAQ now */}
      <section 
        className="py-[50px] px-5 bg-white text-center"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          margin: '0 auto 80px',
          maxWidth: '1200px',
          backdropFilter: 'blur(10px)',
          animation: 'fadeInUp 0.8s ease-out 0.4s both'
        }}
      >
                 <h2 
           className="text-[28px] mb-10"
           style={{
             fontSize: '42px',
             fontWeight: '800',
             background: 'linear-gradient(45deg, #1f2937, #374151)',
             WebkitBackgroundClip: 'text',
             WebkitTextFillColor: 'transparent',
             backgroundClip: 'text',
             fontFamily: "'Poppins', 'Inter', sans-serif",
             letterSpacing: '-0.02em',
             lineHeight: '1.2'
           }}
         >
           See what others are achieving through learning
         </h2>
        <div className="flex flex-wrap justify-center gap-[30px]">
          {[
            { img: kartikeyImg, name: 'Kartikey', quote: '"Because of this course I was able to clear my two interviews and land my dream job. The practical approach made all the difference."', role: 'Software Engineer' },
            // { img: shubhImg, name: 'Shubh', quote: '"This helped me transition from frontend to full stack engineer. The comprehensive curriculum and hands-on projects were invaluable."', role: 'Full Stack Developer' },
            { img: vikasImg, name: 'Vikas', quote: '"I credit my success to the solid foundation this course gave me. The instructors are world-class and the community is incredibly supportive."', role: 'Tech Lead' },
            // { img: ashuImg, name: 'Ashu', quote: '"Highly recommended for serious learners in web development.The real-world projects and industry best practices are game-changers."', role: 'web develope' }
          ].map((testimonial, index) => (
            <div 
              key={index}
              className="w-[220px] bg-[#f4f4f4] p-5 rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.1)]"
              style={{
                width: '280px',
                background: 'white',
                padding: '30px 25px',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                border: '1px solid #f3f4f6',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-8px)';
                e.target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Quote Mark */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '15px',
                fontSize: '60px',
                color: 'rgba(59, 130, 246, 0.1)',
                fontFamily: 'serif'
              }}>"</div>
              
              <img 
                src={testimonial.img} 
                alt={testimonial.name} 
                className="w-[80px] h-[80px] rounded-full object-cover mb-3"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '20px',
                  border: '4px solid #f3f4f6',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#f3f4f6';
                  e.target.style.transform = 'scale(1)';
                }}
              />
                             <p 
                 className="text-[14px] text-[#333] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]"
                 style={{
                   fontSize: '16px',
                   color: '#4b5563',
                   lineHeight: '1.6',
                   marginBottom: '20px',
                   fontStyle: 'italic',
                   fontFamily: "'Inter', sans-serif",
                   fontWeight: '400',
                   letterSpacing: '0.01em'
                 }}
               >
                 {testimonial.quote}
               </p>
               <h4 
                 className="text-[16px] mt-2 font-semibold"
                 style={{
                   fontSize: '20px',
                   fontWeight: '700',
                   color: '#1f2937',
                   marginBottom: '4px',
                   fontFamily: "'Poppins', 'Inter', sans-serif",
                   letterSpacing: '-0.01em'
                 }}
               >
                 {testimonial.name}
               </h4>
               <p style={{
                 fontSize: '15px',
                 color: '#6b7280',
                 margin: 0,
                 fontFamily: "'Inter', sans-serif",
                 fontWeight: '500',
                 letterSpacing: '0.02em'
               }}>
                 {testimonial.role}
               </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ now comes after testimonials */}
      <section 
        className="bg-[#f8f9fb] py-[60px] px-5 max-w-[900px] mx-auto my-[60px] rounded-[10px] text-[#1c1d1f]"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '60px 40px',
          maxWidth: '900px',
          margin: '0 auto',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          animation: 'fadeInUp 0.8s ease-out 0.6s both'
        }}
      >
                 <h2 
           className="text-[32px] font-bold mb-10 text-center"
           style={{
             fontSize: '42px',
             fontWeight: '800',
             marginBottom: '50px',
             textAlign: 'center',
             color: '#1f2937',
             background: 'linear-gradient(45deg, #1f2937, #374151)',
             WebkitBackgroundClip: 'text',
             WebkitTextFillColor: 'transparent',
             backgroundClip: 'text',
             fontFamily: "'Poppins', 'Inter', sans-serif",
             letterSpacing: '-0.02em',
             lineHeight: '1.2'
           }}
         >
           Frequently asked questions
         </h2>
        <div className="border-t border-[#e0e0e0]" style={{ paddingTop: '20px' }}>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onClick={toggle}
            />
          ))}
        </div>
      </section>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              max-height: 0;
            }
            to {
              opacity: 1;
              max-height: 200px;
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Plans;