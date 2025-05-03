import { axiosInstance } from "@/lib/axios";
import { Location } from "@/lib/types";
import { useQuery } from "react-query";

const fetchLatestLocation = async (deviceId: string) => {
  try {
    const { data } = await axiosInstance.get<Location>(
      `/api/locations/${deviceId}`
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error fetching latest location"
    );
  }
};

export function useLatestLocation(deviceId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["latestLocation", deviceId],
    queryFn: () => fetchLatestLocation(deviceId),
    enabled: !!deviceId,
    refetchInterval: 15000, // Refetch every 10 seconds
  });

  return {
    latestLocation: data,
    isLocationLoading: isLoading,
  };
}
