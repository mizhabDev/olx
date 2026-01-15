import { RequestHandler, Response } from "express";
import { Product } from "../model/prodectModel";
import { AuthRequest } from "../types/auth";
import mongoose from "mongoose";
import { Order } from "../model/orderModel";
import { Express } from "express";
import uploadToCloudinary from "../utils/cloudinaryHelper";
import cloudinary from "../config/cloudinary";


export const createProduct: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    console.log("req.files:", authReq.files);
    console.log("req.body:", authReq.body);

    if (!authReq.user?._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    //  Ensure req.body exists and is not empty
    if (!authReq.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request body cannot be empty",
      });
    }

    const { productName, productPrice, productLocation, productCatogery, productDescription } = req.body;
    console.log("user details fron createProduct", authReq.user);
    console.log("product details", req.body);



    const files = authReq.files as Express.Multer.File[];
    console.log("files", files);

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "At least one product image is required",
      });
    }

    const uploadedImages = await Promise.all(
      files.map((file) => uploadToCloudinary(file))
    );


    if (
      productName == null ||
      productPrice == null ||
      productLocation == null ||
      productCatogery == null ||
      productDescription == null
    ) {
      return res.status(400).json({
        message: "Missing required product fields",
      });
    }

    console.log("this is imagePath :", uploadedImages);
    console.log("Uploaded files count:", files.length);

    const newProduct = new Product({
      productName,
      productPrice,
      productLocation,
      productPhotoSrc: uploadedImages.map(img => ({
        url: img.secure_url,
        public_id: img.public_id,
      })),
      productCatogery,
      productDescription,
      createdBy: {
        _id: authReq.user?._id,
      },
    });

    await newProduct.save();

    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Interal Server Error" });
  }
};

// Get Single Product by ID
export const getProductDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID format" });
    }

    // Fetch the product from MongoDB
    const product = await Product.findById(id).populate("subCategory");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
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
      return res
        .status(401)
        .json({ message: "Unauthorized: Please login first" });
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
      return res
        .status(401)
        .json({ message: "Unauthorized: Please login first" });
    }
    if (!product.createdBy._id) {
      console.log("created id not find");
      return res.status(401).json({ message: "created id not found" });
    }

    if (product.createdBy._id.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot buy your own product" });
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


// Delete Product by ID
export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const id = req.params.id as string;

    // Check if user is authenticated
    if (!authReq.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Validate ID format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID format" });
    }

    // Find the product
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if the user owns this product
    if (product.createdBy._id?.toString() !== authReq.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only delete your own products" });
    }

    for (const img of product.productPhotoSrc) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    // Delete the product
    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
