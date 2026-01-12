
import {
    buyProduct,
    createProduct,
    getProductDetails,
    deleteProduct
} from "../controllers/productController";

import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { uploadProductImage } from "../middlewares/upload";

const router = Router();






// post router
router.post('/', verifyToken, uploadProductImage.array("productImage"), createProduct);

router.post('/buy', verifyToken, buyProduct)
router.get("/:id", verifyToken, getProductDetails);
router.delete("/:id", verifyToken, deleteProduct);




export default router;

