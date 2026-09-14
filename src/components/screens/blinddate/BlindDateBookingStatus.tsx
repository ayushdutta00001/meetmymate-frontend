import React, { useEffect, useState } from "react";
import { getBlindDateBookingStatus } from "../../../lib/user-api";
import { supabase } from "../../../supabase";
import { motion } from 'motion/react';
import {
  ArrowLeft, CheckCircle, Circle, Clock, MapPin, Calendar,
  AlertCircle, MessageCircle, Shield, ChevronRight, Navigation,
  Phone, User, Heart,
} from 'lucide-react';
import { BackButton } from "../../ui/BackButton";

type BookingStatus = 'waiting' | 'matched' | 'confirmed' | 'completed' | 'cancelled';

import type { Screen } from "../../../UserApp";

interface BlindDateBookingStatusProps {
  bookingId?: string;
  onNavigate: (page: Screen, data?: any) => void;
  onBack: () => void;
}

const STATUS_CONFIG = {
  waiting:   { label: 'Waiting for Match',  badgeBg: 'bg-amber-100 dark:bg-amber-900/30',  badgeText: 'text-amber-700 dark:text-amber-400'  },
  matched:   { label: 'Match Found',        badgeBg: 'bg-blue-100 dark:bg-blue-900/30',    badgeText: 'text-blue-700 dark:text-blue-400'    },
  confirmed: { label: 'Meeting Confirmed',  badgeBg: 'bg-green-100 dark:bg-green-900/30',  badgeText: 'text-green-700 dark:text-green-400'  },
  completed: { label: 'Completed',          badgeBg: 'bg-green-100 dark:bg-green-900/30',  badgeText: 'text-green-700 dark:text-green-400'  },
  cancelled: {
  label: 'Refunded',
  badgeBg: 'bg-green-100 dark:bg-green-900/30',
  badgeText: 'text-green-700 dark:text-green-400'
},
};

const TIMELINE_STEPS = [
  "Booking Created",
  "Payment Confirmed",
  "Meeting",
];

const STEP_FOR_STATUS: Record<BookingStatus, number> = {
  waiting: 1,
  matched: 1,
  confirmed: 2,
  completed: 3,
  cancelled: 0,
};

export function BlindDateBookingStatus({
  bookingId,
  onNavigate,
  onBack,
}: BlindDateBookingStatusProps){
 const [booking, setBooking] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [partner, setPartner] = useState<any>(null);
const [showPhone, setShowPhone] = useState(false);
const [reloadKey, setReloadKey] = useState(0);
const [timeRemaining, setTimeRemaining] = useState<number>(0);

useEffect(() => {
  let channel: any;

  async function init() {
    await loadBooking();

  const targetBookingId = bookingId;

if (!targetBookingId) {
  return;
}


if (!targetBookingId) {
  return;
}
    channel = supabase
      .channel("blind-date-booking-status")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "blind_date_bookings",
          filter: `id=eq.${targetBookingId}`,
        },
        () => {
          loadBooking();
        }
      )
      .subscribe();
  }

  init();

  return () => {
    if (channel) {
      supabase.removeChannel(channel);
    }
  };
}, [bookingId, reloadKey]);

useEffect(() => {

    const onFocus = () => {
        setReloadKey(prev => prev + 1);
    };

    window.addEventListener("focus", onFocus);

    return () => {
        window.removeEventListener("focus", onFocus);
    };

}, []);


/* =========================
   24-HOUR MATCHING COUNTDOWN
========================= */
useEffect(() => {
  /*
    Countdown should only run while the
    booking is still pending/waiting.
  */
  if (
    !booking?.matching_deadline_at ||
    booking?.status !== "pending"
  ) {
    setTimeRemaining(0);
    return;
  }

  const updateCountdown = () => {
    const deadline = new Date(
      booking.matching_deadline_at
    ).getTime();

    const remaining = Math.max(
      0,
      deadline - Date.now()
    );

    setTimeRemaining(remaining);
  };

  updateCountdown();

  const interval = window.setInterval(
    updateCountdown,
    1000
  );

  return () => {
    window.clearInterval(interval);
  };
}, [
  booking?.matching_deadline_at,
  booking?.status,
]);

