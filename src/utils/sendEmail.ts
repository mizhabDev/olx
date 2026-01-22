import { Resend } from "resend";
import "dotenv/config";

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const { data, error } = await resend.emails.send({
      // Until you verify a domain, use 'onboarding@resend.dev'
      from: "Sellzy <onboarding@resend.dev>", 
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Email failed ❌:", error);
      return;
    }

    console.log("Email sent successfully ✅:", data?.id);
  } catch (err) {
    console.error("Unexpected error while sending email:", err);
  }
};