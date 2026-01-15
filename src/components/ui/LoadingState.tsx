/**
 * Reusable loading state component
 */

import React from 'react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading...', className = '' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3C82F6] dark:border-[#3758FF]"></div>
      {message && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
}

/**
 * Inline loading spinner (smaller)
 */
export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full h-5 w-5 border-b-2 border-current ${className}`}></div>
  );
}
