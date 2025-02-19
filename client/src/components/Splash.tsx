import React from "react";
import Loader from "./Loader";

const Splash: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-primary to-teal-400 text-white">
      <div className="flex flex-col justify-center items-center">
        <Loader size="lg" />
        <p className="mt-2 text-lg">
          Please wait while we prepare your experience.
        </p>
      </div>
    </div>
  );
};

export default Splash;
