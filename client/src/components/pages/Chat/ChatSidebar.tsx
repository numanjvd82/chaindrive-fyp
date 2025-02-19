import Button from "@/components/Button";
import { Conversation } from "@/lib/types";
import { truncateText } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { IoCloseSharp } from "react-icons/io5";

interface Props {
  isLoading: boolean;
  conversations: Conversation[];
  selectedChat: Conversation;
  setSelectedChat: (convo: Conversation) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const ChatSidebar: React.FC<Props> = ({
  conversations,
  isLoading,
  selectedChat,
  setSelectedChat,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="w-[250px]"
        >
          {/* Sidebar Header */}
          <div className="flex justify-between items-center h-16 p-4 border-b relative">
            <h2 className="text-lg font-semibold">All messages</h2>
            <div className="flex items-center space-x-4">
              <FiSearch className="text-gray-500 cursor-pointer" />
              <Button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="px-2"
              >
                <IoCloseSharp />
              </Button>
            </div>
          </div>

          {/* Conversations List */}
          <div>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              conversations.map((convo) => (
                <div
                  key={convo.id}
                  onClick={() => {
                    setSelectedChat(convo);
                  }}
                  className={`flex items-center p-4 cursor-pointer border-b hover:bg-gray-100 ${
                    selectedChat.id === convo.id ? "bg-gray-200" : ""
                  }`}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{convo.name}</h3>
                    <span className="text-xs text-gray-400">
                      {new Date(convo.lastSeen).toLocaleDateString()}
                    </span>
                    <p className="text-sm text-gray-500 truncate">
                      {truncateText(convo.lastMessage!, 15)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
