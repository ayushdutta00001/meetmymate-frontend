import React, { useEffect, useState } from "react";
import { Search, Filter, Eye, Edit2, XCircle, Download, MapPin, Briefcase, Clock, CreditCard, User, X } from 'lucide-react';
import { supabase } from "../../../../supabase";

interface Booking {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  providerId: string | null;
  providerName: string;
  providerPhone: string;
  service: string;
  status: string;
  paymentStatus: string;
  location: string;
  amount: string;
  date: string;
  time: string;
  duration: string;
  notes: string;
}

const STATUS_TABS = [
  "All",
  "pending_provider_acceptance",
  "confirmed",
  "provider_en_route",
  "provider_arrived",
  "in_progress",
  "completed",
  "cancelled",
  "provider_not_found"
];

function statusClass(status: string) {

  switch (status) {

    case "pending_provider_acceptance":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";

    case "confirmed":
    case "completed":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    case "provider_en_route":
    case "provider_arrived":
    case "in_progress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

    case "cancelled":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";

    case "provider_not_found":
      return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
  }

}

function payClass(p: string) {
  if (p === 'Paid') return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
  if (p === 'Pending') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
  if (p === 'Refunded') return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400';
  return 'bg-gray-100 text-gray-600';
}
function downloadInvoice(b: Booking) {
  const lines = [
    '==============================================',
    '         MEET MY MATE — BOOKING INVOICE',
    '==============================================',
    '',
    `Invoice For : ${b.bookingId}`,
    `Generated   : ${new Date().toLocaleString()}`,
    '',
    '----------------------------------------------',
    ' CUSTOMER DETAILS',
    '----------------------------------------------',
    `User ID     : ${b.userId}`,
    `Name        : ${b.userName}`,
    `Phone       : ${b.userPhone}`,
    `Email       : ${b.userEmail}`,
    '',
    '----------------------------------------------',
    ' PROVIDER DETAILS',
    '----------------------------------------------',
    `Provider ID : ${b.providerId}`,
    `Name        : ${b.providerName}`,
    `Phone       : ${b.providerPhone}`,
    '',
    '----------------------------------------------',
    ' BOOKING DETAILS',
    '----------------------------------------------',
    `Service     : ${b.service}`,
    `Date        : ${b.date}`,
    `Time        : ${b.time}`,
    `Duration    : ${b.duration}`,
    `Location    : ${b.location}`,
    `Status      : ${b.status}`,
    '',
    '----------------------------------------------',
    ' PAYMENT DETAILS',
    '----------------------------------------------',
    `Amount      : ${b.amount}`,
    `Payment     :${b.paymentStatus}`,
    '',
    '==============================================',
    '     Thank you for using Meet My Mate in!',
    '==============================================',
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Invoice-${b.bookingId}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800 last:border-b-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </span>

      <span className="text-sm text-gray-900 dark:text-white font-medium text-right break-all">
        {value || "-"}
      </span>
    </div>
  );
}
export function RafBookings() {
 const [activeTab, setActiveTab] = useState("All");
const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
const [bookings, setBookings] = useState<Booking[]>([]);
const [loading, setLoading] = useState(true);

 const filtered = bookings.filter((b) =>
  (activeTab === "All" || b.status === activeTab) &&
  (
    !search ||
    b.userName.toLowerCase().includes(search.toLowerCase()) ||
    b.bookingId.toLowerCase().includes(search.toLowerCase()) ||
    b.service.toLowerCase().includes(search.toLowerCase())
  )
);
const loadBookings = async () => {
  try {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const bookingRes = await fetch(
      "https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_get_recent_raf_bookings",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const bookingData = await bookingRes.json();

    console.log("RAF BOOKINGS:", bookingData);

    if (bookingData.success) {
      setBookings(bookingData.bookings);
    }
  } catch (err) {
    console.error("Failed to load bookings:", err);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  loadBookings();
}, []);

if (loading) {
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="text-gray-500 dark:text-gray-400">
        Loading Bookings...
      </div>
    </div>
  );
}
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Bookings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Complete booking management for Rent A Friend</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-[#1A1F2E] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-[#1A1F2E] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, booking ID, or service…"
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1A1F2E] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {['Booking ID', 'User ID', 'User Name', 'Provider ID', 'Provider Name', 'Service', 'Status', 'Payment Amount', 'Location', 'Date & Time', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-900/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((b) => (
                <tr key={b.bookingId} className="hover:bg-blue-600 dark:hover:bg-gray-900/40 transition-colors">
                  <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 font-mono text-xs whitespace-nowrap">{b.bookingId}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 font-mono text-xs whitespace-nowrap">{b.userId}</td>
                  <td className="px-5 py-3.5 text-gray-900 dark:text-white whitespace-nowrap">{b.userName}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 font-mono text-xs whitespace-nowrap">{b.providerId}</td>
                  <td className="px-5 py-3.5 text-gray-900 dark:text-white whitespace-nowrap">{b.providerName}</td>
                  <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 whitespace-nowrap">{b.service}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded ${statusClass(b.status)}`}>{b.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-green-600 dark:text-green-400 whitespace-nowrap">{b.amount}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{b.location}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{b.date} {b.time}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                       <button
                        onClick={() => setSelected(b)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-400 transition-colors"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button
                        onClick={() => downloadInvoice(b)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Download className="w-3 h-3" /> Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">No bookings found.</div>
        )}
      </div>

      {/* Booking Detail Drawer */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-[#1A1F2E] border-l border-gray-200 dark:border-gray-800 z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg text-gray-900 dark:text-white">Booking Details</h2>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-0.5">{selected.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded ${statusClass(selected.status)}`}>{selected.status}</span>
                <button
                  onClick={() => downloadInvoice(selected)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download Invoice
                </button>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Customer */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-blue-500" />
                  <h4 className="text-sm text-gray-900 dark:text-white">Customer Information</h4>
                </div>
                <DetailRow label="User ID" value={selected.userId} />
                <DetailRow label="Full Name" value={selected.userName} />
                <DetailRow label="Phone" value={selected.userPhone} />
                <DetailRow label="Email" value={selected.userEmail} />
              </div>

              {/* Provider */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  <h4 className="text-sm text-gray-900 dark:text-white">Provider Information</h4>
                </div>
                <DetailRow label="Provider ID" value={selected.providerId} />
                <DetailRow label="Provider Name" value={selected.providerName} />
                <DetailRow label="Phone" value={selected.providerPhone} />
              </div>

              {/* Booking */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-green-500" />
                  <h4 className="text-sm text-gray-900 dark:text-white">Booking Information</h4>
                </div>
                <DetailRow label="Service" value={selected.service} />
                <DetailRow label="Date" value={selected.date} />
                <DetailRow label="Time" value={selected.time} />
                <DetailRow label="Duration" value={selected.duration} />
                <DetailRow label="Location" value={selected.location} />
              </div>

              {/* Payment */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-green-500" />
                  <h4 className="text-sm text-gray-900 dark:text-white">Payment Details</h4>
                </div>
                <DetailRow label="Amount" value={selected.amount} />
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
  <span className="text-sm text-gray-500 dark:text-gray-400">
    Payment Status
  </span>

  <span
    className={`text-xs px-2 py-1 rounded ${payClass(
      selected.paymentStatus
    )}`}
  >
    {selected.paymentStatus}
  </span>
</div>
              </div>

              {/* Location */}
              <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-700 dark:text-blue-400">{selected.location}</span>
                </div>
              </div>

              {/* Download CTA */}
              <button
                onClick={() => downloadInvoice(selected)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" /> Download Invoice
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}