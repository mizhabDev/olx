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
        require:true
    },
    productPhotoSrc: String,
    productCatogery:{
        type:String,
        default:"other",
    },
    createdBy: {
        _id:{
            type:String,
        },
        name: {
            type:String, 
            default: "Admin"
        },
        email:{
            type:String,
        },
        date: { 
            type: Date, 
            default: Date.now 
        }
    }
},{ timestamps: true });



export const Product = model<IProduct>("Product", productSchema);
