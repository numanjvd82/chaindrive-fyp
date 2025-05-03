import { CarGrid } from "@/components/pages/RenterDashboard/CarGrid";

import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { useAvailableRentals } from "@/hooks/useAvailableRentals";

const RenterDashboard = () => {
  const { error, isLoading, availableRentals } = useAvailableRentals();

  if (isLoading) {
    <div className="text-center h-screen flex items-center justify-center">
      <Loader size="lg" />
    </div>;
  }

  if (error) {
    return (
      <div className="text-center h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Error fetching available rentals</p>
      </div>
    );
  }

  if (!availableRentals || availableRentals.length === 0) {
    return (
      <div className="text-center h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">No available rentals found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-8">Car Rental</h1>
        <CarGrid availableRentals={availableRentals} />
      </div>
      <Footer />
    </div>
    <Footer />
    </div>
  );
};

export default RenterDashboard;
