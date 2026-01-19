
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {


    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
      connectionTimeout: 20000,
    });

    const info = await transporter.sendMail({
      from: `"olx" <${process.env.APP_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully ✅:", info.messageId);
  } catch (error) {
    console.log("Email sent failed ❌:", error);
  }
};



