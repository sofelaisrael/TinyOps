import { Bot } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-0.5 text-[15px] font-black tracking-tight text-neutral-900">
      <span>Tiny</span>
      <Bot className="size-[1em] -translate-y-[0.03em]" />
      <span>ps</span>
    </Link>
  );
}
