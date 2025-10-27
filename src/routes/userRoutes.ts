import {
    userExist,
    createUser
}  from "../controllers/userController";
import { Router } from "express";
const router = Router();


// get router
router.get('/login', userExist);



// post router
router.post('/register', createUser);


export default router;

