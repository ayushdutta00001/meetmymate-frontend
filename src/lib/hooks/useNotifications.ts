/**
 * Custom hook for managing notification data
 * Provides standardized data fetching, loading states, and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import { api, handleApiError } from '../api';

export type NotificationStatus = 'read' | 'unread';

export interface Notification {
  id: string;
  user_email: string;
  title: string;
  message: string;
  link?: string;
  read_status: NotificationStatus;
  created_at: string;
}

interface UseNotificationsOptions {
  autoFetch?: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  unreadCount: number;
  clearError: () => void;
}

export function useNotifications({ autoFetch = true }: UseNotificationsOptions = {}): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get<Notification[]>('notifications');
      
      if (response.success && response.data) {
        setNotifications(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch notifications');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error fetching notifications:', err);
      // Set empty array on error so UI doesn't break
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await api.put(`notifications/${notificationId}/read`);
      
      if (response.success) {
        // Optimistically update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, read_status: 'read' as NotificationStatus }
              : notif
          )
        );
      } else {
        throw new Error(response.error || 'Failed to mark notification as read');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await api.put('notifications/read-all');
      
      if (response.success) {
        // Optimistically update all notifications to read
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read_status: 'read' as NotificationStatus }))
        );
      } else {
        throw new Error(response.error || 'Failed to mark all notifications as read');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchNotifications();
    }
  }, [fetchNotifications, autoFetch]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => n.read_status === 'unread').length;

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
    clearError,
  };
}