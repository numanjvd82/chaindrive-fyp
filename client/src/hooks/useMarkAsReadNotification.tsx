import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";

async function markAsReadNotification() {
  try {
    await axiosInstance.post(`/api/notifications/mark-read`);
  } catch (error) {
    console.error(error);
  }
}

export const useMarkAsReadNotification = () => {
  const { mutateAsync, isLoading } = useMutation(
    "notifications",
    markAsReadNotification
  );

  return { markAsReadNotification: mutateAsync, isLoading };
};
