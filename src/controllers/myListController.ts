import { RequestHandler } from "express";
import { Product } from "../model/prodectModel";
import { AuthRequest } from "../types/auth";

export const getMyListings: RequestHandler = async (req, res) => {
    try {
        const authReq = req as AuthRequest;
        console.log(authReq.user);

        if (!authReq.user?._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const listings = await Product.find({
            "createdBy._id": authReq.user._id.toString(),
        }).sort({ createdAt: -1 })
            .select(
                "_id productName productPrice productPhotoSrc productCatogery createdAt status "
            );




        console.log(listings);

        return res.status(200).json({
            count: listings.length,
            listings,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
