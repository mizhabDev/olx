
import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { adminChatPage, userChat } from "../controllers/messageController";



const router = Router();


router.get("/chat/:id", verifyToken, adminChatPage);
router.get("/user", verifyToken, userChat);




export default router;


