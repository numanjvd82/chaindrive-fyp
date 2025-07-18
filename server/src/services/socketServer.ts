import http from "http";
import { Server } from "socket.io";
import { Message } from "../lib/types";
import { conversationModel } from "../models/conversation";
import { messageModel } from "../models/message";
import { notificationDbFunctions } from "./notification";
import { onlineUsersDbFunctions } from "./userOnlineStatus";

export default function socketServer(server: http.Server) {
  try {
    const { addOnlineUser, getOnlineUsers, removeInactiveUsers } =
      onlineUsersDbFunctions;

    const { insertNotification } = notificationDbFunctions;

    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
      },
    });

    const onlineUsersSocket = new Map<number, string>();

    io.on("connection", (socket) => {
      const userId: number = socket.handshake.auth.userId;
      if (!userId) return;

      console.log(`User ${userId} connected with socket ID: ${socket.id}`);

      onlineUsersSocket.set(userId, socket.id);

      try {
        io.emit(
          "userOnline",
          getOnlineUsers.all().map((row: any) => row.user_id)
        );
      } catch (error) {
        console.error("Error getting online users:", error);
      }

      // Handle heartbeat to update last_seen
      socket.on("heartbeat", () => {
        try {
          addOnlineUser.run(userId);
        } catch (error) {
          console.error("Error updating user heartbeat:", error);
        }
      });

      socket.on("fetch-messages", async (conversationId: number) => {
        const messages = await messageModel.list({
          conversationId,
        });
        socket.emit("messages", messages);
      });

      // Join a conversation room
      socket.on("join-conversation", (conversationId: number) => {
        const room = `conversation-${conversationId}`;

        const rooms = Array.from(socket.rooms);
        rooms.forEach((room) => {
          if (room.startsWith("conversation-")) {
            socket.leave(room);
          }
        });

        socket.join(room);
      });

      // Handle sending messages
      socket.on("send-message", async (message: Message) => {
        const newMessage = await messageModel.add(message);
        const room = `conversation-${message.conversationId}`;
        io.to(room).emit("receive-message", newMessage);

        // Notify the recipient
        const conversation = await conversationModel.byId({
          conversationId: message.conversationId,
          userId,
        });
        if (!conversation) return;

        const recipientId =
          conversation.user1 === userId
            ? conversation.user2
            : conversation.user1;
        const isRecipientOnline = onlineUsersSocket.has(recipientId);
        const recipeintSocketId = onlineUsersSocket.get(recipientId);

        const truncatedMessage =
          message.message.length > 50
            ? message.message.substring(0, 50) + "..."
            : message.message;

        try {
          // Insert Notification in the db
          const notificationId = insertNotification.run(
            recipientId,
            "message",
            truncatedMessage,
            `/chat?conversationId=${message.conversationId}`,
            null
          ).lastInsertRowid as number;

          if (isRecipientOnline && recipeintSocketId) {
            io.to(recipeintSocketId).emit("notification", {
              id: notificationId,
              type: "message",
              content: truncatedMessage,
              link: `/chat?conversationId=${message.conversationId}`,
              created_at: new Date().toISOString(),
            });
          } else {
            // Pass as the notification is already inserted
          }
        } catch (error) {
          console.error("Error inserting notification:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected, waiting to verify...`);
        onlineUsersSocket.delete(userId);
      });
    });

    // Background task: Remove inactive users every 10 seconds
    setInterval(() => {
      try {
        removeInactiveUsers.run();
        io.emit(
          "userOnline",
          getOnlineUsers.all().map((row: any) => row.user_id)
        );
      } catch (error) {
        console.error("Error in background cleanup task:", error);
      }
    }, 10000);
  } catch (error) {
    console.error("Error initializing socket server:", error);
    throw error;
  }
}
