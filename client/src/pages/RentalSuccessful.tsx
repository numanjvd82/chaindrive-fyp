import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Rental ID Missing
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the rental ID. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Rental Confirmed!
        </h1>
        <p className="text-gray-600 mb-6">
          Your rental has been successfully confirmed. Thank you for choosing
          our service!
        </p>
        <p className="text-gray-600 mb-6">
          You will be redirected to the rental details page in {countdown}{" "}
          seconds.
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGoToDashboard}
            className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Explore More Rentals
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalSuccessful;
