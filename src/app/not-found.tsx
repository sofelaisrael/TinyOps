import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#EDEBE7] flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-6">
          <img
            src="/images/nudge-404.webp"
            alt="404 illustration"
            className="h-72 mx-auto object-contain mb-4"
          />
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight font-bold text-neutral-900 mb-6 text-balance">
          Oh, the tragedy!
        </h1>

        <p className="text-lg md:text-xl text-neutral-600 text-balance mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="cursor-pointer inline-flex items-center justify-center font-medium transition-all px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-700 active:scale-95 text-base"
          >
            Go to homepage
          </Link>

          <Link
            href="/favorites"
            className="cursor-pointer inline-flex items-center justify-center font-medium transition-all px-6 py-3 bg-neutral-200 text-neutral-900 rounded-full hover:bg-neutral-900 hover:text-white active:scale-95 text-base"
          >
            View favorites
          </Link>
        </div>

        <div className="mt-10 mb-16 mx-auto">
          <p className="text-sm text-neutral-500 mb-3">You might be looking for:</p>
          <div className="flex flex-wrap gap-4 justify-center">
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
            <Link
              href="/favorites"
              className="text-neutral-600 hover:text-neutral-900 transition-colors font-medium text-sm"
            >
              Favorites
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
