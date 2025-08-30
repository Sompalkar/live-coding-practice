import { Router } from "express";
import { createChat, getAllChats } from "../controller/chat.controller.js";

const router = Router();

// Keep both: Socket.io for realtime, REST API as fallback for initial loading
router.post("/create", createChat);
router.get("/getAllChats", getAllChats);

export default router;

