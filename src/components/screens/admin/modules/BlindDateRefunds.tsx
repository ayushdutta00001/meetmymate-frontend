import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../supabase";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  DollarSign,
  Download,
  Eye,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  Search,
  User,
  X,
  XCircle,
} from "lucide-react";

interface RefundRecord {
  id: string;
  booking_id: string;
  user_id: string;

  amount: number;
  refund_amount: number;
  reason: string;
  status: string;

  payment_id?: string | null;
  razorpay_order_id?: string | null;
  razorpay_refund_id?: string | null;

  payment_paid_at?: string | null;
  matching_deadline_at?: string | null;
  refund_initiated_at?: string | null;
  refunded_at?: string | null;
  created_at: string;

  user_name?: string;
  user_email?: string;
  user_phone?: string;
  user_city?: string;
  user_avatar?: string | null;
}

interface RefundSummary {
  total_refunds: number;
  total_refunded_amount: number;
  pending_refunds: number;
  failed_refunds: number;
}

type FilterType = "all" | "refunded" | "pending" | "failed";

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (value?: number | null) => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case "refunded":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    case "pending":
    case "processing":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";

    case "failed":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "refunded":
      return "Refunded";

    case "processing":
      return "Processing";

    case "pending":
      return "Pending";

    case "failed":
      return "Failed";

    default:
      return status || "Unknown";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "refunded":
      return CheckCircle2;

    case "failed":
      return XCircle;

    case "processing":
    case "pending":
      return Clock;

    default:
      return AlertCircle;
  }
};

const shortId = (value?: string | null, length = 12) => {
  if (!value) return "—";

  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length)}...`;
};

const escapeCsvValue = (value: unknown) => {
  const stringValue = String(value ?? "");

  return `"${stringValue.replace(/"/g, '""')}"`;
};

