import { supabase } from "../supabase";
import { getFCMToken } from "../firebase";

export async function registerPushNotifications() {
  try {
    console.log("🚀 Starting push setup...");

    // Browser support
    if (!("Notification" in window)) {
      console.warn("Notifications are not supported.");
      return;
    }

    // Ask permission
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("❌ Notification permission denied.");
      return;
    }

    // Wait until auth is ready
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      console.log("No authenticated user.");
      return;
    }

    const user = session.user;

    // Get FCM Token
    const token = await getFCMToken();

    if (!token) {
      console.warn("FCM token not available.");
      return;
    }

    console.log("📱 FCM Token:", token);

    // Save only if changed
    const { data: existing } = await supabase
      .from("users")
      .select("fcm_token")
      .eq("id", user.id)
      .maybeSingle();

    if (existing?.fcm_token === token) {
      console.log("FCM token already up to date.");
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({
        fcm_token: token,
      })
      .eq("id", user.id);

    if (error) {
      console.error("Failed to save FCM token:", error);
      return;
    }

    console.log("✅ FCM token saved successfully.");

  } catch (err) {

    if (
      err instanceof Error &&
      err.name === "AbortError"
    ) {
      console.warn("Push registration cancelled.");
      return;
    }

    console.error("Push registration failed:", err);
  }
}