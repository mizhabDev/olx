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
<<<<<<< HEAD
    productDescription:{
        type:String,
        require:true

    },
=======
>>>>>>> 3d134bec2c95c644ba27a7994033fba0c7fd6bb2
    isSold:{
        type:Boolean,
        default:false
 
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
