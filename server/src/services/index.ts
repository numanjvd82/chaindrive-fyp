import http from "http";
import { Server } from "socket.io";
import { Message } from "../lib/types";
import { conversationModel } from "../models/conversation";
import { messageModel } from "../models/message";
import { notificationDbFunctions } from "./notfication";
import { onlineUsersDbFunctions } from "./userOnlineStatus";

export default function socketServer(server: http.Server) {
  const { addOnlineUser, getOnlineUsers, removeInactiveUsers } =
    onlineUsersDbFunctions;

  const {
    deleteNotification,
    getUnreadNotifications,
    insertNotification,
    markNotificationAsRead,
  } = notificationDbFunctions;

  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId: number = socket.handshake.auth.userId;
    if (!userId) return;

    console.log(`User ${userId} connected with socket ID: ${socket.id}`);

    // Broadcast updated online users
    io.emit(
      "userOnline",
      getOnlineUsers.all().map((row: any) => row.user_id)
    );

    // Send unread notifications when user connects
    const notifications = getUnreadNotifications.all(userId);
    socket.emit("unread-notifications", notifications);

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
    socket.on("send-message", async (message: Message) => {
      const newMessage = await messageModel.add(message);

      io.emit("receive-message", newMessage);

      // Notify the recipient
      const conversation = await conversationModel.byId(message.conversationId);
      if (!conversation) return;
      const recipientId = conversation.otherUserId;
      const recipientIdStr = String(recipientId);
      const onlineUsers = getOnlineUsers.get() as Record<string, number>;
      const isRecipientOnline = Array.from(Object.values(onlineUsers)).includes(
        recipientId
      );
      if (isRecipientOnline) {
        io.to(recipientIdStr).emit("notification", {
          type: "message",
          content: `New message from ${conversation.name}`,
        });
      } else {
        insertNotification.run(
          recipientId,
          "message",
          `New message from ${conversation.name}`
        );
      }
    });

    // Mark notification as read
    socket.on("mark-as-read", (notificationId) => {
      markNotificationAsRead.run(notificationId);
    });

    // Remove notification
    socket.on("remove-notification", (notificationId) => {
      deleteNotification.run(notificationId);
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
