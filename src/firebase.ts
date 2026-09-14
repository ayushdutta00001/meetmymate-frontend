import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA1j-2_vGGADVDBnxStaz0O8OE5tbLzY1A",
  authDomain: "meet-my-mate-v2.firebaseapp.com",
  projectId: "meet-my-mate-v2",
  storageBucket: "meet-my-mate-v2.firebasestorage.app",
  messagingSenderId: "587383672520",
  appId: "1:587383672520:web:e116030d0e05f0ea9fdffd",
  measurementId: "G-F7GK0YJ2KB",
};

// 🚀 Init app
const app = initializeApp(firebaseConfig);

// 🔥 Messaging instance
let messaging: any = null;

export const initMessaging = async () => {
  const supported = await isSupported();

  if (!supported) {
    console.warn("❌ FCM not supported");
    return null;
  }

  if (!messaging) {
    messaging = getMessaging(app);
  }

  return messaging;
};

// ==============================
// 🔑 GET FCM TOKEN (FINAL FIXED)
// ==============================
export const getFCMToken = async () => {
  try {
    const msg = await initMessaging();
    if (!msg) return null;

    if (!("serviceWorker" in navigator)) {
      console.warn("❌ No service worker support");
      return null;
    }

    // 🔥 GET CORRECT SERVICE WORKER (CRITICAL FIX)
    let registration = await navigator.serviceWorker.getRegistration(
      "/firebase-messaging-sw.js"
    );

    // If not found, register it
    if (!registration) {
      registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
    }

    // 🔥 WAIT UNTIL READY
    await navigator.serviceWorker.ready;

    // 🔥 ENSURE ACTIVE
    if (!registration.active) {
      console.log("⏳ Waiting for SW activation...");
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("✅ Using SW:", registration);

    const token = await getToken(msg, {
      vapidKey:
        "BO2ZsCzVjWooz1PlTC6ZHRb2_HoDnYmKOpHrVOa2HqQc4ZnptkxgGB1VR5jHUcy9dVp32qHtfCUdJ9IK2M7FkgQ",
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("❌ No token received");
      return null;
    }

    console.log("📱 FCM TOKEN:", token);

    return token;

  } catch (err) {
    console.error("❌ FCM ERROR:", err);
    return null;
  }
};

// ==============================
// 📩 FOREGROUND LISTENER
// ==============================
export const listenToMessages = async () => {
  const msg = await initMessaging();
  if (!msg) return;

  onMessage(msg, (payload) => {
    console.log("🔥 FOREGROUND MESSAGE:", payload);

    if (Notification.permission === "granted") {
      new Notification(payload.notification?.title || "New Message", {
        body: payload.notification?.body || "",
        icon: "/icon.png",
      });
    }
  });
};