import { useState, useEffect, useCallback, ReactNode } from "react";
import { api, handleApiError } from "../api";
import { supabase } from "../../supabase";
export interface Notification {
  icon: any;
  user_email: ReactNode;
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  reference_id?: string;
  reference_type?: string;
  is_read: boolean;
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
  unreadCount: number;
  clearError: () => void;
}

export function useNotifications(
  { autoFetch = true }: UseNotificationsOptions = {}
): UseNotificationsReturn {

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {

    setLoading(true);
    setError(null);

    try {

      const res = await api.post("get_my_notifications");

console.log("notifications response:", res);

if (res?.data?.success) {
  setNotifications(res.data.data);
} else {
        throw new Error(res.error || "Failed to fetch notifications");
      }

    } catch (err) {

      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error("Error fetching notifications:", err);
      setNotifications([]);

    } finally {

      setLoading(false);

    }

  }, []);

 const markAsRead = useCallback(async (notificationId: string) => {
  try {
    const res = await api.post("mark_raf_notification_read", {
  notification_id: notificationId,
});

    console.log("markAsRead response:", res);

    if (res?.data?.success) {
      // ✅ update local state instantly
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, is_read: true }
            : n
        )
      );
    } else {
      throw new Error(res?.data?.error || "Failed to mark notification read");
    }

  } catch (err) {
    const errorMessage = handleApiError(err);
    setError(errorMessage);
    console.error("❌ markAsRead failed:", err);
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
  }, [autoFetch, fetchNotifications]);

useEffect(() => {

  const channel = supabase
    .channel("notifications-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications"
        
      },
      (payload) => {

        console.log("Realtime notification received:", payload);

        fetchNotifications(); // refresh notifications

      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };

}, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    unreadCount,
    clearError
  };

}