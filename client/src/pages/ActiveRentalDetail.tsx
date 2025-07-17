import Button from "@/components/Button";
import Loader from "@/components/Loader";
import { RentalDetailForOwner } from "@/components/pages/ActiveRentalDetail/RentalDetailForOwner";
import { RentalDetailForRenter } from "@/components/pages/ActiveRentalDetail/RentalDetailForRenter";
import useAuthUser from "@/hooks/useAuthUser";
import { useListingById } from "@/hooks/useListingById";
import { useRentalDetail } from "@/hooks/useRentalDetail";
import { motion } from "motion/react";
import React from "react";
import { FaExclamationTriangle, FaSearch } from "react-icons/fa";
import { useParams } from "react-router-dom";

const ActiveRentalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthUser();

  const {
    rental,
    error: rentalDetailError,
    isLoading: isRentalDetailLoading,
    refetchRentalDetail,
  } = useRentalDetail(id);
  const {
    listing,
    error: listingError,
    isLoading: isListingLoading,
  } = useListingById(rental?.listingId || 0);

  if (isRentalDetailLoading || isListingLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader size="xl" variant="spinner" color="text-blue-600" />
          <p className="text-gray-600 text-lg mt-4">Loading rental details...</p>
        </motion.div>
      </div>
    );

  if (rentalDetailError || listingError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Rental</h1>
          <p className="text-gray-600 mb-6">
            Unable to load rental details. Please try again later.
          </p>
          <Button
            variant="primary"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );

  if (!rental || !listing || !id)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            No Rental Found
          </h1>
          <p className="text-gray-600 mb-6">
            The rental you are looking for does not exist or has been removed.
          </p>
          <Button
            variant="primary"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </motion.div>
      </div>
    );

  if (!user) return null;

  return (
    <>
      {user.role === "owner" ? (
        <RentalDetailForOwner
          rental={rental}
          listing={listing}
          refetchRentalDetail={refetchRentalDetail}
        />
      ) : (
        <RentalDetailForRenter
          rental={rental}
          listing={listing}
          refetchRentalDetail={refetchRentalDetail}
        />
      )}
    </>
  );
};

export default ActiveRentalDetail;
