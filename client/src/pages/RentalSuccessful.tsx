import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaCar, FaArrowRight, FaCalendarCheck, FaHome } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import Button from "@/components/Button";

const RentalSuccessful: React.FC = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  const handleGoToDashboard = () => {
    navigate("/renter-dashboard");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(timer);
      navigate(`/rentals/${id}`);
    }

    return () => clearInterval(timer);
  }, [countdown, navigate, id]);

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCar className="text-red-500 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Rental ID Missing
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the rental ID. Please try again.
          </p>
          <Button
            onClick={() => navigate("/renter-dashboard")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2">
              <FaHome />
              Go to Dashboard
            </div>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-lg w-full"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <FaCheckCircle className="text-4xl" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-2"
          >
            Rental Confirmed!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-green-100 text-lg"
          >
            🎉 Your booking is all set!
          </motion.p>
        </div>

        {/* Content */}
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-green-200 mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FaCalendarCheck className="text-green-600 text-2xl" />
                <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Your rental has been successfully confirmed and payment processed. 
                You'll receive a confirmation email shortly with all the details.
              </p>
            </div>

            {/* Countdown Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6"
            >
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                <FaCar className="text-lg" />
                <span className="font-semibold">Auto-redirect in</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {countdown}
              </div>
              <div className="text-sm text-blue-500">
                Redirecting to rental details...
              </div>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <Button
              onClick={() => navigate(`/rentals/${id}`)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <FaCalendarCheck className="text-lg" />
                View Rental Details
                <FaArrowRight className="text-sm" />
              </div>
            </Button>

            <Button
              onClick={handleGoToDashboard}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <FaHome />
                Explore More Rentals
              </div>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RentalSuccessful;
