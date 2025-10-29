import { Request, Response } from "express";
import { typeUser } from "../types/user.types";
import { User } from "../model/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail";
import { generateOtp } from "../utils/otpGeneration";



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

    if (user.isVerified === false) {
      return res.status(400).json({
        success: false,
        message: "Your email is not verified. Please verify your account before logging in.",
      });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!user.password) {
      return res.status(400).json({ message: "User has no Password google sign required" });
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


    return res.status(200).json({ message: "Login successfully", token });
  } catch (error) {

  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const otpExpiry = Date.now() + 5 * 60 * 1000;
    const { name, email, password } = req.body;

    console.log(`New user has been created: 
      Name= ${name}, 
      Email= ${email}, 
      Password= ${password}`
    );


    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    console.log(existingUser?.isVerified);

    if (existingUser) {
      if (!existingUser.isVerified) {
        // 🔹 Resend OTP to unverified user
        const otp = generateOtp();
        existingUser.otp = otp;
        existingUser.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await existingUser.save();

        await sendEmail(email, "Verify your email - OTP", `Your OTP code is ${otp}`);

        return res.json({ message: "OTP resent. Please verify your email." });
      }

    }



    //password hashing 
    const hashPass = await bcrypt.hash("password", 10);
    if (!hashPass) {
      console.log("password hashing error");
      return res.status(400).json({ message: "Internal server error" })
    }

    // generating otp
    const otp = generateOtp();
    const hashOtp = await bcrypt.hash("otp", 10);
    if (!hashOtp) {
      console.log("password hashing error");
      return res.status(400).json({ message: "Internal server error" })
    }


    const newUser = new User({
      name,
      email,
      password: hashPass,
      otp: hashOtp,
      otpExpiry,
      isVerified: false
    })
    await newUser.save();

    // sending Otp email
    await sendEmail(email, "Welcome!", `Hi ${name}, welcome to our app. Your OTP code is ${otp}`);
    console.log("The otp is generated succesfully:", otp);


    return res.status(200).json({ message: "Otp send to your email ", name, email })

  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json("Email already exists");
    }
    console.log(`error found while creating new user ${error.message}`);

    return res.status(400).json(`error found while creating new user ${error.message}`);

  }
}




export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    // 1 Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    //  Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified. Please login.",
      });
    }

    //  Check OTP validity
    if (!user.otp) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
    }
    const isMatch = bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }


    //  If all good → verify user
    await User.updateOne(
      { email: email },
      {
        $unset: { otp: "", otpExpiry: "" }, // removes both fields
        $set: { isVerified: true }
      }
    );

    await user.save();

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




    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });

  } catch (error: any) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};




export const googleCallback = (req: Request, res: Response) => {
  try {
    const userData = req.user as any;

    console.log("User received in googleCallback", userData);

    if (!userData || !userData.user || !userData.token) {
      return res.redirect("/login");
    }

    const { token } = userData;

    // Store JWT token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    console.log(`token recived: ${token}
    ---------------`);

    return res.redirect("/success");



  } catch (error) {
    console.error("Google login error:", error);
    return res.redirect("/login");
  }
};
