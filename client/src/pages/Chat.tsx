import Button from "@/components/Button";
import Input from "@/components/Input";
import { ChatSidebar } from "@/components/pages/Chat/ChatSidebar";
import useListConversations from "@/hooks/useListConversations";
import { Conversation } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";

const Chat = () => {
  const [newMessage, setNewMessage] = useState("");
  const { conversations, isLoading } = useListConversations();
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            className="bg-white shadow-lg border-t border-r border-b"
          >
            <ChatSidebar
              conversations={conversations || []}
              isLoading={isLoading}
              selectedChat={selectedChat!}
              setSelectedChat={setSelectedChat}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
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
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 p-3 rounded-lg max-w-xs">
                  Hey there! I saw your pitch for my job. I'd love to talk more
                  about it. Are you available for a quick chat tomorrow?
                </div>
              </div>
              <div className="flex justify-end mb-4">
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                  Hi
                </div>
              </div>
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
