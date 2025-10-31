import { Document } from "mongoose";


export interface IProduct extends Document {
  productName: string;
  productPrice: number;
  productLocation: String;
  productPhotoSrc: string;
  productCatogery: string;
  createdBy: {
    _id:string;
    name: String;
    email:String
    date:Date;
  }
}
