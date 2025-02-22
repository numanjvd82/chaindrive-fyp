import http from "http";
import { Server } from "socket.io";
import { messageModel } from "../models/message";
import { sql } from "../utils/utils";
import { sqliteInstance } from "./db/sqlite";

export default function socketServer(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  const onlineUsers = new Set<number>();

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) return;

    console.log(`User ${userId} connected with socket ID: ${socket.id}`);

    onlineUsers.add(userId);
    io.emit("onlineUsers", Array.from(onlineUsers)); // Broadcast online users

    // Heartbeat to keep user online
    socket.on("heartbeat", () => {
      onlineUsers.add(userId);
    });

    // Fetch messages for a conversation
    socket.on("fetch-messages", async (conversationId: number) => {
      const messages = await messageModel.list({
        conversationId,
      });
      socket.emit("messages", messages);
    });

    // Handle sending messages
    socket.on("send-message", async (message) => {
      console.log("Message received:", message);
      const newMessage = await messageModel.add(message);

      io.emit("receive-message", newMessage);
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected, waiting to verify...`);
      onlineUsers.delete(userId);
      io.emit("onlineUsers", Array.from(onlineUsers));
    });
  });
}

function updateUserStatus(userId: number, isOnline: boolean) {
  try {
    sqliteInstance
      .prepare(sql`UPDATE users SET is_online = ? WHERE id = ?`)
      .run(isOnline ? 1 : 0, userId);
  } catch (error) {
    console.error("Error updating user status:", error);
  }
}
