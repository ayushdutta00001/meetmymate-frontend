import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  User,
  BadgeCheck,
  MessageSquare,
} from "lucide-react";

import { supabase } from "../../../supabase";

interface Props {
  bookingId?: string;
  onBack: () => void;
}

export function RentFriendBookingDetails({
  bookingId,
  onBack,
}: Props) {

  const [booking, setBooking] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  useEffect(() => {

  if (!bookingId) return;

  const channel = supabase
    .channel(`booking-${bookingId}`)

    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "rent_friend_bookings",
        filter: `id=eq.${bookingId}`,
      },

      (payload) => {

        console.log(
          "BOOKING UPDATED:",
          payload.new
        );

        fetchBooking();

      }
    )

    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };

}, [bookingId]);
function TimelineItem({
  title,
  time,
}: {
  title: string;
  time: string;
}) {
  return (
    <div className="flex gap-3">

      <div
        className="
          w-3
          h-3

          mt-2

          rounded-full

          bg-green-400

          shadow-[0_0_10px_rgba(74,222,128,0.8)]
        "
      />

      <div>
        <p className="font-medium text-white">
          {title}
        </p>

        <p className="text-sm text-gray-400">
          {new Date(time).toLocaleString(
  "en-IN",
  {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }
)}
        </p>
      </div>

    </div>
  );
}
  const fetchBooking = async () => {

    if (!bookingId) {
      setLoading(false);
      return;
    }

console.log("BOOKING ID RECEIVED:", bookingId);
console.log("TYPE:", typeof bookingId);

    const { data, error } = await supabase
      .from("rent_friend_bookings")
      .select(`
        *,
        providers (
          full_name,
          profile_photo_url,
          avg_rating,
          phone
        )
      `)
      .eq("id", bookingId)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setBooking(data);
    console.log("BOOKING DATA", data);
console.log("PROVIDER PHONE", data.providers?.phone);
    setLoading(false);
  };

  if (loading || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading booking...
      </div>
    );
  }
  
  const getStatusLabel = (
  status: string
) => {

  switch (status) {

    case "confirmed":
      return "Confirmed";

    case "provider_en_route":
      return "Provider On The Way";

    case "provider_arrived":
      return "Provider Arrived";

    case "in_progress":
      return "Session In Progress";

    case "awaiting_customer_confirmation":
      return "Awaiting Your Confirmation";

    case "completed":
      return "Completed";

    default:
      return status;
  }

};

 
const confirmCompletion = async () => {

  try {

    const { data, error } =
      await supabase.functions.invoke(
        "complete-rent-friend-booking",
        {
          body: {
            bookingId: booking.id,
          },
        }
      );

    console.log(
      "COMPLETE BOOKING RESPONSE:",
      data
    );

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    await fetchBooking();

    alert(
      "Booking completed successfully"
    );

  } catch (err) {

    console.error(err);

    alert(
      "Failed to complete booking"
    );

  }

};
 return (
  <div className="min-h-screen bg-gradient-to-b from-[#020817] via-[#071226] to-[#0A0F1F] text-white overflow-x-hidden">

    {/* TOP GLOW */}
    <div className="absolute top-0 left-0 w-full h-96 bg-blue-500/10 blur-[120px] pointer-events-none" />

    <div className="relative max-w-5xl mx-auto px-4 py-8">

      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="
          mb-8 flex items-center gap-2
          text-blue-300 hover:text-white
          transition-colors
        "
      >
        ← Back
      </button>

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          relative overflow-hidden
          rounded-[36px]
          border border-white/10
          bg-white/5
          backdrop-blur-2xl
          shadow-[0_0_60px_rgba(0,0,0,0.45)]
        "
      >

        {/* HEADER */}
        <div className="relative p-8 md:p-10">

          {/* HEADER GLOW */}
          <div className="
            absolute top-0 right-0
            w-72 h-72
            bg-blue-500/10
            blur-[120px]
            rounded-full
          " />

          <div className="relative flex flex-col md:flex-row md:items-center gap-8">

            {/* PROFILE */}
            <div className="relative">

              <img
                src={booking.providers?.profile_photo_url}
                className="
                  w-32 h-32
                  rounded-[30px]
                  object-cover
                  border-4 border-white/10
                  shadow-2xl
                "
              />

              <div className="
                absolute -bottom-3 left-1/2 -translate-x-1/2
                px-4 py-2 rounded-full
                bg-gradient-to-r from-green-400 to-emerald-500
                text-black text-sm font-bold
                shadow-xl
              ">
               {getStatusLabel(
  booking.booking_status
)}
              </div>
            </div>

            {/* INFO */}
            <div className="flex-1">

              <p className="text-blue-300 text-sm tracking-[0.25em] uppercase mb-2">
                Booking Details
              </p>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {booking.providers?.full_name}
              </h1>

              <p className="text-xl text-gray-300 mt-3 capitalize">
                {booking.service_type?.replace("-", " ")}
              </p>
<div className="mt-4 flex items-center gap-3">

 <div
  onClick={() => {
    navigator.clipboard.writeText(
      booking.providers?.phone || ""
    );
    alert("Phone number copied.");
  }}
  className="
    cursor-pointer
    px-4 py-3
    rounded-xl
    bg-blue-500/10
    border border-blue-500/30
    text-blue-400
    font-semibold
    text-center
    hover:bg-blue-500/20
  "
>
  📞 {booking.providers?.phone || "No phone number"}
</div>

  <a
    href={`https://wa.me/91${booking.providers?.phone}`}
    target="_blank"
    rel="noopener noreferrer"
    className="
      px-4 py-2
      rounded-xl
      bg-emerald-500/20
      border border-emerald-500/30
      text-emerald-300
      font-medium
      hover:bg-emerald-500/30
      transition
    "
  >
    💬 WhatsApp
  </a>

</div>
              {/* STATS */}
              <div className="flex flex-wrap gap-4 mt-8">

                <div className="
                  px-5 py-3 rounded-2xl
                  bg-white/5 border border-white/10
                  backdrop-blur-xl
                ">
                  <p className="text-xs text-gray-400 mb-1">
                    Total Paid
                  </p>

                  <p className="text-2xl font-bold text-green-400">
                    ₹{booking.total_amount}
                  </p>
                </div>

                <div className="
                  px-5 py-3 rounded-2xl
                  bg-white/5 border border-white/10
                ">
                  <p className="text-xs text-gray-400 mb-1">
                    Duration
                  </p>

                  <p className="text-xl font-semibold">
                    {booking.duration_hours} Hours
                  </p>
                </div>

                <div className="
                  px-5 py-3 rounded-2xl
                  bg-white/5 border border-white/10
                ">
                  <p className="text-xs text-gray-400 mb-1">
                    Payment
                  </p>

                  <p className="text-xl font-semibold capitalize">
                    {booking.payment_status}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

      {/* BODY */}

<div className="px-8 md:px-10 pb-10">

  {booking.booking_status ===
    "awaiting_customer_confirmation" && (

    <div
      className="
        mb-6

        rounded-[28px]

        border border-green-500/20

        bg-green-500/10

        p-6

        backdrop-blur-xl
      "
    >
      <h2 className="text-2xl font-bold text-green-300">
        Session Completed
      </h2>

      <p className="mt-3 text-white/80">
        Your provider has marked this
        booking as completed.

        Please confirm the session was
        completed successfully.
      </p>

      <div className="flex gap-4 mt-6">

        <button
          onClick={confirmCompletion}
          className="
            px-6 py-3

            rounded-xl

            bg-green-500

            text-white

            font-semibold
          "
        >
          Confirm Completion
        </button>

        <button
          className="
            px-6 py-3

            rounded-xl

            bg-red-500/10

            border border-red-500/20

            text-red-300
          "
        >
          Report Problem
        </button>

      </div>

    </div>

  )}

  <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT CARD */}
          <div className="
            rounded-[28px]
            bg-white/5
            border border-white/10
            p-6
            backdrop-blur-xl
          ">

            <h3 className="text-xl font-semibold mb-6">
              Meeting Information
            </h3>

            <div className="space-y-6">

              <div className="flex items-start gap-4">
                <div className="
                  p-3 rounded-2xl
                  bg-blue-500/10
                ">
                  <Calendar className="w-5 h-5 text-blue-300" />
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Date
                  </p>

                  <p className="text-lg font-medium">
                    {booking.booking_date}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="
                  p-3 rounded-2xl
                  bg-purple-500/10
                ">
                  <Clock className="w-5 h-5 text-purple-300" />
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Time
                  </p>

                  <p className="text-lg font-medium">
                    {booking.booking_time}
                  </p>
                </div>
              </div>

             <div className="flex items-start gap-4">

  <div
    className="
      p-3 rounded-2xl
      bg-pink-500/10
    "
  >
    <MapPin className="w-5 h-5 text-pink-300" />
  </div>

  <div className="flex-1">

    <p className="text-sm text-gray-400">
      Meetup Location
    </p>

    <div
      className="
        mt-3
        p-4

        rounded-2xl

        bg-cyan-500/10
        border border-cyan-500/20
      "
    >
      <p className="text-lg font-semibold text-cyan-200">
        📍 {booking.meetup_location}
      </p>
    </div>

    <a
      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        booking.meetup_location
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-flex
        items-center
        gap-2

        mt-3

        px-4 py-2

        rounded-xl

        bg-blue-500/10
        border border-blue-500/20

        text-blue-300

        hover:bg-blue-500/20

        transition-all
      "
    >
      🗺️ Open in Google Maps
    </a>

  </div>

