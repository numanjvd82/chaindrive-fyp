import React, { useState } from "react";

interface MainSearchProps {
  onSearch: (location: string, pickupDate: string, returnDate: string) => void;
}

const MainSearch: React.FC<MainSearchProps> = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleSearch = () => {
    onSearch(location, pickupDate, returnDate);
  };

  return (
    <div className="relative mx-auto flex w-auto md:px-5 bg-white shadow-lg rounded-lg mt-8">
      <div className="flex flex-wrap items-center p-4 gap-4 md:gap-10">
        <div className="w-full md:w-auto flex items-center gap-4">
          <img
            className="h-6 md:h-auto mb-1.5 self-end"
            src="/locationicon.svg"
            alt="Location"
            loading="lazy"
          />
          <div className="flex flex-1 flex-col items-start">
            <p className="text-sm md:text-base font-medium text-gray-800_01">
              Location
            </p>
            <input
              type="text"
              id="location"
              placeholder="Search your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-sm md:text-base text-gray-500 focus:outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center gap-4">
          <img
            className="h-6 md:h-[32px] mb-1.5 self-end"
            src="/calandaricon.svg"
            alt="Pickup Date"
            loading="lazy"
          />
          <div className="flex flex-1 flex-col items-start">
            <p className="text-sm md:text-base font-medium text-gray-800_01">
              Pickup date
            </p>
            <input
              type="datetime-local"
              id="pickup-date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="text-sm md:text-base text-gray-700 focus:outline-none bg-transparent cursor-pointer"
            />
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center gap-4">
          <img
            className="h-6 md:h-[32px] mb-1.5 self-end"
            src="/calandaricon.svg"
            alt="Return Date"
            loading="lazy"
          />
          <div className="flex flex-1 flex-col items-start">
            <p className="text-sm md:text-base font-medium text-gray-800_01">
              Return date
            </p>
            <input
              type="datetime-local"
              id="return-date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="text-sm md:text-base text-gray-700 focus:outline-none bg-transparent cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default MainSearch;
