import { Request, Response } from "express";
import { Product } from "../model/prodectModel";
import { IProduct } from "../types/product.types";



export const createProduct = async(req: Request<{}, {}, IProduct>, res: Response) => {

 try {
  const { productName,
    productPrice,
    productLocation,
    productPhotoSrc } = req.body;


  const newProduct = new Product({
    productName,
    productPrice,
    productLocation,
    productPhotoSrc
  });  

  await newProduct.save();

  res.status(201).json({ message: "Product created", product: newProduct });}

catch (error) {
  console.error(error);
  res.status(500).json({ message: "Interal Server Error" });
}};



export const  getProduct = async (req:Request,res:Response)=>{
  try {
    const data = await Product.find();
    res.json(data);
  } catch (error) {
    console.log("some thing error has happened in get product function ", error);
  }
}  