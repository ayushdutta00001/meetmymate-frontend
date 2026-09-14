import { useEffect, useState } from "react";
import { supabase } from "../../../../supabase";
import {
  Search,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

export function P2PPayments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [payments, setPayments] = useState<any[]>([]);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedPayments: 0,
    pendingPayments: 0,
    refundsIssued: 0,
  });

  const [loading, setLoading] = useState(false);
  const [refundLoading, setRefundLoading] = useState<string | null>(null);

  /* =========================================================
     LOAD PAYMENT STATS
  ========================================================= */

  const loadPaymentStats = async () => {
  try {
    /* =========================================================
       LOAD MEETING PAYMENT DATA
    ========================================================= */

    const {
      data: meetings,
      error: meetingsError,
    } = await supabase
      .from("p2p_meetings")
      .select("price, payment_user_a, payment_user_b");

    if (meetingsError) {
      console.error(
        "Payment stats meetings error:",
        meetingsError
      );
    }

    let revenue = 0;
    let completed = 0;
    let pending = 0;

    (meetings || []).forEach((meeting: any) => {
      const userAPaid = Boolean(
        meeting.payment_user_a
      );

      const userBPaid = Boolean(
        meeting.payment_user_b
      );

      if (userAPaid && userBPaid) {
        completed++;
        revenue += Number(
          meeting.price || 0
        );
      } else {
        pending++;
      }
    });

    /* =========================================================
       LOAD REAL REFUND DATA THROUGH SECURE ADMIN FUNCTION
       
       Do NOT directly query p2p_refunds here because the
       browser may be restricted by RLS.
    ========================================================= */

    let refundsIssued = 0;

    const {
      data: sessionData,
      error: sessionError,
    } = await supabase.auth.getSession();

    if (
      sessionError ||
      !sessionData.session?.access_token
    ) {
      console.error(
        "Refund stats session error:",
        sessionError
      );
    } else {
      const {
        data: refundResponse,
        error: refundFunctionError,
      } = await supabase.functions.invoke(
        "admin-p2p-refunds",
        {
          headers: {
            Authorization: `Bearer ${sessionData.session.access_token}`,
          },
        }
      );

      if (refundFunctionError) {
        console.error(
          "Admin refund stats function error:",
          refundFunctionError
        );
      } else if (
        refundResponse?.success
      ) {
        const refunds =
          Array.isArray(
            refundResponse.refunds
          )
            ? refundResponse.refunds
            : [];

        /*
         * The actual p2p_refunds ledger uses:
         * status = "completed"
         */
        refundsIssued =
          refunds.filter(
            (refund: any) =>
              refund.status ===
              "completed"
          ).length;
      } else {
        console.error(
          "Admin refund stats response error:",
          refundResponse?.error
        );
      }
    }

    /* =========================================================
       UPDATE CARDS
    ========================================================= */

    setStats({
      totalRevenue: revenue,
      completedPayments: completed,
      pendingPayments: pending,
      refundsIssued,
    });
  } catch (error) {
    console.error(
      "Unexpected payment stats error:",
      error
    );
  }
};

  /* =========================================================
     LOAD PAYMENTS
  ========================================================= */

  const loadPayments = async () => {
    const {
      data,
      error,
    } = await supabase
      .from("p2p_meetings")
      .select(`
        id,
        price,
        payment_deadline,
        payment_user_a,
        payment_user_b,
        user_a,
        user_b,
        status,
        refund_status_a,
        refund_status_b,
        refunded_at_a,
        refunded_at_b
      `)
      .order("created_at", {
        ascending: false,
      });

    console.log(
      "Admin payments:",
      data
    );

    console.log(
      "Admin payments error:",
      error
    );

    if (error) {
      console.error(error);
      return;
    }

    const formatted =
      (data || []).map((m: any) => {
        let paymentStatus =
          "pending";

        if (
          m.payment_user_a &&
          m.payment_user_b
        ) {
          paymentStatus =
            "completed";
        } else if (
          m.payment_user_a ||
          m.payment_user_b
        ) {
          paymentStatus =
            "partial";
        }

        return {
          meetingId: m.id,

          userAId:
            m.user_a,

          userBId:
            m.user_b,

          userAPayment:
            m.payment_user_a
              ? "paid"
              : "pending",

          userBPayment:
            m.payment_user_b
              ? "paid"
              : "pending",

          price:
            Number(m.price || 0),

          paymentDeadline:
            m.payment_deadline,

          status:
            paymentStatus,

          meetingStatus:
            m.status,

          refundStatusA:
            m.refund_status_a ??
            "not_refunded",

          refundStatusB:
            m.refund_status_b ??
            "not_refunded",

          refundedAtA:
            m.refunded_at_a ?? null,

          refundedAtB:
            m.refunded_at_b ?? null,
        };
      });

    setPayments(formatted);
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadPaymentStats();
    loadPayments();
  }, []);

  /* =========================================================
     REALTIME
  ========================================================= */

  useEffect(() => {
    const channel =
      supabase
        .channel("admin-payments")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "p2p_meetings",
          },
          () => {
            loadPayments();
            loadPaymentStats();
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "p2p_refunds",
          },
          () => {
            loadPayments();
            loadPaymentStats();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  /* =========================================================
     MARK RECEIVED
     
     IMPORTANT:
     This remains only as a manual/admin fallback.
     It does NOT initiate or verify a Razorpay payment.
  ========================================================= */

  const handleMarkReceived = async (
    payment: any
  ) => {
    const confirmed =
      confirm(
        "This manually marks BOTH participant payments as received. This should only be used for an authorized manual correction. Continue?"
      );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("p2p_meetings")
      .update({
        payment_user_a:
          true,
        payment_user_b:
          true,
      })
      .eq(
        "id",
        payment.meetingId
      )
      .select();

    console.log(
      "Payment update result:",
      data
    );

    console.log(
      "Payment update error:",
      error
    );

    setLoading(false);

    if (error) {
      alert(
        "Failed to mark payment received"
      );
      return;
    }

    alert(
      "Payment marked as received"
    );

    await loadPayments();
    await loadPaymentStats();
  };

  /* =========================================================
     REFUND
     
     This now calls the secure Edge Function:
     
       refund-p2p-payment
     
     The Edge Function performs:
       - authentication
       - admin authorization
       - participant validation
       - payment validation
       - Razorpay refund
       - refund ledger update
       - meeting refund status update
  ========================================================= */

  const handleRefund = async (
    payment: {
      meetingId: string;
      userId: string;
      price: number;
      participantSide: "a" | "b";
    }
  ) => {
    const participantLabel =
      payment.participantSide === "a"
        ? "User A"
        : "User B";

    const reason =
      prompt(
        `Enter refund reason for ${participantLabel}`
      );

    if (!reason?.trim()) {
      return;
    }

    const confirmed =
      confirm(
        `Refund ₹${payment.price} to ${participantLabel}?\n\nReason: ${reason.trim()}`
      );

    if (!confirmed) {
      return;
    }

    const loadingKey =
      `${payment.meetingId}-${payment.userId}`;

    setRefundLoading(
      loadingKey
    );

    try {
      /* -------------------------------------------------------
         Get the current authenticated session
      ------------------------------------------------------- */

      const {
        data: sessionData,
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (
        sessionError ||
        !sessionData.session
      ) {
        console.error(
          "SESSION ERROR:",
          sessionError
        );

        alert(
          "Your admin session is missing or expired. Please sign in again."
        );

        return;
      }

      /* -------------------------------------------------------
         Call secure refund Edge Function
      ------------------------------------------------------- */

      const {
        data,
        error,
      } =
        await supabase.functions.invoke(
          "refund-p2p-payment",
          {
            body: {
              meeting_id:
                payment.meetingId,

              user_id:
                payment.userId,

              reason:
                reason.trim(),
            },
          }
        );

      console.log(
        "P2P refund function result:",
        data
      );

      console.log(
        "P2P refund function error:",
        error
      );

      /* -------------------------------------------------------
         Edge Function transport error
      ------------------------------------------------------- */

      if (error) {
        console.error(
          "P2P REFUND INVOKE ERROR:",
          error
        );

        alert(
          `Refund request failed:\n\n${
            error.message ||
            "Unable to contact refund service"
          }`
        );

        return;
      }

      /* -------------------------------------------------------
         Application-level failure
      ------------------------------------------------------- */

      if (!data?.success) {
        alert(
          data?.error ||
          "Refund failed"
        );

        return;
      }

      /* -------------------------------------------------------
         Already refunded
      ------------------------------------------------------- */

      if (
        data.already_refunded
      ) {
        alert(
          `${participantLabel} has already been refunded.`
        );

        await loadPayments();
        await loadPaymentStats();

        return;
      }

      /* -------------------------------------------------------
         Pending refund
      ------------------------------------------------------- */

      if (
        data.refund_status ===
        "pending"
      ) {
        alert(
          `Refund request accepted by Razorpay for ${participantLabel}, but the refund is still pending.\n\nRefund ID: ${
            data.gateway_refund_id ||
            "Not available"
          }`
        );

        await loadPayments();
        await loadPaymentStats();

        return;
      }

      /* -------------------------------------------------------
         Completed refund
      ------------------------------------------------------- */

      if (
        data.refund_status ===
        "refunded"
      ) {
        alert(
          `₹${payment.price} refund completed successfully for ${participantLabel}.\n\nRazorpay Refund ID: ${
            data.gateway_refund_id ||
            "Not available"
          }`
        );

        await loadPayments();
        await loadPaymentStats();

        return;
      }

      /* -------------------------------------------------------
         Unexpected success response
      ------------------------------------------------------- */

      alert(
        "Refund request completed, but the returned refund status was unexpected. Please verify the meeting and refund ledger."
      );

      await loadPayments();
      await loadPaymentStats();
    } catch (err) {
      console.error(
        "UNEXPECTED FRONTEND REFUND ERROR:",
        err
      );

      alert(
        "An unexpected error occurred while processing the refund."
      );
    } finally {
      setRefundLoading(
        null
      );
    }
  };

  /* =========================================================
     CANCEL MEETING
  ========================================================= */

  const handleCancelMeeting =
    async (
      payment: any
    ) => {
      const confirmCancel =
        confirm(
          "Cancel this meeting?"
        );

      if (!confirmCancel) {
        return;
      }

      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("p2p_meetings")
        .update({
          status:
            "cancelled",
        })
        .eq(
          "id",
          payment.meetingId
        )
        .select();

      console.log(
        "Cancel result:",
        data
      );

      console.log(
        "Cancel error:",
        error
      );

      setLoading(false);

      if (error) {
        alert(
          "Cancel failed"
        );
        return;
      }

      alert(
        "Meeting cancelled"
      );

      await loadPayments();
      await loadPaymentStats();
    };

  /* =========================================================
     FILTER PAYMENTS
  ========================================================= */

  const filteredPayments =
    payments.filter(
      (payment) => {
        const matchesSearch =
          !searchQuery.trim() ||
          payment.meetingId
            .toLowerCase()
            .includes(
              searchQuery
                .trim()
                .toLowerCase()
            );

        const matchesStatus =
          statusFilter ===
            "All" ||
          payment.status ===
            statusFilter.toLowerCase();

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-b border-white/30 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-6">
          <h1
            className="text-2xl lg:text-3xl text-white mb-2"
            style={{
              fontWeight: 700,
            }}
          >
            Payments Control
          </h1>

          <p className="text-sm text-gray-400">
            Monitor and manage P2P meeting payments
          </p>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-white/40 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-1">
              Total Revenue
            </p>

            <p
              className="text-3xl text-white"
              style={{
                fontWeight: 700,
              }}
            >
              ₹{stats.totalRevenue}
            </p>
          </div>

          <div className="bg-gray-800 border border-white/40 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-1">
              Completed Payments
            </p>

            <p
              className="text-3xl text-white"
              style={{
                fontWeight: 700,
              }}
            >
              {stats.completedPayments}
            </p>
          </div>

          <div className="bg-gray-800 border border-white/40 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-500">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-1">
              Pending Payments
            </p>

            <p
              className="text-3xl text-white"
              style={{
                fontWeight: 700,
              }}
            >
              {stats.pendingPayments}
            </p>
          </div>

          <div className="bg-gray-800 border border-white/40 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-red-500">
                <AlertCircle className="w-6 h-6 text-red-900" />
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-1">
              Refunds Issued
            </p>

            <p
              className="text-3xl text-white"
              style={{
                fontWeight: 700,
              }}
            >
              {stats.refundsIssued}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-800 border border-white/30 rounded-xl p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

              <input
                type="text"
                placeholder="Search by meeting ID..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/20 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="px-4 py-3 rounded-xl border border-white/10 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              style={{
                fontWeight: 500,
              }}
            >
              <option>
                All
              </option>
              <option>
                Completed
              </option>
              <option>
                Partial
              </option>
              <option>
                Pending
              </option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-gray-800 border border-white/40 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/90 border-b border-white/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
                    Meeting ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
                    User A Payment
                  </th>

                  <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
                    User B Payment
                  </th>

                  <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
                    Payment Deadline
                  </th>

                  <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {filteredPayments.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={
                        7
                      }
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      No payments found
                    </td>
                  </tr>
                )}

                {filteredPayments.map(
                  (payment) => {
                    const refundAKey =
                      `${payment.meetingId}-${payment.userAId}`;

                    const refundBKey =
                      `${payment.meetingId}-${payment.userBId}`;

                    const refundALoading =
                      refundLoading ===
                      refundAKey;

                    const refundBLoading =
                      refundLoading ===
                      refundBKey;

                    const userAAlreadyRefunded =
                      payment.refundStatusA ===
                        "refunded";

                    const userBAlreadyRefunded =
                      payment.refundStatusB ===
                        "refunded";

                    return (
                      <tr
                        key={
                          payment.meetingId
                        }
                        className="hover:bg-gray-800/50"
                      >
                        {/* Meeting ID */}
                        <td className="px-6 py-4">
                          <span
                            className="text-sm text-white font-mono"
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {
                              payment.meetingId
                            }
                          </span>
                        </td>

                        {/* User A */}
                        <td className="px-6 py-4">
                          {payment.userAPayment ===
                          "paid" ? (
                            <div className="flex flex-col gap-1">
                              <span className="flex items-center gap-1 text-sm text-green-500">
                                <CheckCircle2 className="w-4 h-4" />
                                Paid
                              </span>

                              {userAAlreadyRefunded && (
                                <span className="text-xs text-purple-400">
                                  Refunded
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="flex items-center gap-1 text-sm text-orange-500">
                              <Clock className="w-4 h-4" />
                              Pending
                            </span>
                          )}
                        </td>

                        {/* User B */}
                        <td className="px-6 py-4">
                          {payment.userBPayment ===
                          "paid" ? (
                            <div className="flex flex-col gap-1">
                              <span className="flex items-center gap-1 text-sm text-green-500">
                                <CheckCircle2 className="w-4 h-4" />
                                Paid
                              </span>

                              {userBAlreadyRefunded && (
                                <span className="text-xs text-purple-400">
                                  Refunded
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="flex items-center gap-1 text-sm text-orange-500">
                              <Clock className="w-4 h-4" />
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4">
                          <span
                            className="text-sm text-white"
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            ₹
                            {
                              payment.price
                            }
                          </span>
                        </td>

                        {/* Deadline */}
                        <td className="px-6 py-4">
                          <span className="text-xs text-gray-500">
                            {payment.paymentDeadline
                              ? new Date(
                                  payment.paymentDeadline
                                ).toLocaleString()
                              : "—"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs border ${
                              payment.status ===
                              "completed"
                                ? "bg-green-500 text-green-900 border-green-500"
                                : payment.status ===
                                  "partial"
                                ? "bg-blue-500 text-blue-900 border-blue-500"
                                : "bg-orange-500 text-orange-300 border-orange-500"
                            }`}
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {payment.status
                              .charAt(
                                0
                              )
                              .toUpperCase() +
                              payment.status.slice(
                                1
                              )}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Manual fallback */}
                            <button
                              onClick={() =>
                                handleMarkReceived(
                                  payment
                                )
                              }
                              disabled={
                                loading
                              }
                              className="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-500/30 border border-green-500 text-green-400 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{
                                fontWeight: 500,
                              }}
                            >
                              Mark Received
                            </button>

                            {/* Refund User A */}
                            {payment.userAPayment ===
                              "paid" &&
                              !userAAlreadyRefunded ? (
                              <button
                                onClick={() =>
                                  handleRefund(
                                    {
                                      meetingId:
                                        payment.meetingId,
                                      userId:
                                        payment.userAId,
                                      price:
                                        payment.price,
                                      participantSide:
                                        "a",
                                    }
                                  )
                                }
                                disabled={
                                  refundALoading ||
                                  loading
                                }
                                className="px-3 py-1.5 rounded-lg bg-orange-500 border border-orange-500 text-orange-400 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {refundALoading
                                  ? "Refunding..."
                                  : "Refund User A"}
                              </button>
                            ) : (
                              payment.userAPayment ===
                                "paid" && (
                                <span className="px-3 py-1.5 rounded-lg border border-purple-500/50 text-purple-400 text-xs">
                                  User A Refunded
                                </span>
                              )
                            )}

                            {/* Refund User B */}
                            {payment.userBPayment ===
                              "paid" &&
                              !userBAlreadyRefunded ? (
                              <button
                                onClick={() =>
                                  handleRefund(
                                    {
                                      meetingId:
                                        payment.meetingId,
                                      userId:
                                        payment.userBId,
                                      price:
                                        payment.price,
                                      participantSide:
                                        "b",
                                    }
                                  )
                                }
                                disabled={
                                  refundBLoading ||
                                  loading
                                }
                                className="px-3 py-1.5 rounded-lg bg-orange-500 border border-orange-500 text-orange-400 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {refundBLoading
                                  ? "Refunding..."
                                  : "Refund User B"}
                              </button>
                            ) : (
                              payment.userBPayment ===
                                "paid" && (
                                <span className="px-3 py-1.5 rounded-lg border border-purple-500/50 text-purple-400 text-xs">
                                  User B Refunded
                                </span>
                              )
                            )}

                            {/* Cancel */}
                            <button
                              onClick={() =>
                                handleCancelMeeting(
                                  payment
                                )
                              }
                              disabled={
                                loading ||
                                refundLoading !==
                                  null
                              }
                              className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-500/30 border border-red-500 text-red-400 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{
                                fontWeight: 500,
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}