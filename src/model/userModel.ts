import { model, Schema } from "mongoose";
import { typeUser } from "../types/user.types";

export const userSchema = new Schema<typeUser>({
  
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },

  // 👇 For normal signup users
  password: {
    type: String,
    required: false, 
  },

  // 👇 For Google login users
  googleId: {
    type: String,
    required: false, 
  },
  photo: {
    type: String,
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  // 👇 OTP only used for normal signup
  otp: {
    type: String,
    required: false,
  },
  otpExpiry: {
    type: Date,
    required: false,
    index: { expires: 300 },
  },

  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
   wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

export const User = model<typeUser>("User", userSchema);
