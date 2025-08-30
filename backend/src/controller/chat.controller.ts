import Chat from "../models/chat.model.js";
import type { Request, Response } from "express";
import { getSocketIO } from "../socket/socketManager.js";

export const createChat = async (req: Request, res: Response) => {
    const { message } = req.body;

    try {
        const response = await Chat.create({ message: message });
        
        // Emit realtime update to all connected clients
        const io = getSocketIO();
        io.emit("newMessage", {
            _id: response._id,
            message: response.message,
            createdAt: response.createdAt
        });

        res.status(200).json({
            message: "chat created successfully",
            data: response,
        });
        
    } catch (error) {
        res.status(500).json({
            message: "error creating chat",
            error: error,
        });
    }
};

export const getAllChats = async (req: Request, res: Response) => {
    try {
        const response = await Chat.find().sort({ createdAt: -1 });
        res.status(200).json({
            message: "Chats fetched successfully",
            data: response,
        });
    } catch (error) {
        res.status(500).json({
            message: "error fetching chats",
            error: error,
        });
    }
};

