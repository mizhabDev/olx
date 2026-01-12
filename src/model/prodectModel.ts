import  { model, Schema } from "mongoose";
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
        type:String,
        require:true,
        trim:true
    },
     productPhotoSrc: {
      type: [String],           // 👈 array of strings
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one product image is required",
      },
    },
    productCatogery:{
        type:String,
        default:"other",
        require:true
        
    },
    productDescription:{
        type:String,
        require:true

    },
    isSold:{
        type:Boolean,
        default:false
 
    },
    createdBy: {
        _id:{
            type:String,
        },
        date: { 
            type: Date, 
            default: Date.now 
        }
    }
},{ timestamps: true });



export const Product = model<IProduct>("Product", productSchema);
