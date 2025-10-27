import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const db = process.env.MONGODB;
console.log(db);

if (!db) {
  throw new Error("MONGODB environment variable is not set!");
}

const connectDB = async () => {
  try {
    // use non-null assertion so TS knows db is a string here
    const conn = await mongoose.connect(db!);
    console.log(`MongoDB Connected succeess`);
  } catch (error) {
    console.error(`Error while connecting to mongodb: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
