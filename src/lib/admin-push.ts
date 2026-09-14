import { supabase } from "../supabase";
import { getFCMToken } from "../firebase";

export async function registerAdminPushNotifications() {
  try {
    console.log("🚀 Starting admin push setup...");

    // Browser support
    if (!("Notification" in window)) {
      console.warn("Browser notifications are not supported.");
      return;
    }

    // Ask for browser notification permission
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("❌ Admin notification permission denied.");
      return;
    }

    // Get authenticated session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      console.log("❌ No authenticated admin session.");
      return;
    }

    // Get Firebase FCM token
    const token = await getFCMToken();

    if (!token) {
      console.warn("❌ Admin FCM token not available.");
      return;
    }

    console.log("📱 Admin FCM token obtained.");

    // Register token through secure Edge Function
    const { data, error } = await supabase.functions.invoke(
      "register-admin-push-token",
      {
        body: {
          fcm_token: token,
        },
      }
    );

    if (error) {
      console.error(
        "❌ Admin push registration failed:",
        error
      );
      return;
    }

    if (!data?.success) {
      console.error(
        "❌ Admin push registration rejected:",
        data
      );
      return;
    }

    console.log(
      "✅ Admin browser push registered successfully."
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      console.warn(
        "Admin push registration cancelled."
      );
      return;
    }

    console.error(
      "❌ Admin push registration crashed:",
      error
    );
  }
}