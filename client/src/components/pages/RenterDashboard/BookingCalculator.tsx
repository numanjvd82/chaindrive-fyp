import Button from "@/components/Button";
import Calendar from "@/components/Calendar";
import dayjs from "dayjs";
import React, { useState } from "react";

interface BookingSummaryProps {
  ppd: number;
  onBookNow?: () => void;
}

const BookingCalculator: React.FC<BookingSummaryProps> = ({
  ppd = 45,
  onBookNow,
}) => {
  const [dates, setDates] = useState<string[]>([]);

  const onlyOneDay =
    dates.length === 1 ||
    (dates.length > 0 &&
      dayjs(dates[0]).isSame(dayjs(dates[dates.length - 1]), "day"));

  const calculateTotal = () => {
    if (dates.length === 0) return 0;
    const startDate = dayjs(dates[0]);
    const endDate = dayjs(dates[dates.length - 1]);
    const totalDays = endDate.diff(startDate, "day") + 1; // +1 to include start date
    return totalDays * ppd;
  };
  const total = calculateTotal();
  const totalDays = dates.length;

  return (
    <div className="border rounded-xl p-6 shadow-lg bg-white w-full max-w-sm mx-auto h-[350px] lg:w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Booking Summary</h2>
        <h3 className="text-lg font-bold text-primary">PKR {ppd}/day</h3>
      </div>

      <div className="mt-5">
        <div className="bg-gray-100 flex justify-between items-center rounded-lg shadow-sm p-3">
          <Calendar
            trigger={
              <div className="text-sm text-gray-700 cursor-pointer w-full">
                <p className="font-medium text-primary">
                  {dates.length > 0
                    ? onlyOneDay
                      ? `Selected Date: ${dayjs(dates[0]).format("DD/MM/YYYY")}`
                      : `Selected Dates: ${dayjs(dates[0]).format(
                          "DD/MM/YYYY"
                        )} - ${dayjs(dates[dates.length - 1]).format(
                          "DD/MM/YYYY"
                        )}`
                    : "Select Dates"}
                </p>
              </div>
            }
            onDateSelect={(dates) => setDates(dates)}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 border-t pt-4">
        <p className="font-medium text-lg">Total</p>
        <p className="text-2xl font-bold text-primary">PKR {total}</p>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500 mt-2">
          {totalDays > 0
            ? `Total Days: ${totalDays}`
            : "Please select dates to see total days."}
        </p>
      </div>

      <Button
        onClick={onBookNow}
        disabled={total === 0}
        className="w-full py-3 mt-6 text-lg font-semibold"
      >
        Initiate Booking
      </Button>
    </div>
  );
};

export default BookingCalculator;
