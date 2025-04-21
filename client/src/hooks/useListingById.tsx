import { axiosInstance } from "@/lib/axios";
import { Listing } from "@/lib/types";
import { useQuery } from "react-query";

async function fetchListingById(id: number) {
  try {
    const { data } = await axiosInstance.get(`/api/listings/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch listing by ID"
    );
  }
}

export function useListingById(id: number) {
  const { data, error, isLoading, refetch } = useQuery<Listing>(
    ["listingById", id],
    () => fetchListingById(id),
    {
      enabled: !!id, // Only fetch if `id` is defined
    }
  );

  return {
    listing: data,
    error,
    isLoading,
    refetch,
  };
}
