import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
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
  const smtpUser = process.env.SMTP_USER || "";
  if (!smtpUser) {
    console.warn("SMTP_USER not configured — skipping email");
    return;
  }

  const fromName = process.env.FROM_NAME || "TinyOps Dev Team";
  const from = `${fromName} <${smtpUser}>`;

  try {
    await transporter.sendMail({ from, to, subject, text, html });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}
