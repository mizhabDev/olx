import { NextFunction, Response } from "express";
import { decodeToken } from "../utils/jwt";
import { AuthRequest } from "../types/auth";




export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token =req.cookies?.token || req.headers.authorization?.split(" ")[1];
    console.log("verify token", token);
    

    if (!token) {
      return res.status(401).json({ message: "Access denied, no token provided" });
    }

    req.user = decodeToken(token); 
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
