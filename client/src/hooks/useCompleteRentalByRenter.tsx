import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";

async function completeRentalByRenter(rentalId: number) {
  try {
    const { data } = await axiosInstance.patch("/api/rentals/complete/renter", {
      rentalId,
    });
    return data;
  } catch (error) {
    console.error("Error completing rental by renter:", error);
    throw error;
  }
}

export function useCompleteRentalByRenter() {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: completeRentalByRenter,
  });

  return {
    completeRentalByRenter: mutateAsync,
    isCompleteRentalByRenterLoading: isLoading,
  };
}
