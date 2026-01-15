/**
 * Example: Notifications Screen with Backend Integration
 * This demonstrates how to integrate backend API calls into a screen
 */

import React from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useApiData, useMutation } from '../../lib/hooks/useApiData';
import { 
  getMyNotifications, 
  markNotificationRead, 
  markAllNotificationsRead 
} from '../../lib/user-api';
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
import { BackButton } from '../ui/BackButton';

interface NotificationsScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function NotificationsScreenBackend({ onNavigate, onBack }: NotificationsScreenProps) {
  // Fetch notifications from backend
  const { data: notifications, isLoading, error, refetch } = useApiData({
    fetchFn: getMyNotifications,
  });

  // Mutation for marking single notification as read
  const markAsReadMutation = useMutation(
    (notificationId: string) => markNotificationRead(notificationId)
  );

  // Mutation for marking all as read
  const markAllAsReadMutation = useMutation(
    () => markAllNotificationsRead()
  );

  const handleMarkAsRead = async (notificationId: string) => {
    const result = await markAsReadMutation.mutate(notificationId);
    if (result) {
      // Refresh notifications list
      refetch();
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await markAllAsReadMutation.mutate(undefined);
    if (result) {
      // Refresh notifications list
      refetch();
    }
  };

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <BackButton onClick={onBack} />
          <div className="flex-1">
            <h1 className="text-xl">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {notifications && notifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#3C82F6] dark:text-[#3758FF] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Loading State */}
        {isLoading && <LoadingState message="Loading notifications..." />}

        {/* Error State */}
        {error && <ErrorState error={error} onRetry={refetch} />}

        {/* Empty State */}
        {!isLoading && !error && (!notifications || notifications.length === 0) && (
          <EmptyState
            icon={<Bell className="w-12 h-12" />}
            title="No notifications"
            message="You don't have any notifications yet. We'll notify you when something important happens."
          />
        )}

        {/* Notifications List */}
        {!isLoading && !error && notifications && notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-[#1A1F2E] rounded-xl p-4 border ${
                  notification.is_read
                    ? 'border-gray-200 dark:border-gray-800'
                    : 'border-[#3C82F6] dark:border-[#3758FF] bg-blue-50/50 dark:bg-blue-900/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-[#3C82F6] rounded-full flex-shrink-0 mt-1.5"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {new Date(notification.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={markAsReadMutation.isLoading}
                      className="p-2 text-gray-400 hover:text-[#3C82F6] dark:hover:text-[#3758FF] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mutation Error */}
        {(markAsReadMutation.error || markAllAsReadMutation.error) && (
          <div className="mt-4">
            <ErrorState 
              error={markAsReadMutation.error || markAllAsReadMutation.error} 
              onRetry={() => {
                markAsReadMutation.reset();
                markAllAsReadMutation.reset();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
