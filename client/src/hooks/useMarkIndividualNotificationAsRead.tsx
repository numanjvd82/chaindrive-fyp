import { axiosInstance } from "@/lib/axios";
import { useMutation } from "react-query";

async function markIndividualNotificationAsRead(notificationId: number) {
  if (!notificationId || isNaN(notificationId)) {
    throw new Error(`Invalid notification ID: ${notificationId}`);
  }

  try {
    await axiosInstance.post(`/api/notifications/mark-read/${notificationId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const useMarkIndividualNotificationAsRead = () => {
  const { mutateAsync, isLoading } = useMutation(
    "mark-individual-notification",
    markIndividualNotificationAsRead
  );

  return { markIndividualNotificationAsRead: mutateAsync, isLoading };
};
