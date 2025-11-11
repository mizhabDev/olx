import { Response } from "express";
import { Product } from "../model/prodectModel";
import { AuthRequest } from "../types/auth";
import mongoose from "mongoose";




export const createProduct = async (req: AuthRequest, res: Response) => {

  try {

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const { productName,
      productPrice,
      productLocation,
      productPhotoSrc,
      productCatogery,
    } = req.body;
    console.log( "user details fron createProduct",req.user);
    

    const newProduct = new Product({
      productName,
      productPrice,
      productLocation,
      productPhotoSrc,
      productCatogery,
      createdBy: {
        _id: req.user?._id,
        email:req.user?.email
      }
    });

    await newProduct.save();

    res.status(201).json({ message: "Product created", product: newProduct });
  }

  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Interal Server Error" });
  }
};




// Get Single Product by ID
export const getProductDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID format" });
    }

    // Fetch the product from MongoDB
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