async function loadBooking() {
  try {
  const targetBookingId = bookingId;

if (!targetBookingId) {
  return;
}



if (!targetBookingId) {
  setLoading(false);
  return;
}

const res = await getBlindDateBookingStatus(targetBookingId);

if (res.success) {

    setBooking(res.data);

    setPartner(res.partner ?? null);

    setShowPhone(res.show_phone ?? false);

}

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}

const statusMap: Record<string, BookingStatus> = {
  pending: "waiting",
  confirmed: "confirmed",
  completed: "completed",
  cancelled: "cancelled",
};

const uiStatus =
  statusMap[booking?.status] || "waiting";

 /* =========================
   COUNTDOWN FORMATTER
========================= */
const formatTimeRemaining = (
  milliseconds: number
) => {
  const totalSeconds = Math.max(
    0,
    Math.floor(milliseconds / 1000)
  );

  const days = Math.floor(
    totalSeconds / 86400
  );

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds =
    totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const matchingTimeText =
  formatTimeRemaining(timeRemaining);

const matchingDeadlineReached =
  Boolean(
    booking?.matching_deadline_at &&
    timeRemaining <= 0
  );

const refundCompleted =
  booking?.payment_status === "refunded" ||
  booking?.refund_status === "refunded";

const refundPending =
  booking?.refund_status === "pending" ||
  booking?.refund_status === "processing";

const refundFailed =
  booking?.refund_status === "failed";

 
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0F1F]">
      Loading...
    </div>
  );
}

if (!booking) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0F1F]">
      No booking found.
    </div>
  );
}

 console.log("Booking Status:", booking?.status);
console.log("Meeting Date:", booking?.meeting_date);
console.log("Meeting Location:", booking?.meeting_location);
console.log("UI Status:", uiStatus);


