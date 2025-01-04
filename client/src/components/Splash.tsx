import React from "react";

const Splash: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="text-center">
        <svg
          className="animate-spin h-16 w-16 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <h1 className="text-3xl font-bold">Loading...</h1>
        <p className="mt-2 text-lg">
          Please wait while we prepare your experience.
        </p>
      </div>
    </div>
  );
};

export default Splash;
