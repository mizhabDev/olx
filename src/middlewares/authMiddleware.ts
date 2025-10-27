import { NextFunction, Response, } from "express";
import jwt from "jsonwebtoken";
import { MyRequest } from "../types/auth";

export const verifyToken = (req:MyRequest, res:Response, next:NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
    console.log("token recived",token);
    

    if (!token) {
      return res.status(401).json({ message: "Access denied, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("token try to decode",decoded);
    
    req.user = decoded; // store user info in req
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
