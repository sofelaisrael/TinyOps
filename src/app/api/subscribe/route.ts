import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import fs from "fs";

const SUBSCRIBERS_PATH = "/tmp/tinyops-subscribers.json";

function getSubscribers(): string[] {
  try {
    if (fs.existsSync(SUBSCRIBERS_PATH)) {
      return JSON.parse(fs.readFileSync(SUBSCRIBERS_PATH, "utf8"));
    }
  } catch {}
  return [];
}

function saveSubscriber(email: string) {
  const subs = getSubscribers();
  if (!subs.includes(email)) {
    subs.push(email);
    fs.writeFileSync(SUBSCRIBERS_PATH, JSON.stringify(subs, null, 2));
  }
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const subscribers = getSubscribers();
    if (subscribers.includes(email)) {
      return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }

    saveSubscriber(email);

    await Promise.all([
      sendEmail({
        to: process.env.ADMIN_EMAIL || "sofelaisrael3@gmail.com",
        subject: "New TinyOps Subscriber",
        text: `New subscriber: ${email}`,
      }),
      sendEmail({
        to: email,
        subject: "Welcome to TinyOps!",
        text: [
          "Hey there,",
          "",
          "Thanks for subscribing to TinyOps!",
          "",
          "You'll now receive fresh CI/CD prompts delivered to your inbox every Tuesday.",
          "No fluff, no spam — just battle-tested workflows for Vercel & GitHub Actions.",
          "",
          "In the meantime, check out the full library:",
          "https://tinyops.vercel.app",
          "",
          "— TinyOps Dev Team",
        ].join("\n"),
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
