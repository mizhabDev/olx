import express, { Request, Response } from "express";

import { AuthRequest } from "../types/auth";
import { log } from "console";
import { User } from "../model/userModel";
import { Admin } from "../model/adminModel";
const router = express.Router();

import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/authMiddleware";

router.get("/login", (req, res) => {
  res.render("login")
})


router.get("/admin", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    // ✅ Fetch all users from olxdb
    const users = await User.find({}, { email: 1, _id: 0 });

    // ✅ Render admin page with user list
    res.render("admin-slt-email", {
      users // pass to EJS
    });
    log(users)
  } catch (error) {
    console.error("Error loading admin page:", error);
    res.status(500).send("Internal Server Error");
  }
});

 




router.get("/chat/:id", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const emailId = req.params.id;

    // Fetch the user from DB
    const user = await User.findOne({ email: emailId });

    if (!user) {
      return res.status(404).send("User not found");
    }

    log(user)
    // Render chatRoom
    res.render("admin-chat", { user ,admin:{
      email:"adminOlx@gmail.com"
    }});
  } catch (error) {
    console.error("Error loading chat page:", error);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/user", verifyToken, (req: AuthRequest, res: Response) => {
  try {
    const user = req?.user;

    // ✅ 1. Validate user presence
    if (!user || !user.email ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User information missing or invalid.",
      });
    }

    // ✅ 2. Render chat page
    return res.render("user-chat", {
      user: {
        name: user.name,
        email: user.email,
      },
      admin: {
        name: "AdminOlx",
        email: "adminOlx@gmail.com",
      },
    });
  } catch (error) {
    console.error("❌ Error rendering user chat:", error);

    // ✅ 3. Send safe fallback JSON response
    return res.status(500).json({
      success: false,
      message: "Internal server error while loading chat."
    });
  }
});




router.get("/admin-login", (req, res) => {
  res.render("admin-login", {
    message: "welcome admin"
  })
})




router.post("/admin-login", async (req: Request, res: Response) => {
  console.log("Admin login request body:", req.body);

  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      log("admin not found")
      return res.render("admin-login", { message: "Admin not found!" });
    }

    // ✅ FIXED: password check should be "!=="
    if (password !== admin.password) {
      return res.render("admin-login", { message: "Invalid password!" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    console.log("Admin logged in successfully, token:", token);

    // ✅ You can redirect to dashboard or send a success message
    return res.render("admin-login", { message: "Admin login success!" });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.render("admin-login", { message: "Error occurred!" });
  }
});




export default router;


