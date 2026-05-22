'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

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
            <div className="mx-auto w-20 h-20 bg-white border border-neutral-200 rounded-2xl flex items-center justify-center mb-6 shadow-md">
              <AlertTriangle className="w-10 h-10 text-neutral-400" />
            </div>

            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              Oops! Something broke
            </h1>

            <p className="text-neutral-500 mb-8 text-lg">
              We&apos;re experiencing technical difficulties. Our team has been alerted and is working on a fix.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-all active:scale-[0.97] shadow-md"
              >
                <RefreshCw className="w-5 h-5" />
                Retry
              </button>

              <a
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-4 border border-neutral-300 text-neutral-600 font-semibold rounded-xl hover:border-neutral-400 hover:text-neutral-900 transition-all"
              >
                <Home className="w-5 h-5" />
                Home
              </a>
            </div>

            <div className="text-left space-y-4">
              <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
                <h3 className="text-sm font-mono text-neutral-500 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-neutral-300 rounded-full"></span>
                  What happened?
                </h3>
                <p className="text-sm text-neutral-600">
                  An unexpected error occurred while loading the application. This is usually temporary.
                </p>
              </div>

              <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-sm">
                <h3 className="text-sm font-mono text-neutral-500 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
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
                <h3 className="text-xs font-mono text-neutral-500 mb-3 uppercase tracking-wider">
                  Developer Information
                </h3>
                <div className="space-y-2">
                  <p className="text-xs font-mono text-neutral-600">
                    <span className="text-neutral-400">Error:</span> {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs font-mono text-neutral-600">
                      <span className="text-neutral-400">Digest:</span> {error.digest}
                    </p>
                  )}
                  <p className="text-xs font-mono text-neutral-600">
                    <span className="text-neutral-400">Stack:</span>
                  </p>
                  <pre className="text-[10px] font-mono text-neutral-500 mt-1 overflow-x-auto max-w-full">
                    {error.stack?.split('\n').slice(0, 5).join('\n') || 'No stack trace available'}
                  </pre>
                </div>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-neutral-200">
              <p className="text-xs text-neutral-400">
                If the problem persists, please{' '}
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
