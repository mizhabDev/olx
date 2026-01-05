import { Response } from "express";
import { AuthRequest } from "../types/auth";
import { User } from "../model/userModel";



export const getUserDetails = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no user found in token",
      });
    }

    const userId = req.user._id;

    // Fetch user details from database (excluding sensitive fields like password)
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send user data
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
