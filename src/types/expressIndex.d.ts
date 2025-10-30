import { IUser } from "../model/userModel";

declare global {
  namespace Express {
    interface User extends IUser {
      _id: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
