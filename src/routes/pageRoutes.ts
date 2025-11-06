import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import {
    getAdminLoginPage,
    getHomePage,
    getLoginPage,
    getSelectEmail,
    postAdminDetails
} from "../controllers/pageController";

const router = Router();

router.get('/homePage', verifyToken, getHomePage);
router.get('/login', getLoginPage);
router.get('/selectEmail', verifyToken, getSelectEmail);
router.get('/admin-login',getAdminLoginPage);
router.post('/admin-login',postAdminDetails);




export default router;