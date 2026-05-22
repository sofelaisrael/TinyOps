'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 bg-white border border-neutral-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <AlertTriangle className="w-8 h-8 text-neutral-400" />
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 mb-3">
          Something went wrong
        </h2>

        <p className="text-neutral-500 mb-8">
          We encountered an error while loading this page. Don&apos;t worry, our team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>

          <a
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 text-neutral-600 font-medium rounded-lg hover:border-neutral-400 hover:text-neutral-900 transition-colors"
          >
            Go home
          </a>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-white border border-neutral-200 rounded-lg text-left shadow-sm">
            <h3 className="text-sm font-mono text-neutral-500 mb-2">Error details:</h3>
            <p className="text-sm font-mono text-neutral-600 break-all">
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
