import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { AvailableRentalsFilters } from "@/hooks/useAvailableRentals";
import { Listing } from "@/lib/types";
import React, { useState, useEffect, memo } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

export interface FilterCriteria {
  title: string;
  model: string;
  year: string;
  fuelType: string;
  numOfSeats: string;
  transmissionType: string;
  location: string;
  minPrice: string;
  maxPrice: string;
}

interface CarFilterProps {
  onFilterApply: (filters: AvailableRentalsFilters) => void;
  availableRentals: Listing[];
  isLoading?: boolean;
  currentFilters: AvailableRentalsFilters;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
}

const CarFilter: React.FC<CarFilterProps> = ({
  onFilterApply,
  availableRentals,
  isLoading = false,
  currentFilters,
  isFilterOpen,
  setIsFilterOpen,
}) => {
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  // Convert URL filters to local filter format
  const [filters, setFilters] = useState<FilterCriteria>(() => ({
    title: currentFilters.title || "",
    model: currentFilters.model || "",
    year: currentFilters.year || "",
    fuelType: currentFilters.fuelType || "",
    numOfSeats: currentFilters.numOfSeats || "",
    transmissionType: currentFilters.transmissionType || "",
    location: currentFilters.location || "",
    minPrice: currentFilters.minPrice || "",
    maxPrice: currentFilters.maxPrice || "",
  }));

  // Update local filters when URL filters change
  useEffect(() => {
    setFilters({
      title: currentFilters.title || "",
      model: currentFilters.model || "",
      year: currentFilters.year || "",
      fuelType: currentFilters.fuelType || "",
      numOfSeats: currentFilters.numOfSeats || "",
      transmissionType: currentFilters.transmissionType || "",
      location: currentFilters.location || "",
      minPrice: currentFilters.minPrice || "",
      maxPrice: currentFilters.maxPrice || "",
    });
  }, [currentFilters]);

  const fuelTypeOptions = [
    { value: "", label: "All Fuel Types" },
    { value: "petrol", label: "Petrol" },
    { value: "diesel", label: "Diesel" },
    { value: "electric", label: "Electric" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const transmissionOptions = [
    { value: "", label: "All Transmissions" },
    { value: "manual", label: "Manual" },
    { value: "automatic", label: "Automatic" },
  ];

  const seatOptions = [
    { value: "", label: "All Seats" },
    { value: "2", label: "2 Seats" },
    { value: "4", label: "4 Seats" },
    { value: "5", label: "5 Seats" },
    { value: "7", label: "7 Seats" },
    { value: "8", label: "8+ Seats" },
  ];

  // Get unique years from available rentals for year filter
  const yearOptions = [
    { value: "", label: "All Years" },
    ...Array.from(new Set(availableRentals.map((car) => car.year)))
      .sort((a, b) => b - a)
      .map((year) => ({
        value: year.toString(),
        label: year.toString(),
      })),
  ];

  const handleFilterChange = (field: keyof FilterCriteria, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    // Convert to server-side filter format and trigger API call
    const serverFilters: AvailableRentalsFilters = {
      title: filters.title || undefined,
      model: filters.model || undefined,
      year: filters.year || undefined,
      fuelType: filters.fuelType || undefined,
      numOfSeats: filters.numOfSeats || undefined,
      transmissionType: filters.transmissionType || undefined,
      location: filters.location || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
    };

    onFilterApply(serverFilters);
    closeFilter();
  };

  const clearFilters = () => {
    const emptyFilters: FilterCriteria = {
      title: "",
      model: "",
      year: "",
      fuelType: "",
      numOfSeats: "",
      transmissionType: "",
      location: "",
      minPrice: "",
      maxPrice: "",
    };
    setFilters(emptyFilters);
    onFilterApply({}); // Pass empty filters to show all results
    closeFilter();
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value !== "").length;
  };

  return (
    <div className="mb-6 relative">
      {/* Filter Toggle Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <Button
          onClick={toggleFilter}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          disabled={isLoading}
        >
          <FaFilter
            className={`transition-transform duration-200 ${
              isFilterOpen ? "rotate-180" : ""
            }`}
          />
          <span className="hidden sm:inline">
            {isLoading ? "Loading..." : "Filters"}
          </span>
          <span className="sm:hidden">
            {isLoading ? "Loading..." : "Filter Cars"}
          </span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-white text-blue-600 rounded-full px-2 py-1 text-xs font-bold ml-1">
              {getActiveFiltersCount()}
            </span>
          )}
        </Button>

        <div className="flex items-center gap-2">
          {getActiveFiltersCount() > 0 && (
            <Button
              onClick={clearFilters}
              variant="secondary"
              className="flex items-center gap-2 text-sm"
            >
              <FaTimes />
              <span className="hidden sm:inline">Clear All Filters</span>
              <span className="sm:hidden">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel - Absolute positioned to hover over content */}
      {isFilterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={closeFilter}
          />
          {/* Filter Panel */}
          <div className="absolute top-full left-0 right-0 z-50 bg-white p-6 rounded-lg shadow-2xl border border-gray-200 mt-2 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Title Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Title
                </label>
                <Input
                  placeholder="Search by title..."
                  value={filters.title}
                  onChange={(e) => handleFilterChange("title", e.target.value)}
                />
              </div>

              {/* Model Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <Input
                  placeholder="Search by model..."
                  value={filters.model}
                  onChange={(e) => handleFilterChange("model", e.target.value)}
                />
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <Select
                  options={yearOptions}
                  value={filters.year}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                  optionLabel="Select year"
                />
              </div>

              {/* Fuel Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <Select
                  options={fuelTypeOptions}
                  value={filters.fuelType}
                  onChange={(e) =>
                    handleFilterChange("fuelType", e.target.value)
                  }
                  optionLabel="Select fuel type"
                />
              </div>

              {/* Seats Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Seats
                </label>
                <Select
                  options={seatOptions}
                  value={filters.numOfSeats}
                  onChange={(e) =>
                    handleFilterChange("numOfSeats", e.target.value)
                  }
                  optionLabel="Select seats"
                />
              </div>

              {/* Transmission Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission
                </label>
                <Select
                  options={transmissionOptions}
                  value={filters.transmissionType}
                  onChange={(e) =>
                    handleFilterChange("transmissionType", e.target.value)
                  }
                  optionLabel="Select transmission"
                />
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Input
                  placeholder="Search by location..."
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                />
              </div>

              {/* Price Range Filters */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (PKR/day)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                {getActiveFiltersCount() > 0 && (
                  <span>
                    {getActiveFiltersCount()} filter
                    {getActiveFiltersCount() !== 1 ? "s" : ""} applied
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={clearFilters}
                  variant="secondary"
                  className="text-sm"
                >
                  Clear All
                </Button>
                <Button
                  onClick={applyFilters}
                  variant="primary"
                  className="text-sm"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(CarFilter);
