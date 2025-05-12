import { axiosInstance } from "@/lib/axios";
import { RentalWithImages } from "@/lib/types";
import { useQuery } from "react-query";

type FetchRentalsInput = {
  isOwner?: boolean;
  isRenter?: boolean;
};

async function fetchListRentals(params: FetchRentalsInput) {
  try {
    const { data } = await axiosInstance.get<RentalWithImages[]>(
      "/api/rentals",
      {
        params,
      }
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch rentals");
  }
}

export function useListRentals(input: FetchRentalsInput & { userId?: number }) {
  const filter = {
    isOwner: input.isOwner,
    isRenter: input.isRenter,
  };
  const { data, error, isLoading, refetch } = useQuery(
    ["listRentals", input],
    () => fetchListRentals(filter),
    {
      enabled: !!input.userId,
    }
  );

  return {
    rentals: data,
    error,
    isLoading,
    refetch,
  };
}
