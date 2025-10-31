
import {
  
    createProduct
}  from "../controllers/productController";

import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
const router = Router();






// post router
router.post('/', verifyToken,createProduct);


export default router;

