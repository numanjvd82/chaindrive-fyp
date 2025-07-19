import { useCancelRental } from "@/hooks/useCancelRental";
import { useConfirmRental } from "@/hooks/useConfirmRental";
import { useListingById } from "@/hooks/useListingById";
import { useRentalDetail } from "@/hooks/useRentalDetail";
import { useOtherUser } from "@/hooks/useOtherUser";
import { useWallet } from "@/hooks/useWallet";
import { getContractInstance } from "@/lib/contract";
import { convertDateToString } from "@/lib/utils";
import { useNotificationProvider } from "@/providers/NotificationProvider";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import Button from "./Button";
import DialogModal from "./DialogModal";
import { motion } from "motion/react";
import {
  FaCar,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaEthereum,
  FaCheckCircle,
  FaTimes,
  FaUser,
  FaIdCard,
  FaMapMarkerAlt,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import Loader from "./Loader";

type Props = {
  selectedRentalId: number;
  setSelectedRentalId: (id: number | null) => void;
  selectedNotificationId: number | null;
  setSelectedNotificationId: (id: number | null) => void;
};

export const ConfirmRentalModal = ({
  selectedRentalId,
  setSelectedRentalId,
  selectedNotificationId,
  setSelectedNotificationId,
}: Props) => {
  const { confirmRental, isConfirmRentalLoading } = useConfirmRental();
  const { markIndividualAsRead } = useNotificationProvider();
  const { rental, isLoading: isRentalLoading } = useRentalDetail(
    String(selectedRentalId)
  );
  const { listing, isLoading: isListingLoading } = useListingById(
    rental?.listingId || 0
  );
  const { user: renterUser, isLoading: isRenterLoading } = useOtherUser(
    rental?.renterId || 0
  );
  const { cancelRental, isCancelRentalLoading } = useCancelRental();

  const { signer, provider, account } = useWallet();

  // Star rating function
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(rating) ? (
        <FaStar key={i} className="text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="text-yellow-400" />
      )
    );
  };

  const handleConfirmRental = async (rentalId: number) => {
    if (!selectedNotificationId) return;
    try {
      await confirmRental({ rentalId });
      toast.success("Rental confirmed successfully!");
      markIndividualAsRead(selectedNotificationId);
      setSelectedNotificationId(null);
      setSelectedRentalId(null);
    } catch (error) {
      console.error("Error confirming rental:", error);
    }
  };

  const handleCancelRental = async () => {
    if (!selectedNotificationId) return;
    if (!signer || !provider || !account) {
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
      setSelectedRentalId(null);
      markIndividualAsRead(selectedNotificationId);
      setSelectedNotificationId(null);
    } catch (error) {
      console.error("Error cancelling rental:", error);
      toast.error("Error cancelling rental");
    }
  };

  if (!selectedRentalId) {
    return null;
  }

  if (isRentalLoading || isListingLoading || isRenterLoading) {
    return (
      <DialogModal
        isOpen={!!selectedRentalId}
        onClose={() => {
          setSelectedRentalId(null);
          setSelectedNotificationId(null);
        }}
        title="Loading Rental Details"
        description="Please wait while we fetch the rental information."
      >
        <div className="flex justify-center items-center py-12">
          <Loader size="lg" variant="spinner" />
        </div>
      </DialogModal>
    );
  }

  if (!rental || !listing) {
    return (
      <DialogModal
        isOpen={!!selectedRentalId}
        onClose={() => {
          setSelectedRentalId(null);
          setSelectedNotificationId(null);
        }}
        title="Rental Not Found"
        description="We couldn't find the rental details you're looking for."
        footer={
          <Button
            onClick={() => {
              setSelectedRentalId(null);
              setSelectedNotificationId(null);
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl"
          >
            Close
          </Button>
        }
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimes className="text-red-500 text-2xl" />
          </div>
          <p className="text-gray-600">No rental details found.</p>
        </div>
      </DialogModal>
    );
  }

  return (
    <DialogModal
      isOpen={!!selectedRentalId}
      onClose={() => {
        setSelectedRentalId(null);
        setSelectedNotificationId(null);
      }}
      title="Rental Confirmation"
      description="Review the rental details and take action"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleCancelRental}
            disabled={isConfirmRentalLoading || isCancelRentalLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-red-700 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2">
              <FaTimes />
              Cancel Rental
            </div>
          </Button>
          <Button
            onClick={() => handleConfirmRental(selectedRentalId)}
            isLoading={isConfirmRentalLoading || isCancelRentalLoading}
            disabled={isConfirmRentalLoading || isCancelRentalLoading}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2">
              <FaCheckCircle />
              Confirm Rental
            </div>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Vehicle Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaCar className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Vehicle Information
            </h3>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">Vehicle</span>
              <span className="font-semibold text-gray-900">
                {listing.title}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Rental Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Rental Details</h3>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700 flex items-center gap-2">
                <FaIdCard className="text-gray-500" />
                Rental ID
              </span>
              <span className="font-semibold text-gray-900">#{rental.id}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">Start Date</span>
              <span className="font-semibold text-gray-900">
                {dayjs(rental.startDate).format("MMM DD, YYYY HH:mm")}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700">End Date</span>
              <span className="font-semibold text-gray-900">
                {dayjs(rental.endDate).format("MMM DD, YYYY HH:mm")}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700 flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" />
                Rental Fee (PKR)
              </span>
              <span className="font-bold text-green-600">
                PKR {rental.rentalFee}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="font-medium text-gray-700 flex items-center gap-2">
                <FaEthereum className="text-indigo-500" />
                Total in ETH
              </span>
              <span className="font-bold text-indigo-600">
                {rental.totalEth} ETH
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
              <span className="font-medium text-gray-700">Status</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  rental.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : rental.status === "active"
                    ? "bg-green-100 text-green-700"
                    : rental.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Renter Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaUser className="text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Renter Information
            </h3>
          </div>
          <div className="bg-white rounded-xl p-4">
            {renterUser ? (
              <div className="space-y-4">
                {/* Renter Profile */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <img
                      className="h-16 w-16 rounded-full border-4 border-purple-200 shadow-md"
                      src={`data:image/jpeg;base64,${renterUser.selfie}`}
                      alt={renterUser.firstName}
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mt-2">
                    {`${renterUser.firstName} ${renterUser.lastName}`}
                  </h4>

                  {/* Rating */}
                  <div className="flex items-center justify-center mt-2">
                    <div className="flex items-center gap-1">
                      {renderStars(4.5)}
                    </div>
                    <span className="ml-2 text-gray-500 text-sm">
                      4.5 (20 reviews)
                    </span>
                  </div>
                </div>

                {/* Renter Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaMapMarkerAlt className="text-purple-600 w-4 h-4" />
                    <div>
                      <span className="text-sm text-gray-500">Location</span>
                      <p className="font-medium text-gray-900">
                        {renterUser.city}, {renterUser.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaCalendarAlt className="text-purple-600 w-4 h-4" />
                    <div>
                      <span className="text-sm text-gray-500">
                        Member Since
                      </span>
                      <p className="font-medium text-gray-900">
                        {convertDateToString(renterUser.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">
                  Renter information not available
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DialogModal>
  );
};
