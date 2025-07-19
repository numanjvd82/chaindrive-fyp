import UserProfile from "@/components/UserProfile";
import Button from "@/components/Button";
import Map from "@/components/Map";
import { useConfirmRental } from "@/hooks/useConfirmRental";
import { useCompleteRentalByOwner } from "@/hooks/useCompleteRentalByOwner";
import { useCancelRental } from "@/hooks/useCancelRental";
import { useLatestLocation } from "@/hooks/useLatestLocation";
import { useWallet } from "@/hooks/useWallet";
import { getContractInstance } from "@/lib/contract";
import { Listing, RentalWithImages } from "@/lib/types";
import dayjs from "dayjs";
import { motion } from "motion/react";
import React, { useState } from "react";
import {
  FaCheckCircle,
  FaCogs,
  FaGasPump,
  FaIdCard,
  FaMapMarkerAlt,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaTimes,
  FaCircle,
  FaDollarSign,
  FaExclamationTriangle,
  FaCamera,
} from "react-icons/fa";
import { toast } from "react-toastify";
import ViolationReportingModal from "./ViolationReportingModal";
import { useViolationByRentalId } from "@/hooks/useViolationById";

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
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const { completeRentalByOwner, isCompleteRentalByOwnerLoading } =
    useCompleteRentalByOwner();
  const { confirmRental, isConfirmRentalLoading } = useConfirmRental();
  const { cancelRental, isCancelRentalLoading } = useCancelRental();
  const { refetchViolation, violation } = useViolationByRentalId(rental.id);
  const { signer, provider } = useWallet();
  const { latestLocation, isLocationLoading } = useLatestLocation(
    listing.expectedDeviceId || ""
  );

  const handleConfirmRental = async () => {
    try {
      await confirmRental({ rentalId: rental.id });
    } catch (error: unknown) {
      console.error("Error confirming rental:", error);
    }
  };

  const handleCancelRental = async () => {
    if (!signer || !provider) {
      toast.error("Please connect your wallet to cancel the rental.");
      return;
    }

    if (!rental) {
      toast.error("Rental not found.");
      return;
    }

    if (rental.status !== "pending") {
      toast.error("Rental cannot be cancelled.");
      return;
    }

    try {
      const contract = getContractInstance(signer);
      const tx = await contract.cancelRental(rental.id);
      toast.loading("Cancelling rental on the blockchain...");
      const receipt = await tx.wait();

      if (!receipt || receipt.status !== 1) {
        toast.error("Failed to cancel rental on the blockchain.");
        return;
      }

      await cancelRental(rental.id);
      refetchRentalDetail();
      toast.dismiss();
      toast.success(`Rental is Cancelled.\n
              Transaction Hash: ${tx.hash}
              View on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}
              `);
    } catch (error: unknown) {
      console.error("Error cancelling rental:", error);
      toast.error("Error cancelling rental");
    }
  };

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
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to complete rental. Please try again."
      );
    }
  };

  const disabledCompleteRentalByOwner =
    rental.status !== "active" || rental.completedByOwner;
  // dayjs(rental.endDate).isAfter(dayjs());

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <FaCheckCircle className="w-4 h-4 text-green-600" />;
      case "completed":
        return <FaCheckCircle className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <FaClock className="w-4 h-4 text-yellow-600" />;
      case "cancelled":
        return <FaTimes className="w-4 h-4 text-red-600" />;
      default:
        return <FaCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const renderMap = () => {
    if (isLocationLoading) {
      return <p className="text-gray-500">Loading location...</p>;
    }

    if (!latestLocation) {
      return <p className="text-gray-500">No location data available.</p>;
    }

    if (latestLocation) {
      return (
        <Map
          latitude={latestLocation.latitude}
          longitude={latestLocation.longitude}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Rental Management
              </h1>
              <p className="text-lg text-gray-600">
                Manage your vehicle rental request
              </p>
            </div>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                  rental.status
                )}`}
              >
                {getStatusIcon(rental.status)}
                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Completion Status */}
        {renderCompletionStatus() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            {renderCompletionStatus()}
          </motion.div>
        )}

        {/* Vehicle Location Map */}
        {rental.status === "active" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-600" />
              Vehicle Location
            </h2>
            <div className="bg-gray-50 rounded-xl p-4">{renderMap()}</div>
          </motion.div>
        )}

        {/* Violation Reports */}
        {violation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <FaExclamationTriangle className="text-red-600" />
              Violation Reports (1)
            </h2>
            <div className="space-y-4">
              <div
                key={violation.id}
                className="border border-red-200 rounded-xl p-4 bg-red-50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      {violation.violationType.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {violation.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {dayjs(violation.createdAt).format("MMM D, YYYY")}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{violation.detailedQuery}</p>
                {violation.expectedDamage && (
                  <p className="text-sm text-red-600">
                    <strong>Expected Damage:</strong> {violation.expectedDamage}
                  </p>
                )}
                {violation.photos && violation.photos.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    <FaCamera className="inline-block mr-1" />
                    {violation.photos.length} photo(s) attached
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rental Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">Vehicle Details</h2>
              <p className="text-blue-100">{listing.title}</p>
            </div>

            <div className="p-6">
              {/* Rental Timeline */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Rental Period
                </h3>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendarAlt className="text-blue-600" />
                    <span className="font-medium">Start:</span>
                    <span>{dayjs(rental.startDate).format("MMM D, YYYY")}</span>
                  </div>
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCalendarAlt className="text-blue-600" />
                    <span className="font-medium">End:</span>
                    <span>{dayjs(rental.endDate).format("MMM D, YYYY")}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <div>
                      <span className="text-sm text-gray-500">Location</span>
                      <p className="font-medium">{listing.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaGasPump className="text-blue-600" />
                    <div>
                      <span className="text-sm text-gray-500">Fuel Type</span>
                      <p className="font-medium">
                        {listing.fuelType.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaCogs className="text-blue-600" />
                    <div>
                      <span className="text-sm text-gray-500">
                        Transmission
                      </span>
                      <p className="font-medium">
                        {listing.transmissionType.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaUsers className="text-blue-600" />
                    <div>
                      <span className="text-sm text-gray-500">Seats</span>
                      <p className="font-medium">{listing.numOfSeats}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg sm:col-span-2">
                    <FaIdCard className="text-blue-600" />
                    <div>
                      <span className="text-sm text-gray-500">
                        License Plate
                      </span>
                      <p className="font-medium">{listing.licensePlate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg sm:col-span-2">
                    <FaDollarSign className="text-green-600" />
                    <div>
                      <span className="text-sm text-gray-500">
                        Price per Day
                      </span>
                      <p className="font-medium text-green-600">
                        {listing.pricePerDay} PKR
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Renter Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <UserProfile id={rental.renterId} title="Renter Information" />

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                {!rental.ownerConfirmed && rental.status === "pending" && (
                  <Button
                    variant="primary"
                    onClick={handleConfirmRental}
                    isLoading={isConfirmRentalLoading}
                    disabled={isConfirmRentalLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaCheckCircle className="w-4 h-4" />
                      Accept Rental
                    </div>
                  </Button>
                )}

                {rental.status === "pending" && (
                  <Button
                    variant="secondary"
                    onClick={handleCancelRental}
                    isLoading={isCancelRentalLoading}
                    disabled={isCancelRentalLoading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaTimes className="w-4 h-4" />
                      Cancel Rental
                    </div>
                  </Button>
                )}

                {!rental.completedByOwner && rental.status === "active" && (
                  <Button
                    isLoading={isCompleteRentalByOwnerLoading}
                    onClick={handleCompleteRentalByOwner}
                    disabled={disabledCompleteRentalByOwner}
                    variant="primary"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaCheckCircle className="w-4 h-4" />
                      Complete Rental
                    </div>
                  </Button>
                )}

                {/* Report Violation Button - Only show when rental is completed and no violation reported yet */}
                {(rental.status === "completed" ||
                  (rental.completedByOwner && rental.completedByRenter)) &&
                  !violation && (
                    <Button
                      onClick={() => setIsViolationModalOpen(true)}
                      variant="secondary"
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FaExclamationTriangle className="w-4 h-4" />
                        Report Violation
                      </div>
                    </Button>
                  )}

                {/* Show message when violation already reported */}
                {(rental.status === "completed" ||
                  (rental.completedByOwner && rental.completedByRenter)) &&
                  violation && (
                    <div className="w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-xl text-center text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <FaCheckCircle className="w-4 h-4 text-green-600" />
                        Violation already reported for this rental
                      </div>
                    </div>
                  )}

                {/* Show message when rental is not yet completed */}
                {rental.status !== "completed" &&
                  !(rental.completedByOwner && rental.completedByRenter) && (
                    <div className="w-full bg-blue-100 text-blue-700 py-3 px-4 rounded-xl text-center text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <FaClock className="w-4 h-4" />
                        Violations can only be reported after rental completion
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Violation Reporting Modal */}
        <ViolationReportingModal
          isOpen={isViolationModalOpen}
          onClose={() => setIsViolationModalOpen(false)}
          rentalId={rental.id.toString()}
          onReportSubmitted={() => {
            refetchRentalDetail();
            refetchViolation();
          }}
        />
      </div>
    </div>
  );
};
