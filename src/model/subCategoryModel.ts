// subcategories.model.ts
import { Schema, model } from "mongoose";
import { ISubCategory } from "../types/subCatogery";

const additionalDetailSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
    },
    value: {
      type: Schema.Types.Mixed, // string | number | boolean | date
      required: true,
    },
  },
  { _id: false }
);

const subCategorySchema = new Schema<ISubCategory>( 
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    category: {
      type:String,
      required: true,
    },

    subCategory: {
      type:String,
      required: true,
    },

    additionalDetails: {
      type: [additionalDetailSchema],
      default: [],
    },

    types:{
      type:String,
      
    }

  },
  { timestamps: true }
);

export const SubCategory = model<ISubCategory>("SubCategory", subCategorySchema);