</div>
<div className="flex items-start gap-4">
  <div className="p-3 rounded-2xl bg-amber-500/10">
    <MessageSquare className="w-5 h-5 text-amber-300" />
  </div>

  <div>
    <p className="text-sm text-gray-400">
      Additional Notes
    </p>

    <p className="text-lg font-medium">
      {booking.special_request || "No notes"}
    </p>
  </div>
</div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="
            rounded-[28px]
            bg-white/5
            border border-white/10
            p-6
            backdrop-blur-xl
          ">

            <h3 className="text-xl font-semibold mb-6">
              Booking Summary
            </h3>

            <div className="space-y-5">

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Booking ID
                </span>

                <span className="font-medium text-right max-w-[180px] break-all">
                  {booking.id}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Status
                </span>

               <span>
  {getStatusLabel(
    booking.booking_status
  )}
</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Payment Status
                </span>

                <span className="capitalize">
                  {booking.payment_status}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Created
                </span>

                <span>
                  {new Date(
                    booking.created_at
                  ).toLocaleDateString()}
                </span>
              </div>

            </div>

{/* TIMELINE */}

<div
  className="
    mt-8

    p-5

    rounded-2xl

    bg-white/5

    border border-white/10
  "
>
  <h4 className="font-semibold text-lg mb-5">
    Booking Timeline
  </h4>

  <div className="space-y-4">

    {booking.accepted_at && (
      <TimelineItem
        title="Booking Accepted"
        time={booking.accepted_at}
      />
    )}

    {booking.journey_started_at && (
      <TimelineItem
        title="Journey Started"
        time={booking.journey_started_at}
      />
    )}

    {booking.arrived_at && (
      <TimelineItem
        title="Provider Arrived"
        time={booking.arrived_at}
      />
    )}

    {booking.session_started_at && (
      <TimelineItem
        title="Session Started"
        time={booking.session_started_at}
      />
    )}

    {booking.session_ended_at && (
      <TimelineItem
        title="Session Ended"
        time={booking.session_ended_at}
      />
    )}

    {booking.customer_confirmed_at && (
      <TimelineItem
        title="Customer Confirmed"
        time={booking.customer_confirmed_at}
      />
    )}

    {booking.completed_at && (
      <TimelineItem
        title="Booking Completed"
        time={booking.completed_at}
      />
    )}

  </div>
</div>

{/* SPECIAL REQUEST */}
            {booking.special_request && (
              <div className="
                mt-8 p-5 rounded-2xl
                bg-white/5
                border border-white/10
              ">
                <p className="text-sm text-gray-400 mb-2">
                  Special Request
                </p>

                <p className="leading-relaxed text-gray-200">
                  {booking.special_request}
                </p>
              </div>
            )}

                    </div>
        </div>
      </div>
      </motion.div>
      
    </div>
  </div>
);
}