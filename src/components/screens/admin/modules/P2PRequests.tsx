import { supabase } from "../../../../supabase";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  X,
  User,
  MapPin,
  Calendar,
  CreditCard,
  RotateCcw,
  FileText,
  Check,
} from "lucide-react";

/* ==============================================================
   TYPES
============================================================== */

interface UserRecord {
  id: string;
  name: string | null;
  profile_photo_url: string | null;
  city: string | null;
  email?: string | null;
  phone?: string | null;
}

interface RequestRecord {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  purpose: string | null;
  what_i_bring: string | null;
  what_i_seek: string | null;
  preferred_time: string | null;
  preferred_location: string | null;
  created_at: string;
  responded_at: string | null;
  [key: string]: any;
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

  meeting_city: string | null;
  meeting_area: string | null;
  meeting_time: string | null;
  meeting_point_text: string | null;

  cancel_reason: string | null;

  razorpay_order_id_a: string | null;
  razorpay_payment_id_a: string | null;
  razorpay_signature_a?: string | null;

  razorpay_order_id_b: string | null;
  razorpay_payment_id_b: string | null;
  razorpay_signature_b?: string | null;

  refund_status_a: string | null;
  refund_status_b: string | null;

  refunded_at_a: string | null;
  refunded_at_b: string | null;

  created_at: string | null;
  updated_at: string | null;
  completed_at: string | null;

  [key: string]: any;
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
  [key: string]: any;
}

interface SelectedRequest {
  request: RequestRecord;
  requester: UserRecord | null;
  receiver: UserRecord | null;
  meeting: MeetingRecord | null;
  refunds: RefundRecord[];
}

/* ==============================================================
   MAIN COMPONENT
============================================================== */

