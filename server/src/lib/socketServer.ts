import http from "http";
import { Server } from "socket.io";

export default function socketServer(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("send-message", ({ conversationId, userId, message }) => {
      console.log("send-message", conversationId, userId, message);

      // send message to the receiver
      socket.to(conversationId).emit("receive-message", {
        conversationId,
        userId,
        message,
      });

      // send message to the sender

      socket.emit("receive-message", {
        conversationId,
        userId,
        message,
      });
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}
