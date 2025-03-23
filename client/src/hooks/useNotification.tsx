import { axiosInstance } from "@/lib/axios";
import { Notification } from "@/lib/types";
import { useQuery } from "react-query";
import { useUser } from "./useUser";

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
  const { user } = useUser();
  const { data, isLoading, refetch } = useQuery(
    "notifications",
    fetchNotifications,
    {
      refetchInterval: 10000,
      enabled: !!user,
    }
  );

  return { data, isLoading, refetch };
};
