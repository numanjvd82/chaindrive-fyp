import { NotificationContext } from "@/contexts/NotificationContext";
import { useMarkAsReadNotification } from "@/hooks/useMarkAsReadNotification";
import { useNotification } from "@/hooks/useNotification";
import { useSocket } from "@/hooks/useSocket";
import { Notification } from "@/lib/types";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { socket } = useSocket();
  const {
    data,
    isLoading: isNotificationsLoading,
    refetch: refetchNotifications,
  } = useNotification();
  const { markAsReadNotification } = useMarkAsReadNotification();

  useEffect(() => {
    if (!isNotificationsLoading && data) {
      setNotifications(data);
    }
  }, [data, isNotificationsLoading]);

  useEffect(() => {
    const handleNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      if (location.pathname !== "/chat") {
        toast.info(notification.content, {
          position: "top-right",
          autoClose: 5000,
        });
      }

      const audio = new Audio("/notification.mp3");
      audio
        .play()
        .catch((err) =>
          console.error("Error playing notification sound:", err)
        );
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]); // Only depend on socket

  const markAllAsRead = () => {
    setNotifications([]);
    markAsReadNotification();
    refetchNotifications();
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationProvider = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationProvider must be used within a NotificationProvider"
    );
  }
  return context;
};
