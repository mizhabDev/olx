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
        required:true
    },
    createdAt: { type: Date, default: Date.now }
})

export const User = model<typeUser>("User", userSchema);
