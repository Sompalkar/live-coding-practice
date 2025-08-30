'use client'

import axios from "axios";
import { useEffect, useState } from "react";
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

    useEffect(() => {
        // Load initial messages first (reliable fallback)
        loadInitialMessages();

        // Then connect to Socket.io for realtime updates
        const newSocket = io("http://localhost:8000");
        setSocket(newSocket);

        // Listen for new messages
        newSocket.on("newMessage", (message: ChatMessage) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            newSocket.close();
        };
    }, []);

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

            // Message will be added via socket event, so we don't need to manually add it here
            setInputMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Realtime Chat</h1>
            
            <div className="mb-4 flex gap-2">
                <input 
                    type="text" 
                    placeholder="Enter your message..." 
                    onChange={(e) => setInputMessage(e.target.value)} 
                    value={inputMessage}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                    onClick={handleSendMessage}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Send
                </button>
            </div>

            <div className="space-y-3">
                {messages.map((message) => ( 
                    <div key={message._id} className="p-3 bg-gray-100 rounded-lg">
                        <p className="text-gray-800">{message.message}</p>  
                        <p className="text-xs text-gray-500 mt-1">
                            {new Date(message.createdAt).toLocaleString()}
                        </p>    
                    </div>      
                ))}
            </div>
        </div>
    );
}   