import { Bot } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-neutral-900">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1 text-white text-sm font-semibold tracking-tight">
              <Bot className="size-4" />
              TinyOps
            </Link>
            <span className="text-neutral-600 text-xs hidden sm:inline">·</span>
            <small className="text-neutral-500 text-xs hidden sm:block">
              &copy; {new Date().getFullYear()} TinyOps. All Rights Reserved.
            </small>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <a
              href="https://github.com/syntax-devv/TinyOps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://github.com/syntax-devv/TinyOps/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Issues
            </a>
            <a
              href="mailto:sofelaisrael3@gmail.com"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="sm:hidden pb-3 text-center">
          <small className="text-neutral-500 text-xs">
            &copy; {new Date().getFullYear()} TinyOps. All Rights Reserved.
          </small>
        </div>
      </div>
    </footer>
  );
}
