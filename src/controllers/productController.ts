import { Response } from "express";
import { Product } from "../model/prodectModel";
import { AuthRequest } from "../types/auth";
import mongoose from "mongoose";
import { Order } from "../model/orderModel";




export const createProduct = async (req: AuthRequest, res: Response) => {

  try {

    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    //  Ensure req.body exists and is not empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body cannot be empty"
      });
    }


    const {
      productName,
      productPrice,
      productLocation,
      productPhotoSrc,
      productCatogery,
    } = req.body;
    console.log("user details fron createProduct", req.user);

    if (!productName || !productPrice || !productLocation || !productCatogery) {
      return res.status(400).json({
        message: "Missing required product fields"
      });
    }




    const newProduct = new Product({
      productName,
      productPrice,
      productLocation,
      productPhotoSrc,
      productCatogery,
      createdBy: {
        _id: req.user?._id,
        email: req.user?.email
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


export const buyProduct = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: Please login first" });
    }

    const userId = req.user._id;

    const { productId } = req.body;
    console.log("this is from request body", req.body);


    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.isSold) {
      return res.status(400).json({ message: "Product already sold" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: Please login first" });
    }
    if (!product.createdBy._id) {
      console.log("created id not find");
      return res.status(401).json({ message: "created id not found" });
    }

    if (product.createdBy._id.toString() === userId.toString()) {
      return res.status(400).json({ message: "You cannot buy your own product" });
    }

    // Create order 
    const order = await Order.create({
      buyer: userId,
      seller: product.createdBy._id,
      product: product._id,
      price: product.productPrice,
      status: "completed",
    });

    // Mark product as sold
    product.isSold = true;
    await product.save();

    return res.status(200).json({
      message: "Product purchased successfully",
      order,
    });
  } catch (error) {
    console.error("Buy Product Error:", error);
    return res.status(500).json({ message: "from here  Server Error", error });
  }
};
