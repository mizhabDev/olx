import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  senderEmail: string;
  receiverEmail: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

const messageSchema = new Schema<IMessage>(
  {
    senderEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    receiverEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Message = mongoose.model<IMessage>("Message", messageSchema);
