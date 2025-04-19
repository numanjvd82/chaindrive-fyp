import { axiosInstance } from "@/lib/axios";
import { Rental } from "@/lib/types";
import { useMutation } from "react-query";

interface CreateRentalInput {
  listingId: number;
  renterId: number;
  renterAddress: string;
  ownerAddress: string;
  startDate: string;
  endDate: string;
  rentalFee: number;
  securityDeposit: number;
  platformFee: number;
  totalEth: string;
  isCompleted?: boolean;
  status: string;
}

async function createRental(rentalData: CreateRentalInput) {
  try {
    const { data } = await axiosInstance.post<Rental>(
      "/api/rentals",
      rentalData
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while creating the rental"
    );
  }
}

export function useCreateRental() {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: createRental,
  });

  return {
    createRental: mutateAsync,
    isCreateRentalLoading: isLoading,
  };
}
