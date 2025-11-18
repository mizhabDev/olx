
import {
    buyProduct,
    createProduct,
    getProductDetails
}  from "../controllers/productController";

import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();






// post router
router.post('/', verifyToken,createProduct);
router.get('/buy',verifyToken,buyProduct)
router.get("/:id", verifyToken,getProductDetails);




export default router;

  