import React, { useState, useEffect } from 'react';
import { supabase } from "../../supabase";
import { motion } from 'motion/react';
import {
  CreditCard,
  Shield,
  CheckCircle,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { BackButton } from '../ui/BackButton';
import type { Screen } from "../../UserApp";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface P2PPeerPaymentScreenProps {
  onNavigate: (page: Screen) => void;
  onBack: () => void;
  peerId: string | null;
  requestId: string | null;
  setSelectedMeetingId: (id: string) => void;
}

export function P2PPeerPaymentScreen({
  onNavigate,
  onBack,
  peerId,
  requestId,
  setSelectedMeetingId
}: P2PPeerPaymentScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState<
    'card' | 'upi' | 'netbanking'
  >('card');

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [upiId, setUpiId] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [peer, setPeer] = useState<any>(null);

  /* =========================================================
     LOAD RAZORPAY SCRIPT
  ========================================================= */

  useEffect(() => {
    if (
      document.getElementById(
        "razorpay-checkout-script"
      )
    ) {
      return;
    }

    const script =
      document.createElement("script");

    script.id =
      "razorpay-checkout-script";

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);

    return () => {
      /*
       * Do not remove the script.
       * Razorpay may already be loaded and reused.
       */
    };
  }, []);

  /* =========================================================
     LOAD EXACT MEETING FOR EXACT REQUEST

     IMPORTANT:
     We NEVER search by "latest meeting between two users".

     requestId identifies one specific request.
     That request has one specific meeting.

     This prevents:
       old expired meeting
       old cancelled meeting
       old completed meeting

     from being loaded for a new request.
  ========================================================= */

  useEffect(() => {
    const loadMeeting = async () => {
      try {
        setLoading(true);

        setMeeting(null);
        setPeer(null);

        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
          console.error(
            "No authenticated user."
          );

          setLoading(false);
          return;
        }

        if (!requestId) {
          console.error(
            "No request ID supplied."
          );

          setLoading(false);
          return;
        }

        if (!peerId) {
          console.error(
            "No peer ID supplied."
          );

          setLoading(false);
          return;
        }

        /* =====================================================
           FIND MEETING USING request_id ONLY
        ===================================================== */

        const {
          data: existingMeeting,
          error: meetingError
        } = await supabase
          .from("p2p_meetings")
          .select("*")
          .eq(
            "request_id",
            requestId
          )
          .maybeSingle();

        if (meetingError) {
          console.error(
            "Meeting load error:",
            meetingError
          );

          setLoading(false);
          return;
        }

        if (!existingMeeting) {
          console.error(
            "No meeting found for request:",
            requestId
          );

          setLoading(false);
          return;
        }

        /* =====================================================
           VERIFY PARTICIPANTS

           The logged-in user must be either:
             user_a
             user_b

           And peerId must be the other participant.
        ===================================================== */

        const currentUserIsA =
          existingMeeting.user_a ===
          user.id;

        const currentUserIsB =
          existingMeeting.user_b ===
          user.id;

        if (
          !currentUserIsA &&
          !currentUserIsB
        ) {
          console.error(
            "Authenticated user is not a participant in this meeting."
          );

          setLoading(false);
          return;
        }

        const expectedPeerId =
          currentUserIsA
            ? existingMeeting.user_b
            : existingMeeting.user_a;

        if (
          expectedPeerId !== peerId
        ) {
          console.error(
            "Peer does not match meeting participant.",
            {
              requestId,
              authenticatedUserId:
                user.id,
              expectedPeerId,
              suppliedPeerId: peerId
            }
          );

          setLoading(false);
          return;
        }

        /* =====================================================
           ONLY PAYMENT-PHASE MEETINGS CAN BE PAID HERE
        ===================================================== */

        const paymentStatuses = [
          "pending_payment",
          "awaiting_second_payment"
        ];

        if (
          !paymentStatuses.includes(
            existingMeeting.status
          )
        ) {
          console.error(
            "This meeting is not in a payable state:",
            existingMeeting.status
          );

          setMeeting(
            existingMeeting
          );

          setLoading(false);
          return;
        }

        /* =====================================================
           SAVE EXACT MEETING
        ===================================================== */

        setMeeting(
          existingMeeting
        );

        /* =====================================================
           LOAD EXACT PEER
        ===================================================== */

        const {
          data: peerUser,
          error: peerError
        } = await supabase
          .from("users")
          .select(
            "id, name, profile_photo_url"
          )
          .eq(
            "id",
            expectedPeerId
          )
          .single();

        if (
          peerError
        ) {
          console.error(
            "Peer load error:",
            peerError
          );
        } else if (
          peerUser
        ) {
          setPeer(peerUser);
        }

        setLoading(false);
      } catch (err) {
        console.error(
          "Unexpected meeting loading error:",
          err
        );

        setLoading(false);
      }
    };

    loadMeeting();
  }, [peerId, requestId]);

  /* =========================================================
     PAYMENT
  ========================================================= */

  const handlePayment = async () => {
    if (!meeting) {
      console.error(
        "No P2P meeting loaded."
      );
      return;
    }

    if (!requestId) {
      alert(
        "This booking request could not be identified. Please go back and open the booking again."
      );
      return;
    }

    if (!agreed) {
      alert(
        "Please agree to the Terms & Conditions."
      );
      return;
    }

    if (
      ![
        "pending_payment",
        "awaiting_second_payment"
      ].includes(meeting.status)
    ) {
      alert(
        "This booking is no longer available for payment."
      );
      return;
    }

    setProcessing(true);

    try {
      /* =======================================================
         AUTH USER
      ======================================================= */

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        throw new Error(
          "You must be logged in to make a payment."
        );
      }

      /* =======================================================
         EXTRA PARTICIPANT SAFETY CHECK
      ======================================================= */

      const isParticipant =
        meeting.user_a ===
          user.id ||
        meeting.user_b ===
          user.id;

      if (!isParticipant) {
        throw new Error(
          "You are not a participant in this meeting."
        );
      }

      /* =======================================================
         WAIT FOR RAZORPAY
      ======================================================= */

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay is still loading. Please try again in a moment."
        );
      }

      /* =======================================================
         CREATE P2P RAZORPAY ORDER
      ======================================================= */

      const {
        data: orderData,
        error: orderError
      } =
        await supabase.functions.invoke(
          "create-p2p-razorpay-order",
          {
            body: {
              meeting_id:
                meeting.id
            }
          }
        );

      if (orderError) {
        console.error(
          "P2P Razorpay order error:",
          orderError
        );

        throw new Error(
          orderError.message ||
            "Unable to create payment order."
        );
      }

      if (
        !orderData?.success ||
        !orderData?.order?.id
      ) {
        console.error(
          "Invalid order response:",
          orderData
        );

        throw new Error(
          orderData?.error ||
            "Unable to create Razorpay order."
        );
      }

      /* =======================================================
         RAZORPAY CHECKOUT
      ======================================================= */

      const options = {
        key:
          orderData.key_id,

        amount:
          orderData.order.amount,

        currency:
          orderData.order.currency ||
          "INR",

        name:
          "MeetMyMateIn",

        description:
          `P2P Meeting Payment - ${meeting.id}`,

        order_id:
          orderData.order.id,

        handler:
          async (
            response: any
          ) => {
            try {
              console.log(
                "Razorpay payment successful:",
                response
              );

              /* =================================================
                 VERIFY PAYMENT
              ================================================= */

              const {
                data: verificationData,
                error: verificationError
              } =
                await supabase.functions.invoke(
                  "verify-p2p-razorpay-payment",
                  {
                    body: {
                      meeting_id:
                        meeting.id,

                      razorpay_order_id:
                        response.razorpay_order_id,

                      razorpay_payment_id:
                        response.razorpay_payment_id,

                      razorpay_signature:
                        response.razorpay_signature
                    }
                  }
                );

              if (
                verificationError
              ) {
                console.error(
                  "P2P payment verification error:",
                  verificationError
                );

                throw new Error(
                  verificationError.message ||
                    "Payment verification failed."
                );
              }

              if (
                !verificationData?.success ||
                !verificationData?.verified
              ) {
                console.error(
                  "P2P payment verification failed:",
                  verificationData
                );

                throw new Error(
                  verificationData?.error ||
                    "Payment verification failed."
                );
              }

              /* =================================================
                 MARK PAYMENT SUCCESS
              ================================================= */

              const {
                data: successData,
                error: successError
              } =
                await supabase.functions.invoke(
                  "mark_p2p_payment_success",
                  {
                    body: {
                      meeting_id:
                        meeting.id,

                      razorpay_order_id:
                        response.razorpay_order_id,

                      razorpay_payment_id:
                        response.razorpay_payment_id,

                      razorpay_signature:
                        response.razorpay_signature
                    }
                  }
                );

              if (
                successError
              ) {
                console.error(
                  "P2P payment finalization error:",
                  successError
                );

                throw new Error(
                  successError.message ||
                    "Unable to finalize payment."
                );
              }

              if (
                !successData?.success
              ) {
                console.error(
                  "P2P payment finalization failed:",
                  successData
                );

                throw new Error(
                  successData?.error ||
                    "Unable to finalize payment."
                );
              }

              /* =================================================
                 UPDATE LOCAL MEETING
              ================================================= */

              setMeeting(
                successData.meeting ||
                  {
                    ...meeting,

                    ...(successData.status !==
                    undefined
                      ? {
                          status:
                            successData.status
                        }
                      : {}),

                    ...(successData.payment_user_a !==
                    undefined
                      ? {
                          payment_user_a:
                            successData.payment_user_a
                        }
                      : {}),

                    ...(successData.payment_user_b !==
                    undefined
                      ? {
                          payment_user_b:
                            successData.payment_user_b
                        }
                      : {})
                  }
              );

              /* =================================================
                 STORE EXACT MEETING ID
              ================================================= */

              setSelectedMeetingId(
                meeting.id
              );

              /* =================================================
                 GO TO EXACT MEETING STATUS
              ================================================= */

              onNavigate(
                "p2p-meeting-confirmation"
              );
            } catch (
              error: any
            ) {
              console.error(
                "P2P payment completion error:",
                error
              );

              alert(
                error?.message ||
                  "Payment was received, but verification could not be completed. Please contact support before paying again."
              );
            } finally {
              setProcessing(
                false
              );
            }
          },

        modal: {
          ondismiss: () => {
            console.log(
              "Razorpay checkout dismissed"
            );

            setProcessing(
              false
            );
          }
        },

        prefill: {
          name:
            user.user_metadata?.name ||
            "",

          email:
            user.email ||
            ""
        },

        theme: {
          color:
            "#2563EB"
        }
      };

      /* =======================================================
         OPEN RAZORPAY
      ======================================================= */

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on(
        "payment.failed",
        (response: any) => {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setProcessing(
            false
          );

          alert(
            response?.error
              ?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      razorpay.open();
    } catch (
      error: any
    ) {
      console.error(
        "P2P payment start error:",
        error
      );

      setProcessing(
        false
      );

      alert(
        error?.message ||
          "Unable to start payment."
      );
    }
  };

  /* =========================================================
     FORM VALIDATION
  ========================================================= */

  const isFormValid = () => {
    return (
      agreed &&
      !!meeting &&
      [
        "pending_payment",
        "awaiting_second_payment"
      ].includes(
        meeting.status
      )
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading payment...
      </div>
    );
  }

  /* =========================================================
     MISSING BOOKING
  ========================================================= */

  if (!meeting || !peer) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0F1F] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40">
            <XCircleIconFallback />

            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Booking Not Found
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              This booking could not be loaded. Please return to your requests and open the current booking again.
            </p>

            <button
              onClick={onBack}
              className="w-full px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Back to Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     NON-PAYABLE MEETING
  ========================================================= */

  const meetingCanBePaid =
    [
      "pending_payment",
      "awaiting_second_payment"
    ].includes(
      meeting.status
    );

  if (!meetingCanBePaid) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
        <motion.div
          initial={{
            opacity: 0,
            y: -20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="border-b border-gray-200 dark:border-gray-800"
        >
          <div className="max-w-2xl mx-auto px-6 py-6">
            <BackButton
              onClick={onBack}
            />

            <div className="mt-4">
              <h1 className="mb-2">
                Booking Status
              </h1>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                This booking is no longer waiting for payment.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Page Closed
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              This booking has already moved to another status and cannot accept this payment.
            </p>

            <button
              onClick={() => {
                setSelectedMeetingId(
                  meeting.id
                );

                onNavigate(
                  "p2p-meeting-confirmation"
                );
              }}
              className="w-full px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              View Booking Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAYMENT SCREEN
  ========================================================= */

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">

      {/* Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-2xl mx-auto px-6 py-6">
          <BackButton
            onClick={onBack}
          />

          <div className="mt-4">
            <h1 className="mb-2">
              Payment
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete payment to schedule your meeting
            </p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Meeting Summary */}
        {peer && meeting && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.1
            }}
            className="mb-8 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
          >
            <h3 className="mb-4">
              Meeting Summary
            </h3>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                {peer.profile_photo_url ? (
                  <img
                    src={
                      peer.profile_photo_url
                    }
                    alt={peer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white bg-blue-600">
                    {peer.name?.charAt(
                      0
                    )}
                  </div>
                )}
              </div>

              <div>
                <p className="mb-1 font-semibold">
                  {peer.name}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Booking ID:{" "}
                  {meeting.id
                    .slice(0, 8)
                    .toUpperCase()}
                </p>
              </div>
            </div>

            {meeting.updated_at && (
              <div className="mb-4 p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Booking Time
                </p>

                <p className="font-semibold text-gray-900 dark:text-gray-200">
                  {new Date(
                    meeting.updated_at
                  ).toLocaleString(
                    "en-IN",
                    {
                      dateStyle:
                        "medium",
                      timeStyle:
                        "short"
                    }
                  )}
                </p>
              </div>
            )}

            {meeting.payment_deadline && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Payment deadline
                </p>

                <p className="font-semibold text-amber-800 dark:text-amber-200">
                  {new Date(
                    meeting.payment_deadline
                  ).toLocaleString(
                    "en-IN",
                    {
                      dateStyle:
                        "medium",
                      timeStyle:
                        "short"
                    }
                  )}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Meeting Fee
                </span>

                <span>
                  ₹{meeting.price}
                </span>
              </div>

              <div className="flex justify-between items-center text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>
                  Total Amount
                </span>

                <span>
                  ₹{meeting.price}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Secure Razorpay */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.2
          }}
          className="mb-6 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Secure Razorpay Payment
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click Pay to open Razorpay Checkout. You can pay securely using Card, UPI, Net Banking and other supported payment methods.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Terms */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.4
          }}
          className="mb-6"
        >
          <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) =>
                setAgreed(
                  e.target.checked
                )
              }
              className="mt-1"
            />

            <span className="text-sm text-gray-700 dark:text-gray-300">
              I agree to the{" "}
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Terms & Conditions
              </a>{" "}
              and understand that this payment is for scheduling a business meeting.
            </span>
          </label>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.5
          }}
          className="mb-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30"
        >
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />

            <p className="text-sm text-blue-800 dark:text-blue-300">
              Your payment is secure and encrypted. We never store your card details.
            </p>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.6
          }}
          className="flex gap-3"
        >
          <button
            onClick={
              handlePayment
            }
            disabled={
              !isFormValid() ||
              processing
            }
            className="flex-1 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white transition-all flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

                <span>
                  Processing...
                </span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />

                <span>
                  Pay Securely ₹
                  {meeting?.price}
                </span>
              </>
            )}
          </button>

          <button
            onClick={onBack}
            disabled={
              processing
            }
            className="px-6 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-all"
          >
            Cancel
          </button>
        </motion.div>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL FALLBACK ICON
========================================================= */

function XCircleIconFallback() {
  return (
    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        className="w-7 h-7 text-red-600 dark:text-red-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
        />
        <path d="m9 9 6 6" />
        <path d="m15 9-6 6" />
      </svg>
    </div>
  );
}