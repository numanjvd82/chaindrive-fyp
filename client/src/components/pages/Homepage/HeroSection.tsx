import React from "react";

const HeroSection: React.FC = () => {
  return (
    <div className="relative flex flex-col md:flex-row items-center bg-gray-100 p-6 md:p-12">
      {/* Text Section */}
      <div className="text-center md:text-left md:w-1/2 space-y-6 z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Find, book and rent a car{" "}
          <span className="text-blue-600">Easily</span>
        </h1>
        <p className="text-gray-700 text-lg md:text-xl">
          We connect car renters and owners with a secure, transparent, and
          efficient blockchain-powered platform.
        </p>
        <button className="px-8 py-3 mt-6 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition text-lg">
          Get Started
        </button>
      </div>

      {/* Frame Section */}
      <div className="relative md:w-1/2 mt-8 md:mt-0 flex justify-center md:justify-end">
        <img
          className="absolute left-0 md:left-auto w-[90%] md:w-full h-auto object-contain z-0"
          loading="lazy"
          alt="Frame"
          src="/mainframe.svg"
        />
        <img
          className="relative w-[85%] md:w-full h-auto object-contain z-10"
          src="/maincar.svg"
          alt="Car"
        />
      </div>
    </div>
  );
};

export default HeroSection;
