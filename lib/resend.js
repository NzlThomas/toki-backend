import { Resend } from "resend";
import verifyEmailTemplate from "./verifyEmailTemplate.js";
import resetPasswordTemplate from "./resetPasswordTemplate.js";

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

async function sendResetPasswordEmail(email, token) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Réinitialisez votre mot de passe",
    html: resetPasswordTemplate(resetUrl),
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export { resend, sendVerificationEmail, sendResetPasswordEmail };
