import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase"; // adjust path if needed

type NotificationContextType = {
  notifCount: number;
  refreshNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifCount, setNotifCount] = useState(0);

  const fetchUnread = async () => {
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false) 

    setNotifCount(count || 0);
  };

  useEffect(() => {
    fetchUnread();

    const channel = supabase
      .channel("global-notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          fetchUnread();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifCount,
        refreshNotifications: fetchUnread,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be inside NotificationProvider");
  return ctx;
}