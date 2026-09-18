import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../supabase";
import { motion } from "motion/react";
import { Card } from "../Card";

import {
  Bell,
  Heart,
  Calendar,
  MessageCircle,
  DollarSign,
  UserCheck,
  Sparkles,
  CheckCheck,
  Trash2,
  CheckCircle2,
} from "lucide-react";

interface NotificationsScreenProps {
  onNavigate: (page: string, payload?: any) => void;
  setSelectedMeetingId: (id: string) => void;
  onBack?: () => void;
}

interface Notification {
  booking_id?: string;
  reference_type?: string;
  reference_id?: string;
  module?: string;
  metadata?: any;
  image?: string;
  actionPage?: string;
  actionText?: string;

  id: string;
  title: string;
  message: string;
  link?: string;
  created_at: string;
  is_read: boolean;

  table_source:
    | "notifications"
    | "blind_date_notifications"
    | "p2p_notifications";

  type?: string;
}

export function NotificationsScreen({
  onNavigate,
  setSelectedMeetingId,
  onBack,
}: NotificationsScreenProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ============================================================
  // LOAD NOTIFICATIONS
  // ============================================================

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        console.log("AUTH USER:", user);

        if (!user) {
          setNotifications([]);
          return;
        }

        // --------------------------------------------------------
        // NORMAL NOTIFICATIONS
        // --------------------------------------------------------

        const normalResult = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id);

        console.log("NORMAL:", normalResult);

        // --------------------------------------------------------
        // BLIND DATE NOTIFICATIONS
        // --------------------------------------------------------

        const blindDateResult = await supabase
          .from("blind_date_notifications")
          .select("*")
          .eq("user_id", user.id);

        console.log("BLIND DATE RESULT:", blindDateResult);
        console.log("BLIND DATE DATA:", blindDateResult.data);
        console.log("BLIND DATE ERROR:", blindDateResult.error);

        // --------------------------------------------------------
        // P2P NOTIFICATIONS
        // --------------------------------------------------------

        const p2pResult = await supabase
          .from("p2p_notifications")
          .select("*")
          .eq("user_id", user.id);

        console.log("P2P RESULT:", p2pResult);
        console.log("P2P DATA:", p2pResult.data);
        console.log("P2P ERROR:", p2pResult.error);

        // --------------------------------------------------------
        // NORMALIZE NORMAL NOTIFICATIONS
        // --------------------------------------------------------

        const normalNotifications: Notification[] =
          (normalResult.data || []).map((n) => ({
            ...n,
            table_source: "notifications" as const,
          }));

        // --------------------------------------------------------
        // NORMALIZE BLIND DATE NOTIFICATIONS
        // --------------------------------------------------------

        const blindDateNotifications: Notification[] =
          (blindDateResult.data || []).map((n) => ({
            ...n,
            table_source: "blind_date_notifications" as const,
            type: "blind_date",
            module: "Blind Date",
          }));

        // --------------------------------------------------------
        // NORMALIZE P2P NOTIFICATIONS
        // --------------------------------------------------------

        const p2pNotifications: Notification[] =
          (p2pResult.data || []).map((n) => ({
            ...n,
            table_source: "p2p_notifications" as const,
            module: "Business Meetup",
          }));

        // --------------------------------------------------------
        // MERGE
        // --------------------------------------------------------

        const merged = [
          ...normalNotifications,
          ...blindDateNotifications,
          ...p2pNotifications,
        ];

        // --------------------------------------------------------
        // SORT NEWEST FIRST
        // --------------------------------------------------------

        merged.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );

        console.log("MERGED:", merged);

        setNotifications(merged);

        // --------------------------------------------------------
        // UPDATE GLOBAL UNREAD COUNT
        // --------------------------------------------------------

        window.dispatchEvent(
          new CustomEvent("notificationsUpdated", {
            detail: merged.filter((n) => !n.is_read).length,
          })
        );
      } catch (error) {
        console.error("Notifications loading error:", error);
      }
    };

    fetchNotifications();
  }, []);

  // ============================================================
  // REALTIME
  // ============================================================

  useEffect(() => {
    let channel: any;

    const setupRealtime = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      console.log("🔌 Subscribing for user:", user.id);

      channel = supabase
        .channel(`user-notifications-${user.id}`)

        // ======================================================
        // NORMAL NOTIFICATIONS REALTIME
        // ======================================================

        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("🔥 NORMAL REALTIME TRIGGERED:", payload);

            if (payload.eventType === "INSERT") {
              const newNotification: Notification = {
                ...(payload.new as Notification),
                table_source: "notifications",
              };

              toast.custom(() => (
                <div className="bg-[#0A0F1F] border border-gray-700 text-white px-4 py-3 rounded-xl shadow-lg">
                  <p className="font-semibold">
                    {newNotification.title}
                  </p>

                  <p className="text-sm text-gray-400">
                    {newNotification.message}
                  </p>
                </div>
              ));

              const audio = new Audio("/notification.mp3");
              audio.play().catch(() => {});

              setNotifications((prev) => {
                const updated = [
                  newNotification,
                  ...prev.filter(
                    (n) => n.id !== newNotification.id
                  ),
                ];

                window.dispatchEvent(
                  new CustomEvent("notificationsUpdated", {
                    detail: updated.filter(
                      (n) => !n.is_read
                    ).length,
                  })
                );

                return updated;
              });
            }
          }
        )

        // ======================================================
        // BLIND DATE REALTIME
        // ======================================================

        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "blind_date_notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log(
              "🔥 BLIND DATE REALTIME TRIGGERED:",
              payload
            );

            if (payload.eventType === "INSERT") {
              const newNotification: Notification = {
                ...(payload.new as Notification),
                table_source:
                  "blind_date_notifications",
                type: "blind_date",
                module: "Blind Date",
              };

              toast.custom(() => (
                <div className="bg-[#0A0F1F] border border-gray-700 text-white px-4 py-3 rounded-xl shadow-lg">
                  <p className="font-semibold">
                    {newNotification.title}
                  </p>

                  <p className="text-sm text-gray-400">
                    {newNotification.message}
                  </p>
                </div>
              ));

              const audio = new Audio(
                "/notification.mp3"
              );

              audio.play().catch(() => {});

              setNotifications((prev) => {
                const updated = [
                  newNotification,
                  ...prev.filter(
                    (n) => n.id !== newNotification.id
                  ),
                ];

                window.dispatchEvent(
                  new CustomEvent("notificationsUpdated", {
                    detail: updated.filter(
                      (n) => !n.is_read
                    ).length,
                  })
                );

                return updated;
              });
            }
          }
        )

        // ======================================================
        // P2P REALTIME
        // ======================================================

        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "p2p_notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log(
              "🔥 P2P REALTIME TRIGGERED:",
              payload
            );

            if (payload.eventType === "INSERT") {
              const newNotification: Notification = {
                ...(payload.new as Notification),
                table_source:
                  "p2p_notifications",
                module: "Business Meetup",
              };

              toast.custom(() => (
                <div className="bg-[#0A0F1F] border border-gray-700 text-white px-4 py-3 rounded-xl shadow-lg">
                  <p className="font-semibold">
                    {newNotification.title}
                  </p>

                  <p className="text-sm text-gray-400">
                    {newNotification.message}
                  </p>
                </div>
              ));

              const audio = new Audio(
                "/notification.mp3"
              );

              audio.play().catch(() => {});

              setNotifications((prev) => {
                const updated = [
                  newNotification,
                  ...prev.filter(
                    (n) => n.id !== newNotification.id
                  ),
                ];

                window.dispatchEvent(
                  new CustomEvent("notificationsUpdated", {
                    detail: updated.filter(
                      (n) => !n.is_read
                    ).length,
                  })
                );

                return updated;
              });
            }
          }
        )

        .subscribe((status) => {
          console.log(
            "📡 Notification realtime status:",
            status
          );
        });
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // ============================================================
  // ICON
  // ============================================================

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "match":
        return <Heart className="w-5 h-5" />;

      case "booking":
        return <Calendar className="w-5 h-5" />;

      case "message":
        return <MessageCircle className="w-5 h-5" />;

      case "payment":
        return <DollarSign className="w-5 h-5" />;

      case "provider":
        return <UserCheck className="w-5 h-5" />;

      case "blind_date":
        return (
          <Heart className="w-5 h-5 text-pink-500" />
        );

      case "p2p_request_accepted":
        return (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        );

      case "p2p_profile_expired":
        return <Bell className="w-5 h-5" />;

      case "system":
        return <Sparkles className="w-5 h-5" />;

      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  // ============================================================
  // COLOR
  // ============================================================

  const getNotificationColor = (type?: string) => {
    switch (type) {
      case "match":
        return "from-pink-500 to-rose-500";

      case "booking":
        return "from-blue-500 to-indigo-500";

      case "message":
        return "from-green-500 to-emerald-500";

      case "payment":
        return "from-yellow-500 to-amber-500";

      case "provider":
        return "from-purple-500 to-violet-500";

      case "p2p_profile_expired":
        return "from-orange-500 to-amber-500";

      case "blind_date":
        return "from-pink-500 to-rose-500";

      case "system":
        return "from-cyan-500 to-teal-500";

      default:
        return "from-gray-500 to-gray-600";
    }
  };

  // ============================================================
  // MARK AS READ
  // ============================================================

  const markAsRead = async (
    notification: Notification
  ) => {
    const { error } = await supabase
      .from(notification.table_source)
      .update({
        is_read: true,
      })
      .eq("id", notification.id);

    if (error) {
      console.error(
        "Mark as read failed:",
        error
      );
      return;
    }

    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === notification.id
          ? {
              ...n,
              is_read: true,
            }
          : n
      );

      window.dispatchEvent(
        new CustomEvent("notificationsUpdated", {
          detail: updated.filter(
            (n) => !n.is_read
          ).length,
        })
      );

      return updated;
    });
  };

  // ============================================================
  // MARK ALL AS READ
  // ============================================================

  const markAllAsRead = async () => {
    const unreadNotifications =
      notifications.filter(
        (n) => !n.is_read
      );

    for (const notification of unreadNotifications) {
      await supabase
        .from(notification.table_source)
        .update({
          is_read: true,
        })
        .eq("id", notification.id);
    }

    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        is_read: true,
      }))
    );

    window.dispatchEvent(
      new CustomEvent("notificationsUpdated", {
        detail: 0,
      })
    );
  };

  // ============================================================
  // DELETE
  // ============================================================

  const deleteNotification = async (
    notification: Notification
  ) => {
    const { error } = await supabase
      .from(notification.table_source)
      .delete()
      .eq("id", notification.id);

    if (error) {
      console.error(
        "Delete failed:",
        error
      );
      return;
    }

    setNotifications((prev) => {
      const updated = prev.filter(
        (n) => n.id !== notification.id
      );

      window.dispatchEvent(
        new CustomEvent("notificationsUpdated", {
          detail: updated.filter(
            (n) => !n.is_read
          ).length,
        })
      );

      return updated;
    });
  };

  // ============================================================
  // GROUP
  // ============================================================

  const groupNotifications = (
    items: Notification[]
  ) => {
    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const earlier: Notification[] = [];

    const now = new Date();

    items.forEach((notification) => {
      const created = new Date(
        notification.created_at
      );

      const diff =
        now.getTime() -
        created.getTime();

      const days =
        diff /
        (1000 * 60 * 60 * 24);

      if (
        days < 1 &&
        created.getDate() ===
          now.getDate()
      ) {
        today.push(notification);
      } else if (days < 2) {
        yesterday.push(notification);
      } else {
        earlier.push(notification);
      }
    });

    return {
      today,
      yesterday,
      earlier,
    };
  };

  // ============================================================
  // NOTIFICATION CLICK
  // ============================================================

  const handleNotificationClick = (
    notification: Notification
  ) => {
    console.log(
      "CLICKED NOTIFICATION:",
      notification
    );

    markAsRead(notification);

    // ----------------------------------------------------------
    // P2P REQUEST
    // ----------------------------------------------------------

    if (
      notification.table_source ===
        "notifications" &&
      (
        notification.type ===
          "p2p_request" ||
        notification.type ===
          "p2p_request_accepted"
      )
    ) {
      onNavigate("p2p-requests-hub");
      return;
    }

    // ----------------------------------------------------------
    // P2P PROFILE EXPIRED
    // ----------------------------------------------------------

    if (
      notification.table_source ===
        "p2p_notifications" &&
      notification.type ===
        "p2p_profile_expired"
    ) {
      onNavigate("p2p-peer-listing");
      return;
    }

    // ----------------------------------------------------------
    // P2P MEETING SCHEDULED
    // ----------------------------------------------------------

    if (
      notification.type ===
        "p2p_meeting_scheduled" &&
      notification.reference_id
    ) {
      console.log(
        "📅 P2P MEETING NOTIFICATION CLICKED:",
        notification.reference_id
      );

      setSelectedMeetingId(
        notification.reference_id
      );

      onNavigate(
        "p2p-meeting-confirmation"
      );

      return;
    }

    // ----------------------------------------------------------
    // P2P GENERAL NOTIFICATION
    // ----------------------------------------------------------

    if (
      notification.table_source ===
        "p2p_notifications" &&
      notification.reference_id
    ) {
      console.log(
        "📅 P2P NOTIFICATION CLICKED:",
        notification.reference_id
      );

      setSelectedMeetingId(
        notification.reference_id
      );

      onNavigate(
        "p2p-meeting-confirmation"
      );

      return;
    }

    // ----------------------------------------------------------
    // BLIND DATE
    // ----------------------------------------------------------

    if (
      notification.table_source ===
        "blind_date_notifications"
    ) {
      console.log(
        "❤️ BLIND DATE NOTIFICATION CLICKED:",
        notification.booking_id
      );

      if (notification.booking_id) {
        onNavigate(
          "blind-date-booking-status",
          notification.booking_id
        );
      }

      return;
    }

    // ----------------------------------------------------------
    // OTHER NORMAL NOTIFICATIONS
    // ----------------------------------------------------------

    if (notification.link) {
      onNavigate(notification.link);
    }
  };

  // ============================================================
  // FILTER
  // ============================================================

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter(
          (n) => !n.is_read
        )
      : notifications;

  const groupedNotifications =
    groupNotifications(
      filteredNotifications
    );

  const unreadCount =
    notifications.filter(
      (n) => !n.is_read
    ).length;

  // ============================================================
  // CARD
  // ============================================================

  const renderNotificationCard = (
    notification: Notification,
    index: number
  ) => (
    <motion.div
      key={notification.id}
      initial={{
        opacity: 0,
        x: -20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        delay: index * 0.05,
      }}
    >
      <Card
        variant="glass"
        hover={true}
        onClick={() =>
          handleNotificationClick(
            notification
          )
        }
      >
        <div className="flex items-start gap-4">

          {/* Avatar / Icon */}
          {notification.metadata
            ?.sender_avatar ? (
            <img
              src={
                notification.metadata
                  .sender_avatar
              }
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br ${getNotificationColor(
                notification.type
              )} flex items-center justify-center text-white`}
            >
              {getNotificationIcon(
                notification.type
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1">

            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">

              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                {notification.metadata
                  ?.sender_name ||
                  "User"}
              </span>

              {notification.module && (
                <span className="px-2 py-[2px] text-[10px] rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                  {notification.module.toUpperCase()}
                </span>
              )}

              <span className="text-xs text-gray-400">
                {new Date(
                  notification.created_at
                ).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </span>

              {!notification.is_read && (
                <span className="w-2 h-2 bg-blue-500 rounded-full ml-1 animate-pulse" />
              )}
            </div>

            {/* Message */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {notification.metadata
                ?.purpose
                ? `Wants to collaborate on ${notification.metadata.purpose}`
                : notification.message}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3">

              {!notification.is_read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(
                      notification
                    );
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Mark as read
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(
                    notification
                  );
                }}
                className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>

            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">

      {/* Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">

          <div className="flex items-center justify-between mb-4">

            <div>
              <h2 className="mb-1">
                Notifications
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1
                        ? "s"
                        : ""
                    }`
                  : "All caught up!"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all text-sm"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}

          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">

            <button
              onClick={() =>
                setFilter("all")
              }
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                filter === "all"
                  ? "bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All ({notifications.length})
            </button>

            <button
              onClick={() =>
                setFilter("unread")
              }
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                filter === "unread"
                  ? "bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Unread ({unreadCount})
            </button>

          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <div className="max-w-4xl mx-auto px-4 py-6">

        {filteredNotifications.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Bell className="w-10 h-10 text-white" />
            </div>

            <h3 className="mb-2">
              No Notifications
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filter === "unread"
                ? "You're all caught up!"
                : "No notifications yet"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">

            {/* TODAY */}
            {groupedNotifications.today.length >
              0 && (
              <div>
                <h4 className="text-xs text-gray-400 font-semibold mb-2">
                  Today
                </h4>

                <div className="space-y-3">
                  {groupedNotifications.today.map(
                    renderNotificationCard
                  )}
                </div>
              </div>
            )}

            {/* YESTERDAY */}
            {groupedNotifications.yesterday.length >
              0 && (
              <div>
                <h4 className="text-xs text-gray-400 font-semibold mb-2">
                  Yesterday
                </h4>

                <div className="space-y-3">
                  {groupedNotifications.yesterday.map(
                    renderNotificationCard
                  )}
                </div>
              </div>
            )}

            {/* EARLIER */}
            {groupedNotifications.earlier.length >
              0 && (
              <div>
                <h4 className="text-xs text-gray-400 font-semibold mb-2">
                  Earlier
                </h4>

                <div className="space-y-3">
                  {groupedNotifications.earlier.map(
                    renderNotificationCard
                  )}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}