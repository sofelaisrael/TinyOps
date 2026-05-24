"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "This page";

  return (
    <div className="min-h-screen bg-[#EDEBE7] flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-block bg-white border border-neutral-200 rounded-2xl px-8 py-4 shadow-sm">
            <p className="text-2xl md:text-3xl font-semibold text-neutral-900">
              &ldquo;{page}&rdquo;
            </p>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight font-bold text-neutral-900 mb-6 text-balance">
          Not ready yet
        </h1>

        <p className="text-lg md:text-xl text-neutral-600 text-balance mb-8">
          This page hasn&apos;t been built yet — but the rest of the library is
          ready and waiting for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="cursor-pointer inline-flex items-center justify-center font-medium transition-all px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-700 active:scale-95 text-base"
          >
            Browse Prompts
          </Link>

          <Link
            href="/favorites"
            className="cursor-pointer inline-flex items-center justify-center font-medium transition-all px-6 py-3 bg-neutral-200 text-neutral-900 rounded-full hover:bg-neutral-900 hover:text-white active:scale-95 text-base"
          >
            View Favorites
          </Link>
        </div>

        <div className="mt-10 mb-16 mx-auto">
          <p className="text-sm text-neutral-500 mb-3">You might be looking for:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/"
              className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium text-sm"
            >
              Home
            </Link>
            <a
              href="https://github.com/syntax-devv/TinyOps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium text-sm"
            >
              GitHub
            </a>
            <a
              href="https://github.com/syntax-devv/TinyOps/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium text-sm"
            >
              Report Issue
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
