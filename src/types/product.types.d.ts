import { Document } from "mongoose";


export interface IProduct extends Document {
  productName: string;
  productPrice: number;
  productLocation: String;
  productPhotoSrc: string;
  createdBy:{
    name:String
  }
}
