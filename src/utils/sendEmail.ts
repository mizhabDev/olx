
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
    });

    await transporter.sendMail({
      from: `"Sellzy" <${process.env.APP_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully ✅");
  } catch (error) {
    console.error("Email sending failed ❌:", error);
    throw error;
  }
};
