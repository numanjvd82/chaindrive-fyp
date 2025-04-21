import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";

async function completeRentalByOwner(rentalId: number) {
  try {
    const { data } = await axiosInstance.patch("/api/rentals/complete/renter", {
      rentalId,
    });
    return data;
  } catch (error: any) {
    console.error("Error completing rental by owner:", error);
    throw new Error(
      error.response?.data?.message || "Failed to complete rental by owner"
    );
  }
}

export function useCompleteRentalByOwner() {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: completeRentalByOwner,
  });

  return {
    completeRentalByOwner: mutateAsync,
    isCompleteRentalByOwnerLoading: isLoading,
  };
}
