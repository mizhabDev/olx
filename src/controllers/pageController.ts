import { Request, Response } from "express";
import { Product } from "../model/prodectModel";

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
