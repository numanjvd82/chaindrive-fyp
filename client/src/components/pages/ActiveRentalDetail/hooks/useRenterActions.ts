import { getContractInstance } from "@/lib/contract";
import { useWallet } from "@/hooks/useWallet";
import { useCompleteRentalByRenter } from "@/hooks/useCompleteRentalByRenter";
import { useCancelRental } from "@/hooks/useCancelRental";
import { RentalWithImages } from "@/lib/types";
import { toast } from "react-toastify";

interface UseRenterActionsProps {
  rental: RentalWithImages;
  refetchRentalDetail: () => void;
}

export const useRenterActions = ({
  rental,
  refetchRentalDetail,
}: UseRenterActionsProps) => {
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
        error instanceof Error
          ? error.message
          : "Failed to complete rental. Please try again."
      );
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

  return {
    handleCompleteRentalByRenter,
    handleCancelRental,
    isCompleteRentalByRenterLoading,
    isCancelRentalLoading,
  };
};
