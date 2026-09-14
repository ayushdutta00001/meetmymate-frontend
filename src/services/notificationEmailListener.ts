import { supabase } from "../supabase";

interface Notification {
  user_id: string;
  title: string;
  message: string;
  [key: string]: any;
}

export const startNotificationEmailListener = () => {
  console.log("🚀 Email listener started");

  const channel = supabase
    .channel("notification-email-listener")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
      },
      async (payload) => {
        console.log("📩 New notification detected:", payload);

        const notification = payload.new as Notification;

       
        }
      
    )
    .subscribe();

  return channel;
};