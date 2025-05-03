import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";

async function deleteDevice(deviceId: string) {
  try {
    const { data } = await axiosInstance.delete(`/api/devices/${deviceId}`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete device");
  }
}

export function useDeleteDevice() {
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: deleteDevice,
  });

  return {
    deleteDevice: mutateAsync,
    isDeleteDeviceLoading: isLoading,
  };
}
