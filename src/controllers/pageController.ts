import { Request, Response } from "express";
import { Product } from "../model/prodectModel";
import { AuthRequest } from "../types/auth";
import { log } from "console";
import { User } from "../model/userModel";
import jwt from "jsonwebtoken";
import { Admin } from "../model/adminModel";
import { Order } from "../model/orderModel";
import mongoose from "mongoose";


export const getHomePage = async (req: Request, res: Response) => {
  try {
    const { search, location, minPrice, maxPrice, price } = req.query;
    const filter: any = {};

    //  Text search (name or category)
    if (search && typeof search === "string") {
      filter.$or = [
        { productName: { $regex: search.trim(), $options: "i" } },
        { productCatogery: { $regex: search.trim(), $options: "i" } },
      ];
    }

    //  Location filter
    if (location && typeof location === "string") {
      filter.productLocation = { $regex: location.trim(), $options: "i" };
    }

    //  Price filter
    if (price) {
      // If user searches for exact price (e.g. /homePage?price=500)
      filter.productPrice = Number(price);
    } else if (minPrice || maxPrice) {
      // Range-based filter
      filter.productPrice = {};
      if (minPrice) filter.productPrice.$gte = Number(minPrice);
      if (maxPrice) filter.productPrice.$lte = Number(maxPrice);
    }

    //  Fetch data
    const products = await Product.find(filter).limit(6);
    res.status(200).json(products);

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getLoginPage = (req: Request, res: Response) => {
  res.render("login")
};



export const getSelectEmail = async (req: AuthRequest, res: Response) => {
  try {
    // ✅ Fetch all users from olxdb
    const users = await User.find({}, { email: 1, _id: 0 });

    // ✅ Render admin page with user list
    res.render("admin-slt-email", {
      users
    });
    log(users)
  } catch (error) {
    console.error("Error loading admin page:", error);
    res.status(500).send("Internal Server Error");
  }
};


export const getAdminLoginPage = (req: AuthRequest, res: Response) => {
  res.render("admin-login", {
    message: "welcome admin"
  })
};



export const postAdminDetails = async (req: Request, res: Response) => {
  console.log("Admin login request body:", req.body);

  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      log("admin not found")
      return res.render("admin-login", { message: "Admin not found!" });
    }

    // ✅ FIXED: password check should be "!=="
    if (password !== admin.password) {
      return res.render("admin-login", { message: "Invalid password!" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    console.log("Admin logged in successfully, token:", token);

    // ✅ You can redirect to dashboard or send a success message
    return res.render("admin-login", { message: "Admin login success!" });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.render("admin-login", { message: "Error occurred!" });
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


