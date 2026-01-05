import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import {
    getAdminLoginPage,
    getHomePage,
    getLoginPage,
    getPage,
    getSelectEmail,
    postAdminDetails
} from "../controllers/pageController";

const router = Router();

<<<<<<< HEAD
router.get('/homePage', getHomePage);
=======
router.get('/homePage', verifyToken, getHomePage);
>>>>>>> 3d134bec2c95c644ba27a7994033fba0c7fd6bb2
router.get('/login', getLoginPage);
router.get('/selectEmail', verifyToken, getSelectEmail);
router.get('/admin-login',getAdminLoginPage);
router.post('/admin-login',postAdminDetails);
router.get ('/:slug',verifyToken,getPage);





export default router;