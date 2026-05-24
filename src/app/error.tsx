'use client';

import { useEffect } from 'react';
import { RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 bg-[#EDEBE7]">
      <div className="text-center max-w-md">
        <div className="relative mb-8 inline-block">
          <div className="absolute -top-2 -left-2 w-full h-full bg-neutral-200 rounded-[1.5rem] -rotate-2" />
          <div className="relative bg-white rounded-xl p-6 shadow-sm border border-neutral-200/80">
            <div className="w-16 h-16 mx-auto bg-[#EDEBE7] rounded-full flex items-center justify-center">
              <span className="text-3xl font-black text-neutral-400">!</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 mb-3">
          Something went wrong
        </h2>

        <p className="text-neutral-500 text-sm mb-8 max-w-xs mx-auto">
          We hit a snag. Our team has been notified — try again or head back home.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-all active:scale-[0.97] shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-neutral-300 text-neutral-600 font-semibold rounded-xl hover:border-neutral-400 hover:text-neutral-900 transition-all"
          >
            <Home className="w-4 h-4" />
            Go home
          </a>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-white border border-neutral-200 rounded-xl text-left shadow-sm">
            <p className="text-xs font-mono text-neutral-500 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs font-mono text-neutral-400 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
