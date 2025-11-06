import mongoose, { Document } from "mongoose";


export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
}

const adminSchema = new mongoose.Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


export const Admin = mongoose.model<IAdmin>("Admins", adminSchema);
