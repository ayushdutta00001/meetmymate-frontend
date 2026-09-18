import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../supabase";

type NotificationContextType = {
  notifCount: number;
  refreshNotifications: () => void;
};

const NotificationContext =
  createContext<NotificationContextType | null>(null);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifCount, setNotifCount] = useState(0);

  // ============================================================
  // FETCH TOTAL UNREAD NOTIFICATIONS
  // ============================================================

  const fetchUnread = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setNotifCount(0);
        return;
      }

      // --------------------------------------------------------
      // NORMAL NOTIFICATIONS
      // --------------------------------------------------------

      const normalResult = await supabase
        .from("notifications")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id)
        .eq("is_read", false);

      // --------------------------------------------------------
      // BLIND DATE NOTIFICATIONS
      // --------------------------------------------------------

      const blindDateResult = await supabase
        .from("blind_date_notifications")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id)
        .eq("is_read", false);

      // --------------------------------------------------------
      // P2P NOTIFICATIONS
      // --------------------------------------------------------

      const p2pResult = await supabase
        .from("p2p_notifications")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id)
        .eq("is_read", false);

      // --------------------------------------------------------
      // ERROR CHECKING
      // --------------------------------------------------------

      if (normalResult.error) {
        console.error(
          "Normal notification count error:",
          normalResult.error
        );
      }

      if (blindDateResult.error) {
        console.error(
          "Blind Date notification count error:",
          blindDateResult.error
        );
      }

      if (p2pResult.error) {
        console.error(
          "P2P notification count error:",
          p2pResult.error
        );
      }

      // --------------------------------------------------------
      // TOTAL
      // --------------------------------------------------------

      const normalCount =
        normalResult.count || 0;

      const blindDateCount =
        blindDateResult.count || 0;

      const p2pCount =
        p2pResult.count || 0;

      const totalUnread =
        normalCount +
        blindDateCount +
        p2pCount;

      console.log("🔔 UNREAD COUNTS:", {
        normal: normalCount,
        blindDate: blindDateCount,
        p2p: p2pCount,
        total: totalUnread,
      });

      setNotifCount(totalUnread);

      // Keep other parts of the app synchronized
      window.dispatchEvent(
        new CustomEvent("notificationsUpdated", {
          detail: totalUnread,
        })
      );
    } catch (error) {
      console.error(
        "Notification count error:",
        error
      );

      setNotifCount(0);
    }
  };

  // ============================================================
  // INITIAL LOAD + REALTIME
  // ============================================================

  useEffect(() => {
    let normalChannel: any;
    let blindDateChannel: any;
    let p2pChannel: any;

    const initialize = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setNotifCount(0);
        return;
      }

      console.log(
        "🔔 NotificationProvider initialized:",
        user.id
      );

      // Initial unread count
      await fetchUnread();

      // ========================================================
      // NORMAL NOTIFICATIONS REALTIME
      // ========================================================

      normalChannel = supabase
        .channel(
          `notification-count-normal-${user.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            console.log(
              "🔔 Normal notification changed"
            );

            fetchUnread();
          }
        )
        .subscribe((status) => {
          console.log(
            "📡 Normal notification realtime:",
            status
          );
        });

      // ========================================================
      // BLIND DATE REALTIME
      // ========================================================

      blindDateChannel = supabase
        .channel(
          `notification-count-blind-date-${user.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "blind_date_notifications",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            console.log(
              "❤️ Blind Date notification changed"
            );

            fetchUnread();
          }
        )
        .subscribe((status) => {
          console.log(
            "📡 Blind Date notification realtime:",
            status
          );
        });

      // ========================================================
      // P2P REALTIME
      // ========================================================

      p2pChannel = supabase
        .channel(
          `notification-count-p2p-${user.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "p2p_notifications",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            console.log(
              "🤝 P2P notification changed"
            );

            fetchUnread();
          }
        )
        .subscribe((status) => {
          console.log(
            "📡 P2P notification realtime:",
            status
          );
        });
    };

    initialize();

    // ==========================================================
    // LISTEN FOR LOCAL NOTIFICATION UPDATES
    // ==========================================================

    const handleNotificationsUpdated = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<number>;

      if (
        typeof customEvent.detail ===
        "number"
      ) {
        setNotifCount(
          customEvent.detail
        );
      } else {
        fetchUnread();
      }
    };

    window.addEventListener(
      "notificationsUpdated",
      handleNotificationsUpdated
    );

    // ==========================================================
    // CLEANUP
    // ==========================================================

    return () => {
      if (normalChannel) {
        supabase.removeChannel(
          normalChannel
        );
      }

      if (blindDateChannel) {
        supabase.removeChannel(
          blindDateChannel
        );
      }

      if (p2pChannel) {
        supabase.removeChannel(
          p2pChannel
        );
      }

      window.removeEventListener(
        "notificationsUpdated",
        handleNotificationsUpdated
      );
    };
  }, []);

  // ============================================================
  // PROVIDER
  // ============================================================

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

// ============================================================
// HOOK
// ============================================================

export function useNotification() {
  const ctx = useContext(
    NotificationContext
  );

  if (!ctx) {
    throw new Error(
      "useNotification must be inside NotificationProvider"
    );
  }

  return ctx;
}