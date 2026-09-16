import { Resend } from "resend";
import verifyEmailTemplate from "./verifyEmailTemplate.js";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Vérifiez votre adresse email",
    html: verifyEmailTemplate(verificationUrl),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export { resend, sendVerificationEmail };
