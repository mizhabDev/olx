import { Request, Response } from "express";
import { typeUser } from "../types/user.types";
import { User } from "../model/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";




export const userExist = async (req: Request<{}, {}, typeUser>, res: Response): Promise<any> => {

  try {
    const { password, email } = req.body;
    if (!email && !password) {
      return res.json({ message: "email and password required" });
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not exist" });
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password incorrect" });
    }
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, // payload
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    console.log(token);
    

    // Store in secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, 
    });


    return res.status(200).json({ message: "Login successfully",token });
  } catch (error) {

  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    console.log(`New user has been created: 
      Name= ${name}, 
      Email= ${email}, 
      Password= ${password}`
    );

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }
    const hashPass = await bcrypt.hash("password", 10);//password hashing 
    if (!hashPass) {
      console.log("password hashing error");
      return res.status(400).json({ message: "Internal server error" })
    }


    const newUser = new User({
      name,
      email,
      password: hashPass
    })
    await newUser.save();
    return res.status(200).json({ message: "user created successfully", name, email })//no error send this one
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json("Email already exists");
    }
    return res.status(400).json(`error found while creating new user ${error.message}`);

  }

}