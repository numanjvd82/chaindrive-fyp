import { useQuery } from "react-query";
import { axiosInstance } from "@/lib/axios";
import { Violation } from "@/lib/types";

async function fetchViolationByRentalId(rentalId: number): Promise<Violation> {
  if (!rentalId) {
    throw new Error("Rental ID is required");
  }
  const response = await axiosInstance.get(`/api/violations/${rentalId}`);
  return response.data;
}

// Hook to fetch violations by rental ID
export const useViolationByRentalId = (rentalId: number) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["violations", "rental", rentalId],
    queryFn: () => fetchViolationByRentalId(rentalId),
    enabled: !!rentalId,
  });

  return {
    violation: data,
    isViolationsLoading: isLoading,
    refetchViolation: refetch,
  };
};
