import { socket } from "@/lib/socket";
import { createContext } from "react";
import { Socket } from "socket.io-client";

// Create context for socket
export const SocketContext = createContext<{
  socket: Socket;
  isConnected: boolean;
}>({ socket, isConnected: false });
