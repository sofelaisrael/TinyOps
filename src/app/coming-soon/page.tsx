"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap, BookOpen, GitBranch, ArrowUpRight } from "lucide-react";
import { Suspense } from "react";

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "This page";

  return (
    <div className="min-h-screen bg-[#EDEBE7] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">

        {/* 3D 404 */}
        <div className="relative mb-10 flex justify-center select-none">
          <div className="relative" style={{ perspective: "600px" }}>
            {/* Shadow */}
            <div
              className="absolute inset-0 flex items-center justify-center blur-2xl opacity-20"
              style={{ transform: "translateY(24px) scale(0.92)" }}
            >
              <span className="font-display font-black text-9xl text-neutral-900">404</span>
            </div>
            {/* 3D layers */}
            <div className="relative" style={{ transformStyle: "preserve-3d" }}>
              {[
                { offset: 12, opacity: 0.08 },
                { offset: 10, opacity: 0.12 },
                { offset: 8, opacity: 0.16 },
                { offset: 6, opacity: 0.22 },
                { offset: 4, opacity: 0.28 },
                { offset: 2, opacity: 0.36 },
              ].map((layer, i) => (
                <span
                  key={i}
                  className="absolute inset-0 flex items-center justify-center font-display font-black text-9xl text-neutral-900"
                  style={{
                    transform: `translateX(${layer.offset}px) translateY(${layer.offset}px)`,
                    opacity: layer.opacity,
                    clipPath: "inset(0)",
                  }}
                >
                  404
                </span>
              ))}
              <span className="relative flex items-center justify-center font-display font-black text-9xl text-neutral-900">
                404
              </span>
              {/* Accent line */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-rose-400/60 rounded-full blur-[2px]" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="font-display font-black uppercase leading-none tracking-tight text-neutral-900 mb-4"
          style={{ fontSize: "clamp(28px, 5vw, 48px)" }}
        >
          Page not found
        </h1>

        {/* Card */}
        <div className="mb-6 p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm text-left">
          <p className="text-neutral-500 text-[14px] leading-relaxed">
            <span className="font-semibold text-neutral-900">&ldquo;{page}&rdquo;</span>{" "}
            doesn&apos;t exist yet — but there&apos;s plenty to explore.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Browse Prompts", "Favorites", "RSS Feed"].map((label) => (
              <Link
                key={label}
                href={label === "Browse Prompts" ? "/" : label === "Favorites" ? "/favorites" : "/rss.xml"}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-100 text-neutral-600 rounded-full text-[12px] font-medium hover:bg-neutral-200 hover:text-neutral-800 transition-colors"
              >
                {label === "Browse Prompts" && <Zap className="w-3 h-3" />}
                {label === "Favorites" && <BookOpen className="w-3 h-3" />}
                {label === "RSS Feed" && <ArrowUpRight className="w-3 h-3" />}
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Primary actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white font-medium rounded-full hover:bg-neutral-700 transition-all active:scale-[0.97] text-sm shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to prompts
          </Link>
          <a
            href="https://github.com/syntax-devv/TinyOps/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-neutral-200 text-neutral-700 font-medium rounded-full hover:border-neutral-400 hover:text-neutral-900 transition-all active:scale-[0.97] text-sm"
          >
            <GitBranch className="w-4 h-4" />
            Open an issue
          </a>
        </div>

        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-neutral-300"
              style={{ opacity: 0.6 - i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ComingSoon() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#EDEBE7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
      </div>
    }>
      <ComingSoonContent />
    </Suspense>
  );
}
