import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Shield,
  Check,
  Loader2,
} from "lucide-react";
import { supabase } from "../../../supabase";
import { markBlindDatePaymentSuccess } from "../../../lib/user-api";
import { BackButton } from "../../ui/BackButton";
import type { Screen } from "../../../UserApp";

interface BlindDatePaymentNewProps {
  onNavigate: (
    page: Screen,
    param?: string
  ) => void;

  onBack: () => void;
}

interface BlindDatePaymentData {
  paymentDraftId: string;
  amount: number;
}

const BLIND_DATE_AMOUNT = 399;
const BLIND_DATE_AMOUNT_IN_PAISE = 39900;

export function BlindDatePaymentNew({
  onNavigate,
  onBack,
}: BlindDatePaymentNewProps) {
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [bookingData, setBookingData] =
    useState<BlindDatePaymentData | null>(null);

  // =========================================================
  // LOAD PAYMENT DRAFT INFORMATION
  // =========================================================
  useEffect(() => {
    try {
      const saved =
        sessionStorage.getItem("blindDatePayment");

      if (!saved) {
        onNavigate("blind-date-booking");
        return;
      }

      const parsed = JSON.parse(saved);

      if (!parsed?.paymentDraftId) {
        console.error(
          "Blind Date payment draft ID is missing:",
          parsed
        );

        sessionStorage.removeItem(
          "blindDatePayment"
        );

        onNavigate("blind-date-booking");
        return;
      }

      setBookingData({
        paymentDraftId:
          parsed.paymentDraftId,

        // Always display the server-defined launch price.
        amount: BLIND_DATE_AMOUNT,
      });
    } catch (error) {
      console.error(
        "Failed to load Blind Date payment data:",
        error
      );

      sessionStorage.removeItem(
        "blindDatePayment"
      );

      onNavigate("blind-date-booking");
    }
  }, [onNavigate]);

  // =========================================================
  // LOAD RAZORPAY CHECKOUT SDK
  // =========================================================
  useEffect(() => {
    const existingScript =
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

    if (existingScript) {
      return;
    }

    const script =
      document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);

    return () => {
      if (
        document.body.contains(script)
      ) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // =========================================================
  // HANDLE PAYMENT
  // =========================================================
  const handlePayment = async () => {
    if (!bookingData?.paymentDraftId) {
      alert(
        "Payment information is missing."
      );
      return;
    }

    if (processing) {
      return;
    }

    try {
      setProcessing(true);

      // =====================================================
      // AUTH
      // =====================================================
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert(
          "Please sign in again."
        );
        setProcessing(false);
        return;
      }

      // =====================================================
      // SERVER-AUTHORITATIVE AMOUNT
      // =====================================================
      const amountInRupees =
        BLIND_DATE_AMOUNT;

      const amountInPaise =
        BLIND_DATE_AMOUNT_IN_PAISE;

      console.log(
        "BLIND DATE PAYMENT DRAFT:",
        bookingData.paymentDraftId
      );

      console.log(
        "BLIND DATE PAYMENT TOTAL:",
        amountInRupees
      );

      console.log(
        "BLIND DATE PAYMENT AMOUNT IN PAISE:",
        amountInPaise
      );

      // =====================================================
      // STEP 1:
      // CREATE RAZORPAY ORDER
      // =====================================================
      const {
        data: orderData,
        error: orderError,
      } =
        await supabase.functions.invoke(
          "create-razorpay-order",
          {
            body: {
              payment_draft_id:
                bookingData.paymentDraftId,

              currency: "INR",
            },
          }
        );

      console.log(
        "BLIND DATE RAZORPAY ORDER RESULT:",
        orderData
      );

      if (orderError) {
        console.error(
          "Create Razorpay Order Error:",
          orderError
        );

        alert(
          "Unable to start payment. Please try again."
        );

        setProcessing(false);
        return;
      }

      if (
        !orderData?.success ||
        !orderData?.order?.id ||
        !orderData?.key_id
      ) {
        console.error(
          "Invalid Razorpay order response:",
          orderData
        );

        alert(
          "Unable to start payment. Please try again."
        );

        setProcessing(false);
        return;
      }

      // =====================================================
      // STEP 2:
      // CHECK RAZORPAY SDK
      // =====================================================
      const Razorpay =
        (window as any).Razorpay;

      if (!Razorpay) {
        alert(
          "Payment system is still loading. Please try again."
        );

        setProcessing(false);
        return;
      }

      // =====================================================
      // STEP 3:
      // OPEN RAZORPAY CHECKOUT
      // =====================================================
      const options = {
        key: orderData.key_id,

        amount:
          orderData.order.amount,

        currency:
          orderData.order.currency,

        name: "Blind Date",

        description:
          "Blind Date Booking",

        order_id:
          orderData.order.id,

        prefill: {
          name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            "",

          email:
            user.email || "",
        },

        theme: {
          color: "#EC4899",
        },

        handler: async function (
          response: any
        ) {
          console.log(
            "BLIND DATE RAZORPAY PAYMENT SUCCESS:",
            response
          );

          try {
            setProcessing(true);

            // =================================================
            // STEP 4:
            // VERIFY RAZORPAY PAYMENT
            // =================================================
            const {
              data: verificationData,
              error: verificationError,
            } =
              await supabase.functions.invoke(
                "verify-razorpay-payment",
                {
                  body: {
                    payment_draft_id:
                      bookingData.paymentDraftId,

                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,
                  },
                }
              );

            console.log(
              "BLIND DATE PAYMENT VERIFICATION RESULT:",
              verificationData
            );

            if (
              verificationError ||
              !verificationData?.success ||
              !verificationData?.verified
            ) {
              console.error(
                "Blind Date payment verification failed:",
                verificationError ||
                  verificationData
              );

              alert(
                "Payment could not be verified. Please contact support if your bank was charged."
              );

              setProcessing(false);
              return;
            }

            // =================================================
            // STEP 5:
            // FINALIZE PAYMENT + CREATE REAL BOOKING
            // =================================================
            const paymentResult =
              await markBlindDatePaymentSuccess(
                bookingData.paymentDraftId,

                response.razorpay_order_id,

                response.razorpay_payment_id,

                response.razorpay_signature
              );

            console.log(
              "BLIND DATE PAYMENT FINALIZATION RESULT:",
              paymentResult
            );

            if (
              !paymentResult?.success
            ) {
              console.error(
                "Blind Date payment finalization failed:",
                paymentResult
              );

              alert(
                "Payment was successful, but we could not create your booking. Please contact support."
              );

              setProcessing(false);
              return;
            }

            // =================================================
            // GET FINAL BOOKING ID
            //
            // The real booking is created only after payment.
            // =================================================
            const finalBookingId =
              paymentResult?.booking?.id;

            if (!finalBookingId) {
              console.error(
                "Payment succeeded but final booking ID was not returned:",
                paymentResult
              );

              alert(
                "Payment was successful, but your booking confirmation could not be loaded. Please contact support."
              );

              setProcessing(false);
              return;
            }

            // =================================================
            // STEP 6:
            // PAYMENT COMPLETE
            // =================================================
            setCompleted(true);

            sessionStorage.removeItem(
              "blindDatePayment"
            );

            setTimeout(() => {
              onNavigate(
                "blind-date-booking-status",
                finalBookingId
              );
            }, 1500);

          } catch (error: any) {
            console.error(
              "Blind Date payment handler error:",
              error
            );

            alert(
              error?.message ||
                "Payment processing failed."
            );

            setProcessing(false);
          }
        },

        modal: {
          ondismiss: function () {
            console.log(
              "Blind Date Razorpay checkout closed by user"
            );

            setProcessing(false);
          },
        },
      };

      const razorpay =
        new Razorpay(options);

      razorpay.open();

    } catch (error: any) {
      console.error(
        "Blind Date payment error:",
        error
      );

      alert(
        error?.message ||
          "Unable to start payment."
      );

      setProcessing(false);
    }
  };

  // =========================================================
  // LOADING STATE
  // =========================================================
  if (!bookingData) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0F1F] flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">
          Loading payment details...
        </p>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">

      {/* Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <BackButton onClick={onBack} />

            <div>
              <h2>
                Payment Confirmation
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and complete your booking
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {completed ? (

          /* =================================================
             PAYMENT SUCCESS
          ================================================== */
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>

            <h3 className="mb-2 text-green-600 dark:text-green-400">
              Payment Successful
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Taking you to your bookings...
            </p>
          </motion.div>

        ) : (

          <>
            {/* =================================================
               BOOKING SUMMARY
            ================================================== */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mb-8 p-6 rounded-xl border border-gray-200 dark:border-gray-800"
            >
              <h4 className="mb-4">
                Blind Date Booking
              </h4>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                You’re about to confirm your blind date booking.
              </p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Amount
                </span>

                <span className="text-2xl font-semibold">
                  ₹399
                </span>
              </div>
            </motion.div>

            {/* =================================================
               TRUST MESSAGE
            ================================================== */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
              className="mb-8 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-900/30"
            >
              <div className="flex gap-4">

                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />

                <div>
                  <h4 className="mb-2 text-blue-900 dark:text-blue-400">
                    Payment Protection
                  </h4>

                 <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
  You'll be charged now. We will try to arrange your Blind Date within
  <strong> 24 hours of payment</strong>. If no match is found within that
  period, your <strong>full payment will be refunded automatically</strong>.
</p>
                </div>

              </div>
            </motion.div>
<label className="flex items-start gap-3 mb-6 p-4 rounded-xl border border-gray-200 dark:border-gray-800 cursor-pointer">
  <input
    type="checkbox"
    checked={agreed}
    onChange={(e) => setAgreed(e.target.checked)}
    className="mt-1"
  />

  <span className="text-sm text-gray-700 dark:text-gray-300">
    I agree to the{" "}
    <button
      type="button"
      onClick={() => onNavigate("terms")}
      className="text-blue-600 dark:text-blue-400 hover:underline"
    >
      Terms of Service
    </button>{" "}
    and understand the Blind Date booking and payment terms.
  </span>
</label>
            {/* =================================================
               RAZORPAY PAYMENT
            ================================================== */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
              }}
              className="mb-8 p-6 rounded-xl border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h4 className="mb-2">
                    Secure Payment
                  </h4>

                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Your payment will be processed securely
                    through Razorpay. You can choose your
                    preferred payment method inside Razorpay,
                    including UPI, cards and other supported
                    options.
                  </p>
                </div>

              </div>
            </motion.div>

            {/* =================================================
               PAY BUTTON
            ================================================== */}
            <button
              onClick={handlePayment}
              disabled={processing}
              className={`w-full py-4 rounded-xl transition-all font-medium ${
                !processing
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                  : "bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-600 cursor-not-allowed"
              }`}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </span>
              ) : (
                "Pay & Confirm ₹399"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}