import http from "http";
import { Server } from "socket.io";
import { messageModel } from "../models/message";
import { sql } from "../utils/utils";
import { getDbInstance } from "./db/sqlite";

export default function socketServer(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  const db = getDbInstance();

  const addOnlineUser = db.prepare(sql`
INSERT INTO OnlineUsers (user_id, last_seen) VALUES (?, CURRENT_TIMESTAMP) ON CONFLICT(user_id) DO UPDATE SET last_seen = CURRENT_TIMESTAMP`);

  const removeInactiveUsers = db.prepare(
    sql`DELETE FROM OnlineUsers WHERE last_seen < DATETIME('now', '-10 seconds')`
  );

  const getOnlineUsers = db.prepare(sql`SELECT user_id FROM OnlineUsers`);

  io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) return;

    console.log(`User ${userId} connected with socket ID: ${socket.id}`);

    // Broadcast updated online users
    io.emit(
      "userOnline",
      getOnlineUsers.all().map((row: any) => row.user_id)
    );

    // Handle heartbeat to update last_seen
    socket.on("heartbeat", () => {
      addOnlineUser.run(userId);
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
      const newMessage = await messageModel.add(message);

      io.emit("receive-message", newMessage);
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected, waiting to verify...`);
    });
  });

  // Background task: Remove inactive users every 10 seconds
  setInterval(() => {
    removeInactiveUsers.run();
    io.emit(
      "userOnline",
      getOnlineUsers.all().map((row: any) => row.user_id)
    );
  }, 10000);
}
