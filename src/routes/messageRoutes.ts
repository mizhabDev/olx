
import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { adminChatPage, userChat } from "../controllers/messageController";
import { Message } from "../model/messageModel";
import { log } from "console";



const router = Router();


router.get("/chat/:id", verifyToken, adminChatPage);
router.get("/user", verifyToken, userChat);


// 🧾 Get chat history
router.get("/messages/", verifyToken, async (req, res) => {
  try {
    const { senderEmail, receiverEmail } = req.query;
    log("f-----------------------------------------------------",senderEmail,receiverEmail)

    if (!senderEmail || !receiverEmail) {
      return res.status(400).json({ message: "Missing email fields" });
    }

    const roomId = generateRoomId(senderEmail as string, receiverEmail as string);

    const messages = await Message.find({ roomId }).sort({ timestamp: 1 }); // oldest → newest
    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

function generateRoomId(userEmail: string, adminEmail: string) {
  const sorted = [userEmail, adminEmail].sort();
  return `room-${sorted[0]}-${sorted[1]}`;
}



export default router;


