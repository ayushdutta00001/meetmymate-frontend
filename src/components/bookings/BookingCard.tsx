import React from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
} from "lucide-react";

/* ===============================
   BOOKING CARD DATA MODEL
================================ */

export interface BookingCardData {
  id: string;
  createdAt?: string | null;
  type: "p2p" | "blind_date" | "service";
  status:
    | "holding"
    | "pending"
    | "confirmed"
    | "completed"
    | "refunded"
    | "cancelled"
    | "awaiting_second_payment"
    | "paid_waiting_admin"
    | "scheduled";

  date?: string;
  time?: string;
  location?: string;

  confirmedDate?: string;
  confirmedTime?: string;
  confirmedLocation?: string;

  // ⭐ ADD THIS
  peerName?: string;
  peerImage?: string;

provider?: {
  name: string;
  image: string;
  rating?: number | null;
};

amount?: number;

serviceName?: string;
}
/* ===============================
   STATUS CONFIGURATION
================================ */

function getStatusConfig(status: BookingCardData["status"]) {
  switch (status) {
    // ===== BLIND DATE STATES =====

    case "holding":
      return {
        icon: Loader,
        bg: "bg-green-50 dark:bg-green-900/10",
        border: "border-yellow-300",
        text: "text-yellow-700 dark:text-yellow-400",
        label: "Holding",
      };

    case "confirmed":
      return {
        icon: CheckCircle,
        bg: "bg-green-50 dark:bg-green-900/10",
        border: "border-green-400",
        text: "text-green-700 dark:text-green-400",
        label: "Confirmed",
      };

    case "completed":
      return {
        icon: CheckCircle,
        bg: "bg-gray-50 dark:bg-gray-900/10",
        border: "border-gray-300",
        text: "text-gray-600 dark:text-gray-400",
        label: "Completed",
      };

    case "refunded":
      return {
        icon: XCircle,
        bg: "bg-amber-50 dark:bg-amber-900/10",
        border: "border-amber-300",
        text: "text-amber-700 dark:text-amber-400",
        label: "Refunded",
      };

    // ===== P2P STATES =====

    case "awaiting_second_payment":
      return {
        icon: Loader,
        bg: "bg-yellow-50 dark:bg-yellow-900/10",
        border: "border-yellow-300",
        text: "text-yellow-700 dark:text-yellow-400",
        label: "Waiting Payment",
      };

    case "paid_waiting_admin":
      return {
        icon: AlertCircle,
        bg: "bg-green-50 dark:bg-green-900/10",
        border: "border-orange-300",
        text: "text-orange-700 dark:text-orange-400",
        label: "Admin Scheduling",
      };

    case "scheduled":
      return {
        icon: CheckCircle,
        bg: "bg-green-50 dark:bg-green-900/10",
        border: "border-green-400",
        text: "text-green-700 dark:text-green-400",
        label: "Meeting Scheduled",
      };

    case "cancelled":
      return {
        icon: XCircle,
        bg: "bg-red-50 dark:bg-red-900/10",
        border: "border-red-300",
        text: "text-red-700 dark:text-red-400",
        label: "Cancelled",
      };

    default:
      return {
        icon: AlertCircle,
        bg: "bg-gray-50",
        border: "border-gray-300",
        text: "text-gray-600",
        label: "Unknown",
      };
  }
}

/* ===============================
   COMPONENT
================================ */

