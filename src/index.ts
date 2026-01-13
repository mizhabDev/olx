import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./config/socket";

dotenv.config();

const PORT = process.env.PORT || 3000;

// connect to database 
connectDB();

const server = createServer(app);



// create socket.io instance with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});



//  initialize socket logic
initSocket(io);




//  EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));




server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