export function P2PRequests() {
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [users, setUsers] = useState<
    Record<string, UserRecord>
  >({});
  const [meetings, setMeetings] = useState<
    MeetingRecord[]
  >([]);
  const [refunds, setRefunds] = useState<
    RefundRecord[]
  >([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedRequest, setSelectedRequest] =
    useState<SelectedRequest | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  /* ============================================================
     LOAD DATA
  ============================================================ */

  const loadRequests = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      /* ========================================================
         REQUESTS
      ======================================================== */

      const {
        data: requestData,
        error: requestError,
      } = await supabase
        .from("p2p_match_requests")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (requestError) {
        console.error(
          "Failed loading P2P requests:",
          requestError
        );
        return;
      }

      const safeRequests =
        (requestData || []) as RequestRecord[];

      setRequests(safeRequests);

      /* ========================================================
         USER IDS
      ======================================================== */

      const userIds = Array.from(
        new Set(
          safeRequests.flatMap(
            (request) => [
              request.requester_id,
              request.receiver_id,
            ]
          )
        )
      ).filter(Boolean);

      /* ========================================================
         USERS
      ======================================================== */

      if (userIds.length > 0) {
        const {
          data: userData,
          error: userError,
        } = await supabase
          .from("users")
          .select(`
            id,
            name,
            profile_photo_url,
            city,
            email,
            phone
          `)
          .in("id", userIds);

        if (userError) {
          console.error(
            "Failed loading users:",
            userError
          );
        } else {
          const userMap: Record<
            string,
            UserRecord
          > = {};

          (userData || []).forEach(
            (user: UserRecord) => {
              userMap[user.id] = user;
            }
          );

          setUsers(userMap);
        }
      } else {
        setUsers({});
      }

      /* ========================================================
         MEETINGS
      ======================================================== */

      const {
        data: meetingData,
        error: meetingError,
      } = await supabase
        .from("p2p_meetings")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (meetingError) {
        console.error(
          "Failed loading P2P meetings:",
          meetingError
        );
      } else {
        setMeetings(
          (meetingData || []) as MeetingRecord[]
        );
      }

      /* ========================================================
         REFUNDS
      ======================================================== */

      const {
        data: refundData,
        error: refundError,
      } = await supabase
        .from("p2p_refunds")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (refundError) {
        console.error(
          "Failed loading P2P refunds:",
          refundError
        );
      } else {
        setRefunds(
          (refundData || []) as RefundRecord[]
        );
      }
    } catch (error) {
      console.error(
        "P2P request audit load failed:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ============================================================
     INITIAL LOAD + REALTIME
  ============================================================ */

  useEffect(() => {
    loadRequests();

    const requestChannel = supabase
      .channel("admin-p2p-requests-table")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "p2p_match_requests",
        },
        () => {
          loadRequests(true);
        }
      )
      .subscribe();

    const meetingChannel = supabase
      .channel("admin-p2p-request-meetings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "p2p_meetings",
        },
        () => {
          loadRequests(true);
        }
      )
      .subscribe();

    const refundChannel = supabase
      .channel("admin-p2p-request-refunds")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "p2p_refunds",
        },
        () => {
          loadRequests(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(
        requestChannel
      );

      supabase.removeChannel(
        meetingChannel
      );

      supabase.removeChannel(
        refundChannel
      );
    };
  }, []);

  /* ============================================================
     LOCK BACKGROUND SCROLL WHEN MODAL IS OPEN
  ============================================================ */

  useEffect(() => {
    if (!selectedRequest) {
      return;
    }

    const oldBodyOverflow =
      document.body.style.overflow;

    const oldHtmlOverflow =
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
        setSelectedRequest(null);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        oldBodyOverflow;

      document.documentElement.style.overflow =
        oldHtmlOverflow;

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [selectedRequest]);

  /* ============================================================
     STATUS
  ============================================================ */

  const getStatusConfig = (
    status: string
  ) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          className:
            "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
          icon: (
            <Clock className="w-3.5 h-3.5" />
          ),
        };

      case "accepted":
        return {
          label: "Accepted",
          className:
            "bg-green-500/10 text-green-300 border-green-500/30",
          icon: (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ),
        };

      case "rejected":
        return {
          label: "Rejected",
          className:
            "bg-red-500/10 text-red-300 border-red-500/30",
          icon: (
            <XCircle className="w-3.5 h-3.5" />
          ),
        };

      case "expired":
        return {
          label: "Expired",
          className:
            "bg-orange-500/10 text-orange-100 border-orange-500/30",
          icon: (
            <AlertCircle className="w-3.5 h-3.5" />
          ),
        };

      default:
        return {
          label: status || "Unknown",
          className:
            "bg-gray-500/10 text-gray-300 border-gray-500/30",
          icon: (
            <FileText className="w-3.5 h-3.5" />
          ),
        };
    }
  };

  /* ============================================================
     FORMATTERS
  ============================================================ */

  const formatDate = (
    value: string | null | undefined
  ) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

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
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
      return "₹0";
    }

    return `₹${amount.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;
  };

  /* ============================================================
     FIND RELATED MEETING
  ============================================================ */

  const findMeetingForRequest = (
    request: RequestRecord
  ) => {
    return (
      meetings.find(
        (meeting) =>
          (meeting.user_a ===
            request.requester_id &&
            meeting.user_b ===
              request.receiver_id) ||
          (meeting.user_a ===
            request.receiver_id &&
            meeting.user_b ===
              request.requester_id)
      ) || null
    );
  };

  /* ============================================================
     FIND RELATED REFUNDS
  ============================================================ */

  const findRefundsForMeeting = (
    meetingId: string | null
  ) => {
    if (!meetingId) {
      return [];
    }

    return refunds.filter(
      (refund) =>
        refund.meeting_id === meetingId
    );
  };

  /* ============================================================
     OPEN DETAILS
  ============================================================ */

  const openRequestDetails = (
    request: RequestRecord
  ) => {
    const meeting =
      findMeetingForRequest(request);

    setSelectedRequest({
      request,

      requester:
        users[request.requester_id] ||
        null,

      receiver:
        users[request.receiver_id] ||
        null,

      meeting,

      refunds:
        findRefundsForMeeting(
          meeting?.id || null
        ),
    });
  };

  /* ============================================================
     FILTER
  ============================================================ */

  const filteredRequests = useMemo(() => {
    const query =
      searchQuery
        .trim()
        .toLowerCase();

    return requests.filter(
      (request) => {
        const requester =
          users[
            request.requester_id
          ];

        const receiver =
          users[
            request.receiver_id
          ];

        if (
          statusFilter !== "All" &&
          request.status !==
            statusFilter.toLowerCase()
        ) {
          return false;
        }

        if (!query) {
          return true;
        }

        return (
          request.id
            ?.toLowerCase()
            .includes(query) ||
          request.requester_id
            ?.toLowerCase()
            .includes(query) ||
          request.receiver_id
            ?.toLowerCase()
            .includes(query) ||
          requester?.name
            ?.toLowerCase()
            .includes(query) ||
          receiver?.name
            ?.toLowerCase()
            .includes(query) ||
          request.purpose
            ?.toLowerCase()
            .includes(query) ||
          request.preferred_location
            ?.toLowerCase()
            .includes(query)
        );
      }
    );
  }, [
    requests,
    users,
    searchQuery,
    statusFilter,
  ]);

  const pendingCount =
    requests.filter(
      (request) =>
        request.status ===
        "pending"
    ).length;

  const acceptedCount =
    requests.filter(
      (request) =>
        request.status ===
        "accepted"
    ).length;

  const expiredCount =
    requests.filter(
      (request) =>
        request.status ===
        "expired"
    ).length;

  /* ============================================================
     PAGE
  ============================================================ */

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-950 to-black pb-8">

      {/* ========================================================
          HEADER
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
                P2P Requests Audit
              </h1>

              <p className="text-sm text-gray-400">
                Complete history and details of all P2P requests
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                loadRequests(true)
              }
              disabled={refreshing}
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
            STATS
        ====================================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <StatCard
            label="Total Requests"
            value={
              requests.length
            }
          />

          <StatCard
            label="Pending"
            value={
              pendingCount
            }
          />

          <StatCard
            label="Accepted"
            value={
              acceptedCount
            }
          />

          <StatCard
            label="Expired"
            value={
              expiredCount
            }
          />

        </div>

        {/* ======================================================
            SEARCH
        ====================================================== */}

        <div className="bg-gray-800/80 border border-white/10 rounded-2xl p-4">

          <div className="flex flex-col lg:flex-row gap-4">

            <div className="flex-1 relative">

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />

              <input
                type="text"
                placeholder="Search request ID, requester, receiver, purpose, location..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-gray-900/70 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-500"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="px-4 py-3 rounded-xl border border-white/10 bg-gray-900/70 text-white focus:ring-2 focus:ring-blue-500 outline-none min-w-[160px]"
            >

              <option>All</option>
              <option>Pending</option>
              <option>Accepted</option>
              <option>Rejected</option>
              <option>Expired</option>

            </select>

          </div>

        </div>

        {/* ======================================================
            REQUEST TABLE
        ====================================================== */}

        <div className="bg-gray-800 border border-white/10 rounded-2xl overflow-hidden">

          <div className="px-5 py-4 border-b border-white/10">

            <h2 className="text-white font-semibold">
              All Requests
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Showing{" "}
              {
                filteredRequests.length
              }{" "}
              of{" "}
              {requests.length}
            </p>

          </div>

          {loading ? (

            <div className="py-20 text-center text-gray-400">
              Loading P2P requests...
            </div>

          ) : filteredRequests.length ===
            0 ? (

            <div className="py-20 text-center">

              <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />

              <p className="text-gray-400">
                No matching requests found.
              </p>

            </div>

          ) : (

            /*
             * IMPORTANT:
             * This wrapper owns horizontal scrolling only.
             * It prevents table content from changing the page width.
             */

            <div
              className="w-full overflow-x-auto overflow-y-hidden"
              style={{
                WebkitOverflowScrolling:
                  "touch",
              }}
            >

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

                {/* =================================================
                    COLUMN WIDTHS
                ================================================= */}

                <colgroup>

                  <col
                    style={{
                      width:
                        "12%",
                    }}
                  />

                  <col
                    style={{
                      width:
                        "16%",
                    }}
                  />

                  <col
                    style={{
                      width:
                        "16%",
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
                        "10%",
                    }}
                  />

                  <col
                    style={{
                      width:
                        "11%",
                    }}
                  />

                  <col
                    style={{
                      width:
                        "9%",
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
                        "7%",
                    }}
                  />

                </colgroup>

                {/* =================================================
                    HEADER
                ================================================= */}

                <thead className="bg-gray-950/90">

                  <tr>

                    <TableHeader>
                      Request ID
                    </TableHeader>

                    <TableHeader>
                      Requester
                    </TableHeader>

                    <TableHeader>
                      Receiver
                    </TableHeader>

                    <TableHeader>
                      Purpose
                    </TableHeader>

                    <TableHeader>
                      Location
                    </TableHeader>

                    <TableHeader>
                      Preferred Time
                    </TableHeader>

                    <TableHeader>
                      Created
                    </TableHeader>

                    <TableHeader>
                      Status
                    </TableHeader>

                    <TableHeader>
                      Action
                    </TableHeader>

                  </tr>

                </thead>

                {/* =================================================
                    BODY
                ================================================= */}

                <tbody>

                  {filteredRequests.map(
                    (request) => {

                      const requester =
                        users[
                          request.requester_id
                        ];

                      const receiver =
                        users[
                          request.receiver_id
                        ];

                      const statusConfig =
                        getStatusConfig(
                          request.status
                        );

                      return (

                        <tr
                          key={
                            request.id
                          }
                          className="border-b border-white/10 hover:bg-white/[0.025] transition-colors"
                          style={{
                            height:
                              "72px",
                          }}
                        >

                          {/* ---------------------------------------
                              REQUEST ID
                          --------------------------------------- */}

                          <TableCell>

                            <div
                              className="font-mono text-xs text-blue-300"
                              style={{
                                overflowWrap:
                                  "anywhere",
                                wordBreak:
                                  "break-word",
                                lineHeight:
                                  "1.35",
                              }}
                            >
                              {
                                request.id
                              }
                            </div>

                          </TableCell>

                          {/* ---------------------------------------
                              REQUESTER
                          --------------------------------------- */}

                          <TableCell>

                            <CompactUserCell
                              user={
                                requester
                              }
                            />

                          </TableCell>

                          {/* ---------------------------------------
                              RECEIVER
                          --------------------------------------- */}

                          <TableCell>

                            <CompactUserCell
                              user={
                                receiver
                              }
                              blue
                            />

                          </TableCell>

                          {/* ---------------------------------------
                              PURPOSE
                          --------------------------------------- */}

                          <TableCell>

                            <div
                              className="text-sm text-gray-300"
                              style={{
                                whiteSpace:
                                  "normal",
                                overflowWrap:
                                  "anywhere",
                                wordBreak:
                                  "break-word",
                                lineHeight:
                                  "1.35",
                              }}
                            >
                              {
                                request.purpose ||
                                "—"
                              }
                            </div>

                          </TableCell>

                          {/* ---------------------------------------
                              LOCATION
                          --------------------------------------- */}

                          <TableCell>

                            <div className="flex items-center gap-2 min-w-0">

                              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />

                              <span
                                className="text-sm text-gray-300"
                                style={{
                                  overflowWrap:
                                    "anywhere",
                                  wordBreak:
                                    "break-word",
                                  lineHeight:
                                    "1.35",
                                }}
                              >
                                {
                                  request.preferred_location ||
                                  "—"
                                }
                              </span>

                            </div>

                          </TableCell>

                          {/* ---------------------------------------
                              PREFERRED TIME
                          --------------------------------------- */}

                          <TableCell>

                            <div className="flex items-center gap-2 min-w-0">

                              <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />

                              <span
                                className="text-sm text-gray-300"
                                style={{
                                  overflowWrap:
                                    "anywhere",
                                  wordBreak:
                                    "break-word",
                                  lineHeight:
                                    "1.35",
                                }}
                              >
                                {
                                  request.preferred_time ||
                                  "—"
                                }
                              </span>

                            </div>

                          </TableCell>

                          {/* ---------------------------------------
                              CREATED
                          --------------------------------------- */}

                          <TableCell>

                            <div
                              className="text-xs text-gray-400"
                              style={{
                                overflowWrap:
                                  "anywhere",
                                wordBreak:
                                  "break-word",
                                lineHeight:
                                  "1.35",
                              }}
                            >
                              {formatDate(
                                request.created_at
                              )}
                            </div>

                          </TableCell>

                          {/* ---------------------------------------
                              STATUS
                          --------------------------------------- */}

                          <TableCell>

                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border whitespace-nowrap ${statusConfig.className}`}
                            >

                              {
                                statusConfig.icon
                              }

                              {
                                statusConfig.label
                              }

                            </span>

                          </TableCell>

                          {/* ---------------------------------------
                              ACTION
                          --------------------------------------- */}

                          <TableCell>

                            <button
                              type="button"
                              onClick={() =>
                                openRequestDetails(
                                  request
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-medium whitespace-nowrap transition-colors"
                            >

                              <Eye className="w-4 h-4 flex-shrink-0" />

                              View

                            </button>

                          </TableCell>

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
          DETAILS MODAL
      ======================================================== */}

      {selectedRequest &&
        typeof document !==
          "undefined" &&
        createPortal(
          <div
            className="fixed inset-0"
            style={{
              position:
                "fixed",
              inset: 0,
              zIndex:
                2147483647,
              width: "100vw",
              height: "100vh",
              overflow:
                "hidden",
            }}
          >

            {/* BACKDROP */}

            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() =>
                setSelectedRequest(
                  null
                )
              }
            />

            {/* MODAL HOLDER */}

            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                padding:
                  "16px",
                pointerEvents:
                  "none",
              }}
            >

              {/* ==================================================
                  MODAL
              ================================================== */}

              <div
                className="relative bg-gray-900 border border-white/10 rounded-2xl shadow-2xl"
                style={{
                  width:
                    "min(1152px, calc(100vw - 32px))",
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
                    MODAL HEADER
                ================================================== */}

                <div
                  className="absolute top-0 left-0 right-0 bg-gray-900 border-b border-white/10"
                  style={{
                    height:
                      "82px",
                    zIndex:
                      50,
                  }}
                >

                  <div className="h-full flex items-center justify-between px-6">

                    <div className="min-w-0 pr-4">

                      <div className="flex items-center gap-3">

                        <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />

                        <h2 className="text-xl font-bold text-white">
                          Request Details
                        </h2>

                      </div>

                      <p className="text-xs text-gray-500 font-mono break-all mt-2">
                        {
                          selectedRequest
                            .request.id
                        }
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRequest(
                          null
                        )
                      }
                      className="flex-shrink-0 p-2.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >

                      <X className="w-5 h-5" />

                    </button>

                  </div>

                </div>

                {/* ==================================================
                    MODAL SCROLL AREA
                ================================================== */}

                <div
                  className="p2p-request-details-scroll"
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
                      STATUS
                  ================================================== */}

                  <div className="flex items-center gap-3 mb-6">

                    <span className="text-xs text-gray-500">
                      Current Status
                    </span>

                    {(() => {

                      const config =
                        getStatusConfig(
                          selectedRequest
                            .request.status
                        );

                      return (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border ${config.className}`}
                        >
                          {
                            config.icon
                          }
                          {
                            config.label
                          }
                        </span>
                      );

                    })()}

                  </div>

                  {/* ==================================================
                      REQUESTER + RECEIVER
                  ================================================== */}

                  <div className="grid lg:grid-cols-2 gap-5 mb-6">

                    {/* REQUESTER */}

                    <div className="rounded-2xl border border-white/10 bg-gray-800/60 p-5">

                      <div className="flex items-center gap-2 mb-4">

                        <User className="w-4 h-4 text-purple-400" />

                        <h3 className="text-white font-semibold">
                          Requester
                        </h3>

                      </div>

                      <UserDetail
                        user={
                          selectedRequest
                            .requester
                        }
                        fallbackId={
                          selectedRequest
                            .request
                            .requester_id
                        }
                      />

                    </div>

                    {/* RECEIVER */}

                    <div className="rounded-2xl border border-white/10 bg-gray-800/60 p-5">

                      <div className="flex items-center gap-2 mb-4">

                        <User className="w-4 h-4 text-blue-400" />

                        <h3 className="text-white font-semibold">
                          Receiver
                        </h3>

                      </div>

                      <UserDetail
                        user={
                          selectedRequest
                            .receiver
                        }
                        fallbackId={
                          selectedRequest
                            .request
                            .receiver_id
                        }
                        blue
                      />

                    </div>

                  </div>

                  {/* ==================================================
                      REQUEST INFORMATION
                  ================================================== */}

                  <div className="rounded-2xl border border-white/10 bg-gray-800/60 p-5 mb-6">

                    <div className="flex items-center gap-2 mb-5">

                      <FileText className="w-4 h-4 text-blue-400" />

                      <h3 className="text-white font-semibold">
                        Request Information
                      </h3>

                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                      <InfoCard
                        label="Purpose"
                        value={
                          selectedRequest
                            .request
                            .purpose ||
                          "—"
                        }
                      />

                      <InfoCard
                        label="Preferred Time"
                        value={
                          selectedRequest
                            .request
                            .preferred_time ||
                          "—"
                        }
                        icon={
                          <Clock className="w-4 h-4 text-gray-500" />
                        }
                      />

                      <InfoCard
                        label="Preferred Location"
                        value={
                          selectedRequest
                            .request
                            .preferred_location ||
                          "—"
                        }
                        icon={
                          <MapPin className="w-4 h-4 text-gray-500" />
                        }
                      />

                      <InfoCard
                        label="Created At"
                        value={formatDate(
                          selectedRequest
                            .request
                            .created_at
                        )}
                        icon={
                          <Calendar className="w-4 h-4 text-gray-500" />
                        }
                      />

                      <InfoCard
                        label="Responded At"
                        value={formatDate(
                          selectedRequest
                            .request
                            .responded_at
                        )}
                      />

                      <InfoCard
                        label="Request ID"
                        value={
                          selectedRequest
                            .request.id
                        }
                        mono
                      />

                    </div>

                    <div className="grid lg:grid-cols-2 gap-5 mt-6">

                      <TextBox
                        label="What I Bring"
                        value={
                          selectedRequest
                            .request
                            .what_i_bring
                        }
                      />

                      <TextBox
                        label="What I Seek"
                        value={
                          selectedRequest
                            .request
                            .what_i_seek
                        }
                      />

                    </div>

                  </div>

                  {/* ==================================================
                      RELATED MEETING
                  ================================================== */}

                  <div className="rounded-2xl border border-white/10 bg-gray-800/60 p-5 mb-6">

                    <div className="flex items-center gap-2 mb-5">

                      <UsersIcon />

                      <h3 className="text-white font-semibold">
                        Related P2P Meeting
                      </h3>

                    </div>

                    {!selectedRequest.meeting ? (

                      <div className="rounded-xl border border-dashed border-white/10 bg-gray-900/40 p-8 text-center">

                        <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-3" />

                        <p className="text-sm text-gray-400">
                          No meeting has been created for this request.
                        </p>

                      </div>

                    ) : (

                      <div className="space-y-5">

                        {/* MEETING SUMMARY */}

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                          <InfoCard
                            label="Meeting ID"
                            value={
                              selectedRequest
                                .meeting.id
                            }
                            mono
                          />

                          <InfoCard
                            label="Status"
                            value={
                              selectedRequest
                                .meeting.status
                                ?.replaceAll(
                                  "_",
                                  " "
                                ) ||
                              "—"
                            }
                          />

                          <InfoCard
                            label="Price"
                            value={formatAmount(
                              selectedRequest
                                .meeting.price
                            )}
                          />

                          <InfoCard
                            label="Payment Deadline"
                            value={formatDate(
                              selectedRequest
                                .meeting
                                .payment_deadline
                            )}
                          />

                        </div>

                        {/* PAYMENTS */}

                        <div className="grid md:grid-cols-2 gap-4">

                          <PaymentCard
                            title="User A Payment"
                            paid={
                              selectedRequest
                                .meeting
                                .payment_user_a
                            }
                            orderId={
                              selectedRequest
                                .meeting
                                .razorpay_order_id_a
                            }
                            paymentId={
                              selectedRequest
                                .meeting
                                .razorpay_payment_id_a
                            }
                            refundStatus={
                              selectedRequest
                                .meeting
                                .refund_status_a
                            }
                            refundedAt={
                              selectedRequest
                                .meeting
                                .refunded_at_a
                            }
                          />

                          <PaymentCard
                            title="User B Payment"
                            paid={
                              selectedRequest
                                .meeting
                                .payment_user_b
                            }
                            orderId={
                              selectedRequest
                                .meeting
                                .razorpay_order_id_b
                            }
                            paymentId={
                              selectedRequest
                                .meeting
                                .razorpay_payment_id_b
                            }
                            refundStatus={
                              selectedRequest
                                .meeting
                                .refund_status_b
                            }
                            refundedAt={
                              selectedRequest
                                .meeting
                                .refunded_at_b
                            }
                          />

                        </div>

                        {/* SCHEDULING */}

                        <div className="rounded-xl border border-white/10 bg-gray-900/50 p-4">

                          <div className="text-sm font-semibold text-white mb-4">
                            Meeting / Scheduling Information
                          </div>

                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

                            <InfoCard
                              label="Meeting Time"
                              value={formatDate(
                                selectedRequest
                                  .meeting
                                  .meeting_time
                              )}
                            />

                            <InfoCard
                              label="City"
                              value={
                                selectedRequest
                                  .meeting
                                  .meeting_city ||
                                "—"
                              }
                            />

                            <InfoCard
                              label="Area"
                              value={
                                selectedRequest
                                  .meeting
                                  .meeting_area ||
                                "—"
                              }
                            />

                            <InfoCard
                              label="Meeting Point"
                              value={
                                selectedRequest
                                  .meeting
                                  .meeting_point_text ||
                                "—"
                              }
                            />

                          </div>

                        </div>

                        {/* CANCELLATION */}

                        {selectedRequest
                          .meeting
                          .cancel_reason && (
                          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">

                            <div className="flex items-center gap-2 mb-2">

                              <XCircle className="w-4 h-4 text-red-400" />

                              <span className="text-sm font-semibold text-red-300">
                                Cancellation Reason
                              </span>

                            </div>

                            <p className="text-sm text-gray-300 whitespace-pre-wrap">
                              {
                                selectedRequest
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
                      RELATED REFUNDS
                  ================================================== */}

                  <div className="rounded-2xl border border-white/10 bg-gray-800/60 p-5 mb-6">

                    <div className="flex items-center gap-2 mb-5">

                      <RotateCcw className="w-4 h-4 text-orange-400" />

                      <h3 className="text-white font-semibold">
                        Related Refunds
                      </h3>

                    </div>

                    {selectedRequest
                      .refunds.length ===
                    0 ? (

                      <div className="rounded-xl border border-dashed border-white/10 bg-gray-900/40 p-8 text-center">

                        <RotateCcw className="w-8 h-8 text-gray-600 mx-auto mb-3" />

                        <p className="text-sm text-gray-400">
                          No refund record exists for this request.
                        </p>

                      </div>

                    ) : (

                      <div className="overflow-x-auto">

                        <table className="w-full min-w-[900px]">

                          <thead>

                            <tr className="border-b border-white/10">

                              <th className="px-4 py-3 text-left text-[11px] text-gray-500 uppercase">
                                Refund ID
                              </th>

                              <th className="px-4 py-3 text-left text-[11px] text-gray-500 uppercase">
                                User
                              </th>

                              <th className="px-4 py-3 text-left text-[11px] text-gray-500 uppercase">
                                Amount
                              </th>

                              <th className="px-4 py-3 text-left text-[11px] text-gray-500 uppercase">
                                Status
                              </th>

                              <th className="px-4 py-3 text-left text-[11px] text-gray-500 uppercase">
                                Gateway Refund ID
                              </th>

                              <th className="px-4 py-3 text-left text-[11px] text-gray-500 uppercase">
                                Processed
                              </th>

                            </tr>

                          </thead>

                          <tbody className="divide-y divide-white/10">

                            {selectedRequest.refunds.map(
                              (refund) => (
                                <tr
                                  key={
                                    refund.id
                                  }
                                >

                                  <td className="px-4 py-3">

                                    <span className="text-xs font-mono text-blue-300 break-all">
                                      {
                                        refund.id
                                      }
                                    </span>

                                  </td>

                                  <td className="px-4 py-3">

                                    <span className="text-xs font-mono text-gray-300 break-all">
                                      {
                                        refund.user_id
                                      }
                                    </span>

                                  </td>

                                  <td className="px-4 py-3">

                                    <span className="text-sm font-semibold text-white">
                                      {formatAmount(
                                        refund.amount
                                      )}
                                    </span>

                                  </td>

                                  <td className="px-4 py-3">

                                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs bg-green-500/10 text-green-300 border border-green-500/20">
                                      {
                                        refund.status
                                      }
                                    </span>

                                  </td>

                                  <td className="px-4 py-3">

                                    <span className="text-xs font-mono text-gray-300 break-all">
                                      {
                                        refund.gateway_refund_id ||
                                        "—"
                                      }
                                    </span>

                                  </td>

                                  <td className="px-4 py-3">

                                    <span className="text-xs text-gray-400">
                                      {formatDate(
                                        refund.processed_at
                                      )}
                                    </span>

                                  </td>

                                </tr>
                              )
                            )}

                          </tbody>

                        </table>

                      </div>
                    )}

                  </div>

                  {/* ==================================================
                      RAW REQUEST RECORD
                  ================================================== */}

                  <details className="rounded-2xl border border-white/10 bg-gray-800/60 overflow-hidden mb-6">

                    <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-white hover:bg-white/5">
                      View Complete Stored Request Record
                    </summary>

                    <div className="p-5 border-t border-white/10">

                      <pre className="text-xs text-gray-300 bg-gray-950 rounded-xl p-4 overflow-auto max-h-[400px]">
                        {JSON.stringify(
                          selectedRequest
                            .request,
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
                    FOOTER
                ================================================== */}

                <div
                  className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-white/10"
                  style={{
                    height:
                      "72px",
                    zIndex:
                      50,
                  }}
                >

                  <div className="h-full flex items-center justify-end px-6">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRequest(
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
   TABLE CELL
============================================================== */

function TableCell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <td
      className="px-4 py-3 align-middle"
      style={{
        verticalAlign:
          "middle",
        maxWidth:
          "0",
        overflow:
          "hidden",
      }}
    >
      {children}
    </td>
  );
}

/* ==============================================================
   COMPACT TABLE USER
============================================================== */

function CompactUserCell({
  user,
  blue = false,
}: {
  user:
    | UserRecord
    | undefined;
  blue?: boolean;
}) {
  const initial =
    user?.name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() ||
    "U";

  return (
    <div
      className="flex items-center gap-2 min-w-0"
      style={{
        minWidth:
          "0",
        width:
          "100%",
      }}
    >

      {/* IMPORTANT:
          No profile <img> in the table.
          This guarantees the row can never expand because
          of an image's intrinsic dimensions.
      */}

      <div
        className={`flex items-center justify-center rounded-full border text-xs font-bold flex-shrink-0 ${
          blue
            ? "bg-blue-500/20 border-blue-500/30 text-blue-300"
            : "bg-purple-500/20 border-purple-500/30 text-purple-300"
        }`}
        style={{
          width:
            "34px",
          height:
            "34px",
          minWidth:
            "34px",
          maxWidth:
            "34px",
          minHeight:
            "34px",
          maxHeight:
            "34px",
        }}
      >
        {initial}
      </div>

      <div
        style={{
          minWidth:
            "0",
          width:
            "calc(100% - 42px)",
        }}
      >

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
          title={
            user?.name ||
            "Unknown User"
          }
        >
          {user?.name ||
            "Unknown User"}
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
          title={
            user?.id ||
            ""
          }
        >
          {user?.id ||
            "—"}
        </div>

      </div>

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
   USER DETAIL
============================================================== */

function UserDetail({
  user,
  fallbackId,
  blue = false,
}: {
  user:
    | UserRecord
    | null;
  fallbackId: string;
  blue?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">

      <div
        className={`w-14 h-14 rounded-full border overflow-hidden flex items-center justify-center font-bold flex-shrink-0 ${
          blue
            ? "bg-blue-500/20 border-blue-500/20 text-blue-300"
            : "bg-purple-500/20 border-purple-500/20 text-purple-300"
        }`}
      >

        {user?.profile_photo_url ? (

          <img
            src={
              user.profile_photo_url
            }
            alt={
              user.name ||
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

          user?.name
            ?.charAt(0)
            ?.toUpperCase() ||
          "U"

        )}

      </div>

      <div className="min-w-0">

        <div className="text-white font-medium">
          {user?.name ||
            "Unknown User"}
        </div>

        <div className="text-xs text-gray-500 mt-1 break-all">
          {fallbackId}
        </div>

        {user?.email && (
          <div className="text-xs text-gray-400 mt-2 break-all">
            {user.email}
          </div>
        )}

        {user?.phone && (
          <div className="text-xs text-gray-400 mt-1">
            {user.phone}
          </div>
        )}

        {user?.city && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">

            <MapPin className="w-3.5 h-3.5" />

            {user.city}

          </div>
        )}

      </div>

    </div>
  );
}

/* ==============================================================
   INFO CARD
============================================================== */

function InfoCard({
  label,
  value,
  mono = false,
  icon,
}: {
  label: string;
  value: string;
  mono?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-gray-900/50 border border-white/10 p-4">

      <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </div>

      <div
        className={`flex items-start gap-2 break-all ${
          mono
            ? "font-mono text-xs text-blue-300"
            : "text-sm text-white"
        }`}
      >

        {icon}

        <span>
          {value}
        </span>

      </div>

    </div>
  );
}

/* ==============================================================
   TEXT BOX
============================================================== */

function TextBox({
  label,
  value,
}: {
  label: string;
  value:
    | string
    | null;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-gray-900/50 p-4">

      <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </div>

      <p className="text-sm text-gray-300 whitespace-pre-wrap leading-6">
        {value || "—"}
      </p>

    </div>
  );
}

/* ==============================================================
   PAYMENT CARD
============================================================== */

function PaymentCard({
  title,
  paid,
  orderId,
  paymentId,
  refundStatus,
  refundedAt,
}: {
  title: string;
  paid: boolean;
  orderId: string | null;
  paymentId: string | null;
  refundStatus: string | null;
  refundedAt: string | null;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-gray-900/50 p-4">

      <div className="flex items-center gap-2 mb-3">

        <CreditCard className="w-4 h-4 text-blue-400" />

        <span className="text-sm font-semibold text-white">
          {title}
        </span>

      </div>

      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border ${
          paid
            ? "bg-green-500/10 text-green-300 border-green-500/30"
            : "bg-gray-500/10 text-gray-400 border-gray-500/20"
        }`}
      >

        {paid ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Paid
          </>
        ) : (
          "Not Paid"
        )}

      </div>

      <div className="mt-4 space-y-4">

        <div>

          <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">
            Razorpay Order
          </div>

          <div className="text-xs font-mono text-gray-300 break-all">
            {orderId || "—"}
          </div>

        </div>

        <div>

          <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">
            Razorpay Payment
          </div>

          <div className="text-xs font-mono text-gray-300 break-all">
            {paymentId || "—"}
          </div>

        </div>

        <div>

          <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">
            Refund Status
          </div>

          <div
            className={`inline-flex px-2.5 py-1 rounded-full text-xs border ${
              refundStatus ===
              "refunded"
                ? "bg-green-500/10 text-green-300 border-green-500/30"
                : refundStatus ===
                  "processing"
                ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                : "bg-gray-500/10 text-gray-400 border-gray-500/20"
            }`}
          >
            {
              refundStatus ||
              "not_refunded"
            }
          </div>

        </div>

        {refundedAt && (
          <div>

            <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">
              Refunded At
            </div>

            <div className="text-xs text-gray-300">
              {new Date(
                refundedAt
              ).toLocaleString()}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

/* ==============================================================
   USERS ICON
============================================================== */

function UsersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-cyan-400"
    >

      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />

      <circle
        cx="9"
        cy="7"
        r="4"
      />

      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />

      <path d="M16 3.13a4 4 0 0 1 0 7.75" />

    </svg>
  );
}