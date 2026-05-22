"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { track } from "@vercel/analytics";

interface CopyButtonProps {
  text: string;
  slug: string;
}

export function CopyButton({ text, slug }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      track("copy_prompt", { slug });
      console.log(`[Analytics] Tracked copy for: ${slug}`);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
        isCopied
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-400"
      }`}
    >
      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {isCopied ? "Copied" : "Copy"}
    </button>
  );
}
