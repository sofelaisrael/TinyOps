import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

type SendEmailParams = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail({ to, subject, text, html }: SendEmailParams) {
  const fromName = process.env.FROM_NAME || "TinyOps Dev";
  const from = `${fromName} <${process.env.SMTP_USER}>`;

  return transporter.sendMail({ from, to, subject, text, html });
}
