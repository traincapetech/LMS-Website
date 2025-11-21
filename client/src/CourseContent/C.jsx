import React, { useContext } from 'react';
// Removed import './C.css';
import { FaCuttlefish, FaQuestionCircle } from 'react-icons/fa';
import { CartContext } from '../App';
import { useNavigate } from 'react-router-dom';

const C = () => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const courseDetails = {
    title: 'IBM Software Foundation Course C',
    price: 2500,
    id: 'ibm-c',
    description: 'IBM Software Foundation Course C',
  };
  return (
    <div className="max-w-[800px] mx-auto my-8 bg-white rounded-2xl shadow-[0_4px_24px_#e5e7eb] p-10 font-[Segoe UI,Tahoma,Geneva,Verdana,sans-serif]">
      {/* Header Section */}
      <div className="flex items-center gap-[18px] mb-6">
        <FaCuttlefish size={60} color="#00599C" />
        <h1 className="text-2xl font-bold text-[#00599C] m-0">IBM Software Foundation Course C</h1>
        <h2 className="text-[1.2rem] text-[#333] ml-[10px] font-normal m-0">Certification Course</h2>
      </div>

      {/* Price & CTA */}
      <div className="bg-[#f1f5f9] rounded-[10px] py-[1.2rem] px-[1.5rem] mb-6 flex items-center justify-between">
        <h3 className="text-[1.1rem] font-semibold text-[#00599C] m-0">IBM Software Foundation Course C</h3>
        <div className="text-[1.3rem] font-bold text-[#00599C] mr-6">  INR 2,500</div>
        <button onClick={() => {
          localStorage.setItem('courseToAdd', JSON.stringify(courseDetails));
          navigate('/cart');
        }} className="bg-gradient-to-r from-[#00599C] to-[#0ea5e9] text-white border-none rounded-lg py-[10px] px-[28px] font-bold text-base cursor-pointer shadow-[0_2px_8px_#c7d2fe] transition-colors duration-200">Add To Cart</button>
      </div>

      {/* Description Section */}
      <div className="mb-6 bg-[#f9fafb] rounded-[10px] py-[1.2rem] px-[1.5rem]">
        <h3 className="text-[#00599C] text-[1.1rem] font-semibold mb-[0.7rem]">Description</h3>
        <p>
          The IBM Software Foundation Course C provides a comprehensive introduction to the C programming language. You  ll learn the fundamentals of C, including syntax, data types, control structures, functions, and memory management.
        </p>
        <p>
          This course is designed for beginners and covers both theoretical concepts and practical programming exercises. By the end, you  ll be able to write efficient C programs and understand the core principles of software development in C.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="mb-6 bg-[#f9fafb] rounded-[10px] py-[1.2rem] px-[1.5rem]">
        <h3 className="text-[#00599C] text-[1.1rem] font-semibold mb-[0.7rem]">Benefits</h3>
        <ul className="pl-5">
          <li className="mb-2 text-[#333] text-base"><strong>Industry Recognition:</strong> Globally recognized IBM certification.</li>
          <li className="mb-2 text-[#333] text-base"><strong>Career Foundation:</strong> Build a strong base for advanced programming.</li>
          <li className="mb-2 text-[#333] text-base"><strong>Practical Skills:</strong> Hands-on coding experience.</li>
          <li className="mb-2 text-[#333] text-base"><strong>Problem Solving:</strong> Improve logical and analytical thinking.</li>
          <li className="mb-2 text-[#333] text-base"><strong>Competitive Edge:</strong> Stand out in technical interviews and exams.</li>
        </ul>
      </div>

      {/* Exam Details */}
      <div className="mb-6 bg-[#f9fafb] rounded-[10px] py-[1.2rem] px-[1.5rem]">
        <h3 className="text-[#00599C] text-[1.1rem] font-semibold mb-[0.7rem]">Exam Details</h3>
        <ul className="pl-5">
          <li className="mb-2 text-[#333] text-base">Exam Duration: <strong>1 hour</strong></li>
          <li className="mb-2 text-[#333] text-base">Passing Criteria: <strong>70%</strong></li>
          <li className="mb-2 text-[#333] text-base">
            Clicking the  Final Check  button means your submission is FINAL. You will NOT be able to resubmit your answer for that question again.
          </li>
          <li className="mb-2 text-[#333] text-base">
            <strong>IMPORTANT:</strong> Do not let the time run out without submitting, or your answers will be marked as incomplete.
          </li>
        </ul>
      </div>

      {/* FAQ Section */}
      <div className="mb-6 bg-[#f9fafb] rounded-[10px] py-[1.2rem] px-[1.5rem]">
        <h3 className="text-[#00599C] text-[1.1rem] font-semibold mb-[0.7rem]">FAQ's</h3>
        <div className="flex items-center gap-2 text-[#00599C] text-base mb-2"><FaQuestionCircle /> What are the prerequisites for this course?</div>
        <div className="flex items-center gap-2 text-[#00599C] text-base mb-2"><FaQuestionCircle /> Is this course suitable for beginners?</div>
        <div className="flex items-center gap-2 text-[#00599C] text-base mb-2"><FaQuestionCircle /> Will I get a certificate after completion?</div>
        <div className="flex items-center gap-2 text-[#00599C] text-base mb-2"><FaQuestionCircle /> What topics are covered in the exam?</div>
        <div className="flex items-center gap-2 text-[#00599C] text-base mb-2"><FaQuestionCircle /> Can I access course materials after completion?</div>
      </div>
    </div>
  );
};

export default C; 