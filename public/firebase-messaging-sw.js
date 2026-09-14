importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyA1j-2_vGGADVDBnxStaz0O8OE5tbLzY1A",
  authDomain: "meet-my-mate-v2.firebaseapp.com",
  projectId: "meet-my-mate-v2",
  storageBucket: "meet-my-mate-v2.firebasestorage.app",
  messagingSenderId: "587383672520",
  appId: "1:587383672520:web:e116030d0e05f0ea9fdffd",
  measurementId: "G-F7GK0YJ2KB"
});

const messaging = firebase.messaging();

// 🔥 FINAL STABLE BACKGROUND HANDLER
messaging.onBackgroundMessage(function (payload) {
  console.log("🔔 Background message received:", payload);

  const title = payload.notification?.title || "New Notification";
  const body = payload.notification?.body || "You have a new message";

  self.registration.showNotification(title, {
    body: body,
    icon: "/icon.png", // IMPORTANT (add this file in /public)
    badge: "/icon.png",
  });
});