import { NextResponse } from "next/server";
import { getAllPrompts } from "@/lib/mdx";

export async function GET() {
  const prompts = getAllPrompts();
  return NextResponse.json(prompts, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
