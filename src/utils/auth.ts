import jwt from "jsonwebtoken";

interface JwtPayload {
  _id: string;
  email: string;
}

export function decodeToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    return decoded;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
