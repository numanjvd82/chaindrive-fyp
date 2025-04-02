import Button from "@/components/Button";
import React, { useState } from "react";

interface BookingSummaryProps {
  ppd: number;
  onBookNow?: () => void;
}

const BookingCalculator: React.FC<BookingSummaryProps> = ({
  ppd = 45,
  onBookNow,
}) => {
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [totalDays, setTotalDays] = useState<number>(0);

  const calculateTotalDays = () => {
    if (checkInDate && checkOutDate) {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      // Ensure dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        setTotalDays(0);
        return;
      }

      // Calculate the difference in milliseconds
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      // Convert to days
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setTotalDays(diffDays);
    } else {
      setTotalDays(0);
    }
  };

  return (
    <div className="border rounded-lg p-6 shadow-md bg-white w-full max-w-sm mx-auto h-[350px] lg:w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Booking Dates</h3>
        <h3 className="text-lg">PKR{ppd}/day</h3>
      </div>

      {/* Date Inputs */}
      <div className="mt-4">
        <div className="bg-gray-100 rounded-lg shadow-sm p-3 mb-3">
          <label className="text-sm text-gray-600 block">Check-in</label>
          <input
            type="date"
            className="w-full bg-transparent focus:outline-none"
            value={checkInDate}
            onChange={(e) => {
              setCheckInDate(e.target.value);
              calculateTotalDays();
            }}
          />
        </div>

        <div className="bg-gray-100 rounded-lg shadow-sm p-3 mb-3">
          <label className="text-sm text-gray-600 block">Check-out</label>
          <input
            type="date"
            className="w-full bg-transparent focus:outline-none"
            value={checkOutDate}
            onChange={(e) => {
              setCheckOutDate(e.target.value);
              calculateTotalDays();
            }}
          />
        </div>

        {totalDays > 0 && (
          <div className="bg-gray-100 rounded-lg shadow-sm p-3 mb-3">
            <p className="text-sm text-gray-600">Number of days: {totalDays}</p>
          </div>
        )}
      </div>

      {/* Total Price */}
      <div className="flex justify-between items-center mt-4">
        <p className="font-medium">Total</p>
        <p className="text-lg font-bold">PKR{(ppd * totalDays).toFixed(2)}</p>
      </div>

      {/* Booking Button */}
      <Button onClick={onBookNow} className="w-full py-2 mt-4">
        Initiate Booking
      </Button>
    </div>
  );
};

export default BookingCalculator;
