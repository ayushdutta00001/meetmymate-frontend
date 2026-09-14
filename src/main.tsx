import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./lib/auth-context";
import { NotificationProvider } from "./lib/NotificationContext";
import { BookingProvider } from './lib/BookingContext';

// 🔥 ADD THIS BLOCK HERE
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((reg) => {
      console.log("✅ SW registered globally:", reg);
    })
    .catch((err) => {
      console.error("❌ SW registration failed:", err);
    });
}

createRoot(document.getElementById("root")!).render(
  <>
    <AuthProvider>
      <NotificationProvider>
        <BookingProvider>
          <App />
        </BookingProvider>
      </NotificationProvider>
    </AuthProvider>
  </>
);