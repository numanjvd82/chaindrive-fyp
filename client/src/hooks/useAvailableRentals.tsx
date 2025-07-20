import { axiosInstance } from "@/lib/axios";
import { Listing } from "@/lib/types";
import { useQuery } from "react-query";

export interface AvailableRentalsFilters {
  title?: string;
  model?: string;
  year?: string;
  fuelType?: string;
  numOfSeats?: string;
  transmissionType?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
}

async function fetchAvailableRentals(filters: AvailableRentalsFilters = {}) {
  try {
    // Remove empty filter values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined)
    );

    const { data } = await axiosInstance.get<Listing[]>(
      "/api/listings/available",
      {
        params: cleanFilters
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching available Rentals:", error);
    throw error;
  }
}

export function useAvailableRentals(filters: AvailableRentalsFilters = {}) {
  const { data, error, isLoading, refetch } = useQuery(
    ["availableRentals", filters],
    () => fetchAvailableRentals(filters),
    {
      staleTime: 30000, // Cache for 30 seconds
      cacheTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    }
  );

  return {
    availableRentals: data,
    error,
    isLoading,
    refetch,
  };
}
