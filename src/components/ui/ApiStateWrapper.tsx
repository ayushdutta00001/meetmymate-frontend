import React from 'react';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { AlertTriangle, Lock, ServerCrash } from 'lucide-react';

interface ApiStateWrapperProps {
  children: React.ReactNode;
  loading?: boolean;
  error?: Error | string | null;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  onRetry?: () => void;
  loadingMessage?: string;
}

export function ApiStateWrapper({
  children,
  loading = false,
  error = null,
  empty = false,
  emptyTitle = 'No data available',
  emptyDescription = 'There is no data to display at this time.',
  emptyIcon,
  onRetry,
  loadingMessage = 'Loading...',
}: ApiStateWrapperProps) {
  // Handle loading state
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }

  // Handle error states
  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    
    // Check for specific error codes
    if (errorMessage.includes('401') || errorMessage.toLowerCase().includes('unauthorized')) {
      return (
        <ErrorState
          icon={<Lock className="w-16 h-16 text-yellow-500" />}
          title="Session Expired"
          message="Your session has expired. Please sign in again to continue."
          onRetry={() => {
            // Redirect to login
            window.location.href = '/admin?session=expired';
          }}
          retryLabel="Sign In Again"
        />
      );
    }

    if (errorMessage.includes('403') || errorMessage.toLowerCase().includes('forbidden')) {
      return (
        <ErrorState
          icon={<Lock className="w-16 h-16 text-red-500" />}
          title="Access Denied"
          message="You don't have permission to view this content. Contact your administrator if you believe this is an error."
          showRetry={false}
        />
      );
    }

    if (errorMessage.includes('500') || errorMessage.toLowerCase().includes('server error')) {
      return (
        <ErrorState
          icon={<ServerCrash className="w-16 h-16 text-red-500" />}
          title="Server Error"
          message="Something went wrong on our end. Please try again in a moment."
          onRetry={onRetry}
        />
      );
    }

    // Generic error
    return (
      <ErrorState
        icon={<AlertTriangle className="w-16 h-16 text-red-500" />}
        title="Error Loading Data"
        message={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  // Handle empty state
  if (empty) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  // Render children when everything is okay
  return <>{children}</>;
}
