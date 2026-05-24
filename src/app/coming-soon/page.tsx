"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "This page";

  return (
    <div className="min-h-screen bg-[#EDEBE7] flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative inline-block mb-8">
          <img
            src="/images/bones-404.webp"
            alt=""
            className="h-72 md:h-96 mx-auto object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center mt-8 md:mt-12">
            <span className="text-4xl md:text-6xl font-black tracking-tight text-neutral-900 opacity-80 rotate-[-6deg]">
              Coming Soon
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="inline-block bg-white border border-neutral-200 rounded-2xl px-6 py-4 shadow-sm">
            <p className="text-neutral-500 text-sm md:text-base">
              <span className="font-semibold text-neutral-900">&ldquo;{page}&rdquo;</span>{" "}
              doesn&apos;t exist yet — but there&apos;s plenty to explore.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-neutral-500 mb-3">You might be looking for:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/"
              className="text-neutral-600 hover:text-neutral-900 transition-colors font-semibold text-sm"
            >
              Browse Prompts
            </Link>
            <Link
              href="/favorites"
              className="text-neutral-600 hover:text-neutral-900 transition-colors font-semibold text-sm"
            >
              Favorites
            </Link>
            <a
              href="https://github.com/syntax-devv/TinyOps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-neutral-900 transition-colors font-semibold text-sm"
            >
              GitHub
            </a>
          </div>
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
