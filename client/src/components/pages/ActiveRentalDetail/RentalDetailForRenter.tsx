import UserProfile from "@/components/UserProfile";
import Button from "@/components/Button";
import { useCancelRental } from "@/hooks/useCancelRental";
import { useCompleteRentalByRenter } from "@/hooks/useCompleteRentalByRenter";
import { useWallet } from "@/hooks/useWallet";
import { getContractInstance } from "@/lib/contract";
import { Listing, RentalWithImages } from "@/lib/types";
import dayjs from "dayjs";
import { motion } from "motion/react";
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
} from "react-icons/fa";
import { toast } from "react-toastify";

type Props = {
  rental: RentalWithImages;
  listing: Listing;
  refetchRentalDetail: () => void;
};

export const RentalDetailForRenter: React.FC<Props> = ({
  listing,
  refetchRentalDetail,
  rental,
}) => {
  const { completeRentalByRenter, isCompleteRentalByRenterLoading } =
    useCompleteRentalByRenter();
  const { cancelRental, isCancelRentalLoading } = useCancelRental();

  const { signer, provider } = useWallet();

  const handleCompleteRentalByRenter = async () => {
    if (!signer || !provider) {
      toast.error("Please connect your wallet.");
      return;
    }
    try {
      const contract = getContractInstance(signer);
      const tx = await contract.completeRentalByRenter(rental.id);
      toast.loading("Completing rental on the blockchain...");
      const receipt = await tx.wait();

      if (!receipt || receipt.status !== 1) {
        toast.error("Failed to complete rental on the blockchain.");
        return;
      }

      await completeRentalByRenter(rental.id);
      refetchRentalDetail();
      toast.dismiss();
      toast.success(`Rental completed successfully.\n
              Transaction Hash: ${tx.hash}
              View on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}
              `);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to complete rental. Please try again."
      );
    }
  };

  const disabledCompleteRentalByRenter =
    rental.status !== "active" || rental.completedByRenter;
  // dayjs(rental.endDate).isAfter(dayjs());

  const renderCompletionStatus = () => {
    if (rental.completedByOwner && rental.completedByRenter) {
      return (
        <p className="flex items-center gap-2 text-green-600 font-medium">
          <FaCheckCircle /> Rental completed by both you and owner
        </p>
      );
    }
    if (rental.completedByRenter) {
      return (
        <p className="flex items-center gap-2 text-blue-600 font-medium">
          <FaCheckCircle /> Rental is completed by you
        </p>
      );
    }
    if (rental.completedByOwner) {
      return (
        <p className="flex items-center gap-2 text-blue-600 font-medium">
          <FaCheckCircle /> Rental completed by owner
        </p>
      );
    }
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
      toast.dismiss();
      toast.success(`Rental is Cancelled.\n
              Transaction Hash: ${tx.hash}
              View on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}
              `);
    } catch (error) {
      console.error("Error cancelling rental:", error);
      toast.error("Error cancelling rental");
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Rental</h1>
              <p className="text-lg text-gray-600">View and manage your rental details</p>
            </div>
            
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(rental.status)}`}>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rental Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">Vehicle Details</h2>
              <p className="text-blue-100">{listing.title}</p>
            </div>
            
            <div className="p-6">
              {/* Rental Timeline */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Period</h3>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
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
                      <p className="font-medium">{listing.fuelType.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaCogs className="text-blue-600" />
                    <div>
                      <span className="text-sm text-gray-500">Transmission</span>
                      <p className="font-medium">{listing.transmissionType.toUpperCase()}</p>
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
                      <span className="text-sm text-gray-500">License Plate</span>
                      <p className="font-medium">{listing.licensePlate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg sm:col-span-2">
                    <FaDollarSign className="text-green-600" />
                    <div>
                      <span className="text-sm text-gray-500">Price per Day</span>
                      <p className="font-medium text-green-600">{listing.pricePerDay} PKR</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Owner Information & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <UserProfile id={listing.ownerId} title="Owner Information" />
            
            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {rental.status === "pending" && (
                  <Button
                    variant="primary"
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

                {(!rental.completedByRenter && rental.status === "active") && (
                  <Button
                    isLoading={isCompleteRentalByRenterLoading}
                    onClick={handleCompleteRentalByRenter}
                    disabled={disabledCompleteRentalByRenter}
                    variant="primary"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FaCheckCircle className="w-4 h-4" />
                      Complete Rental
                    </div>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
