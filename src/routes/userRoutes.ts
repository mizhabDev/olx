import {
    userExist,
    createUser,
    verifyOtp
}  from "../controllers/userController";
import { Router } from "express";
const router = Router();


// get router
router.get('/login', userExist);



// post router
router.post('/register', createUser);
router.post('/verifyOtp',verifyOtp)


export default router;

