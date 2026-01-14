import { Types } from "mongoose";


export interface ISubCategory {
  productId: Types.ObjectId;
  category: string;
  subCategory: string;
  additionalDetails: {
    key: string;
    value: unknown;
  }[];
  types:string;
}
