import { supabase } from "../../../../supabase";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  Search,
  Eye,
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
  X,
  User,
  CreditCard,
  FileText,
  IndianRupee,
} from "lucide-react";

/* ==============================================================
   TYPES
============================================================== */

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
  [key: string]: any;
}

interface UserRecord {
  id: string;
  name: string | null;
  profile_photo_url: string | null;
  city: string | null;
  email?: string | null;
  phone?: string | null;
}

interface MeetingRecord {
  id: string;
  user_a: string;
  user_b: string;
  price: number | string | null;
  status: string;

  payment_user_a: boolean;
  payment_user_b: boolean;
  payment_deadline: string | null;

  cancel_reason: string | null;

  meeting_city: string | null;
  meeting_area: string | null;
  meeting_time: string | null;
  meeting_point_text: string | null;

  razorpay_order_id_a: string | null;
  razorpay_payment_id_a: string | null;

  razorpay_order_id_b: string | null;
  razorpay_payment_id_b: string | null;

  refund_status_a: string | null;
  refund_status_b: string | null;

  refunded_at_a: string | null;
  refunded_at_b: string | null;

  created_at: string | null;
  updated_at: string | null;

  [key: string]: any;
}

interface RefundDetails {
  refund: RefundRecord;
  user: UserRecord | null;
  meeting: MeetingRecord | null;
  otherUser: UserRecord | null;
}

/* ==============================================================
   MAIN COMPONENT
============================================================== */

