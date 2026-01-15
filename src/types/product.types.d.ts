import { Document, Types } from "mongoose";


export interface IProduct {
  productName: string;
  productPrice: number;
  productLocation: String;
  productPhotoSrc: IProductImage[];
  productCatogery: string;
  subCategory: Types.ObjectId;
  productDescription: String;
  isSold: Boolean;
  createdBy: {
    _id: Types.ObjectId;
    date: Date;
  }
}


export interface IProductImage extends Document {
  url: string;
  public_id: string;
}

