import { model, Schema, Types } from "mongoose";
import { IProduct } from "../types/product.types";


export const productSchema = new Schema<IProduct>({
    productName: {
        type: String,
        require: true
    },
    productPrice: {
        type: Number,
        require: true
    },
    productLocation: {
        type: String,
        require: true,
        trim: true
    },

    productPhotoSrc: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
        },
      ],
      required: true,
      validate: {
        validator: (v: unknown[]) => Array.isArray(v) && v.length > 0,
        message: "At least one product image is required",
      },
    },

    subCategory: {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",

    },
    productDescription: {
        type: String,
        require: true

    },
    isSold: {
        type: Boolean,
        default: false

    },
    createdBy: {
        _id: {
            type: Schema.Types.ObjectId,
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
}, { timestamps: true });



export const Product = model<IProduct>("Product", productSchema);
