import { Request, Response } from "express";
import { Product } from "../model/prodectModel";

export const getHomePage = async(req:Request,res:Response)=>{

   const product = await Product.find().limit(6);
   console.log(product);
   
   res.status(200).json(product)
 
}