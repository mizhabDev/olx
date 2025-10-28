export interface typeUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  otp:string;
  otpExpiry:Date;
  isVerified:Boolean
}
