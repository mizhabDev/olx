import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import {
    adminChatPage,
    userChat,
    getConversations,
    getMessages,
    sendMessage,
    startConversation,
} from "../controllers/messageController";

const router = Router();

// ✅ New API endpoints for frontend chat
router.get("/conversation", verifyToken, getConversations); // Get all user's conversations
router.post("/conversation", verifyToken, startConversation); // Start/get conversation for a product
router.get("/messages/:conversationId", verifyToken, getMessages); // Get messages for a conversation
router.post("/send", verifyToken, sendMessage); // Send a message

// 🔹 Legacy routes (admin chat)
router.get("/chat/:id", verifyToken, adminChatPage);
router.get("/user", verifyToken, userChat);

export default router;
