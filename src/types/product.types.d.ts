import { Document } from "mongoose";


export interface IProduct extends Document {
  productName: string;
  productPrice: number;
  productLocation: String;
  productPhotoSrc: [string]; 
  productCatogery: string;
<<<<<<< HEAD
  productDescription :String;
=======
>>>>>>> 3d134bec2c95c644ba27a7994033fba0c7fd6bb2
  isSold:Boolean
  createdBy: {
    _id:string;
    name: String;
    email:String
    date:Date;
  }
}
