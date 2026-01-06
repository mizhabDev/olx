import { Request, Response } from "express";
import { Product } from "../model/prodectModel";
import { AuthRequest } from "../types/auth";
import { log } from "console";
import { User } from "../model/userModel";
import jwt from "jsonwebtoken";
import { Admin } from "../model/adminModel";
import { Page } from "../model/pageModel";

export const getHomePage = async (req: Request, res: Response) => {
  try {
    const {
      search,
      location,
      minPrice,
      maxPrice,
      price,
      page = "1",
    } = req.query;
    const filter: any = {};

    const pageNumber = Number(page);
    const limit = 16;
    const skip = (pageNumber - 1) * limit;

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

    // Total count
    const totalItems = await Product.countDocuments(filter);

    // Fetch paginated data
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalItems / limit);
    const hasMore = pageNumber < totalPages

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalItems,
        limit,
        hasMore,
      },
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLoginPage = (req: Request, res: Response) => {
  res.render("login");
};

export const getSelectEmail = async (req: AuthRequest, res: Response) => {
  try {
    // ✅ Fetch all users from olxdb
    const users = await User.find({}, { email: 1, _id: 0 });

    // ✅ Render admin page with user list
    res.render("admin-slt-email", {
      users,
    });
    log(users);
  } catch (error) {
    console.error("Error loading admin page:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getAdminLoginPage = (req: AuthRequest, res: Response) => {
  res.render("admin-login", {
    message: "welcome admin",
  });
};

export const postAdminDetails = async (req: Request, res: Response) => {
  console.log("Admin login request body:", req.body);

  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      log("admin not found");
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

export const getPage = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const page = await Page.findOne({ slug });

    if (!page) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    res.status(200).json({ success: true, data: page });
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
