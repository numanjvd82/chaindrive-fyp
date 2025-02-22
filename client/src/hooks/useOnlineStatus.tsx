import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";

const useOnlineStatus = () => {
  const [onlineUsers, setOnlineUsers] = useState<Set<string | number>>(
    new Set()
  );

  const { socket } = useSocket();

  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(new Set(users)); // Update online users list
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  return { onlineUsers };
};

export default useOnlineStatus;
