
import {
    getProduct,
    createProduct
}  from "../controllers/productController";

import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
const router = Router();


// get router
router.get('/',verifyToken, getProduct);



// post router
router.post('/', createProduct);


export default router;

