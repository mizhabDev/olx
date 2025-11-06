import { Server } from "socket.io";

export function initSocket(io: Server) {
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

    // ✅ Handle incoming messages
    socket.on("message", (data) => {
      console.log(`💬 ${data.senderEmail} → ${data.receiverEmail}: ${data.text}`);

      // Emit only to this specific room
      io.to(roomId).emit("message", data);
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
