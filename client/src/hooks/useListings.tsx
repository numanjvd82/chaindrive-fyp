import { axiosInstance } from "@/lib/axios";
import { Listing } from "@/lib/types";
import { useQuery } from "react-query";

async function fetchListings() {
  try {
    const { data } = await axiosInstance.get<Listing[]>("/api/listings");
    return data;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}

export function useListings() {
  const { data, error, isLoading } = useQuery("listings", fetchListings);

  return {
    listings: data,
    error,
    isLoading,
  };
}
