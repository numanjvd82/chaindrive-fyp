import { getContractInstance } from "@/lib/contract";
import { useWallet } from "@/hooks/useWallet";
import { useConfirmRental } from "@/hooks/useConfirmRental";
import { useCompleteRentalByOwner } from "@/hooks/useCompleteRentalByOwner";
import { useCancelRental } from "@/hooks/useCancelRental";
import { RentalWithImages } from "@/lib/types";
import { toast } from "react-toastify";
import { useLateFee } from "@/hooks/useLateFee";

interface UseRentalActionsProps {
  rental: RentalWithImages;
  refetchRentalDetail: () => void;
}

export const useRentalActions = ({
  rental,
  refetchRentalDetail,
}: UseRentalActionsProps) => {
  const { completeRentalByOwner, isCompleteRentalByOwnerLoading } =
    useCompleteRentalByOwner();
  const { confirmRental, isConfirmRentalLoading } = useConfirmRental();
  const { cancelRental, isCancelRentalLoading } = useCancelRental();
  const { hoursLate } = useLateFee(rental);
  const { signer, provider } = useWallet();

  const handleConfirmRental = async () => {
    try {
      await confirmRental({ rentalId: rental.id });
      refetchRentalDetail();
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

      const tx = await contract.completeRentalByOwner(rental.id, hoursLate);
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

  return {
    handleConfirmRental,
    handleCancelRental,
    handleCompleteRentalByOwner,
    isConfirmRentalLoading,
    isCancelRentalLoading,
    isCompleteRentalByOwnerLoading,
  };
};
