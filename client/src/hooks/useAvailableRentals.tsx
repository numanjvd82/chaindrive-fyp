import { axiosInstance } from "@/lib/axios";
import { Listing } from "@/lib/types";
import { useQuery } from "react-query";

async function fetchAvailableRentals() {
  try {
    const { data } = await axiosInstance.get<Listing[]>(
      "/api/listings/available"
    );
    return data;
  } catch (error) {
    console.error("Error fetching available Rentals:", error);
    throw error;
  }
}

export function useAvailableRentals() {
  const { data, error, isLoading, refetch } = useQuery(
    "availableRentals",
    fetchAvailableRentals
  );

  return {
    availableRentals: data,
    error,
    isLoading,
    refetch,
  };
}
