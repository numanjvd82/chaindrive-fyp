import clsx from "clsx";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";

interface CalendarProps {
  lockedDates?: string[];
  minDate?: string;
  maxDate?: string;
  onDateSelect?: (dates: string[]) => void;
  trigger?: React.ReactNode;
}

const Calendar: React.FC<CalendarProps> = ({
  lockedDates = [],
  minDate,
  maxDate,
  onDateSelect,
  trigger = <Button>Open Calendar</Button>,
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
      // If no start date OR if both start and end are set, reset selection
      setRangeStart(date);
      setRangeEnd(null);
      setHoverDate(null);
    } else {
      let start = rangeStart.isBefore(date) ? rangeStart : date;
      let end = rangeStart.isAfter(date) ? rangeStart : date;

      if (minDay && start.isBefore(minDay)) start = minDay;
      if (maxDay && end.isAfter(maxDay)) end = maxDay;

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

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      <div
        className="cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
        onBlur={() => setIsOpen(false)}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={calendarRef}
          className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-4 w-72 z-10"
        >
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
            >
              &lt;
            </button>
            <span className="font-semibold">
              {currentDate.format("MMMM YYYY")}
            </span>
            <button onClick={() => setCurrentDate(currentDate.add(1, "month"))}>
              &gt;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
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
                    "p-2 rounded-lg",
                    isToday ? "bg-blue-500 text-white" : "hover:bg-gray-200",
                    isLocked ? "bg-gray-400 text-white cursor-not-allowed" : "",
                    isDisabled ? "text-gray-300 cursor-not-allowed" : "",
                    !isCurrentMonth ? "text-gray-400" : "text-black",
                    isStart ? "bg-green-500 text-white" : "",
                    isEnd ? "bg-green-500 text-white" : "",
                    isInRange ? "bg-green-300" : "",
                    isSelecting ? "bg-gray-300" : ""
                  )}
                >
                  {date.date()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
