import { Conversation, Message } from "@/lib/types";
import { socket } from "@/MainApp";
import { useEffect, useState } from "react";

export default function useChatSocket(selectedChat: Conversation | null) {
  const [messages, setMessages] = useState<Message[]>([]);

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
  }, [selectedChat]);

  const sendMessage = (userId: number, message: string) => {
    if (!selectedChat) return;

    const newMessage: Message = {
      id: Date.now(),
      conversationId: selectedChat.id,
      senderId: userId,
      message,
      isRead: false,
    };

    // setMessages((prev) => [...prev, newMessage]);
    socket.emit("send-message", newMessage);
  };

  return { messages, sendMessage };
}
