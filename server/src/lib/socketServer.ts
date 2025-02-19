import http from "http";
import { Server } from "socket.io";
import { messageModel } from "../models/message";

export default function socketServer(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Fetch messages for a conversation
    socket.on("fetch-messages", async (conversationId: number) => {
      const messages = await messageModel.list({
        conversationId,
      });
      socket.emit("messages", messages);
    });

    // Handle sending messages
    socket.on("send-message", async (message) => {
      const newMessage = await messageModel.add(message);

      io.emit("receive-message", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