export function BookingCard({
  booking,
  index,
  onClick,
}: {
  meetingId?: string;
  booking: BookingCardData;
  index?: number;
  onClick?: () => void;
}) {
  const config = getStatusConfig(booking.status);
  const isP2P = booking.type === "p2p";

const isAwaitingPayment =
  booking.status === "awaiting_second_payment";

const isWaitingAdmin =
  booking.status === "paid_waiting_admin";
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: (index ?? 0) * 0.08 }}
      onClick={onClick}
     className={`
  p-6 rounded-2xl border-2 relative overflow-hidden
  ${
    booking.type === "service"
      ? "bg-gray-950 border-gray-800 text-white"
      : booking.type === "blind_date"
      ? "bg-slate-950 border-pink-900/60 text-white shadow-lg shadow-pink-900/10"
      : `${config.border} ${config.bg}`
  }
  ${isP2P ? "shadow-lg shadow-blue-500/10" : ""}
`}
    >

      {booking.type === "service" && (
  <div className="mb-4">
    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-400 text-white shadow-lg shadow-violet-500/30 border border-violet-300/20">
      RENT A FRIEND
    </span>
  </div>
)}

{booking.type === "blind_date" && (
  <div className="mb-4">
    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/20">
      BLIND DATE
    </span>
  </div>
)}
      {/* STATUS HEADER */}
      <div className="flex justify-between mb-6 items-center">
  <div className="flex items-center gap-2">
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${config.border}`}>
      <StatusIcon
        className={`w-4 h-4 ${config.text} ${
          booking.status === "holding" ? "animate-spin" : ""
        }`}
      />
      <span className={`text-sm font-medium ${config.text}`}>
        {config.label}
      </span>
    </div>
{booking.type === "service" && booking.provider && (
  <div className="flex items-center gap-4 mb-6">
    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-blue-900/10 border border-blue-300">
      <img
        src={booking.provider.image}
        alt={booking.provider.name}
        className="w-full h-full object-cover"
      />
    </div>

    <div className="flex-1">
      <p className="text-sm text-gray-500">
        Your Companion
      </p>

      <h3 className="font-semibold text-lg">
        {booking.provider.name}
      </h3>

      {booking.serviceName && (
        <p className="text-sm text-blue-600 dark:text-blue-400">
          {booking.serviceName}
        </p>
      )}
    </div>

    {booking.amount && (
      <div className="text-right">
        <p className="text-xs text-gray-500">
          Total
        </p>

        <p className="font-bold text-lg text-green-600">
          ₹{booking.amount}
        </p>
      </div>
    )}
  </div>
)}
    {isP2P && (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow">
        P2P Meeting
      </span>
    )}
  </div>

  <span className="text-sm text-gray-500">
    ID: {booking.id}
  </span>
</div>

{isP2P && (
  <div className="flex items-center gap-4 mb-6">
    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
      {booking.peerImage ? (
        <img
          src={booking.peerImage}
          alt={booking.peerName}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-lg">
          {booking.peerName?.charAt(0)}
        </div>
      )}
    </div>
    <div>
      <p className="text-sm text-gray-500">Meeting With</p>
      <p className="font-semibold">{booking.peerName}</p>
    </div>
  </div>
)}

{isP2P && (
  <div className="mb-4">
    {isAwaitingPayment && (
      <div className="px-4 py-2 rounded-xl bg-yellow-50 border border-yellow-300 text-yellow-700 text-sm">
        Waiting for other participant to complete payment.
      </div>
    )}

    {isWaitingAdmin && (
      <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-300 text-blue-700 text-sm">
        Both payments received. Admin is scheduling your meeting.
      </div>
    )}

    {booking.status === "scheduled" && (
      <div className="px-4 py-2 rounded-xl bg-green-50 border border-green-300 text-green-700 text-sm">
        Meeting scheduled successfully.
      </div>
    )}
  </div>
)}
      {/* DETAILS */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">

          {booking.location && (
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>{booking.location}</span>
            </div>
          )}

          {booking.date && (
            <div className="flex gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span>{booking.date}</span>
            </div>
          )}

          {booking.time && (
            <div className="flex gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span>{booking.time}</span>
            </div>
          )}
        </div>
{booking.createdAt && (
  <div className="flex items-center gap-3">
    <Clock className="w-5 h-5 text-gray-400" />

    <span className="text-sm">
      Booked on{" "}
      {new Date(booking.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}
      {" at "}
      {new Date(booking.createdAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  </div>
)}
      </div>
    </motion.div>
  );
}