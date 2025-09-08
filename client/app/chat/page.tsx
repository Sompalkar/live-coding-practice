
'use client'
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  _id: string;
  message: string;
  createdAt: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadInitialMessages();

    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    newSocket.on("newMessage", (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to latest message
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadInitialMessages = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/chat/getAllChats");
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error loading initial messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      await axios.post("http://localhost:8000/api/v1/chat/create", {
        message: inputMessage,
      });
      setInputMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border border-gray-300 bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white font-semibold text-lg shadow-md">
        Realtime Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
        {messages.map((message, index) => {
          const isOwn = index % 2 === 0; // simple fake left/right alternation
          return (
            <div
              key={message._id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm ${
                  isOwn
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{message.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOwn ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white flex items-center gap-2 border-t">
        <input
          type="text"
          placeholder="Type a message..."
          onChange={(e) => setInputMessage(e.target.value)}
          value={inputMessage}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Send
        </button>
      </div>
    </div>
  );
}
