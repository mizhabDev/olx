
import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { getUserDetails } from "../controllers/userController";
const router = Router()


//get user details

router.get('/userDetails',verifyToken,getUserDetails);

export default router