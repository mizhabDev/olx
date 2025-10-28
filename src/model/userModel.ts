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

    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    otp: {
        type: String,
        required: true
    },
    otpExpiry: {
        type: Date,
        required: true,
        index: { expires: 300 } // 300 seconds = 5 minutes
    },
    isVerified:{
        type:Boolean,
        require:true,
        default:false,
    }
})

export const User = model<typeUser>("User", userSchema);
