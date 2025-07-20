import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { motion, AnimatePresence } from "motion/react";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaTimes } from "react-icons/fa";

interface CalendarProps {
  lockedDates?: string[];
  minDate?: string;
  maxDate?: string;
  onDateSelect?: (dates: string[]) => void;
  trigger?: React.ReactNode;
  allowSingleDay?: boolean; // New prop to control single day selection behavior
}

const Calendar: React.FC<CalendarProps> = ({
  lockedDates = [],
  minDate,
  maxDate,
  onDateSelect,
  trigger = <Button>Open Calendar</Button>,
  allowSingleDay = true, // Default to allow single day selections
}) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [isOpen, setIsOpen] = useState(false);
  const [rangeStart, setRangeStart] = useState<Dayjs | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Dayjs | null>(null);
  const [hoverDate, setHoverDate] = useState<Dayjs | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const today = dayjs();
  const minDay = minDate ? dayjs(minDate) : today;
  const maxDay = maxDate ? dayjs(maxDate) : today.add(1, "month");
  const lockedDays = lockedDates.map((date) =>
    dayjs(date).format("YYYY-MM-DD")
  );

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startOfWeek = startOfMonth.startOf("week");
  const endOfWeek = endOfMonth.endOf("week");

  const days: Dayjs[] = [];
  let current = startOfWeek;
  while (current.isBefore(endOfWeek, "day")) {
    days.push(current);
    current = current.add(1, "day");
  }

  const getSelectedDates = (start: Dayjs, end: Dayjs) => {
    const selectedDates = [];
    let tempDate = start;
    while (tempDate.isBefore(end, "day") || tempDate.isSame(end, "day")) {
      selectedDates.push(tempDate.toISOString());
      tempDate = tempDate.add(1, "day");
    }
    return selectedDates;
  };

  const handleDateClick = (date: Dayjs) => {
    if (
      lockedDays.includes(date.format("YYYY-MM-DD")) ||
      date.isBefore(minDay, "day") ||
      date.isAfter(maxDay, "day")
    ) {
      return;
    }

    if (!rangeStart || (rangeStart && rangeEnd)) {
      // Starting a new selection
      setRangeStart(date);
      setRangeEnd(null);
      setHoverDate(null);
      
      // If allowSingleDay is true, immediately set end date for single day selection
      if (allowSingleDay) {
        onDateSelect?.([date.toISOString()]);
      }
    } else {
      // Completing the range selection
      let start = rangeStart.isBefore(date) ? rangeStart : date;
      let end = rangeStart.isAfter(date) ? rangeStart : date;

      if (minDay && start.isBefore(minDay)) start = minDay;
      if (maxDay && end.isAfter(maxDay)) end = maxDay;

      // For range selections, don't automatically add a day unless it's the same day
      if (!allowSingleDay && start.isSame(end, "day")) {
        end = end.add(1, "day");
      }

      setRangeStart(start);
      setRangeEnd(end);
      onDateSelect?.(getSelectedDates(start, end));
      setIsOpen(false);
    }
  };

  const handleDateHover = (date: Dayjs) => {
    if (rangeStart && !rangeEnd) {
      setHoverDate(date);
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const clearSelection = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setHoverDate(null);
    onDateSelect?.([]);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center w-full">
      <div
        className="cursor-pointer w-full"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={calendarRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 right-4 bg-white shadow-2xl rounded-2xl border border-gray-200 p-6 w-80 z-[99999]"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="text-blue-600 text-sm" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Select Dates</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close calendar"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                aria-label="Previous month"
              >
                <FaChevronLeft className="text-gray-600 group-hover:text-blue-600" />
              </button>
              <span className="text-xl font-bold text-gray-900">
                {currentDate.format("MMMM YYYY")}
              </span>
              <button 
                onClick={() => setCurrentDate(currentDate.add(1, "month"))}
                className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                aria-label="Next month"
              >
                <FaChevronRight className="text-gray-600 group-hover:text-blue-600" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {days.map((date) => {
                const formattedDate = date.format("YYYY-MM-DD");
                const isToday = date.isSame(today, "day");
                const isCurrentMonth = date.isSame(currentDate, "month");
                const isLocked = lockedDays.includes(formattedDate);
                const isDisabled =
                  date.isBefore(minDay, "day") ||
                  date.isAfter(maxDay, "day") ||
                  isLocked;

                const isInRange =
                  rangeStart &&
                  rangeEnd &&
                  date.isAfter(rangeStart, "day") &&
                  date.isBefore(rangeEnd, "day");

                const isStart = rangeStart && date.isSame(rangeStart, "day");
                const isEnd = rangeEnd && date.isSame(rangeEnd, "day");

                const isSelecting =
                  rangeStart &&
                  !rangeEnd &&
                  hoverDate &&
                  ((date.isAfter(rangeStart, "day") &&
                    date.isBefore(hoverDate, "day")) ||
                    date.isSame(hoverDate, "day"));

                return (
                  <button
                    key={formattedDate}
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => handleDateHover(date)}
                    disabled={isDisabled}
                    className={clsx(
                      "relative w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center",
                      // Base styles
                      isCurrentMonth ? "text-gray-900" : "text-gray-400",
                      
                      // Disabled states
                      isDisabled && "cursor-not-allowed opacity-40",
                      isLocked && "bg-red-100 text-red-600",
                      
                      // Interactive states
                      !isDisabled && "hover:bg-blue-50 hover:text-blue-600",
                      
                      // Today
                      isToday && !isStart && !isEnd && "bg-blue-600 text-white hover:bg-blue-700",
                      
                      // Selection states
                      isStart && "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg",
                      isEnd && "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg",
                      isInRange && "bg-blue-100 text-blue-700",
                      isSelecting && "bg-blue-50 text-blue-600"
                    )}
                  >
                    {date.date()}
                    
                    {/* Selection indicator dots */}
                    {(isStart || isEnd) && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={clearSelection}
                className="flex-1 py-2 px-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 text-sm font-medium"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
