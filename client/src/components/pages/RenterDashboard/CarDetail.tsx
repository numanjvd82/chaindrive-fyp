import { AvailableRental } from "@/lib/types";
import React from "react";
import {
  FaCogs,
  FaGasPump,
  FaIdCard,
  FaMapMarkerAlt,
  FaUsers,
  FaCar,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion } from "motion/react";

type Props = {
  rental: Omit<AvailableRental, "images">;
};

const CarDetail: React.FC<Props> = ({ rental }) => {
  const details = [
    {
      icon: FaMapMarkerAlt,
      label: "Location",
      value: rental.location,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: FaGasPump,
      label: "Fuel Type",
      value: rental.fuelType.charAt(0).toUpperCase() + rental.fuelType.slice(1),
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: FaCogs,
      label: "Transmission",
      value: rental.transmissionType.charAt(0).toUpperCase() + rental.transmissionType.slice(1),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: FaUsers,
      label: "Seats",
      value: `${rental.numOfSeats} Passengers`,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: FaCar,
      label: "Model Year",
      value: rental.year.toString(),
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: FaIdCard,
      label: "License Plate",
      value: rental.licensePlate,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <FaCar className="text-white text-xl" />
          </div>
          <h2 className="text-2xl font-bold">Vehicle Details</h2>
        </div>
        <h3 className="text-3xl font-bold">
          {rental.title} {rental.model}
        </h3>
        <p className="text-blue-100 text-lg mt-2">
          PKR {rental.pricePerDay} <span className="text-sm opacity-80">per day</span>
        </p>
      </div>

      {/* Details Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail, index) => (
            <motion.div
              key={detail.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-md"
            >
              <div className={`w-12 h-12 ${detail.bgColor} rounded-xl flex items-center justify-center`}>
                <detail.icon className={`${detail.color} text-xl`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">{detail.label}</p>
                <p className="text-lg font-semibold text-gray-900">{detail.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Availability Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <FaCalendarAlt className="text-green-600 text-lg" />
            </div>
            <div>
              <p className="font-semibold text-green-800">Available for Booking</p>
              <p className="text-sm text-green-600">This vehicle is ready to be rented</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CarDetail;
