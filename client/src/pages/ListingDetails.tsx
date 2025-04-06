import AboutVehicleOwner from "@/components/AboutVehicleOwner";
import Footer from "@/components/Footer";
import ImageSlider from "@/components/ImageSlider";
import BookingCalculator from "@/components/pages/RenterDashboard/BookingCalculator";
import CarDetail from "@/components/pages/RenterDashboard/CarDetail";
import Recommendation from "@/components/Recommendation";
import { AvailableRental } from "@/lib/types";
import { useLocation } from "react-router-dom";

const ListingDetails = () => {
  const location = useLocation();
  const rentalDetails = location.state?.details as AvailableRental;

  if (!rentalDetails) {
    return (
      <div className="text-center h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Rental details not found</p>
      </div>
    );
  }

  const images = rentalDetails.images;

  return (
    <>
      <div className="bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4">Rental Details</h1>
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="w-full lg:w-3/4">
            <ImageSlider images={images} />
          </div>
          <div className="w-full lg:w-1/4">
            <BookingCalculator rental={rentalDetails} />
          </div>
        </div>

        <div className="mt-8 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4">
            <CarDetail rental={rentalDetails} />
          </div>
          <div className="w-full lg:w-1/4">
            <AboutVehicleOwner id={rentalDetails.ownerId} />
          </div>
        </div>

        <div className="mt-8">
          <Recommendation />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListingDetails;
