import UserProfile from "@/components/UserProfile";
import Footer from "@/components/Footer";
import ImageSlider from "@/components/ImageSlider";
import BookingCalculator from "@/components/pages/RenterDashboard/BookingCalculator";
import CarDetail from "@/components/pages/RenterDashboard/CarDetail";
import Recommendation from "@/components/Recommendation";
import { AvailableRental } from "@/lib/types";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { FaArrowLeft, FaCar, FaMapMarkerAlt } from "react-icons/fa";

const ListingDetails = () => {
  const location = useLocation();
  const rentalDetails = location.state?.details as AvailableRental;

  if (!rentalDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCar className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Rental Not Found</h2>
          <p className="text-gray-600 mb-6">The rental details you're looking for could not be found.</p>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 mx-auto"
          >
            <FaArrowLeft />
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  const images = rentalDetails.images;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {rentalDetails.title} {rentalDetails.model}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <FaMapMarkerAlt className="text-blue-600" />
                <span>{rentalDetails.location}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Image and Booking Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4"
        >
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <ImageSlider images={images} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <BookingCalculator rental={rentalDetails} />
            </div>
          </div>
        </motion.div>

        {/* Details and Owner Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4"
        >
          <div className="lg:col-span-2">
            <CarDetail rental={rentalDetails} />
          </div>
          <div className="lg:col-span-1">
            <UserProfile id={rentalDetails.ownerId} title="Owner Information" />
          </div>
        </motion.div>

        {/* Recommendations Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              You Might Also Like
            </h2>
            <Recommendation />
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ListingDetails;
