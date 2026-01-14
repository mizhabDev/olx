import { Document, Types } from "mongoose";


export interface IProduct {
  productName: string;
  productPrice: number;
  productLocation: String;
  productPhotoSrc: [string];
  productCatogery: string;
  subCategory: Types.ObjectId;
  productDescription: String;
  isSold: Boolean;
  createdBy: {
    _id: string;
    name: String;
    email: String;
    date: Date;
  }
}
