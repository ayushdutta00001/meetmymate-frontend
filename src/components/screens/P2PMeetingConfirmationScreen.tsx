import React, { useEffect, useState } from 'react';
import { supabase } from "../../supabase";
import { motion } from 'motion/react';
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Download,
  CheckCircle2,
  XCircle,
  Banknote,
  AlertTriangle,
} from 'lucide-react';
import type { Screen } from "../../UserApp";

interface P2PMeetingConfirmationScreenProps {
  meetingId: string | null;
  onNavigate: (page: Screen) => void;
}

interface RefundRecord {
  id: string;
  meeting_id: string;
  user_id: string;
  amount: number | string;
  reason: string;
  status: string;
  created_at: string;
  processed_at: string | null;
  gateway_refund_id: string | null;
}

export function P2PMeetingConfirmationScreen({
  meetingId,
  onNavigate,
}: P2PMeetingConfirmationScreenProps) {
  const [meeting, setMeeting] = useState<any>(null);
  const [peer, setPeer] = useState<any>(null);
  const [refund, setRefund] = useState<RefundRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [myLocation, setMyLocation] = useState<string | null>(null);
  const [peerLocation, setPeerLocation] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const loadMeetingDetails = async () => {
    if (!meetingId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);

      const { data: meetingData, error: meetingError } = await supabase
        .from("p2p_meetings")
        .select(`
          *,
          user_a:users!p2p_meetings_user_a_fkey (
            id, name, profile_photo_url, phone, email, city
          ),
          user_b:users!p2p_meetings_user_b_fkey (
            id, name, profile_photo_url, phone, email, city
          )
        `)
        .eq("id", meetingId)
        .single();

      if (meetingError || !meetingData) {
        console.error("P2P meeting load error:", meetingError);
        setMeeting(null);
        setPeer(null);
        setRefund(null);
        setLoading(false);
        return;
      }

      setMeeting(meetingData);

      const isUserA = meetingData.user_a?.id === user.id;
      const myUser = isUserA ? meetingData.user_a : meetingData.user_b;
      const otherUser = isUserA ? meetingData.user_b : meetingData.user_a;

      setMyLocation(myUser?.city ?? null);
      setPeerLocation(otherUser?.city ?? null);
      setPeer(otherUser ?? null);

      // Load the current user's refund record for this meeting.
      const { data: refundData, error: refundError } = await supabase
        .from("p2p_refunds")
        .select(`
          id,
          meeting_id,
          user_id,
          amount,
          reason,
          status,
          created_at,
          processed_at,
          gateway_refund_id
        `)
        .eq("meeting_id", meetingId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (refundError) {
        console.error("P2P refund load error:", refundError);
        setRefund(null);
      } else {
        setRefund((refundData as RefundRecord | null) ?? null);
      }
    } catch (error) {
      console.error("P2P meeting details error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetingDetails();
  }, [meetingId]);

  useEffect(() => {
    if (!meetingId) return;

    const channel = supabase
      .channel(`p2p-meeting-confirmation-${meetingId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "p2p_meetings",
          filter: `id=eq.${meetingId}`,
        },
        async (payload) => {
          console.log("🔥 P2P Meeting Updated:", payload);
          await loadMeetingDetails();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "p2p_refunds",
          filter: `meeting_id=eq.${meetingId}`,
        },
        async (payload) => {
          console.log("💰 P2P Refund Created:", payload);
          await loadMeetingDetails();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "p2p_refunds",
          filter: `meeting_id=eq.${meetingId}`,
        },
        async (payload) => {
          console.log("💰 P2P Refund Updated:", payload);
          await loadMeetingDetails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meetingId]);

  const status = meeting?.status;

  const myPaymentDone =
    meeting?.user_a?.id === currentUserId
      ? meeting?.payment_user_a === true
      : meeting?.payment_user_b === true;

  const peerPaymentDone =
    meeting?.user_a?.id === currentUserId
      ? meeting?.payment_user_b === true
      : meeting?.payment_user_a === true;

  const adminSchedulingStarted =
    status === "paid_waiting_admin" ||
    status === "confirmed";

  const meetingConfirmed = status === "confirmed";
  const meetingCancelled = status === "cancelled";

 const rawRefundStatus =
  refund?.status ??
  (meeting?.user_a?.id === currentUserId
    ? meeting?.refund_status_a
    : meeting?.refund_status_b) ??
  "not_refunded";

const isUserA =
  meeting?.user_a?.id === currentUserId;

const myRefundStatus =
  isUserA
    ? meeting?.refund_status_a
    : meeting?.refund_status_b;

const myRefunded =
  myRefundStatus === "refunded" ||
  refund?.status === "completed";

const myRefundPending =
  myRefundStatus === "processing" ||
  myRefundStatus === "pending" ||
  refund?.status === "processing" ||
  refund?.status === "pending";

const myRefundAmount = Number(
  refund?.amount ??
  (myRefundStatus === "refunded"
    ? meeting?.price
    : 0)
);
  const formatDateTime = (value: string | null | undefined) => {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getRefundLabel = () => {
    if (myRefunded) return "Refunded";
    if (myRefundPending) return "Processing";
    return "No Refund";
  };

  const getRefundDescription = () => {
    if (myRefunded) {
      return "Your payment has been refunded successfully.";
    }

    if (myRefundPending) {
      return "Your refund has been accepted for processing. It may take some time to appear in your account.";
    }

    if (meetingCancelled && !myPaymentDone) {
      return "No refund was issued because you did not make a payment.";
    }

    if (meetingCancelled) {
      return "No refund record is currently available for your payment.";
    }

    return "No refund has been issued.";
  };

  const renderStatusMessage = () => {
    switch (meeting?.status) {
      case "awaiting_second_payment":
        return (
          <div>
            <h1 className="text-xl font-bold mb-2">Payment Completed ✅</h1>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Waiting for the other participant to complete payment.
            </p>
            {meeting?.payment_deadline && (
              <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                Payment deadline: {formatDateTime(meeting.payment_deadline)}
              </p>
            )}
          </div>
        );

      case "paid_waiting_admin":
        return (
          <div>
            <h1 className="text-xl font-bold mb-2">
              Both Payments Received 💳
            </h1>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Admin is scheduling your meeting.
            </p>
          </div>
        );

      case "confirmed":
        return (
          <div>
            <h1 className="text-xl font-bold mb-2">
              Meeting Confirmed 🎉
            </h1>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Your meeting is scheduled.
            </p>
          </div>
        );

      case "cancelled":
        return (
          <div>
            <h1 className="text-xl font-bold mb-2">
              Booking Cancelled
            </h1>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              This P2P booking was automatically closed because the 24-hour
              payment deadline expired before both participants completed payment.
            </p>
          </div>
        );

      default:
        return (
          <div>
            <h1 className="text-xl font-bold mb-2">
              Payment Pending
            </h1>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Complete the required payments to continue.
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading confirmation...
      </div>
    );
  }

  if (!meeting || !peer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Meeting not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-2xl mx-auto px-6 py-6">
          <button
            onClick={() => onNavigate("bookings")}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Confirmation ID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 text-center"
        >
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-1">
            Confirmation ID
          </p>
          <p className="text-lg">{meeting.id.slice(0, 8).toUpperCase()}</p>
        </motion.div>

        {/* CURRENT STATUS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`mb-6 rounded-2xl border-2 p-5 ${
            meetingCancelled
              ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20"
              : "border-blue-200 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-900/20"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                meetingCancelled
                  ? "bg-red-100 dark:bg-red-500/10"
                  : "bg-blue-100 dark:bg-blue-500/10"
              }`}
            >
              {meetingCancelled ? (
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              ) : (
                <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {renderStatusMessage()}
            </div>
          </div>
        </motion.div>

        {/* BOOKING PROGRESS */}
        <div className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1F2E] overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Booking Progress
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Track your payment and meeting status
                </p>
              </div>

              <span
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold ${
                  meetingCancelled
                    ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    : meetingConfirmed
                    ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                    : adminSchedulingStarted
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                    : peerPaymentDone
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {meetingCancelled
                  ? "Cancelled"
                  : meetingConfirmed
                  ? "Confirmed"
                  : adminSchedulingStarted
                  ? "Admin Scheduling"
                  : peerPaymentDone
                  ? "Payments Complete"
                  : "Payment Pending"}
              </span>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* YOUR PAYMENT */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  myPaymentDone
                    ? "bg-green-100 dark:bg-green-500/10"
                    : meetingCancelled
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {myPaymentDone ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Your payment
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {myPaymentDone
                    ? "Your payment was completed"
                    : meetingCancelled
                    ? "Your payment was not completed"
                    : "Your payment is pending"}
                </p>
              </div>

              <span
                className={`text-xs font-semibold ${
                  myPaymentDone
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {myPaymentDone ? "Done" : "Pending"}
              </span>
            </div>

            {/* OTHER PARTICIPANT PAYMENT */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  peerPaymentDone
                    ? "bg-green-100 dark:bg-green-500/10"
                    : "bg-amber-100 dark:bg-amber-500/10"
                }`}
              >
                {peerPaymentDone ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Clock className="w-5 h-5 text-amber-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Other participant payment
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {peerPaymentDone
                    ? "Other participant completed payment"
                    : meetingCancelled
                    ? "Other participant did not complete payment"
                    : "Waiting for the other participant to pay"}
                </p>
              </div>

              <span
                className={`text-xs font-semibold ${
                  peerPaymentDone
                    ? "text-green-600 dark:text-green-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {peerPaymentDone ? "Done" : "Pending"}
              </span>
            </div>

            {/* ADMIN SCHEDULING */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  meetingCancelled
                    ? "bg-red-100 dark:bg-red-500/10"
                    : meetingConfirmed
                    ? "bg-green-100 dark:bg-green-500/10"
                    : adminSchedulingStarted
                    ? "bg-blue-100 dark:bg-blue-500/10"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {meetingCancelled ? (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                ) : meetingConfirmed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Clock
                    className={`w-5 h-5 ${
                      adminSchedulingStarted
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400"
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Admin scheduling
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {meetingCancelled
                    ? "Admin scheduling did not start because payment timed out"
                    : meetingConfirmed
                    ? "Admin has scheduled your meeting"
                    : adminSchedulingStarted
                    ? "Admin is scheduling your meeting"
                    : "Admin scheduling will start after both payments"}
                </p>
              </div>

              <span
                className={`text-xs font-semibold ${
                  meetingCancelled
                    ? "text-red-600 dark:text-red-400"
                    : meetingConfirmed
                    ? "text-green-600 dark:text-green-400"
                    : adminSchedulingStarted
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {meetingCancelled
                  ? "Closed"
                  : meetingConfirmed
                  ? "Done"
                  : adminSchedulingStarted
                  ? "In Progress"
                  : "Waiting"}
              </span>
            </div>

            {/* MEETING CONFIRMATION */}
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  meetingConfirmed
                    ? "bg-green-100 dark:bg-green-500/10"
                    : meetingCancelled
                    ? "bg-red-100 dark:bg-red-500/10"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {meetingConfirmed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : meetingCancelled ? (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Meeting confirmation
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {meetingCancelled
                    ? "This booking was cancelled"
                    : meetingConfirmed
                    ? "Your meeting has been confirmed"
                    : "Waiting for admin confirmation"}
                </p>
              </div>

              <span
                className={`text-xs font-semibold ${
                  meetingCancelled
                    ? "text-red-600 dark:text-red-400"
                    : meetingConfirmed
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {meetingCancelled
                  ? "Cancelled"
                  : meetingConfirmed
                  ? "Confirmed"
                  : "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* CANCELLATION DETAILS */}
        {meetingCancelled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 p-5 rounded-2xl border-2 border-red-200 dark:border-red-900/50 bg-red-500 dark:bg-red-900/20"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-red-700 dark:text-red-300">
                  Booking Cancelled
                </h3>

                <p className="text-sm text-red-700/80 dark:text-red-200/80 mt-1">
                  The booking was automatically cancelled after the 24-hour
                  payment deadline expired.
                </p>

                <div className="mt-4 p-4 rounded-xl bg-white/70 dark:bg-black/10 border border-red-200/80 dark:border-red-900/40">
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 mb-1">
                    Cancellation Reason
                  </p>

                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {meeting.cancel_reason || "Payment deadline expired"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* REFUND DETAILS */}
        {(meetingCancelled || refund) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className={`mb-6 rounded-2xl border-2 p-5 ${
              myRefunded
                ? "border-green-200 dark:border-green-900/50 bg-green-900 dark:bg-green-900/20"
                : myRefundPending
                ? "border-amber-200 dark:border-amber-900/50 bg-amber-900 dark:bg-amber-900/20"
                : "border-gray-200 dark:border-gray-800 bg-gray-900 dark:bg-[#151A27]"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  myRefunded
                    ? "bg-green-100 dark:bg-green-500/10"
                    : myRefundPending
                    ? "bg-amber-100 dark:bg-amber-500/10"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <Banknote
                  className={`w-5 h-5 ${
                    myRefunded
                      ? "text-green-600 dark:text-green-400"
                      : myRefundPending
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Your Refund
                  </h3>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      myRefunded
                        ? "bg-green-950 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                        : myRefundPending
                        ? "bg-amber-950 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                        : "bg-gray-950 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {getRefundLabel()}
                  </span>
                </div>

                <p className="text-sm text-gray-800 dark:text-gray-400 mt-1">
                  {getRefundDescription()}
                </p>

                {myRefunded || myRefundPending ? (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/70 dark:bg-black/10 border border-gray-200/70 dark:border-gray-700">
                      <span className="text-sm text-gray-700 dark:text-gray-700">
                        Refund amount
                      </span>
                      <span className="text-base font-bold text-green-500 dark:text-green-500 text-right">
                        ₹{myRefundAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {refund?.reason && (
                      <div className="p-3 rounded-xl bg-white/70 dark:bg-black/10 border border-gray-200/70 dark:border-gray-700">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-700 mb-1">
                          Refund Reason
                        </p>
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          {refund.reason}
                        </p>
                      </div>
                    )}

                    {refund?.gateway_refund_id && (
                      <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/70 dark:bg-black/10 border border-gray-200/70 dark:border-gray-700">
                        <span className="text-sm text-gray-700 dark:text-gray-700">
                          Refund Reference
                        </span>
                        <span className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all text-right">
                          {refund.gateway_refund_id}
                        </span>
                      </div>
                    )}

                    {refund?.created_at && (
                      <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/70 dark:bg-black/10 border border-gray-200/70 dark:border-gray-700">
                        <span className="text-sm text-gray-700 dark:text-gray-700">
                          Refund requested
                        </span>
                        <span className="text-sm text-gray-800 dark:text-gray-200 text-right">
                          {formatDateTime(refund.created_at)}
                        </span>
                      </div>
                    )}

                    {refund?.processed_at && (
                      <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/70 dark:bg-black/10 border border-gray-200/70 dark:border-gray-700">
                        <span className="text-sm text-gray-700 dark:text-gray-700">
                          Refund processed
                        </span>
                        <span className="text-sm text-gray-800 dark:text-gray-200 text-right">
                          {formatDateTime(refund.processed_at)}
                        </span>
                      </div>
                    )}
                  </div>
                ) : meetingCancelled ? (
                  <div className="mt-4 p-4 rounded-xl bg-white/70 dark:bg-black/10 border border-gray-200/70 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      No refund was issued because your payment was not completed.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}

        {/* Meeting Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h3 className="mb-4">Meeting Details</h3>

          <div className="mb-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-green-600 dark:text-green-400 mb-2">
              Preferred Locations
            </p>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Your Location</span>
                <span className="font-medium text-right">
                  {myLocation || "Not set"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  {peer?.name}'s Location
                </span>
                <span className="font-medium text-right">
                  {peerLocation || "Not set"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Date & Time */}
            <div className="flex gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>

              <div>
                <p className="text-sm text-blue-500 mb-1">Date & Time</p>

                {meeting.status === "confirmed" && meeting.meeting_time ? (
                  <>
                    <p className="text-orange-400 text-2xl font-semibold">
                      {new Date(meeting.meeting_time).toLocaleDateString("en-IN")}
                    </p>
                    <p className="text-green-600 dark:text-green-400 text-2xl font-semibold">
                      {new Date(meeting.meeting_time).toLocaleTimeString("en-IN")}
                    </p>
                  </>
                ) : meetingCancelled ? (
                  <p className="text-red-600 dark:text-red-400">
                    Meeting was cancelled
                  </p>
                ) : (
                  <p className="text-gray-500">
                    To be scheduled by admin
                  </p>
                )}
              </div>
            </div>

            {/* Meeting Location + Google Maps */}
            {meeting.status === "confirmed" && meeting.meeting_point_text && (
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Meeting Location
                    </p>

                    <p className="font-medium text-gray-900 dark:text-white">
                      {meeting.meeting_point_text}
                    </p>
                  </div>
                </div>

                <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <iframe
                    title="Meeting Location"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      meeting.meeting_point_text
                    )}&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    meeting.meeting_point_text
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
                >
                  <MapPin className="w-5 h-5" />
                  Open in Google Maps
                </a>
              </div>
            )}

            {/* Admin Notes */}
            {meeting.status === "confirmed" && meeting.admin_note && (
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Admin Note
                </p>
                <p className="text-gray-900 dark:text-white">
                  {meeting.admin_note}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Peer Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <h3 className="mb-4">Contact Information</h3>

          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                {peer?.profile_photo_url ? (
                  <img
                    src={peer.profile_photo_url}
                    alt={peer?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white">
                    {peer?.name?.charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <p className="mb-1">{peer?.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {peer?.role ?? peer?.city ?? ""}
                </p>
              </div>
            </div>

            {meeting.status === "confirmed" ? (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    Phone
                  </span>
                  <span>{peer?.phone || "Not available"}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    Email
                  </span>
                  <span>{peer?.email || "Not available"}</span>
                </div>
              </div>
            ) : meetingCancelled ? (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Contact details are unavailable because this booking was cancelled.
                </p>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Contact details will be available after the admin schedules your meeting.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Important Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`mb-8 p-4 rounded-xl border ${
            meetingCancelled
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30"
              : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30"
          }`}
        >
          <h4 className="mb-3">
            {meetingCancelled ? "Cancellation Information" : "Important Information"}
          </h4>

          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {meetingCancelled ? (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>
                    This P2P booking was closed because the 24-hour payment deadline expired.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                  <span>
                    Any eligible payment was sent through the automatic Razorpay refund process.
                  </span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                  <span>Please arrive on time for the meeting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                  <span>A calendar invitation has been sent to your email</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 mt-1">•</span>
                  <span>If you need to reschedule, contact us at least 24 hours in advance</span>
                </li>
              </>
            )}
          </ul>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={() => window.print()}
            className="w-full px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>Download Confirmation</span>
          </button>

          <button
            onClick={() => onNavigate("bookings")}
            className="w-full px-6 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            Go to Bookings
          </button>
        </motion.div>
      </div>
    </div>
  );
}
