import { FunctionComponent, useState } from "react";
import Button from "../Button";

interface SearchBarProps {
  onSearch: (filters: Record<string, string>) => void;
}

const SearchBar: FunctionComponent<SearchBarProps> = ({ onSearch }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdownLabel: string) => {
    setActiveDropdown((prev) => (prev === dropdownLabel ? null : dropdownLabel));
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  const dropdownOptions = {
    Location: ["New York", "Los Angeles", "Chicago", "Houston"],
    "Car Type": ["Sedan", "SUV", "Convertible", "Truck"],
    "Daily Rent": ["$50-$100", "$101-$200", "$201-$300", "Above $300"],
    Availability: ["Available", "Not Available"],
    Seats: ["2 Seats", "4 Seats", "6 Seats", "8 Seats"],
    Duration: ["1 Day", "1 Week", "1 Month", "Custom"],
  };

  return (
    <div className="bg-gray-100">
      <div
        className="flex justify-center items-center w-full bg-gray-100"
        onClick={closeDropdowns}
      >
        <div
          className="bg-white flex flex-wrap items-center justify-center rounded-lg  shadow-md max-w-[90%] w-full px-4 py-4 gap-4 md:max-w-[80%]"
        >
          <div>
            <svg width="35" height="30" viewBox="0 0 35 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="34" height="29" rx="9.5" stroke="#959595" />
              <path d="M11 20C12.1046 20 13 20.8954 13 22C13 23.1046 12.1046 24 11 24C9.89543 24 9 23.1046 9 22C9 20.8954 9.89543 20 11 20Z" fill="black" fill-opacity="0.15" />
              <path d="M23 13C24.1046 13 25 13.8954 25 15C25 16.1046 24.1046 17 23 17C21.8954 17 21 16.1046 21 15C21 13.8954 21.8954 13 23 13Z" fill="black" fill-opacity="0.15" />
              <path d="M19 8C19 6.89543 18.1046 6 17 6C15.8954 6 15 6.89543 15 8C15 9.10457 15.8954 10 17 10C18.1046 10 19 9.10457 19 8Z" fill="black" fill-opacity="0.15" />
              <path d="M9 8L15 8M15 8C15 9.10457 15.8954 10 17 10C18.1046 10 19 9.10457 19 8M15 8C15 6.89543 15.8954 6 17 6C18.1046 6 19 6.89543 19 8M19 8L25 8M9 15H21M21 15C21 16.1046 21.8954 17 23 17C24.1046 17 25 16.1046 25 15C25 13.8954 24.1046 13 23 13C21.8954 13 21 13.8954 21 15ZM13 22H25M13 22C13 20.8954 12.1046 20 11 20C9.89543 20 9 20.8954 9 22C9 23.1046 9.89543 24 11 24C12.1046 24 13 23.1046 13 22Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>

          {Object.entries(dropdownOptions).map(([label, options], idx) => (
            <div key={idx} className="relative">
              <div
                className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(label);
                }}
              >
                <span className="text-sm font-medium">{label}</span>
                <img
                  src="/downarrow.svg"
                  alt={`Open ${label} dropdown`}
                  className="w-4 h-4"
                />
              </div>

              {activeDropdown === label && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  {options.map((option, optionIdx) => (
                    <div
                      key={optionIdx}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => console.log(`${label}: ${option}`)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Button text="Search" class="px-6 py-2" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
