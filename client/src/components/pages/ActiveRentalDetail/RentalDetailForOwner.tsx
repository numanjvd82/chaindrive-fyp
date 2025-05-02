import AboutVehicleOwner from "@/components/AboutVehicleOwner";
import Button from "@/components/Button";
import Map from "@/components/Map";
import { useCompleteRentalByOwner } from "@/hooks/useCompleteRentalByOwner";
import { useLatestLocation } from "@/hooks/useLatestLocation";
import { useWallet } from "@/hooks/useWallet";
import { getContractInstance } from "@/lib/contract";
import { Listing, RentalWithImages } from "@/lib/types";
import clsx from "clsx";
import React from "react";
import {
  FaCheckCircle,
  FaCogs,
  FaGasPump,
  FaIdCard,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {
  rental: RentalWithImages;
  listing: Listing;
  refetchRentalDetail: () => void;
};

export const RentalDetailForOwner: React.FC<Props> = ({
  listing,
  rental,
  refetchRentalDetail,
}) => {
  const navigate = useNavigate();

  const { completeRentalByOwner, isCompleteRentalByOwnerLoading } =
    useCompleteRentalByOwner();

  const { signer, provider } = useWallet();
  const { latestLocation, isLocationLoading } = useLatestLocation(
    listing.expectedDeviceId || ""
  );

  const handleCompleteRentalByOwner = async () => {
    if (!signer || !provider) {
      toast.error("Please connect your wallet.");
      return;
    }
    try {
      const contract = getContractInstance(signer);
      const tx = await contract.completeRentalByOwner(rental.id);
      toast.loading("Completing rental on the blockchain...");
      const receipt = await tx.wait();

      if (!receipt || receipt.status !== 1) {
        toast.error("Failed to complete rental on the blockchain.");
        return;
      }

      await completeRentalByOwner(rental.id);
      refetchRentalDetail();
      toast.dismiss();
      toast.success(`Rental completed successfully.\n
        Transaction Hash: ${tx.hash}
        View on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}
        `);
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to complete rental. Please try again."
      );
    }
  };

  const disabledCompleteRentalByOwner =
    rental.status !== "active" || rental.completedByOwner;

  const renderCompletionStatus = () => {
    if (rental.completedByOwner && rental.completedByRenter) {
      return (
        <p className="flex items-center gap-2 text-green-600 font-medium">
          <FaCheckCircle /> Rental completed by both you and renter
        </p>
      );
    }
    if (rental.completedByOwner) {
      return (
        <p className="flex items-center gap-2 text-blue-600 font-medium">
          <FaCheckCircle /> Rental is completed by you
        </p>
      );
    }
    if (rental.completedByRenter) {
      return (
        <p className="flex items-center gap-2 text-blue-600 font-medium">
          <FaCheckCircle /> Rental completed by renter
        </p>
      );
    }
    return null;
  };

  const statusColor = {
    pending: "bg-yellow-200 text-yellow-800",
    active: "bg-blue-200 text-blue-800",
    cancelled: "bg-red-200 text-red-800",
    completed: "bg-green-200 text-green-800",
  };

  const renderMap = () => {
    if (isLocationLoading) {
      return <p className="text-gray-500">Loading location...</p>;
    }

    if (!latestLocation) {
      return <p className="text-gray-500">No location data available.</p>;
    }

    <Map
      latitude={latestLocation.latitude}
      longitude={latestLocation.longitude}
    />;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-100 h-[calc(100vh-4rem)] overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Active Renta l Details
      </h1>

      {/* Status Badge */}
      <div className="mb-6 flex items-center gap-4">
        <span
          className={clsx(
            "px-3 py-1 rounded-full text-sm font-semibold capitalize",
            statusColor[rental.status as keyof typeof statusColor]
          )}
        >
          Status: {rental.status}
        </span>
        {renderCompletionStatus()}
      </div>

      {rental.status === "active" ? (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Vehicle Location
          </h2>
          {renderMap()}
        </div>
      ) : null}

      {/* Rental Info Card */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Rental Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <AboutVehicleOwner id={rental.renterId} />
      </div>

      {/* Complete Rental Button */}
      {!rental.completedByOwner ? (
        <div className="flex justify-end mt-6">
          <Button
            isLoading={isCompleteRentalByOwnerLoading}
            onClick={handleCompleteRentalByOwner}
            disabled={disabledCompleteRentalByOwner}
            variant="primary"
          >
            Complete Rental (Owner)
          </Button>
        </div>
      ) : null}
    </div>
  );
};
