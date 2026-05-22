import Link from "next/link";
import { GitBranch, TerminalSquare } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SubmitPrompt } from "@/components/submit-prompt";

export function Header() {
  return (
    <header className="border-b border-neutral-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-neutral-900 hover:text-neutral-600 transition-colors">
          <TerminalSquare className="w-5 h-5" />
          <span className="font-bold tracking-tight text-base">TinyOps</span>
        </Link>
        <nav className="flex items-center gap-3">
          <SubmitPrompt />
          <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
          <Link
            href="https://github.com/yourusername/tinyops"
            target="_blank"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-neutral-400 hover:text-neutral-900 hover:bg-transparent h-9 w-9")}
          >
            <GitBranch className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