const cfg = STATUS_CONFIG[uiStatus];
const currentStep = STEP_FOR_STATUS[uiStatus];
async function handleCancelBooking() {
  alert("Cancel Booking API not connected yet.");
}
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 bg-white dark:bg-[#0A0F1F]"
      >
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
             
               <BackButton onClick={() => onNavigate("bookings")} />
             
              <div>
                <h2>Blind Date Status</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track your booking in real time</p>
              </div>
            </div>
            {/* Status badge */}
            <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${cfg.badgeBg} ${cfg.badgeText}`}>
              {cfg.label}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

      

        {/* ── Hero status card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          key={`hero-${uiStatus}`}
          className="p-8 rounded-2xl border-2 border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center flex-shrink-0">
              {uiStatus === "confirmed" || uiStatus === "completed"
                ? <Calendar className="w-6 h-6 text-white" />
                : uiStatus === "cancelled"
                  ? <AlertCircle className="w-6 h-6 text-white" />
                  : <Clock className="w-6 h-6 text-white" />
              }
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-blue-900 dark:text-blue-400">
                {uiStatus === 'waiting'   && 'Finding Your Match'}
                {uiStatus === 'matched'   && 'Match Found! 🎉'}
                {uiStatus === 'confirmed' && 'Meeting Confirmed ✓'}
                {uiStatus === 'completed' && 'Meeting Completed 🎊'}
                {uiStatus === 'cancelled' &&
  refundCompleted &&
  'Payment Refunded Successfully'}

{uiStatus === 'cancelled' &&
  !refundCompleted &&
  refundPending &&
  'Refund Being Processed'}

{uiStatus === 'cancelled' &&
  !refundCompleted &&
  !refundPending &&
  refundFailed &&
  'Refund Requires Attention'}

{uiStatus === 'cancelled' &&
  !refundCompleted &&
  !refundPending &&
  !refundFailed &&
  'Booking Cancelled'}
              </h3>
             <p className="text-sm text-blue-800 dark:text-blue-300">
  {uiStatus === 'waiting' &&
    'We are finding a compatible match for you. If no match is created within 24 hours of payment, your full payment will be refunded automatically.'}

  {uiStatus === 'matched' &&
    'A compatible match has been found! We are now scheduling your meeting.'}

  {uiStatus === 'confirmed' &&
    'Your blind date is scheduled. Full meeting details are shown below.'}

  {uiStatus === 'completed' &&
    'Thank you for attending your Blind Date. We hope it went well!'}

  {uiStatus === 'cancelled' &&
    refundCompleted &&
    'No match was created within the 24-hour matching period. Your full payment has been refunded automatically.'}

  {uiStatus === 'cancelled' &&
    !refundCompleted &&
    refundPending &&
    'Your matching period has ended and your automatic refund is being processed.'}

  {uiStatus === 'cancelled' &&
    !refundCompleted &&
    !refundPending &&
    refundFailed &&
    'Your automatic refund could not be completed yet. Please contact support.'}

  {uiStatus === 'cancelled' &&
    !refundCompleted &&
    !refundPending &&
    !refundFailed &&
    'This booking has been cancelled.'}
</p>
            </div>
          </div>

          {/* Progress bar for waiting */}
         {uiStatus === 'waiting' && (
  <div className="pt-6 border-t border-blue-200 dark:border-blue-900/30 space-y-4">

    {/* Matching progress */}
    <div className="flex items-center gap-3 text-sm text-blue-800 dark:text-blue-300">
      <div className="flex-1 h-2 rounded-full bg-blue-200 dark:bg-blue-900/30 overflow-hidden">
        <motion.div
          initial={{ width: '0%' }}
          animate={{
            width: matchingDeadlineReached
              ? '100%'
              : '40%'
          }}
          transition={{
            duration: 1.2,
            ease: 'easeOut'
          }}
          className="h-full bg-blue-600 dark:bg-blue-700"
        />
      </div>

      <span className="whitespace-nowrap">
        Matching in progress...
      </span>
    </div>

    {/* 24-hour countdown */}
    <div className="rounded-xl border border-blue-200 dark:border-blue-900/40 bg-white/70 dark:bg-blue-950/20 p-4">

      <div className="flex items-center justify-between gap-4">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Matching time remaining
            </p>

            <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
              {matchingDeadlineReached
                ? "Matching period ended"
                : matchingTimeText}
            </p>
          </div>
        </div>

        {!matchingDeadlineReached && (
          <div className="text-right">
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Deadline
            </p>

            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {new Date(
                booking.matching_deadline_at
              ).toLocaleString("en-IN")}
            </p>
          </div>
        )}

      </div>

      <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
        If no match is created before this deadline, your full payment will be refunded automatically.
      </p>

    </div>

  </div>
)}
          {/* Match found CTA */}
          {uiStatus === 'matched' && (
            <div className="pt-6 border-t border-blue-200 dark:border-blue-900/30">
              <button
                onClick={() => onNavigate('blind-date-match-found')}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white hover:shadow-lg transition-all font-medium"
              >
                View Match Details & Confirm
              </button>
              <p className="text-xs text-center text-blue-700 dark:text-blue-400 mt-3">
                ⏱️ You have 18 hours remaining to confirm
              </p>
            </div>
          )}

        </motion.div>

       {/* ── Booking Progress ── */}

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.15 }}
  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800"
>

  <div className="flex items-center justify-between mb-3">

    <h4 className="text-sm font-semibold">
      Booking Progress
    </h4>

    <span
      className={`text-[11px] px-3 py-1 rounded-full font-medium ${cfg.badgeBg}`}
    >
      {cfg.label}
    </span>

  </div>

  <div className="relative">

    <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-200 dark:bg-gray-800" />

    <div>

      {TIMELINE_STEPS.map((step, i) => {

      const done =
  uiStatus === "confirmed" ||
  uiStatus === "completed"
    ? i <= currentStep
    : i < currentStep;

const current =
  uiStatus === "waiting"
    ? i === currentStep
    : false;

        return (

          <div
            key={step}
            className="flex items-start gap-3 relative pb-2 last:pb-0"
          >

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 border transition-all

              ${
                done
                  ? "bg-green-500 border-green-500 text-white"

                  : current
                  ? "bg-blue-600 border-blue-600"

                  : "bg-white dark:bg-[#0A0F1F] border-gray-300 dark:border-gray-700"
              }
              `}
            >

              {done ? (

                <CheckCircle className="w-3.5 h-3.5" />

              ) : current ? (

                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                  }}
                  className="w-2 h-2 rounded-full bg-white"
                />

              ) : (

                <Circle className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" />

              )}

            </div>

            <div className="flex-1">

              <p
                className={`text-sm

                ${
                  done
                    ? "text-green-600 dark:text-green-400 font-medium"

                    : current
                    ? "text-blue-600 dark:text-blue-400 font-medium"

                    : "text-gray-400 dark:text-gray-600"
                }
                `}
              >

                {i === 2 && uiStatus === "completed"
  ? "Meeting Completed"
  : step}

              </p>

              {done && i === 0 && (

                <p className="text-[11px] text-gray-400 mt-0.5">
                  {new Date(
                    booking?.created_at
                  ).toLocaleString()}
                </p>

              )}

              {done && i === 1 && (

                <p className="text-[11px] text-gray-400 mt-0.5">
                  Payment received successfully
                </p>

              )}

            {uiStatus === "waiting" && current && (
  <p className="text-[11px] text-blue-500 mt-0.5">
    We're arranging your blind date...
  </p>
)}

