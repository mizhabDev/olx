import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { getHomePage } from "../controllers/pageController";

const router=Router();

router.get('/homePage',verifyToken,getHomePage);


export default router;