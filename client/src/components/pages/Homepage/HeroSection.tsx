import React from "react";

const HeroSection: React.FC = () => {
  return (
    <div className="relative flex flex-col md:flex-row items-center bg-gray-100 p-6 md:p-12">
      {/* Text Section */}
      <div className="text-center md:text-left md:w-1/2 space-y-4 z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Find, book and rent a car{" "}
          <span className="text-blue-600">Easily</span>
        </h1>
        <p className="text-gray-700 text-lg">
          We connect car renters and owners with a secure, transparent, and
          efficient blockchain-powered platform.
        </p>
        <button className="px-6 py-3 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
          Get Started
        </button>
      </div>

      {/* Frame Section */}
      <div className="relative md:w-1/2 mt-8 md:mt-0 flex justify-end">
        <img
          className="h-52 absolute inset-0 w-full h-300 object-cover z-0"
          loading="lazy"
          alt="Frame"
          src="/mainframe.svg"
        />
        <img
          className="relative w-full h-auto object-cover z-10"
          alt="Car"
          src="/maincar.svg"
        />
      </div>
    </div>
  );
};

export default HeroSection;
