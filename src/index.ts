import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";
dotenv.config();

const PORT = process.env.PORT || 3000;

// connet to database 
connectDB();






app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
 
 