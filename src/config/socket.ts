import { Server } from "socket.io";
import cookie from "cookie";
import { decodeToken } from "../utils/jwt";
import { Message } from "../model/messageModel";

export async function initSocket(io: Server) {
  // Middleware to verify token from cookie

  io.use((socket, next) => {
    try {
      //  Access raw cookie header from handshake
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) {
        return next(new Error("No cookies found"));
      }

      //  Parse cookies
      const parsedCookies = cookie.parse(cookieHeader);
      const token = parsedCookies.token;

      //decodeToken function
      const decoded = decodeToken(token);
      socket.data.user = decoded;

      // 🕒 Auto-disconnect when token expires
      if (decoded.exp) {
        const expiresInMs = decoded.exp * 1000 - Date.now();
        if (expiresInMs <= 0) throw new Error("Token already expired");

        setTimeout(() => {
          console.log(`🔴 Token expired for ${decoded.email}`);
          socket.disconnect(true);
        }, expiresInMs);

        console.log(`⏳ Token valid for ${Math.round(expiresInMs / 1000)} seconds`);
      }

      next();

    } catch (error) {
      console.log("❌ Auth failed:", error);
      next(new Error("Authentication failed"));

    }
  });

  io.on("connection", async (socket) => {
    const { senderEmail, receiverEmail } = socket.handshake.auth;


    if (!receiverEmail) { 
      console.log("❌ Missing sender or target email target email",senderEmail  );
      socket.disconnect();
      return;
    }


    if (!senderEmail ) {
      console.log("❌ Missing sender or target email",senderEmail);
      socket.disconnect();
      return;
    }
    
    // ✅ Create a unique room ID based on both participants
    const roomId = generateRoomId(senderEmail, receiverEmail);

    // ✅ Join that room
    socket.join(roomId);
    console.log(`🟢 ${senderEmail} joined ${roomId}`);


    // ✅ 1. Load old messages from MongoDB and send them to the user
    try {
      const previousMessages = await Message.find({ roomId })
        .sort({ createdAt: 1 }) // oldest → newest
        .lean();

      socket.emit("chatHistory", previousMessages);
      console.log(`📜 Sent ${previousMessages.length} old messages to ${senderEmail}`);
    } catch (error) {
      console.error("❌ Failed to load chat history:", error);
    }



    // ✅ Handle incoming messages
    socket.on("message", async (data) => {
      console.log(`💬 ${data.senderEmail} → ${data.receiverEmail}: ${data.text}`);

      try {
        const { senderEmail, receiverEmail, text } = data;

        // 🗃️ Save message to MongoDB
        const messageDoc = new Message({
          senderEmail,
          receiverEmail,
          message: text,
          roomId,
        });

        await messageDoc.save();

        console.log(`💾 Saved message: ${senderEmail} → ${receiverEmail}`);

        // 📤 Emit message to room
        io.to(roomId).emit("message", {
          senderEmail,
          receiverEmail,
          text,
          createdAt: messageDoc.createdAt,
        });

      } catch (error) {
        console.error("❌ Error saving message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔴 ${senderEmail} left ${roomId}`);
    });
  });
}

// Helper function to generate consistent room IDs
function generateRoomId(userEmail: string, adminEmail: string) {
  // Sort emails alphabetically to ensure both sides get the same ID
  const sorted = [userEmail, adminEmail].sort();
  return `room-${sorted[0]}-${sorted[1]}`;
}
