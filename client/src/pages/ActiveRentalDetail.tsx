import AboutVehicleOwner from "@/components/AboutVehicleOwner";
import Button from "@/components/Button";
import Loader from "@/components/Loader"; // Loader component
import useAuthUser from "@/hooks/useAuthUser";
import { useCompleteRentalByOwner } from "@/hooks/useCompleteRentalByOwner";
import { useCompleteRentalByRenter } from "@/hooks/useCompleteRentalByRenter";
import { useListingById } from "@/hooks/useListingById";
import { useRentalDetail } from "@/hooks/useRentalDetail";
import dayjs from "dayjs";
import React from "react";
import {
  FaCogs,
  FaGasPump,
  FaIdCard,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

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

  const { completeRentalByRenter, isCompleteRentalByRenterLoading } =
    useCompleteRentalByRenter();
  const { completeRentalByOwner, isCompleteRentalByOwnerLoading } =
    useCompleteRentalByOwner();

  if (isRentalDetailLoading || isListingLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" />
      </div>
    );

  if (rentalDetailError || listingError)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">
            Unable to load rental details. Please try again later.
          </p>
          <Button
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );

  if (!rental || !listing || !id)
    return (
      <div className="flex items-center justify-center  h-screen">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            No Rental Found
          </h1>
          <p className="text-gray-600 mb-4">
            The rental you are looking for does not exist or has been removed.
          </p>
          <Button
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );

  if (!user) return null;

  const handleCompleteRentalByRenter = async () => {
    try {
      await completeRentalByRenter(rental.id);
      toast.success("Rental completed successfully!");
      refetchRentalDetail();
    } catch (error: any) {
      toast.error(error || "Failed to complete rental. Please try again.");
    }
  };

  const handleCompleteRentalByOwner = async () => {
    try {
      await completeRentalByOwner(rental.id);
      toast.success("Rental completed successfully!");
      refetchRentalDetail();
    } catch (error: any) {
      toast.error(error || "Failed to complete rental. Please try again.");
    }
  };

  const disabledCompleteRntalByOwner =
    rental.status !== "active" || rental.completedByOwner;
  // dayjs(rental.endDate).isBefore(dayjs());

  const disabledCompleteRentalByRenter =
    rental.status !== "active" ||
    rental.completedByRenter ||
    dayjs(rental.endDate).isBefore(dayjs());

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-100 h-[calc(100vh-4rem)] overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Active Rental Details
      </h1>

      {/* Rental Details */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Rental Information
        </h2>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-300" />
            <span className="text-blue-300 font-medium">Location:</span>{" "}
            {listing.location}
          </p>
          <p className="flex items-center gap-2">
            <FaGasPump className="text-blue-300" />
            <span className="text-blue-300 font-medium">Fuel Type:</span>{" "}
            {listing.fuelType.toUpperCase()}
          </p>
          <p className="flex items-center gap-2">
            <FaCogs className="text-blue-300" />
            <span className="text-blue-300 font-medium">
              Transmission:
            </span>{" "}
            {listing.transmissionType.toUpperCase()}
          </p>
          <p className="flex items-center gap-2">
            <FaUsers className="text-blue-300" />
            <span className="text-blue-300 font-medium">Seats:</span>{" "}
            {listing.numOfSeats}
          </p>
          <p className="sm:col-span-2 flex items-center gap-2">
            <FaIdCard className="text-blue-300" />
            <span className="text-blue-300 font-medium">
              License Plate:
            </span>{" "}
            {listing.licensePlate}
          </p>
        </div>
      </div>

      {user.role === "owner" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <AboutVehicleOwner id={rental.renterId} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <AboutVehicleOwner id={listing.ownerId} />
        </div>
      )}

      {/* Map for Location Tracking (Visible to Owner Only) */}
      {user.role === "owner" && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Vehicle Location
          </h2>
          {/* <Map
            latitude={rental.location.latitude}
            longitude={rental.location.longitude}
          /> */}
        </div>
      )}

      <div className="flex justify-end mt-6">
        {user.role === "owner" ? (
          <Button
            isLoading={isCompleteRentalByOwnerLoading}
            onClick={handleCompleteRentalByOwner}
            disabled={disabledCompleteRntalByOwner}
            variant="primary"
          >
            Complete Rental (Owner)
          </Button>
        ) : (
          <Button
            isLoading={isCompleteRentalByRenterLoading}
            onClick={handleCompleteRentalByRenter}
            disabled={disabledCompleteRentalByRenter}
            variant="primary"
          >
            Complete Rental (Renter)
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActiveRentalDetail;
