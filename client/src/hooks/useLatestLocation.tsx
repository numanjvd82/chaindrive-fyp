import { axiosInstance } from "@/lib/axios";
import { Location } from "@/lib/types";
import { useQuery } from "react-query";

const fetchLatestLocation = async (deviceId: string, rentalId: number) => {
  try {
    const { data } = await axiosInstance.get<Location>(
      `/api/locations/${deviceId}/${rentalId}`
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error fetching latest location"
    );
  }
};

export function useLatestLocation({
  deviceId,
  rentalId,
}: {
  deviceId: string;
  rentalId: number;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["latestLocation", deviceId],
    queryFn: () => fetchLatestLocation(deviceId, rentalId),
    enabled: !!deviceId,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  return {
    latestLocation: data,
    isLocationLoading: isLoading,
  };
}
