import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaImage, FaPen } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { IoSendSharp } from "react-icons/io5";

const messages = [
  {
    id: 1,
    name: "John Wick",
    message: "I'm interested in your services. Can we",
    time: "1:45 PM",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    online: true,
  },
  {
    id: 2,
    name: "Alexa 443",
    message: "Hey! I saw your pitch for my job. I'd love to",
    time: "3:24 PM",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    online: true,
  },
  {
    id: 3,
    name: "Mr Bond",
    message: "I'd like to discuss your proposal in more",
    time: "12:00 PM",
    avatar: "",
    online: false,
  },
];

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(messages[1]);
  const [input, setInput] = useState("");

  return (
    <div
      style={{
        height: "calc(100vh - 64px)",
      }}
      className="flex  w-full bg-gray-100"
    >
      {/* Sidebar */}
      <div className="w-1/4 overflow-x-hidden bg-white shadow-md border-r">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">All messages</h2>
          <FiSearch className="text-gray-500 cursor-pointer" />
        </div>
        <div>
          {messages.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center p-4 cursor-pointer border-b hover:bg-gray-100 ${
                selectedChat.id === chat.id ? "bg-gray-200" : ""
              }`}
            >
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{chat.name}</h3>
                <p className="text-sm text-gray-500 truncate">{chat.message}</p>
              </div>
              <span className="text-xs text-gray-400">{chat.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex flex-col w-3/4">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 bg-white shadow-md border-b">
          <div className="flex items-center">
            <div className="relative mr-3">
              <img
                src={selectedChat.avatar}
                alt={selectedChat.name}
                className="w-10 h-10 rounded-full"
              />
              {selectedChat.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
              )}
            </div>
            <h2 className="text-lg font-semibold">
              {selectedChat.name}, {selectedChat.time}
            </h2>
          </div>
          <BsThreeDots className="text-gray-500 cursor-pointer" />
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
        <div className="flex items-center p-4 border-t bg-white">
          <FaImage className="text-gray-500 cursor-pointer mr-2" />
          <FaPen className="text-gray-500 cursor-pointer mr-2" />
          <Input
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full"
          />
          <Button className="ml-2 bg-blue-500 text-white p-2 rounded-lg flex items-center">
            <IoSendSharp />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
