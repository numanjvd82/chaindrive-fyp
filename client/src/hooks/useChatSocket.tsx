import { Conversation, Message } from "@/lib/types";
import { useEffect, useState } from "react";
import { useSocket } from "./useSocket";

export default function useChatSocket(selectedChat: Conversation | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    const handleOnlineUsers = (users: number[]) => {
      setOnlineUsers(users);
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, [socket]);

  useEffect(() => {
    if (!selectedChat) return;

    socket.emit("fetch-messages", selectedChat.id);

    const handleMessages = (fetchedMessages: Message[]) => {
      setMessages(fetchedMessages);
    };

    const handleReceiveMessage = (message: Message) => {
      if (message.conversationId === selectedChat.id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("messages", handleMessages);
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("messages", handleMessages);
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [selectedChat, socket]);

  const sendMessage = (userId: number, message: string) => {
    if (!selectedChat) return;

    const newMessage: Message = {
      id: Date.now(),
      conversationId: selectedChat.id,
      senderId: userId,
      message,
      isRead: false,
    };

    socket.emit("send-message", newMessage);
  };

  return { messages, sendMessage, onlineUsers };
}
