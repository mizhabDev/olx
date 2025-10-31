import { Request, Response } from "express";
import { Product } from "../model/prodectModel";
import { IProduct } from "../types/product.types";
import { AuthRequest } from "../types/auth";




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



