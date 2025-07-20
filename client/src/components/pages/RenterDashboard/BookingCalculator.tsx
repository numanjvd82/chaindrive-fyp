import Button from "@/components/Button";
import Calendar from "@/components/Calendar";
import { AvailableRental } from "@/lib/types";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { FaCalendarAlt, FaCalculator, FaCreditCard } from "react-icons/fa";

interface BookingSummaryProps {
  rental: AvailableRental;
}

const BookingCalculator: React.FC<BookingSummaryProps> = ({ rental }) => {
  const [dates, setDates] = useState<string[]>([]);
  const navigate = useNavigate();
  const pricePerDay = rental.pricePerDay;

  const onlyOneDay =
    dates.length === 1 ||
    (dates.length > 0 &&
      dayjs(dates[0]).isSame(dayjs(dates[dates.length - 1]), "day"));

  const calculateTotal = () => {
    if (dates.length === 0) return;
    const startDate = dayjs(dates[0]);
    const endDate = dayjs(dates[dates.length - 1]);
    const totalDays = endDate.diff(startDate, "day"); // Exclusive duration
    return {
      totalPrice: totalDays * pricePerDay,
      totalDays,
    };
  };
  const total = calculateTotal();

  const onBookNow = () => {
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);

    if (!total) return;

    if (total.totalPrice > 0) {
      const bookingData = {
        startDate,
        endDate,
        totalPrice: total.totalPrice,
        totalDays: total.totalDays,
      };

      navigate(`/rental-confirmation/${rental.id}`, {
        state: { rental, bookingData },
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <FaCalculator className="text-white text-xl" />
          </div>
          <h2 className="text-xl font-bold">Booking Calculator</h2>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-green-100">Calculate your rental cost</p>
          <div className="text-right">
            <p className="text-2xl font-bold">PKR {pricePerDay}</p>
            <p className="text-green-100 text-sm">per day</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FaCalendarAlt className="text-blue-600" />
            <label className="text-sm font-semibold text-gray-700">Select Rental Dates</label>
          </div>
          <div className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-xl p-4 border border-gray-200 cursor-pointer">
            <Calendar
              allowSingleDay={false} // Force range selection for rentals
              trigger={
                <div className="text-gray-700 w-full">
                  <p className="font-medium text-gray-900">
                    {dates.length > 0
                      ? onlyOneDay
                        ? `Selected: ${dayjs(dates[0]).format("DD/MM/YYYY")}`
                        : `${dayjs(dates[0]).format("DD/MM/YYYY")} - ${dayjs(dates[dates.length - 1]).format("DD/MM/YYYY")}`
                      : "Click to select dates"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {dates.length > 0 && !onlyOneDay ? `${total?.totalDays || 0} days selected` : "Choose your rental period"}
                  </p>
                </div>
              }
              onDateSelect={(dates) => setDates(dates)}
            />
          </div>
        </div>

        {/* Price Breakdown */}
        {total && total.totalDays > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
          >
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FaCreditCard className="text-blue-600" />
              Price Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Rate:</span>
                <span className="font-medium">PKR {pricePerDay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Days:</span>
                <span className="font-medium">{total.totalDays}</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total Amount:</span>
                <span className="text-green-600">PKR {total.totalPrice}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Booking Button */}
        <Button
          onClick={onBookNow}
          disabled={total?.totalPrice === 0 || dates.length === 0}
          className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
        >
          {dates.length === 0 
            ? "Select Dates to Continue" 
            : total?.totalPrice === 0 
              ? "Invalid Date Selection" 
              : "Initiate Booking"
          }
        </Button>

        {/* Info Text */}
        <p className="text-xs text-gray-500 text-center mt-4">
          {total && total.totalDays > 0
            ? "🚗 Your booking will be processed securely"
            : "📅 Select your rental dates to see the total cost"}
        </p>
      </div>
    </motion.div>
  );
};

export default BookingCalculator;
