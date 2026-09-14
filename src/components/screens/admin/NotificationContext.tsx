import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { api } from "../../../lib/api";
import { supabase } from "../../../supabase";
export type NotifType = 'success' | 'warning' | 'error' | 'info';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotifType;
  time: Date;
  read: boolean;

  section?: string;
  entityId?: string;
  eventType?: string;
}

interface NotifCtx {
  notifications: Notification[];
  push: (title: string, message: string, type?: NotifType) => void;
  markAllRead: () => void;
 markOneRead: (id: string) => Promise<void>;
  clear: () => void;

  selectedNotification: Notification | null;
  openNotification: (notification: Notification) => void;
}

const NotificationContext = createContext<NotifCtx>({
  notifications: [],
  push: () => { },
  markAllRead: () => { },
  clear: () => { },

  selectedNotification: null,
  openNotification: () => { },
  markOneRead: async (id: string): Promise<void> => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
 const [notifications, setNotifications] = useState<Notification[]>([]);
const [selectedNotification, setSelectedNotification] =
  useState<Notification | null>(null);
const loadNotifications = useCallback(async () => {
  console.log("Loading admin notifications...");

  try {
    const response = await api.get("get_admin_notifications");

    console.log("Response:", response);

    if (!response.success) return;

   const mapped = (response.notifications ?? []).map((item: any) => ({
  id: item.id,
  title: item.title,
  message: item.message,
  type: item.severity as NotifType,
  time: new Date(item.created_at),
  read: item.is_read,

  section: item.section,
  entityId: item.entity_id,
  eventType: item.event_type,
}));

    console.log("Mapped:", mapped);

    setNotifications(mapped);
  } catch (err) {
    console.error("Failed to load notifications", err);
  }
}, []);
useEffect(() => {
  loadNotifications();
}, [loadNotifications]);

useEffect(() => {
  const channel = supabase
    .channel("admin-notifications-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "admin_notifications",
      },
      () => {
        console.log("Admin notifications changed");
        loadNotifications();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [loadNotifications]);

  const push = useCallback((title: string, message: string, type: NotifType = 'info') => {
    const notif: Notification = {
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title,
      message,
      type,
      time: new Date(),
      read: false,
    };
    setNotifications(prev => [notif, ...prev]);
  }, []);

const markAllRead = useCallback(async () => {
  console.log("Mark all clicked");

  const { data, error } = await supabase
    .from("admin_notifications")
    .update({
      is_read: true,
    })
    .eq("is_read", false)
    .select();

  console.log("Updated:", data);
  console.log("Error:", error);

  if (error) {
    console.error(error);
    return;
  }

 await loadNotifications();
}, [loadNotifications]);

  const clear = useCallback(() => {
    setNotifications([]);
  }, []);
const openNotification = useCallback((notification: Notification) => {
  setSelectedNotification(notification);
}, []);
const markOneRead = useCallback(async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("admin_notifications")
      .update({ is_read: true })
      .eq("id", id)
      .select();

    if (error) {
      console.error(error);
      return;
    }

    // Optimistically update local state
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    await loadNotifications();
  } catch (err) {
    console.error("Failed to mark one read", err);
  }
}, [loadNotifications]);

  return (
   <NotificationContext.Provider
    value={{
        notifications,
        push,
        markAllRead,
        markOneRead,
        clear,
        selectedNotification,
        openNotification,
    }}
>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

export function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
