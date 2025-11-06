import passport from "passport";
import {
    userExist,
    createUser,
    verifyOtp,
    googleCallback
}  from "../controllers/userController";
import { Router } from "express";
const router = Router();


// get router
router.post('/login', userExist);

//  Route to start Google login
router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));

//  Callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleCallback
);


// post router
router.post('/register', createUser);
router.post('/verifyOtp',verifyOtp)


export default router;

