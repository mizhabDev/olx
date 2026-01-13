import { Server, Socket } from "socket.io";
import cookie from "cookie";
import { decodeToken } from "../utils/jwt";
import { Message } from "../model/messageModel";
import { Conversation } from "../model/conversationModel";

interface AuthenticatedSocket extends Socket {
  data: {
    user: {
      _id: string;
      email: string;
      exp?: number;
    };
  };
}

export async function initSocket(io: Server) {
  // Middleware to verify token from cookie
  io.use((socket, next) => {
    try {
      // Access raw cookie header from handshake
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) {
        return next(new Error("No cookies found"));
      }

      // Parse cookies
      const parsedCookies = cookie.parse(cookieHeader);
      const token = parsedCookies.token;

      if (!token) {
        return next(new Error("No token found in cookies"));
      }

      // Decode token
      const decoded = decodeToken(token);
      socket.data.user = decoded;

      // Auto-disconnect when token expires
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

  io.on("connection", (socket: AuthenticatedSocket) => {
    const userId = socket.data.user._id;
    console.log(`🟢 User connected: ${socket.data.user.email} (${socket.id})`);

    // ✅ Join a conversation room
    socket.on("joinConversation", async ({ conversationId }) => {
      if (!conversationId) {
        console.log("❌ Missing conversationId");
        return;
      }

      try {
        // Verify user is part of this conversation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          console.log(`❌ Conversation not found: ${conversationId}`);
          return;
        }

        const isBuyer = conversation.buyerId.toString() === userId;
        const isSeller = conversation.sellerId.toString() === userId;

        if (!isBuyer && !isSeller) {
          console.log(`❌ User ${userId} not part of conversation ${conversationId}`);
          return;
        }

        // Join the conversation room
        socket.join(conversationId);
        console.log(`📨 ${socket.data.user.email} joined conversation: ${conversationId}`);
      } catch (error) {
        console.error("❌ Error joining conversation:", error);
      }
    });

    // ✅ Handle sending messages (for real-time broadcast after HTTP save)
    socket.on("sendMessage", async ({ conversationId, message }) => {
      if (!conversationId || !message) {
        console.log("❌ Missing conversationId or message data");
        return;
      }

      try {
        // Broadcast the message to all users in the conversation room
        // The message is already saved via HTTP, this just broadcasts it
        const messageData = {
          _id: message._id,
          conversationId,
          senderId: message.senderId,
          message: message.message,
          status: message.status || "sent",
          createdAt: message.createdAt,
        };

        // Emit to all OTHER users in the room (not the sender)
        socket.to(conversationId).emit("newMessage", messageData);
        console.log(`💬 Message broadcast to room ${conversationId}`);
      } catch (error) {
        console.error("❌ Error broadcasting message:", error);
      }
    });

    // ✅ Mark messages as read
    socket.on("markAsRead", async ({ conversationId }) => {
      if (!conversationId) {
        console.log("❌ Missing conversationId for markAsRead");
        return;
      }

      try {
        // Update all unread messages in this conversation where user is NOT the sender
        const result = await Message.updateMany(
          {
            conversationId,
            senderId: { $ne: userId },
            status: { $ne: "read" },
          },
          { $set: { status: "read" } }
        );

        if (result.modifiedCount > 0) {
          // Notify other users in the room that messages were read
          socket.to(conversationId).emit("messagesRead", {
            conversationId,
            readBy: userId,
            count: result.modifiedCount,
          });
          console.log(`✅ Marked ${result.modifiedCount} messages as read in ${conversationId}`);
        }
      } catch (error) {
        console.error("❌ Error marking messages as read:", error);
      }
    });

    // ✅ Handle typing indicators
    socket.on("typing", ({ conversationId, isTyping }) => {
      if (!conversationId) return;

      socket.to(conversationId).emit("userTyping", {
        conversationId,
        userId,
        isTyping,
      });
    });

    // ✅ Handle leaving a conversation room
    socket.on("leaveConversation", ({ conversationId }) => {
      if (conversationId) {
        socket.leave(conversationId);
        console.log(`👋 ${socket.data.user.email} left conversation: ${conversationId}`);
      }
    });

    // ✅ Handle disconnect
    socket.on("disconnect", () => {
      console.log(`🔴 User disconnected: ${socket.data.user.email} (${socket.id})`);
    });
  });
}