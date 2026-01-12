import mongoose, { Schema, Document, Types } from "mongoose";

export interface IConversation extends Document {
    _id: Types.ObjectId;
    sellerId: Types.ObjectId;
    buyerId: Types.ObjectId;
    productId: Types.ObjectId;
    lastMessage?: string;
    lastMessageAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
    {
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        buyerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        lastMessage: {
            type: String,
            default: "",
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure unique conversation per buyer-seller-product combo
conversationSchema.index(
    { sellerId: 1, buyerId: 1, productId: 1 },
    { unique: true }
);

export const Conversation = mongoose.model<IConversation>(
    "Conversation",
    conversationSchema
);
