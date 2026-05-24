'use client';

import { useEffect } from 'react';
import { RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#EDEBE7] text-neutral-900 min-h-screen antialiased">
        <script src="https://cdn.tailwindcss.com" />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6">
              <div className="h-48 w-48 mx-auto bg-white rounded-2xl flex items-center justify-center border border-neutral-200/80 shadow-sm">
                <span className="text-7xl font-black text-neutral-400">!</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl tracking-tight font-bold text-neutral-900 mb-4 text-balance">
              Oops! Something broke
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 text-balance mb-8">
              We&apos;re experiencing technical difficulties. Our team has been alerted and is working on a fix.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={reset}
                className="cursor-pointer inline-flex items-center justify-center font-medium transition-all px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-700 active:scale-95 text-base"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </button>

              <a
                href="/"
                className="cursor-pointer inline-flex items-center justify-center font-medium transition-all px-6 py-3 bg-neutral-200 text-neutral-900 rounded-full hover:bg-neutral-900 hover:text-white active:scale-95 text-base"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-12 text-left">
              <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
                <h3 className="text-sm font-semibold text-neutral-500 mb-2">
                  What happened?
                </h3>
                <p className="text-sm text-neutral-600">
                  An unexpected error occurred. This is usually temporary.
                </p>
              </div>

              <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
                <h3 className="text-sm font-semibold text-neutral-500 mb-2">
                  What can you do?
                </h3>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>&bull; Try refreshing</li>
                  <li>&bull; Clear your cache</li>
                  <li>&bull; Check your connection</li>
                  <li>&bull; Come back later</li>
                </ul>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-white border border-neutral-200 rounded-xl text-left shadow-sm max-w-md mx-auto mb-8">
                <p className="text-xs font-mono text-neutral-600">
                  <span className="text-neutral-400">Error:</span> {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs font-mono text-neutral-600 mt-2">
                    <span className="text-neutral-400">Digest:</span> {error.digest}
                  </p>
                )}
                <pre className="text-[10px] font-mono text-neutral-500 mt-2 overflow-x-auto max-w-full">
                  {error.stack?.split('\n').slice(0, 5).join('\n') || 'No stack trace available'}
                </pre>
              </div>
            )}

            <div className="pt-8 border-t border-neutral-200 max-w-md mx-auto">
              <p className="text-xs text-neutral-400">
                If the problem persists,{' '}
                <a href="https://github.com/syntax-devv/TinyOps/issues"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-neutral-600 hover:text-neutral-900 underline">
                  report it on GitHub
                </a>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
