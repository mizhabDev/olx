import mongoose, { Schema, Document } from "mongoose";

// 🧠 1. Define TypeScript interface
export interface IOrder extends Document {
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  price: number;
  status: "pending" | "completed" | "cancelled";
  paymentMethod?: "cash" | "online";
  createdAt: Date;
  updatedAt: Date;
}

// 🧩 2. Create schema
const orderSchema = new Schema<IOrder>(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      default: "cash",
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

// 🧱 3. Export model
export const Order = mongoose.model<IOrder>("Order", orderSchema);
