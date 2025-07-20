import { Notification } from "@/lib/types";
import { createContext } from "react";

interface NotificationContextType {
  notifications: Notification[];
  markAllAsRead: () => void;
  markIndividualAsRead: (notificationId: number) => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  markAllAsRead: () => {},
  markIndividualAsRead: async () => {},
});
