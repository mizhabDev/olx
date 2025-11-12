import { Document, Types } from "mongoose";

export interface typeUser extends Document {
  _id: string;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  photo?: string;
  createdAt: Date;
  otp?: string;
  otpExpiry?: Date;
  isVerified: boolean;
  wishlist?: Types.ObjectId[];
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}
