import { Request, Response } from "express";
import { User } from "../model/userModel";
import { MyRequest } from "../types/auth";



// ✅ Add to Wishlist
export const addToWishlist = async (req: MyRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized User should be loggin first" });
        }
        console.log("the user", req.user);

        const userId = req.user.id; // assuming user authenticated
        console.log("Adding wishlist to", userId);

        const { productId } = req.body;
        console.log("Adding product id:", productId);

        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { wishlist: productId } }, // prevents duplicates
            { new: true }
        );

        res.status(200).json({ message: "Product added to wishlist" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding to wishlist" });
    }
};

// 💔 Remove from Wishlist
export const removeFromWishlist = async (req: MyRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.body;

        await User.findByIdAndUpdate(
            userId,
            { $pull: { wishlist: productId } },
            { new: true }
        );

        res.status(200).json({ message: "Product removed from wishlist" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing from wishlist" });
    }
};

// 👀 Get Wishlist
export const getWishlist = async (req: MyRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = req.user.id;
        const user = await User.findById(userId).populate("wishlist");

        // 🟢 Check if user is null
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.wishlist || user.wishlist.length === 0) {
            // 🟡 when wishlist is empty
            return res.status(200).json({
                message: "Your wishlist is empty",
                wishlist: [],
            });
        }

        // ✅ when wishlist has items
        return res.status(200).json({
            message: "Wishlist fetched successfully",
            wishlist: user.wishlist,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching wishlist" });
    }
};
