import passport from "passport";
import {
    userExist,
    createUser,
    verifyOtp,
    googleCallback,
    forgotPassword,
    resetPassword
}  from "../controllers/authController";
import { Router } from "express";
import jwt from "jsonwebtoken";
const router = Router();



// user authentication handling router
router.post('/register', createUser);
router.post('/login', userExist);
router.post('/verifyOtp',verifyOtp);

//  Route to start Google login
router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));

//  Callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleCallback
);


router.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    res.json(decoded);
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});


router.get('/forgetPassword',forgotPassword);
router.post("/reset-password/:token", resetPassword);



export default router;

 