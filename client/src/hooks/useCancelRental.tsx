import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";

async function cancelRental(rentalId: number): Promise<void> {
  try {
    await axiosInstance.patch("/api/rentals/cancel", { rentalId });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to cancel rental");
  }
}

export function useCancelRental() {
  const {
    mutateAsync: cancelRentalMutate,
    isLoading,
    error,
  } = useMutation(cancelRental);

  return {
    cancelRental: cancelRentalMutate,
    isCancelRentalLoading: isLoading,
    cancelRentalError: error,
  };
}
