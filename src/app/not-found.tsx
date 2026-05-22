import Link from "next/link";
import { ArrowLeft, Rocket, ExternalLink } from "lucide-react";
import fs from "fs";
import path from "path";

export default function NotFound() {
  let astronautSvg = "";
  const astroPath = path.join(process.cwd(), "public", "illustrations", "astronaut.svg");
  if (fs.existsSync(astroPath)) {
    astronautSvg = fs.readFileSync(astroPath, "utf8");
    const start = astronautSvg.indexOf("<svg");
    const end = astronautSvg.indexOf("</svg>") + 6;
    if (start !== -1 && end > start) {
      astronautSvg = astronautSvg.slice(start, end);
      const defsStart = astronautSvg.indexOf("<defs>");
      const defsEnd = astronautSvg.indexOf("</defs>") + 7;
      if (defsStart !== -1 && defsEnd > defsStart) {
        astronautSvg = astronautSvg.slice(0, defsStart) + astronautSvg.slice(defsEnd);
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#EDEBE7] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-neutral-300" />
        <div className="absolute top-20 right-20 w-1.5 h-1.5 rounded-full bg-neutral-300" />
        <div className="absolute bottom-32 left-1/4 w-1 h-1 rounded-full bg-neutral-300" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-neutral-300" />
        <div className="absolute bottom-20 right-10 w-2 h-2 rounded-full bg-neutral-300" />
      </div>

      <div className="text-center max-w-lg relative z-10">
        <div className="relative mb-8 flex justify-center">
          <div
            className="w-48 h-48"
            dangerouslySetInnerHTML={{ __html: astronautSvg }}
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-display font-black text-[40px] text-neutral-900/10 select-none">
            404
          </div>
        </div>

        <div className="mb-6">
          <p className="text-neutral-400 font-mono text-sm mb-2 tracking-wider uppercase">
            Error 404
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase text-neutral-900 leading-none mb-4">
            Houston, we<br />
            <span className="text-neutral-400">have a problem</span>
          </h1>
        </div>

        <div className="mb-8 p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
          <p className="text-neutral-500 text-sm leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-700 transition-all active:scale-[0.97] text-[14px]"
          >
            <Rocket className="w-4 h-4" />
            Browse Library
          </Link>

          <Link
            href="/favorites"
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-neutral-300 text-neutral-600 font-medium rounded-lg hover:border-neutral-400 hover:text-neutral-900 transition-colors text-[14px]"
          >
            <ArrowLeft className="w-4 h-4" />
            View Favorites
          </Link>

          <a
            href="https://github.com/syntax-devv/TinyOps/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-neutral-300 text-neutral-600 font-medium rounded-lg hover:border-neutral-400 hover:text-neutral-900 transition-colors text-[14px]"
          >
            <ExternalLink className="w-4 h-4" />
            Open Issue
          </a>
        </div>
      </div>
    </div>
  );
}