{uiStatus === "confirmed" && done && i === 2 && (
  <p className="text-[11px] text-green-500 mt-0.5">
    Your meeting has been scheduled.
  </p>
)}

{uiStatus === "completed" && done && i === 2 && (
  <p className="text-[11px] text-green-500 mt-0.5">
    This booking has been completed.
  </p>
)}

            </div>

          </div>

        );

      })}

    </div>

  </div>

</motion.div>

       
{/* =========================
    Meeting Details
========================= */}

{(uiStatus === "confirmed" || uiStatus === "completed") && (

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="overflow-hidden rounded-2xl border border-green-200 dark:border-green-900/30 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/20 dark:via-[#0A0F1F] dark:to-emerald-950/20"
>

  {/* Header */}

  <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-5 py-4">

    <div className="flex items-center gap-3">

      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
        📍
      </div>

      <div className="flex-1">

        <p className="text-green-100 text-xs uppercase tracking-wider">
          Blind Date
        </p>

        <h3 className="text-white text-xl font-bold">
          Meeting Confirmed
        </h3>

      </div>

      <CheckCircle className="w-8 h-8 text-white" />

    </div>

  </div>

  <div className="p-5 space-y-4">

    {/* Date + Time */}

    <div className="grid grid-cols-2 gap-3">

      <div className="rounded-xl bg-green-200 dark:bg-green-950/20 border border-green-500 dark:border-green-500 p-3">

        <div className="flex items-center gap-2 mb-2">

          <Calendar className="w-4 h-4 text-green-600" />

          <span className="text-[11px] uppercase tracking-wide text-gray-500">
            Date
          </span>

        </div>

        <p className="font-bold text-green-700 dark:text-green-500 text-lg">
          {booking.meeting_date || "-"}
        </p>

      </div>

      <div className="rounded-xl bg-green-200 dark:bg-green-950/20 border border-green-500 dark:border-green-500 p-3">

        <div className="flex items-center gap-2 mb-2">

          <Clock className="w-4 h-4 text-green-600" />

          <span className="text-[11px] uppercase tracking-wide text-gray-500">
            Time
          </span>

        </div>

        <p className="font-bold text-green-700 dark:text-green-500 text-lg">
          {booking.meeting_time || "-"}
        </p>

      </div>

    </div>

    {/* Location */}

    <div className="rounded-xl bg-green-200 dark:bg-green-950/20 border border-green-500 dark:border-green-500 p-4">

      <div className="flex items-start gap-3">

        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">

          <MapPin className="w-5 h-5 text-green-600" />

        </div>

        <div className="flex-1">

          <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
            Meeting Location
          </p>

          <p className="font-semibold text-green-700 dark:text-green-500 text-lg">
            {booking.meeting_location || "Location will be announced"}
          </p>

        </div>

      </div>

    </div>

    {/* Bottom Row */}

    <div className="flex items-center justify-between gap-3">

      <div className="flex-1 rounded-xl border border-dashed border-green-500 dark:border-green-500 px-4 py-3">

        <p className="text-[11px] uppercase tracking-wide text-gray-500">
          Meeting ID
        </p>

        <p className="font-mono font-bold text-green-700 dark:text-green-500 text-lg">
          BD-{booking.id.slice(0,8).toUpperCase()}
        </p>

      </div>

      <button
        onClick={() => {
          if (!booking.meeting_location) return;

          window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              booking.meeting_location
            )}`,
            "_blank"
          );
        }}
        className="h-[58px] px-5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg transition-all flex items-center gap-2 font-medium"
      >

        <Navigation className="w-4 h-4" />

        Maps

      </button>

    </div>

    {/* Notice */}

    <div className="rounded-xl bg-green-950 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3">

      <div className="flex items-center gap-2">

        <CheckCircle className="w-5 h-5 text-green-600" />

        <p className="text-slate-950 dark:text-green-900/80">

          Arrive <strong>10 minutes early</strong> and carry a valid Government ID.

        </p>

      </div>

    </div>

  </div>

</motion.div>

)}

{/* =========================
    Blind Date Partner
========================= */}

{partner &&
  (uiStatus === "confirmed" || uiStatus === "completed") && (

<motion.div
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.35 }}
  className="overflow-hidden rounded-2xl border border-pink-200 dark:border-pink-900/30 bg-gradient-to-br from-pink-50 via-white to-rose-50 dark:from-pink-950/20 dark:via-[#0A0F1F] dark:to-rose-950/20"
>

  {/* Header */}

  <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 px-6 py-5">

    <div className="flex items-center gap-4">

      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl">

        💕

      </div>

      <div>

        <p className="text-pink-100 text-sm">
          Your Blind Date Partner
        </p>

        <h3 className="text-white text-xl font-bold">
          {partner.name}
        </h3>

      </div>

    </div>

  </div>

  {/* Details */}

  <div className="p-6 space-y-5">

    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <MapPin className="w-5 h-5 text-pink-500" />

        <span className="text-gray-600 dark:text-gray-400">
          City
        </span>

      </div>

      <span className="font-semibold">
        {partner.city}
      </span>

    </div>

    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <Calendar className="w-5 h-5 text-pink-500" />

        <span className="text-gray-600 dark:text-gray-400">
          Age
        </span>

      </div>

      <span className="font-semibold">
        {partner.age} Years
      </span>

    </div>

    <div className="flex items-center justify-between">

      <div className="flex items-center gap-3">

        <User className="w-5 h-5 text-pink-500" />

        <span className="text-gray-600 dark:text-gray-400">
          Gender
        </span>

      </div>

      <span className="font-semibold capitalize">
        {partner.gender}
      </span>

    </div>

    <div className="border-t border-pink-100 dark:border-pink-900/30 pt-5">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <Phone className="w-5 h-5 text-pink-500" />

          <span className="text-gray-600 dark:text-gray-400">
            Mobile Number
          </span>

        </div>

      {showPhone ? (

  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35 }}
    className="text-right"
  >

    <p className="font-bold text-green-600 text-xl">
      {partner.phone}
    </p>

    <div className="flex items-center justify-end gap-2 mt-1">

      <CheckCircle className="w-4 h-4 text-green-500" />

      <span className="text-xs text-green-600 font-medium">
        Number Unlocked
      </span>

    </div>

  </motion.div>

) : (

  <div className="text-right max-w-[180px]">

    <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/20 px-3 py-1 rounded-full">

      <Shield className="w-4 h-4 text-amber-600" />

      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
        Protected
      </span>

    </div>

    <p className="text-xs text-gray-500 mt-2 leading-relaxed">

      Your partner's phone number will automatically unlock
      <strong> 2 hours before the meeting.</strong>

    </p>

    <p className="text-[11px] text-blue-500 mt-2">

      📲 You'll receive a notification when it's available.

    </p>

  </div>

)}

      </div>

    </div>

  </div>

</motion.div>

)}

  {/* ── Booking Details ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl border border-gray-200 dark:border-gray-800"
        >
          <h4 className="mb-6">Booking Details</h4>
          <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">

            {/* Booking ID */}
            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-0.5">Booking ID</p>
                <p className="font-mono text-sm">
  BD-{booking.id.slice(0, 8).toUpperCase()}
</p>
              </div>
            </div>

            {/* City */}
            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-0.5">City</p>
                <p>
  {booking.city || "Not specified"}
</p>
              </div>
            </div>

            {/* Preferred Match Gender */}
            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-0.5">Preferred Match Gender</p>
               <p className="capitalize">
  {booking.gender_preference || "No preference"}
</p>
              </div>
            </div>

            {/* Age Preference */}
            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-0.5">Preferred Age Range</p>
                <p>
  {booking.min_age} - {booking.max_age} years
</p>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-start gap-4 py-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Availability</p>
                <div className="flex flex-wrap gap-2">
                {booking.availability?.map((slot: any) => (
  <span
    key={slot.day}
    className="text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 text-blue-700 dark:text-blue-400"
  >
    {slot.day} • {slot.periods.join(", ")}
  </span>
))}
                </div>
              </div>
            </div>

            {/* Preferred Meeting Locations */}
            <div className="flex items-start gap-4 py-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preferred Meeting Locations</p>
                <div className="flex flex-wrap gap-2">
                 {booking.preferred_locations?.map((location: string) => (
  <span
    key={location}
    className="text-xs px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
  >
    • {location}
  </span>
))}
                </div>
              </div>
            </div>

          </div>

<div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">

  <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
    Payment Information
  </h4>

  <div className="space-y-3">

    <div className="flex justify-between">
      <span className="text-gray-500">Amount</span>
      <span className="font-medium">
        ₹{booking.amount}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-500">Payment Status</span>

      <span
        className={`font-medium ${
          booking.payment_status === "paid"
            ? "text-green-600"
            : booking.payment_status === "pending"
            ? "text-yellow-600"
            : "text-red-600"
        }`}
      >
        {booking.payment_status}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-500">Payment Reference</span>

      <span className="font-medium">
        {booking.payment_reference || "Not Available"}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-500">Payment Date</span>
{booking.refund_status && (
  <div className="flex justify-between">
    <span className="text-gray-500">
      Refund Status
    </span>

    <span
      className={`font-medium ${
        booking.refund_status === "refunded"
          ? "text-green-600"
          : booking.refund_status === "processing"
          ? "text-yellow-600"
          : booking.refund_status === "pending"
          ? "text-yellow-600"
          : booking.refund_status === "failed"
          ? "text-red-600"
          : "text-gray-600"
      }`}
    >
      {booking.refund_status}
    </span>
  </div>
)}

{booking.razorpay_refund_id && (
  <div className="flex justify-between gap-4">
    <span className="text-gray-500">
      Refund Reference
    </span>

    <span className="font-medium font-mono text-xs text-right">
      {booking.razorpay_refund_id}
    </span>
  </div>
)}

{booking.refunded_at && (
  <div className="flex justify-between">
    <span className="text-gray-500">
      Refund Date
    </span>

    <span className="font-medium">
      {new Date(
        booking.refunded_at
      ).toLocaleString("en-IN")}
    </span>
  </div>
)}
      <span className="font-medium">
        {booking.payment_paid_at
  ? new Date(
      booking.payment_paid_at
    ).toLocaleString("en-IN")
  : "Not Available"}
      </span>
    </div>

  </div>

</div>

        </motion.div>

        {/* ── Refund Protection ── */}
        {uiStatus !== "completed" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="p-6 rounded-xl border border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10"
        >
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="mb-2 text-blue-900 dark:text-blue-400">100% Refund Protection</h4>
              <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                If we are unable to arrange your Blind Date within the eligible period, your payment will be automatically refunded to your original payment method.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">Guaranteed refund if unmatched</span>
              </div>
            </div>
          </div>
          
        </motion.div>
)}
        {/* ── Safety reminder ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30"
        >
          <div className="flex gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <h4 className="text-amber-900 dark:text-amber-400">Safety Reminders</h4>
          </div>
          <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
            {[
              'Meet only at the assigned public location.',
              'Do not share personal contact details before the meeting.',
              'Carry a valid Government ID at all times.',
              'Report any suspicious behaviour immediately to support.',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="p-6 rounded-xl border border-gray-200 dark:border-gray-800"
>
  <div className="flex items-start gap-4">

    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
      <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    </div>

    <div className="flex-1">

      <h4 className="mb-2">
        Customer Support
      </h4>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Need help regarding your booking? Contact our support team.
      </p>

      <a
        href="tel:+919876543210"
        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
      >
        <Phone className="w-4 h-4" />
        +91 8697429125
      </a>

    </div>

  </div>
</motion.div>
<button
  onClick={() => {
    window.location.href = "tel:+918697429125";
  }}
  className="w-full py-4 rounded-xl bg-blue-600 text-white font-medium"
>
  Contact Support
</button>
        {/* ── Bottom action button ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="space-y-3"
        >
        
          {/* Secondary action — cancel (only while waiting/matched) */}
          {(uiStatus === 'waiting' || uiStatus === 'matched') &&
  !matchingDeadlineReached && (
            <button
            onClick={handleCancelBooking}
              className="w-full py-4 rounded-xl border-2 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all font-medium"
            >
              Cancel Booking
            </button>
          )}

         
        </motion.div>

      </div>
    </div>
  );
}
