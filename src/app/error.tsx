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
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-6">
          <div className="h-48 w-48 mx-auto bg-neutral-100 rounded-2xl flex items-center justify-center border border-neutral-200/80">
            <span className="text-7xl font-black text-neutral-400">!</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl tracking-tight font-bold text-neutral-900 mb-4 text-balance">
          Something went wrong
        </h1>

        <p className="text-lg md:text-xl text-neutral-600 text-balance mb-8">
          We hit a snag loading this page. Our team has been notified — try again or head back home.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="cursor-pointer inline-flex items-center justify-center font-medium transition-all px-6 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-700 active:scale-95 text-base"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </button>

          <a
            href="/"
            className="cursor-pointer inline-flex items-center justify-center font-medium transition-all px-6 py-3 bg-neutral-200 text-neutral-900 rounded-full hover:bg-neutral-900 hover:text-white active:scale-95 text-base"
          >
            <Home className="w-4 h-4 mr-2" />
            Go home
          </a>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-10 p-4 bg-white border border-neutral-200 rounded-xl text-left shadow-sm max-w-md mx-auto">
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
