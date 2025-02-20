import { SocketContext } from "@/contexts/SocketContext";
import { useContext } from "react";

// Custom hook to use socket in other components
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
