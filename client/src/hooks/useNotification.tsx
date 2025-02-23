import { NotificationContext } from "@/contexts/NotificationContext";
import { useContext } from "react";

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
