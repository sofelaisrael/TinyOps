import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const { data: existing, error: selectError } = await supabase
      .from("subscribers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }

    if (selectError) {
      return NextResponse.json({ error: `Select error: ${selectError.message}` }, { status: 500 });
    }

    const { error: insertError } = await supabase
      .from("subscribers")
      .insert({ email });

    if (insertError) {
      const msg =
        insertError.code === "23505"
          ? "Already subscribed"
          : `Insert error (${insertError.code}): ${insertError.message}`;
      return NextResponse.json({ error: msg }, { status: 409 });
    }

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
