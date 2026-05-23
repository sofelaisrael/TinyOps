import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { title, description, category, name, email } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const { error: insertError } = await supabase
      .from("suggestions")
      .insert({ title, description, category, name, email });

    if (insertError) {
      return NextResponse.json({ error: `Insert error (${insertError.code}): ${insertError.message}` }, { status: 500 });
    }

    const text = [
      `Title: ${title}`,
      `Category: ${category || "None"}`,
      `Description: ${description || "None"}`,
      `Submitted by: ${name || "Anonymous"} (${email || "no email"})`,
    ].join("\n");

    await sendEmail({
      to: process.env.ADMIN_EMAIL || "sofelaisrael3@gmail.com",
      subject: `New Prompt Suggestion: ${title}`,
      text,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
