// src/model/pageModel.ts
import { Schema, model } from "mongoose";

const pageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Page = model("Page", pageSchema);
