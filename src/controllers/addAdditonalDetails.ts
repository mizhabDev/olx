// controllers/listing.controller.ts
import { Response } from "express";
import mongoose from "mongoose";
import { Product } from "../model/prodectModel";
import { SubCategory } from "../model/subCategoryModel";
import { AuthRequest } from "../types/auth";

export const addAdditionalDetails = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }


    //-----------------------------destructuring -----------------------------

    const { productId } = req.params

    if (typeof productId !== "string") {
      return res.status(400).json({ message: "Invalid productId" });

    }


    if (!productId) {
      return res.status(400).json({
        message: "productId and subCategoryId are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }


    // ------------------------check product is available-----------------------
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }


    // ------------------------ ownership check -----------------------
    if (product.createdBy._id.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to modify this product",
      });
    }


    //-------------------------- check product details available -----------------------
    if (product.subCategory) {
      return res.status(400).json({
        message: "You already added additional details",
      });
    }


    // ------------------------create subcategory-----------------------
    const subCategory = await SubCategory.create({
      productId: product._id,
      category: product.productCatogery,
      subCategory: req.body.subCategory,
      additionalDetails: Array.isArray(req.body.additionalDetails)
        ? req.body.additionalDetails
        : [],

      types:req.body.types
    });

    // ------------------------update product with subcategory id -----------------------
    product.subCategory = subCategory._id;
    await product.save();




    return res.status(201).json({
      message: "Additional details added successfully",
      subCategory,
    });


  } catch (error) {
    console.error("Create Listing Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
