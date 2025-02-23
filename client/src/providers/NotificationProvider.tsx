import { NotificationContext } from "@/contexts/NotificationContext";
import { useSocket } from "@/hooks/useSocket";
import { Notification } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    socket.on("notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast(notification.content);
      new Audio("/notification.mp3").play(); // Play sound
    });

    socket.on("unread-notifications", (unread: Notification[]) => {
      setNotifications(unread);
    });

    return () => {
      socket.off("notification");
      socket.off("unread-notifications");
    };
  }, []);

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    socket.emit("mark-as-read", id);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    socket.emit("remove-notification", id);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
