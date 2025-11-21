import React from "react";
import image1 from "../assets/image1.png";

const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-white">
      {/* Left Content */}
      <div className="flex-1 max-w-xl mb-8 md:mb-0">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">Meet your new AI conversation coach</h2>
        <p className="text-lg md:text-xl text-gray-700 mb-6 font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">Role Play is the interactive way to practice your business and communication skills.</p>
        <button className="bg-black text-white px-6 py-3 rounded-md text-base font-semibold hover:bg-gray-800 transition font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">Find courses with Role Play</button>
      </div>
      {/* Right Image */}
      <div className="flex-1 flex justify-center">
        <img src={image1} alt="AI Coach" className="w-full max-w-md rounded-lg shadow-lg" />
      </div>
    </section>
  );
};

export default HeroSection; 