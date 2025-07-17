import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";

interface CreateDeviceInput {
  deviceId: string;
  listingId: number;
}

async function createDevice(deviceData: CreateDeviceInput) {
  try {
    const { data } = await axiosInstance.post("/api/devices", deviceData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create device");
  }
}

export function useCreateDevice() {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: createDevice,
  });

  return {
    createDevice: mutateAsync,
    isCreateDeviceLoading: isLoading,
  };
}
