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
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md w-full">
            <div className="relative mb-8 inline-block">
              <div className="absolute -top-3 -left-3 w-full h-full bg-neutral-200 rounded-[2rem] -rotate-3" />
              <div className="absolute -bottom-1 -right-1 w-full h-full bg-neutral-300/50 rounded-[2rem] rotate-2" />
              <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-neutral-200/80">
                <div className="w-20 h-20 mx-auto bg-[#EDEBE7] rounded-full flex items-center justify-center">
                  <span className="text-5xl font-black text-neutral-400">!</span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-neutral-900 mb-4 leading-tight">
              Oops! Something<br />
              <span className="text-neutral-500">went wrong</span>
            </h1>

            <p className="text-neutral-500 text-sm mb-8 max-w-xs mx-auto">
              We&apos;re experiencing technical difficulties. Our team has been alerted and is working on a fix.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-all active:scale-[0.97] shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>

              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-neutral-300 text-neutral-600 font-semibold rounded-xl hover:border-neutral-400 hover:text-neutral-900 transition-all"
              >
                <Home className="w-4 h-4" />
                Home
              </a>
            </div>

            <div className="text-left space-y-4">
              <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
                <h3 className="text-sm font-semibold text-neutral-500 mb-2">
                  What happened?
                </h3>
                <p className="text-sm text-neutral-600">
                  An unexpected error occurred while loading the application. This is usually temporary.
                </p>
              </div>

              <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
                <h3 className="text-sm font-semibold text-neutral-500 mb-2">
                  What can you do?
                </h3>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>&bull; Try refreshing the page</li>
                  <li>&bull; Clear your browser cache</li>
                  <li>&bull; Check your internet connection</li>
                  <li>&bull; Come back in a few minutes</li>
                </ul>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-white border border-neutral-200 rounded-xl text-left shadow-sm">
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

            <div className="mt-8 pt-8 border-t border-neutral-200">
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
