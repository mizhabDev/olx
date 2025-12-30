import { Request } from "express";
import { Types } from "mongoose";

export interface AuthRequest extends Request {
  user?: {
    _id?: string | Types.ObjectId;
    name?: string;
    email?: string;
  };

  file?: Express.Multer.File;

  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] };
}