export function P2PRefunds() {
  const [refunds, setRefunds] =
    useState<RefundRecord[]>([]);

  const [users, setUsers] =
    useState<Record<string, UserRecord>>({});

  const [meetings, setMeetings] =
    useState<MeetingRecord[]>([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedRefund, setSelectedRefund] =
    useState<RefundDetails | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  /* ============================================================
     LOAD REFUNDS THROUGH SECURE ADMIN EDGE FUNCTION
  ============================================================ */

  const loadRefunds = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorMessage(null);

      /* --------------------------------------------------------
         CURRENT SESSION
      -------------------------------------------------------- */

      const {
        data: {
          session,
        },
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (
        sessionError ||
        !session
      ) {
        setErrorMessage(
          "Admin session not found. Please sign in again."
        );

        setRefunds([]);
        setUsers({});
        setMeetings([]);

        return;
      }

      /* --------------------------------------------------------
         ADMIN EDGE FUNCTION
      -------------------------------------------------------- */

      const {
        data,
        error,
      } =
        await supabase.functions.invoke(
          "admin-p2p-refunds",
          {
            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },
            body: {},
          }
        );

      if (error) {
        console.error(
          "admin-p2p-refunds invoke error:",
          error
        );

        setErrorMessage(
          error.message ||
            "Failed to load P2P refunds."
        );

        setRefunds([]);

        return;
      }

      if (
        !data ||
        data.success !== true
      ) {
        console.error(
          "admin-p2p-refunds response:",
          data
        );

        setErrorMessage(
          data?.error ||
            "Unable to load P2P refund records."
        );

        setRefunds([]);

        return;
      }

      /* --------------------------------------------------------
         STORE REFUNDS
      -------------------------------------------------------- */

      setRefunds(
        (data.refunds ||
          []) as RefundRecord[]
      );

      /* --------------------------------------------------------
         STORE USERS
      -------------------------------------------------------- */

      setUsers(
        data.users ||
          {}
      );

      /* --------------------------------------------------------
         STORE MEETINGS
      -------------------------------------------------------- */

      setMeetings(
        Object.values(
          data.meetings ||
            {}
        ) as MeetingRecord[]
      );

      console.log(
        "P2P refunds loaded:",
        {
          count:
            data.refunds?.length ||
            0,
        }
      );
    } catch (error) {
      console.error(
        "P2P refund admin load failed:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unexpected error while loading refunds."
      );

      setRefunds([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ============================================================
     INITIAL LOAD + REALTIME
  ============================================================ */

  useEffect(() => {
    loadRefunds();

    const refundChannel =
      supabase
        .channel(
          "admin-p2p-refunds"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "p2p_refunds",
          },
          () => {
            loadRefunds(true);
          }
        )
        .subscribe();

    const meetingChannel =
      supabase
        .channel(
          "admin-p2p-refund-meetings"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "p2p_meetings",
          },
          () => {
            loadRefunds(true);
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        refundChannel
      );

      supabase.removeChannel(
        meetingChannel
      );
    };
  }, []);

  /* ============================================================
     LOCK BACKGROUND SCROLL WHEN MODAL IS OPEN
  ============================================================ */

  useEffect(() => {
    if (!selectedRefund) {
      return;
    }

    const previousBodyOverflow =
      document.body.style.overflow;

    const previousHtmlOverflow =
      document.documentElement.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    document.documentElement.style.overflow =
      "hidden";

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setSelectedRefund(null);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousBodyOverflow;

      document.documentElement.style.overflow =
        previousHtmlOverflow;

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [selectedRefund]);

  /* ============================================================
     HELPERS
  ============================================================ */

  const formatDate = (
    value:
      | string
      | null
      | undefined
  ) => {
    if (!value) {
      return "—";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleString();
  };

  const formatAmount = (
    value:
      | number
      | string
      | null
      | undefined
  ) => {
    const amount =
      Number(value);

    if (
      !Number.isFinite(
        amount
      )
    ) {
      return "₹0";
    }

    return `₹${amount.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const getStatusConfig = (
    status: string
  ) => {
    switch (status) {
      case "completed":
        return {
          label: "Completed",
          className:
            "bg-green-500/10 text-green-300 border-green-500/30",
          icon:
            <CheckCircle2 className="w-3.5 h-3.5" />,
        };

      case "refunded":
        return {
          label: "Refunded",
          className:
            "bg-green-500/10 text-green-300 border-green-500/30",
          icon:
            <CheckCircle2 className="w-3.5 h-3.5" />,
        };

      case "processing":
        return {
          label: "Processing",
          className:
            "bg-blue-500/10 text-blue-300 border-blue-500/30",
          icon:
            <RefreshCw className="w-3.5 h-3.5" />,
        };

      case "pending":
        return {
          label: "Pending",
          className:
            "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
          icon:
            <Clock className="w-3.5 h-3.5" />,
        };

      case "failed":
        return {
          label: "Failed",
          className:
            "bg-red-500/10 text-red-300 border-red-500/30",
          icon:
            <XCircle className="w-3.5 h-3.5" />,
        };

      default:
        return {
          label:
            status || "Unknown",
          className:
            "bg-gray-500/10 text-gray-300 border-gray-500/30",
          icon:
            <AlertCircle className="w-3.5 h-3.5" />,
        };
    }
  };

  /* ============================================================
     FILTER
  ============================================================ */

  const filteredRefunds =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      return refunds.filter(
        (refund) => {
          const user =
            users[
              refund.user_id
            ];

          const meeting =
            meetings.find(
              (item) =>
                item.id ===
                refund.meeting_id
            );

          const statusMatches =
            statusFilter ===
              "All" ||
            refund.status
              ?.toLowerCase() ===
              statusFilter.toLowerCase();

          if (!statusMatches) {
            return false;
          }

          if (!query) {
            return true;
          }

          return (
            refund.id
              ?.toLowerCase()
              .includes(query) ||
            refund.meeting_id
              ?.toLowerCase()
              .includes(query) ||
            refund.user_id
              ?.toLowerCase()
              .includes(query) ||
            refund.gateway_refund_id
              ?.toLowerCase()
              .includes(query) ||
            refund.reason
              ?.toLowerCase()
              .includes(query) ||
            user?.name
              ?.toLowerCase()
              .includes(query) ||
            meeting?.status
              ?.toLowerCase()
              .includes(query)
          );
        }
      );
    }, [
      refunds,
      users,
      meetings,
      searchQuery,
      statusFilter,
    ]);

  /* ============================================================
     OPEN DETAILS
  ============================================================ */

  const openDetails = (
    refund: RefundRecord
  ) => {
    const meeting =
      meetings.find(
        (item) =>
          item.id ===
          refund.meeting_id
      ) || null;

    const user =
      users[
        refund.user_id
      ] || null;

    let otherUser:
      | UserRecord
      | null = null;

    if (
      meeting &&
      user
    ) {
      const otherUserId =
        meeting.user_a ===
        user.id
          ? meeting.user_b
          : meeting.user_a;

      otherUser =
        users[
          otherUserId
        ] || null;
    }

    setSelectedRefund({
      refund,
      user,
      meeting,
      otherUser,
    });
  };

  /* ============================================================
     STATISTICS
  ============================================================ */

  const completedCount =
    refunds.filter(
      (refund) =>
        refund.status ===
          "completed" ||
        refund.status ===
          "refunded"
    ).length;

  const processingCount =
    refunds.filter(
      (refund) =>
        refund.status ===
        "processing"
    ).length;

  const pendingCount =
    refunds.filter(
      (refund) =>
        refund.status ===
        "pending"
    ).length;

  const failedCount =
    refunds.filter(
      (refund) =>
        refund.status ===
        "failed"
    ).length;

  const totalRefundedAmount =
    refunds
      .filter(
        (refund) =>
          refund.status ===
            "completed" ||
          refund.status ===
            "refunded"
      )
      .reduce(
        (
          total,
          refund
        ) =>
          total +
          Number(
            refund.amount ||
              0
          ),
        0
      );

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-950 to-black pb-8">

      {/* ========================================================
          PAGE HEADER
      ======================================================== */}

      <div className="bg-gradient-to-r from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">

        <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-6">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <h1
                className="text-2xl lg:text-3xl text-white mb-2"
                style={{
                  fontWeight: 700,
                }}
              >
                P2P Refunds
              </h1>

              <p className="text-sm text-gray-400">
                Complete refund ledger and Razorpay refund history
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                loadRefunds(true)
              }
              disabled={
                refreshing
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
            >

              <RefreshCw
                className={`w-4 h-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </div>

        </div>

      </div>

      {/* ========================================================
          MAIN CONTENT
      ======================================================== */}

      <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-8 space-y-6">

        {/* ======================================================
            ERROR
        ====================================================== */}

        {errorMessage && (

          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">

            <div className="flex items-start gap-3">

              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />

              <div className="min-w-0">

                <div className="text-sm font-semibold text-red-300 mb-1">
                  Unable to load P2P refunds
                </div>

                <div className="text-sm text-red-200/80 break-words">
                  {
                    errorMessage
                  }
                </div>

              </div>

            </div>

          </div>

        )}

        {/* ======================================================
            STATISTICS
        ====================================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

          <StatCard
            label="Total Refunds"
            value={
              refunds.length
            }
          />

          <StatCard
            label="Completed"
            value={
              completedCount
            }
          />

          <StatCard
            label="Processing"
            value={
              processingCount
            }
          />

          <StatCard
            label="Pending / Failed"
            value={
              pendingCount +
              failedCount
            }
          />

          <div className="rounded-2xl border border-white/10 bg-gray-800/70 p-5">

            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Refunded Amount
            </div>

            <div className="text-2xl font-bold text-white">
              {
                formatAmount(
                  totalRefundedAmount
                )
              }
            </div>

          </div>

        </div>

        {/* ======================================================
            SEARCH + FILTER
        ====================================================== */}

        <div className="bg-gray-800/80 border border-white/10 rounded-2xl p-4">

          <div className="flex flex-col lg:flex-row gap-4">

            <div className="flex-1 relative">

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />

              <input
                type="text"
                placeholder="Search refund ID, meeting ID, user, Razorpay refund ID, reason..."
                value={
                  searchQuery
                }
                onChange={(
                  event
                ) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-gray-900/70 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-500"
              />

            </div>

            <select
              value={
                statusFilter
              }
              onChange={(
                event
              ) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="px-4 py-3 rounded-xl border border-white/10 bg-gray-900/70 text-white focus:ring-2 focus:ring-blue-500 outline-none min-w-[180px]"
            >

              <option value="All">
                All
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="refunded">
                Refunded
              </option>

              <option value="processing">
                Processing
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="failed">
                Failed
              </option>

            </select>

          </div>

        </div>

        {/* ======================================================
            REFUND TABLE
        ====================================================== */}

        <div className="bg-gray-800 border border-white/10 rounded-2xl overflow-hidden">

          <div className="px-5 py-4 border-b border-white/10">

            <h2 className="text-white font-semibold">
              All Refund Records
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Showing{" "}
              {
                filteredRefunds.length
              }{" "}
              of{" "}
              {refunds.length}
            </p>

          </div>

          {loading ? (

            <div className="py-20 text-center text-gray-400">
              Loading P2P refunds...
            </div>

          ) : filteredRefunds.length ===
            0 ? (

            <div className="py-20 text-center">

              <RotateCcw className="w-10 h-10 text-gray-600 mx-auto mb-3" />

              {errorMessage ? (

                <p className="text-gray-500">
                  Refund records could not be loaded.
                </p>

              ) : (

                <p className="text-gray-400">
                  No refund records found.
                </p>

              )}

            </div>

          ) : (

            <div className="w-full overflow-x-auto">

              <table
                className="w-full"
                style={{
                  minWidth:
                    "1250px",
                  tableLayout:
                    "fixed",
                  borderCollapse:
                    "collapse",
                }}
              >

                <colgroup>

                  <col
                    style={{
                      width:
                        "13%",
                    }}
                  />

                  <col
                    style={{
                      width:
                        "15%",
                    }}
                  />

                  <col
                    style={{
                      width:
                        "14%",
                    }}
                  />

                  <col
                    style={{
                      width:
                        "8%",
                    }}
                  />

                  <col
                    style={{
                      width:
                        "10%",
                    }}
                  />

                  <col
                    style={{
                      width:
                        "13%",
                    }}
                  />

                  <col
                    style={{
                      width:
                        "12%",
                    }}
                  />

                  <col
                    style={{
                      width:
                        "7%",
                    }}
                  />

                  <col
                    style={{
                      width:
                        "5%",
                    }}
                  />

                  <col
                    style={{
                      width:
                        "7%",
                    }}
                  />

                </colgroup>

                <thead className="bg-gray-950/80 border-b border-white/10">

                  <tr>

                    <TableHeader>
                      Refund ID
                    </TableHeader>

                    <TableHeader>
                      User
                    </TableHeader>

                    <TableHeader>
                      Meeting ID
                    </TableHeader>

                    <TableHeader>
                      Amount
                    </TableHeader>

                    <TableHeader>
                      Status
                    </TableHeader>

                    <TableHeader>
                      Reason
                    </TableHeader>

                    <TableHeader>
                      Razorpay Refund ID
                    </TableHeader>

                    <TableHeader>
                      Created
                    </TableHeader>

                    <TableHeader>
                      Processed
                    </TableHeader>

                    <TableHeader>
                      Action
                    </TableHeader>

                  </tr>

                </thead>

                <tbody>

                  {filteredRefunds.map(
                    (refund) => {

                      const user =
                        users[
                          refund.user_id
                        ];

                      const config =
                        getStatusConfig(
                          refund.status
                        );

                      const initial =
                        user?.name
                          ?.trim()
                          ?.charAt(0)
                          ?.toUpperCase() ||
                        "U";

                      return (

                        <tr
                          key={
                            refund.id
                          }
                          className="border-b border-white/10 hover:bg-white/[0.025] transition-colors"
                          style={{
                            height:
                              "72px",
                          }}
                        >

                          {/* REFUND ID */}

                          <td className="px-4 py-3 align-middle">

                            <div
                              className="text-xs font-mono text-blue-300"
                              style={{
                                overflowWrap:
                                  "anywhere",
                                lineHeight:
                                  "1.3",
                              }}
                            >
                              {
                                refund.id
                              }
                            </div>

                          </td>

                          {/* USER */}

                          <td className="px-4 py-3 align-middle">

                            <div className="flex items-center gap-2 min-w-0">

                              <div
                                className="w-9 h-9 min-w-[36px] max-w-[36px] min-h-[36px] max-h-[36px] rounded-full bg-purple-500/20 border border-purple-500/20 flex items-center justify-center text-purple-300 text-xs font-bold"
                              >
                                {
                                  initial
                                }
                              </div>

                              <div className="min-w-0">

                                <div
                                  className="text-sm text-white"
                                  style={{
                                    overflow:
                                      "hidden",
                                    textOverflow:
                                      "ellipsis",
                                    whiteSpace:
                                      "nowrap",
                                  }}
                                >
                                  {
                                    user?.name ||
                                    "Unknown User"
                                  }
                                </div>

                                <div
                                  className="text-[10px] text-gray-500 font-mono"
                                  style={{
                                    overflow:
                                      "hidden",
                                    textOverflow:
                                      "ellipsis",
                                    whiteSpace:
                                      "nowrap",
                                  }}
                                >
                                  {
                                    refund.user_id
                                  }
                                </div>

                              </div>

                            </div>

                          </td>

                          {/* MEETING ID */}

                          <td className="px-4 py-3 align-middle">

                            <div
                              className="text-xs font-mono text-gray-300"
                              style={{
                                overflowWrap:
                                  "anywhere",
                                lineHeight:
                                  "1.3",
                              }}
                            >
                              {
                                refund.meeting_id
                              }
                            </div>

                          </td>

                          {/* AMOUNT */}

                          <td className="px-4 py-3 align-middle">

                            <div className="inline-flex items-center gap-1 text-sm font-semibold text-white">

                              <IndianRupee className="w-4 h-4 text-gray-500" />

                              {
                                Number(
                                  refund.amount
                                ).toLocaleString(
                                  "en-IN",
                                  {
                                    maximumFractionDigits:
                                      2,
                                  }
                                )
                              }

                            </div>

                          </td>

                          {/* STATUS */}

                          <td className="px-4 py-3 align-middle">

                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs border whitespace-nowrap ${config.className}`}
                            >

                              {
                                config.icon
                              }

                              {
                                config.label
                              }

                            </span>

                          </td>

                          {/* REASON */}

                          <td className="px-4 py-3 align-middle">

                            <div
                              className="text-xs text-gray-300"
                              style={{
                                whiteSpace:
                                  "normal",
                                overflowWrap:
                                  "anywhere",
                                lineHeight:
                                  "1.35",
                              }}
                            >
                              {
                                refund.reason ||
                                "—"
                              }
                            </div>

                          </td>

                          {/* RAZORPAY REFUND ID */}

                          <td className="px-4 py-3 align-middle">

                            <div
                              className="text-xs font-mono text-gray-300"
                              style={{
                                overflowWrap:
                                  "anywhere",
                                lineHeight:
                                  "1.3",
                              }}
                            >
                              {
                                refund.gateway_refund_id ||
                                "—"
                              }
                            </div>

                          </td>

                          {/* CREATED */}

                          <td className="px-4 py-3 align-middle">

                            <div className="text-xs text-gray-400">
                              {formatDate(
                                refund.created_at
                              )}
                            </div>

                          </td>

                          {/* PROCESSED */}

                          <td className="px-4 py-3 align-middle">

                            <div className="text-xs text-gray-400">
                              {formatDate(
                                refund.processed_at
                              )}
                            </div>

                          </td>

                          {/* ACTION */}

                          <td className="px-4 py-3 align-middle">

                            <button
                              type="button"
                              onClick={() =>
                                openDetails(
                                  refund
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-medium whitespace-nowrap transition-colors"
                            >

                              <Eye className="w-4 h-4" />

                              Details

                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

      {/* ========================================================
          REFUND DETAILS MODAL
      ======================================================== */}

      {selectedRefund &&
        typeof document !==
          "undefined" &&
        createPortal(
          <div
            className="fixed inset-0"
            style={{
              position:
                "fixed",
              inset: 0,
              width:
                "100vw",
              height:
                "100vh",
              zIndex:
                2147483647,
              overflow:
                "hidden",
            }}
          >

            {/* BACKDROP */}

            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() =>
                setSelectedRefund(
                  null
                )
              }
            />

            {/* MODAL HOLDER */}

            <div
              className="absolute inset-0 flex items-center justify-center p-4"
              style={{
                pointerEvents:
                  "none",
              }}
            >

              {/* MODAL */}

              <div
                className="relative bg-gray-900 border border-white/10 rounded-2xl shadow-2xl"
                style={{
                  width:
                    "min(1100px, calc(100vw - 32px))",
                  height:
                    "calc(100vh - 32px)",
                  maxHeight:
                    "calc(100vh - 32px)",
                  overflow:
                    "hidden",
                  pointerEvents:
                    "auto",
                }}
                onClick={(event) =>
                  event.stopPropagation()
                }
              >

                {/* ==================================================
                    FIXED HEADER
                ================================================== */}

                <div
                  className="absolute top-0 left-0 right-0 bg-gray-900 border-b border-white/10"
                  style={{
                    height:
                      "82px",
                    zIndex:
                      20,
                  }}
                >

                  <div className="h-full flex items-center justify-between px-6">

                    <div className="min-w-0 pr-4">

                      <div className="flex items-center gap-3">

                        <RotateCcw className="w-5 h-5 text-orange-400 flex-shrink-0" />

                        <h2 className="text-xl font-bold text-white">
                          Refund Details
                        </h2>

                      </div>

                      <p className="text-xs text-gray-500 font-mono break-all mt-2">
                        {
                          selectedRefund
                            .refund.id
                        }
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRefund(
                          null
                        )
                      }
                      className="flex-shrink-0 p-2.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      aria-label="Close refund details"
                    >

                      <X className="w-5 h-5" />

                    </button>

                  </div>

                </div>

                {/* ==================================================
                    SCROLLABLE DETAILS AREA
                ================================================== */}

                <div
                  className="p2p-refund-details-scroll"
                  onWheel={(event) =>
                    event.stopPropagation()
                  }
                  onTouchMove={(event) =>
                    event.stopPropagation()
                  }
                  style={{
                    position:
                      "absolute",

                    top:
                      "82px",

                    bottom:
                      "72px",

                    left: 0,

                    right: 0,

                    overflowY:
                      "scroll",

                    overflowX:
                      "hidden",

                    padding:
                      "24px",

                    boxSizing:
                      "border-box",

                    WebkitOverflowScrolling:
                      "touch",

                    overscrollBehavior:
                      "contain",

                    touchAction:
                      "pan-y",

                    scrollbarWidth:
                      "auto",

                    scrollbarGutter:
                      "stable",
                  }}
                >

                  {/* ==================================================
                      SUMMARY
                  ================================================== */}

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                    <DetailBox
                      label="Amount"
                      value={formatAmount(
                        selectedRefund
                          .refund
                          .amount
                      )}
                    />

                    <DetailBox
                      label="Status"
                      value={
                        getStatusConfig(
                          selectedRefund
                            .refund
                            .status
                        ).label
                      }
                    />

                    <DetailBox
                      label="Created"
                      value={formatDate(
                        selectedRefund
                          .refund
                          .created_at
                      )}
                    />

                    <DetailBox
                      label="Processed"
                      value={formatDate(
                        selectedRefund
                          .refund
                          .processed_at
                      )}
                    />

                  </div>

                  {/* ==================================================
                      USER
                  ================================================== */}

                  <div className="rounded-2xl border border-white/10 bg-gray-800/60 p-5 mb-6">

                    <div className="flex items-center gap-2 mb-4">

                      <User className="w-4 h-4 text-purple-400" />

                      <h3 className="text-white font-semibold">
                        Refunded User
                      </h3>

                    </div>

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 min-w-[56px] rounded-full bg-purple-500/20 border border-purple-500/20 overflow-hidden flex items-center justify-center text-purple-300 font-bold">

                        {selectedRefund
                          .user
                          ?.profile_photo_url ? (

                          <img
                            src={
                              selectedRefund
                                .user
                                .profile_photo_url
                            }
                            alt={
                              selectedRefund
                                .user
                                .name ||
                              "User"
                            }
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              minWidth:
                                "100%",
                              minHeight:
                                "100%",
                              maxWidth:
                                "100%",
                              maxHeight:
                                "100%",
                              objectFit:
                                "cover",
                              display:
                                "block",
                            }}
                          />

                        ) : (

                          selectedRefund
                            .user
                            ?.name
                            ?.charAt(
                              0
                            )
                            ?.toUpperCase() ||
                          "U"

                        )}

                      </div>

                      <div className="min-w-0">

                        <div className="text-white font-medium">
                          {
                            selectedRefund
                              .user
                              ?.name ||
                            "Unknown User"
                          }
                        </div>

                        <div className="text-xs text-gray-500 mt-1 break-all">
                          {
                            selectedRefund
                              .refund
                              .user_id
                          }
                        </div>

                        {selectedRefund
                          .user
                          ?.email && (

                          <div className="text-xs text-gray-400 mt-2 break-all">
                            {
                              selectedRefund
                                .user
                                .email
                            }
                          </div>

                        )}

                        {selectedRefund
                          .user
                          ?.phone && (

                          <div className="text-xs text-gray-400 mt-1">
                            {
                              selectedRefund
                                .user
                                .phone
                            }
                          </div>

                        )}

                        {selectedRefund
                          .user
                          ?.city && (

                          <div className="text-xs text-gray-400 mt-2">
                            {
                              selectedRefund
                                .user
                                .city
                            }
                          </div>

                        )}

                      </div>

                    </div>

                  </div>

                  {/* ==================================================
                      REFUND INFORMATION
                  ================================================== */}

                  <div className="rounded-2xl border border-white/10 bg-gray-800/60 p-5 mb-6">

                    <div className="flex items-center gap-2 mb-5">

                      <CreditCard className="w-4 h-4 text-cyan-400" />

                      <h3 className="text-white font-semibold">
                        Refund Information
                      </h3>

                    </div>

                    <div className="grid md:grid-cols-2 gap-5">

                      <DetailBox
                        label="Refund ID"
                        value={
                          selectedRefund
                            .refund
                            .id
                        }
                        mono
                      />

                      <DetailBox
                        label="Meeting ID"
                        value={
                          selectedRefund
                            .refund
                            .meeting_id
                        }
                        mono
                      />

                      <DetailBox
                        label="Gateway Refund ID"
                        value={
                          selectedRefund
                            .refund
                            .gateway_refund_id ||
                          "—"
                        }
                        mono
                      />

                      <DetailBox
                        label="Reason"
                        value={
                          selectedRefund
                            .refund
                            .reason ||
                          "—"
                        }
                      />

                    </div>

                  </div>

                  {/* ==================================================
                      RELATED MEETING
                  ================================================== */}

                  <div className="rounded-2xl border border-white/10 bg-gray-800/60 p-5 mb-6">

                    <div className="flex items-center gap-2 mb-5">

                      <FileText className="w-4 h-4 text-blue-400" />

                      <h3 className="text-white font-semibold">
                        Related Meeting
                      </h3>

                    </div>

                    {!selectedRefund.meeting ? (

                      <div className="rounded-xl border border-dashed border-white/10 bg-gray-900/40 p-8 text-center">

                        <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-3" />

                        <p className="text-sm text-gray-400">
                          Related meeting record not found.
                        </p>

                      </div>

                    ) : (

                      <div className="space-y-5">

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                          <DetailBox
                            label="Meeting Status"
                            value={
                              selectedRefund
                                .meeting
                                .status
                                ?.replaceAll(
                                  "_",
                                  " "
                                ) ||
                              "—"
                            }
                          />

                          <DetailBox
                            label="Price"
                            value={formatAmount(
                              selectedRefund
                                .meeting
                                .price
                            )}
                          />

                          <DetailBox
                            label="User A Payment"
                            value={
                              selectedRefund
                                .meeting
                                .payment_user_a
                                ? "Paid"
                                : "Not Paid"
                            }
                          />

                          <DetailBox
                            label="User B Payment"
                            value={
                              selectedRefund
                                .meeting
                                .payment_user_b
                                ? "Paid"
                                : "Not Paid"
                            }
                          />

                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                          <DetailBox
                            label="Meeting Time"
                            value={formatDate(
                              selectedRefund
                                .meeting
                                .meeting_time
                            )}
                          />

                          <DetailBox
                            label="City"
                            value={
                              selectedRefund
                                .meeting
                                .meeting_city ||
                              "—"
                            }
                          />

                          <DetailBox
                            label="Area"
                            value={
                              selectedRefund
                                .meeting
                                .meeting_area ||
                              "—"
                            }
                          />

                          <DetailBox
                            label="Meeting Point"
                            value={
                              selectedRefund
                                .meeting
                                .meeting_point_text ||
                              "—"
                            }
                          />

                        </div>

                        {selectedRefund
                          .meeting
                          .cancel_reason && (

                          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">

                            <div className="text-xs text-red-300 uppercase tracking-wider font-semibold mb-2">
                              Cancellation Reason
                            </div>

                            <p className="text-sm text-gray-300 whitespace-pre-wrap">
                              {
                                selectedRefund
                                  .meeting
                                  .cancel_reason
                              }
                            </p>

                          </div>

                        )}

                      </div>
                    )}

                  </div>

                  {/* ==================================================
                      RAW REFUND RECORD
                  ================================================== */}

                  <details className="rounded-2xl border border-white/10 bg-gray-800/60 overflow-hidden mb-6">

                    <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-white hover:bg-white/5">
                      View Complete Stored Refund Record
                    </summary>

                    <div className="p-5 border-t border-white/10">

                      <pre className="text-xs text-gray-300 bg-gray-950 rounded-xl p-4 overflow-auto max-h-[400px]">
                        {JSON.stringify(
                          selectedRefund
                            .refund,
                          null,
                          2
                        )}
                      </pre>

                    </div>

                  </details>

                  <div
                    style={{
                      height:
                        "24px",
                    }}
                  />

                </div>

                {/* ==================================================
                    FIXED FOOTER
                ================================================== */}

                <div
                  className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-white/10"
                  style={{
                    height:
                      "72px",
                    zIndex:
                      20,
                  }}
                >

                  <div className="h-full flex items-center justify-end px-6">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRefund(
                          null
                        )
                      }
                      className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white border border-white/10 transition-colors"
                    >
                      Close
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>,
          document.body
        )}

    </div>
  );
}

/* ==============================================================
   STAT CARD
============================================================== */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gray-800/70 p-5">

      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </div>

      <div className="text-2xl font-bold text-white">
        {value}
      </div>

    </div>
  );
}

/* ==============================================================
   TABLE HEADER
============================================================== */

function TableHeader({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <th
      className="px-4 py-4 text-left text-[11px] text-gray-400 uppercase tracking-wider border-b border-white/10"
      style={{
        fontWeight: 600,
        whiteSpace:
          "nowrap",
      }}
    >
      {children}
    </th>
  );
}

/* ==============================================================
   DETAIL BOX
============================================================== */

function DetailBox({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-gray-900/50 p-4">

      <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </div>

      <div
        className={`break-all ${
          mono
            ? "font-mono text-xs text-blue-300"
            : "text-sm text-white"
        }`}
      >
        {value}
      </div>

    </div>
  );
}