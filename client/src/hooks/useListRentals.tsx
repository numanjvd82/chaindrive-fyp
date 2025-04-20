import { axiosInstance } from "@/lib/axios";
import { RentalWithImages } from "@/lib/types";
import { useQuery } from "react-query";

async function fetchListRentals() {
  try {
    const { data } = await axiosInstance.get<RentalWithImages[]>(
      "/api/rentals"
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch rentals");
  }
}

export function useListRentals() {
  const { data, error, isLoading, refetch } = useQuery(
    "listRentals",
    fetchListRentals
  );

  return {
    rentals: data,
    error,
    isLoading,
    refetch,
  };
}
