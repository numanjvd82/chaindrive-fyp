import { useCancelRental } from "@/hooks/useCancelRental";
import { useConfirmRental } from "@/hooks/useConfirmRental";
import { useListingById } from "@/hooks/useListingById";
import { useRentalDetail } from "@/hooks/useRentalDetail";
import { useWallet } from "@/hooks/useWallet";
import { getContractInstance } from "@/lib/contract";
import { useNotificationProvider } from "@/providers/NotificationProvider";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import AboutVehicleOwner from "./AboutVehicleOwner";
import Button from "./Button";
import DialogModal from "./DialogModal";

type Props = {
  selectedRentalId: number;
  setSelectedRentalId: (id: number | null) => void;
};

export const ConfirmRentalModal = ({
  selectedRentalId,
  setSelectedRentalId,
}: Props) => {
  const { confirmRental, isConfirmRentalLoading } = useConfirmRental();
  const { markAllAsRead } = useNotificationProvider();
  const { rental, isLoading: isRentalLoading } = useRentalDetail(
    String(selectedRentalId)
  );
  const { listing, isLoading: isListingLoading } = useListingById(
    rental?.listingId || 0
  );
  const { cancelRental, isCancelRentalLoading } = useCancelRental();

  const { signer, provider, account } = useWallet();

  const handleConfirmRental = async (rentalId: number) => {
    try {
      await confirmRental({ rentalId });
      toast.success("Rental confirmed successfully!");
      markAllAsRead();
      setSelectedRentalId(null);
    } catch (error) {
      console.error("Error confirming rental:", error);
    }
  };

  const handleCancelRental = async () => {
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
      markAllAsRead();
    } catch (error) {
      console.error("Error cancelling rental:", error);
      toast.error("Error cancelling rental");
    }
  };

  if (!selectedRentalId) {
    return null;
  }

  if (isRentalLoading || isListingLoading) {
    return <div>Loading...</div>;
  }

  if (!rental || !listing) {
    return <div>No rental details found.</div>;
  }

  return (
    <DialogModal
      isOpen={!!selectedRentalId}
      onClose={() => setSelectedRentalId(null)}
      title="Rental Details"
      description="Review the rental details below and confirm or cancel the rental."
      footer={
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={handleCancelRental}
            disabled={isConfirmRentalLoading || isCancelRentalLoading}
          >
            Cancel Rental
          </Button>
          <Button
            variant="primary"
            onClick={() => handleConfirmRental(selectedRentalId)}
            isLoading={isConfirmRentalLoading || isCancelRentalLoading}
          >
            Confirm Rental
          </Button>
        </div>
      }
    >
      {/* Show Renter information */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Renter Information</h3>
        <AboutVehicleOwner id={rental.renterId} />
      </div>
      {/* Show Rental Details */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Rental Details</h3>
        <p className="text-sm text-gray-600">Rental ID: {rental.id}</p>
        <p className="text-sm text-gray-600">Listing ID: {rental.listingId}</p>
        <p className="text-sm text-gray-600">
          Start Date: {dayjs(rental.startDate).format("YYYY-MM-DD HH:mm")}
        </p>
        <p className="text-sm text-gray-600">
          End Date: {dayjs(rental.endDate).format("YYYY-MM-DD HH:mm")}
        </p>
        <p className="text-sm text-gray-600">
          Total PKR you will get: {rental.rentalFee}
        </p>
        <p className="text-sm text-gray-600">
          Total ETH you will get: {rental.totalEth}
        </p>
        <p className="text-sm text-gray-600">Status: {rental.status}</p>
        <p className="text-sm text-gray-600">Vehicle: {listing.title}</p>
      </div>
    </DialogModal>
  );
};
