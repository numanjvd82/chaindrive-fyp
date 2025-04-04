import { AvailableRental } from "@/lib/types";
import React from "react";
import {
  FaCogs,
  FaGasPump,
  FaIdCard,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";

type Props = {
  rental: Omit<AvailableRental, "images">;
};

const CarDetail: React.FC<Props> = ({ rental }) => {
  return (
    <div className="bg-gray-800 text-white p-6 md:p-8 rounded-lg shadow-lg">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-blue-400 text-center">
        {rental.title} {rental.model} ({rental.year})
      </h2>

      {/* Price */}
      <p className="text-lg text-gray-300 mt-4 text-center">
        <span className="text-blue-300 font-medium">Price:</span>{" "}
        <span className="text-blue-400 font-semibold">
          {rental.pricePerDay} <span className="text-sm">PKR / day</span>
        </span>
      </p>

      {/* Car Details with Icons */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
        <p className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-300" />
          <span className="text-blue-300 font-medium">Location:</span>{" "}
          {rental.location}
        </p>
        <p className="flex items-center gap-2">
          <FaGasPump className="text-blue-300" />
          <span className="text-blue-300 font-medium">Fuel Type:</span>{" "}
          {rental.fuelType.toUpperCase()}
        </p>
        <p className="flex items-center gap-2">
          <FaCogs className="text-blue-300" />
          <span className="text-blue-300 font-medium">Transmission:</span>{" "}
          {rental.transmissionType.toUpperCase()}
        </p>
        <p className="flex items-center gap-2">
          <FaUsers className="text-blue-300" />
          <span className="text-blue-300 font-medium">Seats:</span>{" "}
          {rental.numOfSeats}
        </p>
        <p className="sm:col-span-2 flex items-center gap-2">
          <FaIdCard className="text-blue-300" />
          <span className="text-blue-300 font-medium">License Plate:</span>{" "}
          {rental.licensePlate}
        </p>
      </div>
    </div>
  );
};

export default CarDetail;
