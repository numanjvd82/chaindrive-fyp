import Button from "@/components/Button";
import Input from "@/components/Input";
import { ChatSidebar } from "@/components/pages/Chat/ChatSidebar";
import useListConversations from "@/hooks/useListConversations";
import useMessages from "@/hooks/useMessages";
import { Conversation, Message } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";

const Chat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { conversations, isLoading: isConversationsLoading } =
    useListConversations();
  const { isLoading: isMessagesLoading, messages: storedMessages } =
    useMessages(selectedChat?.id || null);

  useEffect(() => {
    if (!selectedChat) return;
    if (isMessagesLoading || !storedMessages || storedMessages.length === 0)
      return;
    if (selectedChat) {
      setMessages(storedMessages);
    }
  }, [selectedChat, isMessagesLoading, storedMessages]);

  useEffect(() => {
    if (!conversations || conversations.length === 0) return;
    if (!selectedChat) {
      setSelectedChat(conversations[0]);
    }
  }, [conversations, selectedChat]);

  return (
    <div className="flex w-full h-[calc(100vh-4rem)] bg-gray-100 relative">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3 }}
            className=" bg-white shadow-lg border-t border-r border-b "
          >
            <ChatSidebar
              conversations={conversations || []}
              isLoading={isConversationsLoading}
              selectedChat={selectedChat!}
              setSelectedChat={setSelectedChat}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`flex flex-1 flex-col transition-all duration-300`}
      >
        {!selectedChat ? (
          <div className="flex-1 flex items-center justify-center bg-white">
            <h2 className="text-lg font-semibold">
              Select a chat to start messaging
            </h2>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between h-16 p-4 bg-white shadow-md border-y">
              <div className="flex items-center gap-2">
                {/* Sidebar Toggle Button */}
                <Button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`px-2 py-3 ${isSidebarOpen ? "hidden" : "block"}`}
                >
                  <FaBars />
                </Button>
                <img
                  src={`data:image/jpeg;base64,${selectedChat.avatar}`}
                  alt={selectedChat.name}
                  className="w-10 h-10 rounded-full"
                />
                <h2 className="text-lg font-semibold">
                  {selectedChat.name}
                  <p className="text-sm font-normal text-gray-500">
                    {new Date(selectedChat.lastSeen).toLocaleTimeString()}
                  </p>
                </h2>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {isMessagesLoading ? (
                <p>Loading...</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col gap-1 ${
                      message.senderId === 1 ? "items-end" : "items-start"
                    }`}
                  >
                    <p
                      className={`p-2 rounded-lg ${
                        message.senderId === 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {message.message}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt!).toLocaleTimeString("en-PK")}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="flex items-center p-4 border-t bg-white gap-2">
              <Input
                type="text"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full mb-0"
              />
              <Button className="px-2">
                <IoSendSharp />
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Chat;
