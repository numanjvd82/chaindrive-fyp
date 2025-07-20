import { NotificationContext } from "@/contexts/NotificationContext";
import { useMarkAllAsReadNotification } from "@/hooks/useMarkAllAsReadNotification";
import { useMarkIndividualNotificationAsRead } from "@/hooks/useMarkIndividualNotificationAsRead";
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
  const { markAllAsReadNotification } = useMarkAllAsReadNotification();
  const { markIndividualNotificationAsRead } =
    useMarkIndividualNotificationAsRead();

  useEffect(() => {
    if (!isNotificationsLoading && data) {
      setNotifications(data);
    }
  }, [data, isNotificationsLoading]);

  useEffect(() => {
    const handleNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);

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
    markAllAsReadNotification();
    refetchNotifications();
  };

  const markIndividualAsRead = async (notificationId: number) => {
    try {
      // Remove from local state immediately for better UX
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      // Mark as read on the server
      await markIndividualNotificationAsRead(notificationId);

      // Optionally refetch to ensure sync
      refetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Revert local state if API call failed
      refetchNotifications();
      toast.error("Failed to mark notification as read");
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, markAllAsRead, markIndividualAsRead }}
    >
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
