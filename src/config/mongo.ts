import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const db = process.env.MONGO_URI;

if (!db) {
  throw new Error("MONGO_URI environment variable is not set!");
}

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(db);

    console.log("✅ MongoDB Atlas connected successfully");
  } catch (error) {
    console.error(
      "❌ Error while connecting to MongoDB:",
      (error as Error).message
    );
    process.exit(1);
  }
};

export default connectDB;
  
