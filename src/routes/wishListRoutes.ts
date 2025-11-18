
import { Router } from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishListController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", verifyToken, getWishlist);                 //get wishlist page 
router.post("/add/:productId", verifyToken, addToWishlist);           //add wishlist product
router.delete("/remove/:productId", verifyToken, removeFromWishlist); //delete wishlist product


export default router;
