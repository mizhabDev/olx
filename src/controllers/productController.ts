import { Request, Response } from "express";
import { Product } from "../model/prodectModel";
import { IProduct } from "../types/product.types";



export const createProduct = async (req: Request<{}, {}, IProduct>, res: Response) => {

  try {
    const { productName,
      productPrice,
      productLocation,
      productPhotoSrc,
      productCatogery,
    } = req.body;
    console.log(req.user);
    

    const newProduct = new Product({
      productName,
      productPrice,
      productLocation,
      productPhotoSrc,
      productCatogery,
      createdBy: {
        _id: "userName"
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



