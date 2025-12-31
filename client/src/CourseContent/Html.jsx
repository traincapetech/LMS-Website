import React, { useContext } from 'react';
import { FaHtml5, FaQuestionCircle } from 'react-icons/fa';
import { CartContext } from '../App';
import { useNavigate } from 'react-router-dom';

const Html = () => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const courseDetails = {
    title: 'IBM Web Development using HTML',
    price: 3000,
    id: 'ibm-html',
    description: 'IBM Web Development using HTML Certification Course',
  };
  return (
    <div className="max-w-[800px] mx-auto my-8 bg-white rounded-2xl shadow-[0_4px_24px_#e5e7eb] p-10 font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif]">
      {/* Header Section */}
      <div className="flex items-center gap-[18px] mb-6">
        <FaHtml5 size={60} color="#e44d26" />
        <h1 className="text-2xl font-bold text-[#00599C] m-0">IBM Web Development using HTML</h1>
        <h2 className="text-[1.2rem] text-[#333] ml-[10px] font-normal m-0">Certification Course</h2>
      </div>

      {/* Price & CTA */}
      <div className="bg-[#f1f5f9] rounded-[10px] py-[1.2rem] px-[1.5rem] mb-6 flex items-center justify-between">
        <h3 className="text-[1.1rem] font-semibold text-[#00599C] m-0">IBM Web Development Using HTML Certification Course</h3>
        <div className="text-[1.3rem] font-bold text-[#00599C] mr-6"> INR 3,000</div>
        <button onClick={() => {
          localStorage.setItem('courseToAdd', JSON.stringify(courseDetails));
          navigate('/cart');
        }} className="bg-gradient-to-r from-[#00599C] to-[#0ea5e9] text-white border-none rounded-lg py-[10px] px-[28px] font-bold text-base cursor-pointer shadow-[0_2px_8px_#c7d2fe] transition-colors duration-200">Add To Cart</button>
      </div>

      {/* Description Section */}
      <div className="mb-6 bg-[#f9fafb] rounded-[10px] py-[1.2rem] px-[1.5rem]">
        <h3 className="text-[#00599C] text-[1.1rem] font-semibold mb-[0.7rem]">Description</h3>
        <p>
          The IBM Web Development using HTML Certification Course provides a comprehensive introduction to the foundational language of the web. You’ll master the essentials of HTML, learning to structure content, create web pages, and incorporate multimedia elements.
        </p>
        <p>
          This course covers everything from basic tags and elements to advanced concepts like semantic HTML5, forms, and accessibility. Through hands-on projects and quizzes, you’ll gain practical experience in building interactive and engaging web pages. Upon completion, you’ll receive an industry-recognized IBM certification, demonstrating your proficiency in HTML and opening doors to a rewarding career in web development.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="mb-6 bg-[#f9fafb] rounded-[10px] py-[1.2rem] px-[1.5rem]">
        <h3 className="text-[#00599C] text-[1.1rem] font-semibold mb-[0.7rem]">Benefits</h3>
        <ul className="pl-5">
          <li className="mb-2 text-[#333] text-base"><strong>Industry Recognition:</strong> A globally recognized credential that sets you apart.</li>
          <li className="mb-2 text-[#333] text-base"><strong>Enhanced Career Opportunities:</strong> Improve your job prospects.</li>
          <li className="mb-2 text-[#333] text-base"><strong>Increased Credibility:</strong> Gain trust from employers and clients.</li>
          <li className="mb-2 text-[#333] text-base"><strong>Competitive Advantage:</strong> Stand out in a crowded job market.</li>
          <li className="mb-2 text-[#333] text-base"><strong>Demonstrated Skill:</strong> Proof of your HTML expertise.</li>
        </ul>
      </div>

      {/* Exam Details */}
      <div className="mb-6 bg-[#f9fafb] rounded-[10px] py-[1.2rem] px-[1.5rem]">
        <h3 className="text-[#00599C] text-[1.1rem] font-semibold mb-[0.7rem]">Exam Details</h3>
        <ul className="pl-5">
          <li className="mb-2 text-[#333] text-base">Exam Duration: <strong>1 hour</strong></li>
          <li className="mb-2 text-[#333] text-base">Passing Criteria: <strong>70%</strong></li>
          <li className="mb-2 text-[#333] text-base">
            Clicking the “Final Check” button means your submission is FINAL. You will NOT be able to resubmit your answer for that question again.
          </li>
          <li className="mb-2 text-[#333] text-base">
            <strong>IMPORTANT:</strong> Do not let the time run out without submitting, or your answers will be marked as incomplete.
          </li>
        </ul>
      </div>

      {/* FAQ Section */}
      <div className="mb-6 bg-[#f9fafb] rounded-[10px] py-[1.2rem] px-[1.5rem]">
        <h3 className="text-[#00599C] text-[1.1rem] font-semibold mb-[0.7rem]">FAQ's</h3>
        <div className="flex items-center gap-2 text-[#00599C] text-base mb-2"><FaQuestionCircle /> What are the requirements to earn the certification?</div>
        <div className="flex items-center gap-2 text-[#00599C] text-base mb-2"><FaQuestionCircle /> How can I prepare for the certification exam?</div>
        <div className="flex items-center gap-2 text-[#00599C] text-base mb-2"><FaQuestionCircle /> Where and how can I take the certification exam?</div>
        <div className="flex items-center gap-2 text-[#00599C] text-base mb-2"><FaQuestionCircle /> How long is the certification valid?</div>
        <div className="flex items-center gap-2 text-[#00599C] text-base mb-2"><FaQuestionCircle /> How will the certification benefit my career?</div>
        <div className="flex items-center gap-2 text-[#00599C] text-base mb-2"><FaQuestionCircle /> Can I showcase my certification on my resume and profiles?</div>
      </div>
    </div>
  );
};

export default Html;