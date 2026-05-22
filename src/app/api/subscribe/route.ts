import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    await sendEmail({
      to: process.env.ADMIN_EMAIL || "sofelaisrael3@gmail.com",
      subject: "New TinyOps Subscriber",
      text: `New subscriber: ${email}`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
