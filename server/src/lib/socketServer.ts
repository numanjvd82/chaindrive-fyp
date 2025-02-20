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

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) return;

    // Update online status in db
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} connected, total: ${onlineUsers.size}`);

    io.emit("online-users", Array.from(onlineUsers.keys()));

    sqliteInstance
      .prepare(sql`UPDATE users SET is_online = 1 WHERE id = ?`)
      .run(userId);

    // Handle dedicated event to get online users
    socket.on("get-online-users", () => {
      socket.emit("online-users", Array.from(onlineUsers.keys()));
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
      onlineUsers.delete(userId);
      console.log(`User ${userId} disconnected, total: ${onlineUsers.size}`);

      io.emit("online-users", Array.from(onlineUsers.keys()));

      sqliteInstance
        .prepare(sql`UPDATE users SET is_online = 0 WHERE id = ?`)
        .run(userId);
    });
  });
}
