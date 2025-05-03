import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";

interface ConfirmRentalInput {
  rentalId: number;
}

async function confirmRental({ rentalId }: ConfirmRentalInput) {
  try {
    const { data } = await axiosInstance.post("/api/rentals/confirm", {
      rentalId,
    });
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while confirming the rental"
    );
  }
}

export const useConfirmRental = () => {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: confirmRental,
  });

  return {
    confirmRental: mutateAsync,
    isConfirmRentalLoading: isLoading,
  };
};
