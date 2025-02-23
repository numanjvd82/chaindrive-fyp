import { Notification } from "@/lib/types";
import { createContext } from "react";

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: number) => void;
  removeNotification: (id: number) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  markAsRead: () => {},
  removeNotification: () => {},
});
