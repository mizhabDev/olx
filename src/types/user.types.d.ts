

export interface typeUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  photo?: string;
  createdAt?: Date;
  otp?: string;
  otpExpiry?: Date;
  isVerified: boolean;
  wishlist?: Types.ObjectId[];
}

