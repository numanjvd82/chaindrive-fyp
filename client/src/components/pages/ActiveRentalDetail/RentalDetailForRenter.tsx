import AboutVehicleOwner from "@/components/AboutVehicleOwner";
import Button from "@/components/Button";
import { useCancelRental } from "@/hooks/useCancelRental";
import { useCompleteRentalByRenter } from "@/hooks/useCompleteRentalByRenter";
import { useWallet } from "@/hooks/useWallet";
import { getContractInstance } from "@/lib/contract";
import { Listing, RentalWithImages } from "@/lib/types";
import clsx from "clsx";
import {
  FaCheckCircle,
  FaCogs,
  FaGasPump,
  FaIdCard,
  FaMapMarkerAlt,
  FaUsers,
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
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to complete rental. Please try again."
      );
    }
  };

  const disabledCompleteRentalByRenter =
    rental.status !== "active" || rental.completedByRenter;

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

  const statusColor = {
    pending: "bg-yellow-200 text-yellow-800",
    active: "bg-blue-200 text-blue-800",
    cancelled: "bg-red-200 text-red-800",
    completed: "bg-green-200 text-green-800",
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
    <div className="p-6 max-w-6xl mx-auto bg-gray-100 h-[calc(100vh-4rem)] overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Rental Details</h1>

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

      {/* Owner Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <AboutVehicleOwner id={listing.ownerId} />
      </div>

      <div className="flex justify-end mt-6">
        {rental.status === "pending" ? (
          <Button
            variant="primary"
            onClick={handleCancelRental}
            isLoading={isCancelRentalLoading}
            disabled={isCancelRentalLoading}
          >
            Cancel Rental
          </Button>
        ) : null}

        {/* Complete Rental Button */}
        {!rental.completedByRenter || rental.status === "active" ? (
          <Button
            isLoading={isCompleteRentalByRenterLoading}
            onClick={handleCompleteRentalByRenter}
            disabled={disabledCompleteRentalByRenter}
            variant="primary"
          >
            Complete Rental (Renter)
          </Button>
        ) : null}
      </div>
    </div>
  );
};
