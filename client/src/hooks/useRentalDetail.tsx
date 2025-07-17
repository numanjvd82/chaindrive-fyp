import { axiosInstance } from "@/lib/axios";
import { RentalWithImages } from "@/lib/types";
import { useQuery } from "react-query";

export const useRentalDetail = (id: string | undefined) => {
  const { data, isLoading, error, refetch } = useQuery<RentalWithImages>(
    ["rentalDetail", id],
    async () => {
      const { data } = await axiosInstance.get(`/api/rentals/${id}`);
      return data;
    },
    {
      enabled: !!id,
    }
  );

  return {
    rental: data,
    refetchRentalDetail: refetch,
    isLoading,
    error,
  };
};
