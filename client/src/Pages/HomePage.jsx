import React from "react";
import { motion } from "framer-motion";
const HomePage = () => {
  return (
    <div className="w-full h-full bg-Background font-poppins">
      {/* <HeroSection /> */}
      <div className="container mx-auto">
        <div className="flex flex-row items-center justify-center gap-10">
          {/* LEFT CONTENT */}
          <div className="space-y-3 mx-5">
            <h1 className="text-4xl md:text-5xl/tight font-semibold text-PrimaryDark px-5">
              Learn. Grow. Achieve <br />
              <span className="text-Primary"> With TrainCape LMS.</span>
            </h1>

            <p className="text-lg text-TextSecondary mt-5 font-inter">
              Empower your skills with industry-ready courses taught by expert
              instructors. <br /> Join thousands of learners upgrading their
              careers through TrainCape.
            </p>

            {/* CTA BUTTONS */}
            <div className="pt-8 flex gap-4">
              <button className="px-6 py-3 bg-[#3B82F6] text-white rounded-xl text-lg font-medium hover:bg-blue-600 transition">
                Explore Courses
              </button>

              <button className="px-6 py-3 border-2 border-[#3B82F6] text-[#3B82F6] rounded-xl text-lg font-medium hover:bg-blue-50 transition">
                Become an Instructor
              </button>
            </div>

            {/* TRUST BADGES */}
            <div className="mt-10 flex gap-8 text-[#475569] font-inter">
              <div>
                <h3 className="text-2xl font-bold text-[#0F172A]">1000+</h3>
                <p>Students</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#0F172A]">50+</h3>
                <p>Courses</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#0F172A]">20+</h3>
                <p>Instructors</p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-52 md:w-sm">
            <img
              src="https://img.freepik.com/premium-photo/man-wearing-blue-shirt-with-book-his-hand_1239886-5001.jpg?w=1480"
              alt="TrainCape LMS Hero"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
