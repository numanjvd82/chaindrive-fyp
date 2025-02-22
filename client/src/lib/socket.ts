import { io } from "socket.io-client";
import { SERVER_BASE_URL } from "./axios";

export const socket = io(SERVER_BASE_URL, {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
});
