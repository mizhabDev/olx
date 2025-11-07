import express, { Response } from "express";

import { AuthRequest } from "../types/auth";
import { log } from "console";
import { User } from "../model/userModel";

const router = express.Router();


  
export const  adminChatPage = async (req: AuthRequest, res: Response) => {
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
      email:"adminolx@gmail.com"
    }});
  } catch (error) {
    console.error("Error loading chat page:", error);
    res.status(500).send("Internal Server Error");
  }
};


export const userChat = (req: AuthRequest, res: Response) => {
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
        email: "adminolx@gmail.com",
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
};














export default router;


