import { Avatar } from "@/components/Avatar";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { ChatSidebar } from "@/components/pages/Chat/ChatSidebar";
import useChatSocket from "@/hooks/useChatSocket";
import useListConversations from "@/hooks/useListConversations";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { useUser } from "@/hooks/useUser";
import { Conversation } from "@/lib/types";
import { convertDateToString, convertUtcToLocal } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    conversations,
    isLoading: isConversationsLoading,
    refetch,
  } = useListConversations();
  const [newMessage, setNewMessage] = useState("");
  const { messages, sendMessage } = useChatSocket(selectedChat);
  const { onlineUsers } = useOnlineStatus();
  const { user } = useUser();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversations || conversations.length === 0) return;
    if (!selectedChat && conversations.length > 0) {
      setSelectedChat(conversations[0]);
    }
  }, [conversations, selectedChat]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  if (!user) return null;

  const isOnline =
    selectedChat && onlineUsers.has(selectedChat.otherUserId) ? true : false;

  // Inline Components
  const NoChatSelected = () => (
    <div className="flex-1 flex items-center justify-center bg-white">
      <h2 className="text-lg font-semibold">
        Select a chat to start messaging
      </h2>

      <Button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`absolute top-2 left-2 px-[10px] py-3 ${
          isSidebarOpen ? "hidden" : "block"
        }`}
      >
        <FaBars />
      </Button>
    </div>
  );

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
              selectedChat={selectedChat}
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
          <NoChatSelected />
        ) : (
          <>
            <div className="flex items-center justify-between p-2 bg-white shadow-md border">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`px-[10px] py-3 ${
                    isSidebarOpen ? "hidden" : "block"
                  }`}
                >
                  <FaBars />
                </Button>
                <Avatar
                  avatar={`data:image/jpeg;base64,${selectedChat.avatar}`}
                  showOnlineStatus={true}
                  isOnline={isOnline}
                  name={selectedChat.name}
                />

                <h2 className="text-lg font-semibold">
                  {selectedChat.name}

                  <p className="text-sm font-normal text-gray-500">
                    {convertDateToString(selectedChat.lastSeen)}
                  </p>
                </h2>
              </div>
            </div>

            <div ref={chatRef} className="flex-1 p-4 overflow-y-auto">
              {messages.map((message) => {
                const messageCreatedAt = new Date(
                  convertUtcToLocal(message.createdAt!)
                ).toLocaleTimeString();
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    key={message.id}
                    className={`flex flex-col gap-1 ${
                      message.senderId === user.id ? "items-end" : "items-start"
                    }`}
                  >
                    <p
                      className={`p-2 rounded-lg ${
                        message.senderId === user.id
                          ? "bg-primary text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {message.message}
                    </p>
                    <span className="text-xs text-gray-500 mb-1">
                      {messageCreatedAt}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <form
              onSubmit={(e: React.SyntheticEvent) => {
                e.preventDefault();
                if (newMessage.trim() !== "") {
                  sendMessage(user.id, newMessage);
                  if (chatRef.current) {
                    chatRef.current.scrollTop = chatRef.current.scrollHeight;
                  }
                  setNewMessage("");
                  // scroll to bottom
                  refetch();
                }
              }}
              className="flex items-center p-4 border-t bg-white gap-2"
            >
              <Input
                type="text"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full mb-0"
              />
              <Button type="submit" className="px-[10px] py-4">
                <IoSendSharp />
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Chat;
