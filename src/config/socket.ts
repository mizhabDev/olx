import { Server } from "socket.io";
import cookie from "cookie";
import { decodeToken } from "../utils/jwt";
import { Message } from "../model/messageModel";
import { log } from "console";

export function initSocket(io: Server) {
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

  io.on("connection", (socket) => {
    const { senderEmail, targetEmail } = socket.handshake.auth;

    if (!senderEmail || !targetEmail) {
      console.log("❌ Missing sender or target email");
      socket.disconnect();
      return;
    }

    // ✅ Create a unique room ID based on both participants
    const roomId = generateRoomId(senderEmail, targetEmail);

    // ✅ Join that room
    socket.join(roomId);
    console.log(`🟢 ${senderEmail} joined ${roomId}`);

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
