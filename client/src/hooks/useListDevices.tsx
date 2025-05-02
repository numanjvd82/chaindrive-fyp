import { axiosInstance } from "@/lib/axios";
import { Device } from "@/lib/types";
import { useQuery } from "react-query";

async function fetchDevices() {
  try {
    const { data } = await axiosInstance.get<Device[]>("/api/devices");
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch devices");
  }
}

export function useListDevices() {
  const { data, error, isLoading, refetch } = useQuery(
    "listDevices",
    fetchDevices
  );

  return {
    devices: data,
    error,
    isLoading,
    refetch,
  };
}
