import React from 'react';

type Status =
  | 'pending'
  | 'paid'
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'expired'
  | 'approved'
  | 'rejected'
  | 'suspended'
  | 'active'
  | 'inactive';

interface StatusBadgeProps {
  status: Status | string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    pending: {
      color: 'text-yellow-700 dark:text-yellow-300',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      label: 'Pending',
    },
    paid: {
      color: 'text-green-700 dark:text-green-300',
      bg: 'bg-green-100 dark:bg-green-900/30',
      label: 'Paid',
    },
    scheduled: {
      color: 'text-blue-700 dark:text-blue-300',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      label: 'Scheduled',
    },
    completed: {
      color: 'text-green-700 dark:text-green-300',
      bg: 'bg-green-100 dark:bg-green-900/30',
      label: 'Completed',
    },
    cancelled: {
      color: 'text-red-700 dark:text-red-300',
      bg: 'bg-red-100 dark:bg-red-900/30',
      label: 'Cancelled',
    },
    expired: {
      color: 'text-gray-700 dark:text-gray-300',
      bg: 'bg-gray-100 dark:bg-gray-900/30',
      label: 'Expired',
    },
    approved: {
      color: 'text-green-700 dark:text-green-300',
      bg: 'bg-green-100 dark:bg-green-900/30',
      label: 'Approved',
    },
    rejected: {
      color: 'text-red-700 dark:text-red-300',
      bg: 'bg-red-100 dark:bg-red-900/30',
      label: 'Rejected',
    },
    suspended: {
      color: 'text-orange-700 dark:text-orange-300',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      label: 'Suspended',
    },
    active: {
      color: 'text-green-700 dark:text-green-300',
      bg: 'bg-green-100 dark:bg-green-900/30',
      label: 'Active',
    },
    inactive: {
      color: 'text-gray-700 dark:text-gray-300',
      bg: 'bg-gray-100 dark:bg-gray-900/30',
      label: 'Inactive',
    },
  };

  const normalizedStatus = status.toLowerCase();
  const config = statusConfig[normalizedStatus] || {
    color: 'text-gray-700 dark:text-gray-300',
    bg: 'bg-gray-100 dark:bg-gray-900/30',
    label: status.charAt(0).toUpperCase() + status.slice(1),
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full
        ${sizeClasses[size]}
        ${config.color}
        ${config.bg}
        font-medium
        whitespace-nowrap
      `}
    >
      {config.label}
    </span>
  );
}
