import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";

async function markAllAsReadNotification() {
  try {
    await axiosInstance.post(`/api/notifications/mark-all-as-read`);
  } catch (error) {
    console.error(error);
  }
}

export const useMarkAllAsReadNotification = () => {
  const { mutateAsync, isLoading } = useMutation(
    "mark-all-notifications",
    markAllAsReadNotification
  );

  return { markAllAsReadNotification: mutateAsync, isLoading };
};
