import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    await resend.emails.send({
      from: "Sellzy <onboarding@resend.dev>", // works immediately
      to,
      subject,
      html,
    });

    console.log("Email sent successfully ✅");
  } catch (error) {
    console.error("Email sending failed ❌:", error);
    throw error; // IMPORTANT
  }
};