export function BlindDateRefunds() {
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);
  const [summary, setSummary] = useState<RefundSummary>({
    total_refunds: 0,
    total_refunded_amount: 0,
    pending_refunds: 0,
    failed_refunds: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterType>("all");

  const [selectedRefund, setSelectedRefund] =
    useState<RefundRecord | null>(null);

  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const loadRefunds = async (showRefreshState = false) => {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const { data, error } = await supabase.functions.invoke(
        "admin_list_blind_date_refunds"
      );

      if (error) {
        throw error;
      }

      if (!data?.success) {
        throw new Error(
          data?.error || "Unable to load blind date refunds."
        );
      }

      const nextRefunds = Array.isArray(data.data)
        ? data.data
        : [];

      setRefunds(nextRefunds);

      setSummary({
        total_refunds: Number(
          data.summary?.total_refunds ?? nextRefunds.length
        ),
        total_refunded_amount: Number(
          data.summary?.total_refunded_amount ?? 0
        ),
        pending_refunds: Number(
          data.summary?.pending_refunds ?? 0
        ),
        failed_refunds: Number(
          data.summary?.failed_refunds ?? 0
        ),
      });
    } catch (error) {
      console.error("BLIND DATE REFUNDS LOAD ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to load refund details."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRefunds();
  }, []);

  const filteredRefunds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return refunds.filter((refund) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "pending"
          ? refund.status === "pending" ||
            refund.status === "processing"
          : refund.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableValues = [
        refund.id,
        refund.booking_id,
        refund.user_id,
        refund.user_name,
        refund.user_email,
        refund.user_phone,
        refund.user_city,
        refund.payment_id,
        refund.razorpay_order_id,
        refund.razorpay_refund_id,
        refund.reason,
        refund.status,
      ];

      return searchableValues.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [refunds, searchQuery, statusFilter]);

  const copyValue = async (value?: string | null) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);

      setCopiedValue(value);

      window.setTimeout(() => {
        setCopiedValue(null);
      }, 1500);
    } catch (error) {
      console.error("COPY ERROR:", error);
    }
  };

  const exportCsv = () => {
    if (!filteredRefunds.length) {
      alert("There are no refund records to export.");
      return;
    }

    const headers = [
      "Refund ID",
      "Booking ID",
      "User ID",
      "User Name",
      "Email",
      "Phone",
      "City",
      "Original Amount",
      "Refund Amount",
      "Reason",
      "Status",
      "Payment ID",
      "Razorpay Order ID",
      "Razorpay Refund ID",
      "Payment Paid At",
      "Matching Deadline",
      "Refund Initiated At",
      "Refunded At",
      "Created At",
    ];

    const rows = filteredRefunds.map((refund) => [
      refund.id,
      refund.booking_id,
      refund.user_id,
      refund.user_name || "",
      refund.user_email || "",
      refund.user_phone || "",
      refund.user_city || "",
      Number(refund.amount || 0).toFixed(2),
      Number(refund.refund_amount || 0).toFixed(2),
      refund.reason || "",
      refund.status || "",
      refund.payment_id || "",
      refund.razorpay_order_id || "",
      refund.razorpay_refund_id || "",
      refund.payment_paid_at
        ? formatDateTime(refund.payment_paid_at)
        : "",
      refund.matching_deadline_at
        ? formatDateTime(refund.matching_deadline_at)
        : "",
      refund.refund_initiated_at
        ? formatDateTime(refund.refund_initiated_at)
        : "",
      refund.refunded_at
        ? formatDateTime(refund.refunded_at)
        : "",
      formatDateTime(refund.created_at),
    ]);

    const csv = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) =>
        row.map(escapeCsvValue).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `blind-date-refunds-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-[#0A0F1F]">
      <div className="p-6 lg:p-8 space-y-6">

        {/* =========================================================
            HEADER
        ========================================================== */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Blind Date Refunds
                </h1>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Permanent refund ledger and user payment history
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadRefunds(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={exportCsv}
              disabled={!filteredRefunds.length}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* =========================================================
            SUMMARY CARDS
        ========================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          <div className="rounded-2xl border border-white dark:border-gray-100 bg-blue-700 dark:bg-[#111827] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Total Refunds
                </p>

                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                  {summary.total_refunds}
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white dark:border-gray-100 bg-green-700 dark:bg-[#111827] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Total Refunded
                </p>

                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                  {formatCurrency(
                    summary.total_refunded_amount
                  )}
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white dark:border-gray-100 bg-yellow-700 dark:bg-[#111827] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Pending
                </p>

                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                  {summary.pending_refunds}
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-b-white dark:border-red-500 bg-red-700 dark:bg-[#111827] p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Failed
                </p>

                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                  {summary.failed_refunds}
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            FILTERS
        ========================================================== */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-blue-900 dark:bg-[#0b56f983] p-4">
          <div className="flex flex-col lg:flex-row gap-3">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search user, booking ID, payment ID, refund ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0A0F1F] text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {(
                [
                  ["all", "All"],
                  ["refunded", "Refunded"],
                  ["pending", "Pending"],
                  ["failed", "Failed"],
                ] as [FilterType, string][]
              ).map(([value, label]) => {
                const active = statusFilter === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setStatusFilter(value)
                    }
                    className={`px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================
            TABLE
        ========================================================== */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-blue-900 dark:bg-[#0b56f983] overflow-hidden">

          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Refund Ledger
              </h2>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {filteredRefunds.length} record
                {filteredRefunds.length === 1 ? "" : "s"}
              </p>
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500" />

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Loading refund records...
              </p>
            </div>
          ) : filteredRefunds.length === 0 ? (
            <div className="py-16 text-center px-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-400" />
              </div>

              <h3 className="text-base font-medium text-gray-900 dark:text-white mt-4">
                No refund records found
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Refunds will automatically appear here after the
                refund ledger is populated.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0D1425]">
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                      User
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Booking
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Amount
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Refund Date
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Refund ID
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Reason
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </th>

                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredRefunds.map((refund) => {
                    const StatusIcon = getStatusIcon(
                      refund.status
                    );

                    return (
                      <tr
                        key={refund.id}
                        className="hover:bg-fuchsia-700 dark:hover:bg-[#a20ee6] transition-colors"
                      >
                        {/* USER */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">

                            {refund.user_avatar ? (
                              <img
                                src={refund.user_avatar}
                                alt=""
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                                {refund.user_name || "Unknown User"}
                              </p>

                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                {refund.user_email || "No email"}
                              </p>

                              <p className="text-xs text-gray-400 dark:text-gray-500">
                                {refund.user_city || "No city"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* BOOKING */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              copyValue(refund.booking_id)
                            }
                            className="group flex items-center gap-1 text-left"
                            title="Copy booking ID"
                          >
                            <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                              {shortId(
                                refund.booking_id,
                                16
                              )}
                            </span>

                            <Copy className="w-3 h-3 text-gray-400 group-hover:text-blue-500" />
                          </button>

                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatDate(refund.created_at)}
                          </p>
                        </td>

                        {/* AMOUNT */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(
                              refund.refund_amount
                            )}
                          </p>

                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Paid:{" "}
                            {formatCurrency(refund.amount)}
                          </p>
                        </td>

                        {/* DATE */}
                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            {formatDateTime(
                              refund.refunded_at ||
                                refund.refund_initiated_at
                            )}
                          </p>
                        </td>

                        {/* REFUND ID */}
                        <td className="px-5 py-4">
                          {refund.razorpay_refund_id ? (
                            <button
                              type="button"
                              onClick={() =>
                                copyValue(
                                  refund.razorpay_refund_id
                                )
                              }
                              className="flex items-center gap-1 text-left"
                              title="Copy Razorpay refund ID"
                            >
                              <span className="font-mono text-xs text-gray-700 dark:text-gray-300">
                                {shortId(
                                  refund.razorpay_refund_id,
                                  18
                                )}
                              </span>

                              <Copy className="w-3 h-3 text-gray-400 hover:text-blue-500" />
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">
                              —
                            </span>
                          )}
                        </td>

                        {/* REASON */}
                        <td className="px-5 py-4">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {refund.reason ===
                            "blind_date_no_match_24_hours"
                              ? "No match within 24 hours"
                              : refund.reason || "—"}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                              refund.status
                            )}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />

                            {getStatusLabel(
                              refund.status
                            )}
                          </span>
                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedRefund(refund)
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors text-xs font-medium"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ===========================================================
          DETAIL DRAWER
      ============================================================ */}
      {selectedRefund && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedRefund(null)}
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-[#0A0F1F] shadow-2xl overflow-y-auto">

            {/* DRAWER HEADER */}
            <div className="sticky top-0 z-20 px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-[#0A0F1F]/95 backdrop-blur-xl">

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Refund Details
                    </h2>

                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                        selectedRefund.status
                      )}`}
                    >
                      {getStatusLabel(
                        selectedRefund.status
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                    {selectedRefund.id}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRefund(null)}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">

              {/* REFUND SUMMARY */}
              <div className="rounded-2xl border border-green-200 dark:border-green-900/30 bg-green-50/70 dark:bg-green-950/10 p-5">
                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-xs uppercase tracking-wide text-green-700 dark:text-green-400">
                      Refund Amount
                    </p>

                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {formatCurrency(
                        selectedRefund.refund_amount
                      )}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {selectedRefund.refunded_at
                        ? `Refunded on ${formatDateTime(
                            selectedRefund.refunded_at
                          )}`
                        : "Refund date not available"}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              {/* USER DETAILS */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-blue-500" />

                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    User Details
                  </h3>
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">

                  <div className="p-4 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
                    {selectedRefund.user_avatar ? (
                      <img
                        src={selectedRefund.user_avatar}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}

                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedRefund.user_name ||
                          "Unknown User"}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        User ID:{" "}
                        <span className="font-mono">
                          {shortId(
                            selectedRefund.user_id,
                            18
                          )}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2">

                    <div className="p-4 border-b md:border-r border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Email
                        </span>
                      </div>

                      <p className="text-sm text-gray-900 dark:text-white mt-1 break-all">
                        {selectedRefund.user_email ||
                          "Not available"}
                      </p>
                    </div>

                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Phone
                        </span>
                      </div>

                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {selectedRefund.user_phone ||
                          "Not available"}
                      </p>
                    </div>

                    <div className="p-4 md:border-r border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          City
                        </span>
                      </div>

                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {selectedRefund.user_city ||
                          "Not available"}
                      </p>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Refund Created
                        </span>
                      </div>

                      <p className="text-sm text-gray-900 dark:text-white mt-1">
                        {formatDateTime(
                          selectedRefund.created_at
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* BOOKING INFORMATION */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-purple-500" />

                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Booking Information
                  </h3>
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">

                  <div className="p-4 flex items-center justify-between gap-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Booking ID
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        copyValue(
                          selectedRefund.booking_id
                        )
                      }
                      className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400"
                    >
                      <span className="break-all text-right">
                        {selectedRefund.booking_id}
                      </span>

                      <Copy className="w-3.5 h-3.5 flex-shrink-0" />
                    </button>
                  </div>

                  <div className="p-4 flex items-center justify-between gap-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Original Amount
                    </span>

                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(
                        selectedRefund.amount
                      )}
                    </span>
                  </div>

                  <div className="p-4 flex items-center justify-between gap-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Refund Amount
                    </span>

                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(
                        selectedRefund.refund_amount
                      )}
                    </span>
                  </div>

                  <div className="p-4 flex items-center justify-between gap-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Reason
                    </span>

                    <span className="text-sm text-gray-900 dark:text-white text-right max-w-[60%]">
                      {selectedRefund.reason ===
                      "blind_date_no_match_24_hours"
                        ? "No match within 24 hours"
                        : selectedRefund.reason || "—"}
                    </span>
                  </div>
                </div>
              </section>

              {/* PAYMENT INFORMATION */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-green-500" />

                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Payment Information
                  </h3>
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">

                  <div className="p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Payment ID
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        copyValue(
                          selectedRefund.payment_id
                        )
                      }
                      className="mt-1 flex items-center gap-2 text-xs font-mono text-gray-900 dark:text-gray-200 break-all"
                    >
                      {selectedRefund.payment_id ||
                        "Not available"}

                      {selectedRefund.payment_id && (
                        <Copy className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Razorpay Order ID
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        copyValue(
                          selectedRefund.razorpay_order_id
                        )
                      }
                      className="mt-1 flex items-center gap-2 text-xs font-mono text-gray-900 dark:text-gray-200 break-all"
                    >
                      {selectedRefund.razorpay_order_id ||
                        "Not available"}

                      {selectedRefund.razorpay_order_id && (
                        <Copy className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Razorpay Refund ID
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        copyValue(
                          selectedRefund.razorpay_refund_id
                        )
                      }
                      className="mt-1 flex items-center gap-2 text-xs font-mono text-green-600 dark:text-green-400 break-all"
                    >
                      {selectedRefund.razorpay_refund_id ||
                        "Not available"}

                      {selectedRefund.razorpay_refund_id && (
                        <Copy className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </section>

              {/* TIMELINE */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-orange-500" />

                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Refund Timeline
                  </h3>
                </div>

                <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-5">

                  <div className="space-y-5">

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Payment Received
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDateTime(
                            selectedRefund.payment_paid_at
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Matching Deadline
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDateTime(
                            selectedRefund.matching_deadline_at
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                        <RefreshCw className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Refund Initiated
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDateTime(
                            selectedRefund.refund_initiated_at
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Refund Completed
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDateTime(
                            selectedRefund.refunded_at
                          )}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* COPIED MESSAGE */}
              {copiedValue && (
                <div className="fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-lg bg-gray-900 text-white text-sm shadow-xl">
                  ID copied
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}