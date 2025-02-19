import { Conversation, Message } from "@/lib/types";
import { useEffect } from "react";
import { socket } from "src/MainApp";

export default function useChatSocket(selectedChat: Conversation) {
  useEffect(() => {
    if (!selectedChat) return;

    // Fetch messages for the selected chat using seperate API call

    // Listen for new messages
    socket.on("receive-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [selectedChat]);

  const sendMessage = (userId: number, message: string) => {
    if (!selectedChat) return;

    const newMessage: Message = {
      id: messages.length + 1,
      conversationId: selectedChat.id,
      senderId: userId,
      message,
      isRead: false,
    };

    socket.emit("send-message", newMessage);
    setMessages((prev) => [...prev, newMessage]); // Optimistic update
  };

  return { messages, sendMessage };
}
