import React from "react";
import { AlarmClock } from "lucide-react";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
interface IncomingBookingModalProps {
  incomingBooking: any;
  acceptingBooking: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export default function IncomingBookingModal({
  incomingBooking,
  acceptingBooking,
  onAccept,
  onReject,
}: IncomingBookingModalProps) {
  if (!incomingBooking) return null;
const [secondsLeft, setSecondsLeft] =
  useState(30);
const audioRef =
  useRef<HTMLAudioElement | null>(null);
useEffect(() => {

  setSecondsLeft(30);

  const interval = setInterval(() => {

    setSecondsLeft(prev => {

      if (prev <= 1) {

  clearInterval(interval);

  if (audioRef.current) {

    audioRef.current.pause();

    audioRef.current.currentTime = 0;

  }

  onReject();

  return 0;
}

      return prev - 1;

    });

  }, 1000);

  return () => clearInterval(interval);

}, [incomingBooking]);

useEffect(() => {

  audioRef.current =
    new Audio("/freesound_community-game-fail-90322.mp3");

  audioRef.current.loop = true;

  audioRef.current.play()
    .then(() => {
      console.log("AUDIO PLAYING");
    })
    .catch((err) => {
      console.error(
        "AUDIO ERROR:",
        err
      );
    });

  return () => {

    if (audioRef.current) {

      audioRef.current.pause();

      audioRef.current.currentTime = 0;

    }

  };

}, []);

  const earnings = Math.round(
    Number(incomingBooking.total_amount || 0) * 0.8
  );
console.log("SECONDS:", secondsLeft);
  return createPortal(
    <div
      className="
        fixed inset-0
        z-[999999]
        bg-black/80
        backdrop-blur-xl

        flex items-center justify-center

        p-3
      "
    >
      <div
  className={`
    w-full
    max-w-[900px]

    bg-[#0B1220]
    rounded-[28px]
    border border-white/10

    shadow-[0_0_60px_rgba(59,130,246,0.12)]

    overflow-hidden

    ${
      secondsLeft <= 5
        ? "animate-pulse"
        : ""
    }
  `}
>
        {/* HEADER */}

      <div
  className={`
    relative
   px-5 pt-5 pb-8
    bg-gradient-to-r

    ${
      secondsLeft > 15
        ? "from-blue-600 via-indigo-600 to-purple-600"
        : secondsLeft > 5
        ? "from-yellow-500 via-orange-500 to-red-500"
        : "from-red-600 via-red-500 to-red-700"
    }
  `}
>


          <p className="text-[10px] uppercase tracking-[0.25em] text-blue-100">
           
          </p>

          <h2 className="text-2xl font-bold text-white mt-1">
            Review Before Accepting
          </h2>
         
  <div className="mt-5 flex justify-center">

  <div className="relative w-[170px] h-[170px]">

    <svg
      className="absolute inset-0 w-full h-full -rotate-90"
      viewBox="0 0 170 170"
    >
     <circle
  cx="85"
  cy="85"
  r="72"
  stroke="rgba(255,255,255,0.15)"
  strokeWidth="10"
  fill="none"
/>

<circle
  cx="85"
  cy="85"
  r="72"
  fill="none"
  stroke={
    secondsLeft > 15
      ? "#22c55e"
      : secondsLeft > 5
      ? "#f59e0b"
      : "#ef4444"
  }
  strokeWidth="10"
  strokeLinecap="round"
  strokeDasharray="452"
  strokeDashoffset={
    452 - (secondsLeft / 30) * 452
  }
  className="transition-all duration-1000"
/>
    </svg>

    <div
  className="
    absolute inset-0
    flex flex-col
    items-center
    justify-center
    gap-2
  "
>
      <span
        className="
  text-white
  text-3xl
  md:text-4xl
  font-bold
  leading-none
"
      >
       00:{String(secondsLeft).padStart(2, "0")}
      </span>

      <span
        className="
          text-[10px]
          uppercase
          tracking-[0.25em]
          text-white/70
          mt-1
        "
      >
        Seconds
      </span>
    </div>

  </div>

</div>
  
 


        </div>

        {/* CONTENT */}

        <div className="p-4 space-y-3">

          {/* CUSTOMER */}

          <div
            className="
              p-3

              rounded-2xl

              bg-gradient-to-r
              from-blue-500/10
              to-purple-500/10

              border border-blue-500/20

              flex items-center gap-3
            "
          >
            <img
              src={
                incomingBooking.customer?.profile_photo_url ||
                "/default-avatar.png"
              }
              alt=""
              className="
                w-14 h-14
                rounded-full
                object-cover
                border-2 border-blue-500
              "
            />

            <div className="min-w-0">
              <h3 className="text-2xl font-bold text-white truncate">
                {incomingBooking.customer?.name || "Customer"}
              </h3>

              <p className="text-blue-300 text-sm">
                📞 {incomingBooking.customer?.phone || "No phone"}
              </p>
            </div>
          </div>

          {/* DETAILS */}

          <div className="grid grid-cols-2 gap-3">

            <div className="bg-[#111827] border border-white/10 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">
                📅 Date
              </p>

              <p className="text-base font-semibold text-white mt-1">
                {incomingBooking.booking_date || "-"}
              </p>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">
                🕒 Time
              </p>

              <p className="text-base font-semibold text-white mt-1">
                {incomingBooking.booking_time || "-"}
              </p>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">
                🎯 Service
              </p>

              <p className="text-base font-semibold text-white mt-1 capitalize">
                {incomingBooking.service_type
                  ? incomingBooking.service_type.replace("-", " ")
                  : "-"}
              </p>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-400">
                ⏳ Duration
              </p>

              <p className="text-base font-semibold text-white mt-1">
                {incomingBooking.duration_hours || 0} Hour
                {Number(incomingBooking.duration_hours) > 1 ? "s" : ""}
              </p>
            </div>

          </div>

          {/* LOCATION */}

          <div
            className="
              rounded-2xl
              p-3

              bg-gradient-to-r
              from-cyan-500/10
              to-blue-500/10

              border border-cyan-500/25
            "
          >
            <p className="text-[10px] uppercase tracking-widest text-white">
              📍 Meetup Location
            </p>

            <p className="text-white text-base font-semibold mt-1 break-words">
              {incomingBooking.meetup_location || "Not provided"}
            </p>
          </div>

          {/* NOTES */}

          {incomingBooking.special_request && (
            <div
              className="
                rounded-xl
                p-3

                bg-amber-500/10
                border border-amber-500/20
              "
            >
              <p className="text-[10px] uppercase tracking-widest text-white">
                📝 Additional Notes
              </p>

              <p className="text-white text-sm mt-1 break-words">
                {incomingBooking.special_request}
              </p>
            </div>
          )}

          {/* EARNINGS */}

          <div
            className="
              rounded-2xl

              py-3 px-4

              text-center

              bg-gradient-to-r
              from-green-500
              to-emerald-600
            "
          >
            <p className="uppercase tracking-widest text-green-100 text-[10px]">
              You Will Earn
            </p>

            <h2 className="text-4xl font-bold text-white mt-1">
              ₹{earnings}
            </h2>

            <p className="text-green-100 text-xs mt-1">
              After platform commission
            </p>
          </div>

        </div>

        {/* FOOTER */}

        <div
          className="
            p-3

            border-t border-white/10

            bg-[#0F172A]

            grid grid-cols-2 gap-3
          "
        >
          <button
            onClick={() => {

  if (audioRef.current) {

    audioRef.current.pause();

    audioRef.current.currentTime = 0;

  }

  onReject();

}}
            className="
              h-12

              rounded-xl

              bg-red-500/10

              border border-red-500/30

              text-red-400

              font-bold

              transition-all

              hover:bg-red-500/20
            "
          >
            Reject
          </button>

          <button
            onClick={() => {

  if (audioRef.current) {

    audioRef.current.pause();

    audioRef.current.currentTime = 0;

  }

  onAccept();

}}
            disabled={acceptingBooking}
            className="
              h-12

              rounded-xl

              bg-green-500

              text-white

              font-bold

              transition-all

              hover:bg-green-600
            "
          >
            {acceptingBooking
              ? "Accepting..."
              : "Accept Booking"}
          </button>
        </div>
      </div>
    </div>,
    typeof document !== "undefined" ? document.body : null
  );
}