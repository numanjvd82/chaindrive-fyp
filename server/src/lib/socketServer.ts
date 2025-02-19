import http from "http";
import { Server } from "socket.io";
import { sql } from "../utils/utils";
import { sqliteInstance } from "./db/sqlite";

export default function socketServer(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // put this into a seperate file
  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("send-message", ({ senderId, receiverId, message }) => {
      const senderIdInt = parseInt(senderId);
      const receiverIdInt = parseInt(receiverId);
      const stmt = sqliteInstance.prepare(
        sql`INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`
      );
      const result = stmt.run(senderIdInt, receiverIdInt, message);

      const newMessage = {
        id: result.lastInsertRowid,
        senderId: senderIdInt,
        receiverId: receiverIdInt,
        message,
        isRead: 0,
        createdAt: new Date().toISOString(),
      };

      // Send message to the receiver
      io.to(receiverId).emit("receive-message", newMessage);

      // Send message to the sender
      socket.emit("receive-message", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}
