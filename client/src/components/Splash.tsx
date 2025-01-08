import React from "react";
import Loader from "./Loader";

const Splash: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-primary to-purple-600 text-white">
      <div className="text-center">
        <Loader />
        <h1 className="text-3xl font-bold">Loading...</h1>
        <p className="mt-2 text-lg">
          Please wait while we prepare your experience.
        </p>
      </div>
    </div>
  );
};

export default Splash;
