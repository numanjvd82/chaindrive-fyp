import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "./Button";

interface VehicleOwnerProps {
  name: string;
  rating: number;
  reviewCount: number;
  country: string;
  memberSince: string;
}

const AboutVehicleOwner: React.FC<VehicleOwnerProps> = ({
  name,
  rating,
  reviewCount,
  country,
  memberSince,
}) => {
  // Render star ratings
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.floor(rating) ? (
          <FaStar key={i} className="text-yellow-400" />
        ) : (
          <FaRegStar key={i} className="text-yellow-400" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="bg-gray-900 text-white p-6 md:p-8 rounded-lg shadow-lg max-w-lg mx-auto">
      {/* Title */}
      <h2 className="text-2xl font-bold text-blue-400 mb-4">
        About Vehicle Owner
      </h2>

      <div className="flex items-center gap-4">
        {/* Owner Name */}
        <h3 className="text-xl font-semibold">{name}</h3>

        {/* Star Ratings */}
        <div className="flex items-center">
          {renderStars()}
          <span className="ml-2 text-gray-400">
            {rating.toFixed(1)} ({reviewCount})
          </span>
        </div>
      </div>

      {/* Owner Info */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-gray-300">
        <p>
          <span className="text-blue-300 font-medium">From:</span> {country}
        </p>
        <p>
          <span className="text-blue-300 font-medium">Member Since:</span>{" "}
          {memberSince}
        </p>
      </div>

      {/* Chat Button */}
      <Link to="/chat">
        <Button
          className="mt-6 w-full"
          onClick={() => alert("Chat with owner feature coming soon!")}
        >
          Chat Now
        </Button>
      </Link>
    </div>
  );
};

export default AboutVehicleOwner;
