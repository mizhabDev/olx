// import { Request } from "express";

// export interface MyRequest extends Request {
//   user?: {
//     id?: string;
//     email?: string;
//     name?: string;
//   };
// }

// import { Request } from 'express';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         _id: string;      
//         email: string;    
//         name?: string;  
//       };
//     }
//   }
// }

// export { };/

import { Request } from "express";
import { Types } from "mongoose";

export interface AuthRequest extends Request {
  user?: {
    _id?: string | Types.ObjectId;
    name?: string;
    email?: string;
  };
}
