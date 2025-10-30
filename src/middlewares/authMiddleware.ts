import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


interface JwtPayload {
  id: string;
  email: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded; // now _id and email are known
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
