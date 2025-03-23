import { SocketContext } from "@/contexts/SocketContext";
import { useUser } from "@/hooks/useUser";
import { socket } from "@/lib/socket";
import { ReactNode, useEffect, useState } from "react";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (user) {
      socket.auth = { userId: user.id };
      socket.connect();
    } else {
      socket.disconnect();
    }

    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      // socket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
