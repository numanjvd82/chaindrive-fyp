import { CarGrid } from "@/components/pages/RenterDashboard/CarGrid";
import CarFilter from "@/components/pages/RenterDashboard/CarFilter";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { useAvailableRentals, AvailableRentalsFilters } from "@/hooks/useAvailableRentals";
import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const RenterDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Initialize filters from URL query parameters
  const [filters, setFilters] = useState<AvailableRentalsFilters>(() => {
    const urlFilters: AvailableRentalsFilters = {};
    searchParams.forEach((value, key) => {
      if (value) {
        urlFilters[key as keyof AvailableRentalsFilters] = value;
      }
    });
    return urlFilters;
  });

  const { error, isLoading, availableRentals } = useAvailableRentals(filters);

  const handleFilterChange = useCallback((newFilters: AvailableRentalsFilters) => {
    setFilters(newFilters);
    
    // Update URL query parameters
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        newSearchParams.set(key, value);
      }
    });
    setSearchParams(newSearchParams, { replace: true });
  }, [setSearchParams]);

  if (isLoading) {
    return (
      <div className="text-center h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Error fetching available rentals</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Ride
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover thousands of cars available for rent in your area. From economy to luxury, we have the perfect vehicle for every journey.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Component */}
        <div className="mb-8">
          <CarFilter
            key="car-filter" // Stable key to prevent unmounting
            onFilterApply={handleFilterChange}
            availableRentals={availableRentals || []}
            isLoading={isLoading}
            currentFilters={filters}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
          />
        </div>
        
        {/* Results Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Available Cars
                  </h2>
                  <p className="text-gray-600">
                    {availableRentals?.length || 0} car{availableRentals?.length !== 1 ? 's' : ''} found
                  </p>
                </div>
              </div>
              
              {availableRentals && availableRentals.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  All prices shown are per day
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!availableRentals || availableRentals.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cars available</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search in a different location
              </p>
              <button
                onClick={() => handleFilterChange({})}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          /* Car Grid */
          <CarGrid availableRentals={availableRentals || []} />
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default RenterDashboard;