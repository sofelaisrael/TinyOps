import Link from "next/link";
import { Rocket, ArrowLeft, ExternalLink } from "lucide-react";
import fs from "fs";
import path from "path";

function loadSvg(filePath: string): string {
  try {
    const full = path.join(process.cwd(), "public", "illustrations", filePath);
    if (!fs.existsSync(full)) return "";
    let svg = fs.readFileSync(full, "utf8");
    const start = svg.indexOf("<svg");
    const end = svg.indexOf("</svg>") + 6;
    if (start === -1 || end <= start) return "";
    svg = svg.slice(start, end);
    const defsStart = svg.indexOf("<defs>");
    const defsEnd = svg.indexOf("</defs>") + 7;
    if (defsStart !== -1 && defsEnd > defsStart) {
      svg = svg.slice(0, defsStart) + svg.slice(defsEnd);
    }
    return svg;
  } catch {
    return "";
  }
}

export default function NotFound() {
  const astronautSvg = loadSvg("astronaut.svg");

  return (
    <div className="min-h-screen bg-[#EDEBE7] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="relative mb-10 inline-block">
          <div className="absolute -top-4 -left-4 w-full h-full bg-neutral-200 rounded-[2rem] -rotate-3" />
          <div className="absolute -bottom-2 -right-2 w-full h-full bg-neutral-300/50 rounded-[2rem] rotate-2" />
          <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-neutral-200/80">
            <div className="w-44 h-44 mx-auto text-neutral-800">
              {astronautSvg ? (
                <div dangerouslySetInnerHTML={{ __html: astronautSvg }} className="w-full h-full" />
              ) : (
                <div className="w-full h-full bg-neutral-100 rounded-xl flex items-center justify-center text-6xl font-black text-neutral-300">
                  ?
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative inline-block mb-8">
          <span className="text-[6rem] md:text-[8rem] font-black leading-none text-neutral-200 select-none tracking-tighter">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[6rem] md:text-[8rem] font-black leading-none text-neutral-900 select-none tracking-tighter">
            404
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3 leading-tight">
          Houston, we<br />
          <span className="text-neutral-500">have a problem</span>
        </h1>

        <p className="text-neutral-500 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          The page you&apos;re looking for has drifted off into space or never existed.
          Let&apos;s get you back on course.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-all active:scale-[0.97] shadow-sm"
          >
            <Rocket className="w-4 h-4" />
            Browse Library
          </Link>

          <Link
            href="/favorites"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-neutral-300 text-neutral-600 font-semibold rounded-xl hover:border-neutral-400 hover:text-neutral-900 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            View Favorites
          </Link>

          <a
            href="https://github.com/syntax-devv/TinyOps/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-neutral-300 text-neutral-600 font-semibold rounded-xl hover:border-neutral-400 hover:text-neutral-900 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Open Issue
          </a>
        </div>
      </div>
    </div>
  );
}
