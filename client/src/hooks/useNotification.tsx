import { axiosInstance } from "@/lib/axios";
import { Notification } from "@/lib/types";
import { useQuery } from "react-query";

async function fetchNotifications() {
  try {
    const { data } = await axiosInstance.get<Notification[]>(
      "/api/notifications"
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}

export const useNotification = () => {
  const { data, isLoading, refetch } = useQuery(
    "notifications",
    fetchNotifications,
    {
      refetchInterval: 10000,
    }
  );

  return { data, isLoading, refetch };
};
