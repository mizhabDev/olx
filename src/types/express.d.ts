import { Types } from "mongoose";

declare global {
  namespace Express {
    // Express.User is the user object stored by passport on req.user
    interface User {
      _id: Types.ObjectId | string;
      name?: string;
      email?: string;
      wishlist?: Types.ObjectId[];
      token?: string; // optional token if you attach one
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
