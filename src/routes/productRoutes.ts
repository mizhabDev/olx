import {
    getProduct,
    createProduct
}  from "../controllers/productController";

import { Router } from "express";
const router = Router();


// get router
router.get('/', getProduct);



// post router
router.post('/', createProduct);


export default router;

