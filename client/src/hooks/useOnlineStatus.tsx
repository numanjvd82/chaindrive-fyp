import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";

const useOnlineStatus = () => {
  const [onlineUsers, setOnlineUsers] = useState<Set<string | number>>(
    new Set()
  );

  const { socket } = useSocket();

  // Receive updated online users from backend
  useEffect(() => {
    socket.on("userOnline", (users) => {
      setOnlineUsers(new Set(users));
    });

    return () => {
      socket.off("userOnline");
    };
  }, [socket]);

  // Send heartbeat every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit("heartbeat");
    }, 5000);

    return () => clearInterval(interval);
  }, [socket]);

  return { onlineUsers };
};

export default useOnlineStatus;
