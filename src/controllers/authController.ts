import { Request, Response } from "express";
import { typeUser } from "../types/user.types";
import { User } from "../model/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail";
import { generateOtp, otpEmailTemplate, passwordResetEmailTemplate } from "../utils/otpGeneration";
import { AuthRequest } from "../types/auth";
import crypto from "crypto";
import dotenv from "dotenv";
import { log } from "console";
dotenv.config()









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
      return res.status(400).json({ message: "The User has been already sign in with google.Sign in with google" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password incorrect" });
    }


    // Create JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email, name: user.name }, // payload
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
      path: "/"
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

    if (existingUser) {
      console.log("User already exist, verify:", existingUser?.isVerified);
      if (!existingUser.isVerified) {
        // 🔹 Resend OTP to unverified user
        const otp = generateOtp();
        const hashOtp = await bcrypt.hash(otp, 10);
        existingUser.otp = hashOtp;
        existingUser.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await existingUser.save();

        console.log("Your new otp:", otp);


        await sendEmail(email, "Welcome to OLX!", otpEmailTemplate(name, otp));


        return res.json({ message: "OTP resent. Please verify your email." });
      }

    }



    //password hashing 
    const hashPass = await bcrypt.hash(password, 10);
    if (!hashPass) {
      console.log("password hashing error");
      return res.status(400).json({ message: "Internal server error" })
    }

    // generating otp
    const otp = generateOtp();
    const hashOtp = await bcrypt.hash(otp, 10);
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
    await sendEmail(
      email,
      "Your OLX OTP Code",
      `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background:#f4f6f8; padding:30px; color:#333;">
    <div style="max-width:500px; margin:auto; background:#fff; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">
      <div style="background:#007bff; color:#fff; padding:15px 20px;">
        <h2 style="margin:0; font-size:20px;">Your OTP Code</h2>
      </div>

      <div style="padding:25px;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your one-time password (OTP) is:</p>

        <div style="text-align:center; margin:20px 0;">
          <div style="display:inline-block; font-size:28px; font-weight:bold; color:#007bff; letter-spacing:3px; background:#f1f1f1; padding:10px 25px; border-radius:8px;">
            ${otp}
          </div>
        </div>

        <div style="text-align:center; margin-top:15px;">
          <a href="#" 
             style="display:inline-block; background:#007bff; color:#fff; padding:10px 25px; border-radius:6px; text-decoration:none; font-weight:600; font-size:14px; cursor:pointer;">
             📋 Copy OTP
          </a>
        </div>

        <p style="margin-top:20px;">This code will expire in <strong>10 minutes</strong>.</p>
        <p>If you didn’t request this, please ignore this email.</p>
      </div>

      <div style="background:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#777;">
        © ${new Date().getFullYear()} OLX. All rights reserved.
      </div>
    </div>
  </div>
  `
    );


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




export const verifyOtp = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "Request body is empty" });
      return;
    }


    const { email, otp } = req.body;
    console.log(req.body);



    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // If both exist, continue
    console.log("Email:", email);
    console.log("OTP:", otp);


    // 1 Check if user exists 
    const user = await User.findOne({ email });
    console.log(`Trying to verify the otp form this email: ${email} otp reached: ${otp}`);


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
    const isMatch = await bcrypt.compare(otp, user.otp);
    console.log("isMatch in otp verify", isMatch);
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
      { _id: user._id, email: user.email, name: user.name }, // payload
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    console.log(`token recived:
      ${token}
    -----------------`);


    // Store in secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
      path: "/"
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




export const googleCallback = (req: AuthRequest, res: Response) => {
  try {
    const userData = req.user as any;

    console.log("User received in googleCallback", userData);

    if (!userData || !userData.token) {
      return res.redirect("/login");
    }

    console.log("user true");


    const { token } = userData;
    console.log("your tken is :",token);

    // Store JWT token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour 
      path: "/"
    });

    console.log(`
      token recived from google callback: ${token}
    ---------------`);

   return res.redirect("http://localhost:5173/oauth-success");




  } catch (error) {
    console.error("Google login error:", error);
    return res.redirect("/login");
  }
};   
     







export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!user.isVerified) {
      return res.status(404).json({ success: false, message: "User not verified" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and save in DB (safer)
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    // Create reset link (from environment variable)
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const resetURL = `${baseUrl.replace(/\/$/, "")}/api/auth/reset-password/${hashedToken}`;


    console.log("Password reset URL:", resetURL);


    //  Reset Email password
    await sendEmail(
      email,
      "Password Reset Request",
      passwordResetEmailTemplate(user.name, resetURL)
    );



    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email.",
    });

  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// 🔹 Step 2: Reset password
export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.params;
    log(req.body)
    const { newPassword } = req.body || {};
    console.log(token, newPassword);

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required"
      });
    }


    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    const hashPass = await bcrypt.hash(newPassword, 10);

    user.password = hashPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




// export const updateUser = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: "Invalid user ID format" });
//     }

//     const updatedUser = await User.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     }).select("-password -otp");

//     if (!updatedUser) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: updatedUser,
//     });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };








// export const deleteUser = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: "Invalid user ID format" });
//     }

//     const user = await User.findByIdAndDelete(id);

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// }; 