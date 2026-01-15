/**
 * Reusable empty state component
 */

import React, { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  message,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="mb-4 text-gray-400 dark:text-gray-600">
        {icon || <Inbox className="w-12 h-12" />}
      </div>
      {title && (
        <h3 className="text-lg text-gray-900 dark:text-white mb-2">{title}</h3>
      )}
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {message}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
