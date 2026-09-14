import React, { ReactNode, useEffect, useState } from 'react';
import { Calendar, Radio, XCircle, Eye, X, MapPin, User, Briefcase, CreditCard, Clock } from 'lucide-react';
import { supabase } from "../../../../supabase";
interface Booking {
  bookingId: ReactNode;
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  service: string;
  providerId: string;
  providerName: string;
  providerPhone: string;
  status: string;
  location: string;
  amount: string;
  date: string;
  time: string;
  duration: string;
  notes: string;
}
function statusClass(s: string) {
  if (s === 'confirmed' || s === 'completed')
    return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';

  if (s === 'pending')
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';

if (s === 'in_progress')
    return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';

  if (s === 'cancelled')
    return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';

  if (s === 'provider_not_found')
    return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400';

  return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400';
}
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 w-36">{label}</span>
      <span className="text-xs text-gray-900 dark:text-white text-right">{value || '—'}</span>
    </div>
  );
}

export function RafOverview() {
 const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
const [loading, setLoading] = useState(true);

const [overview, setOverview] = useState({
  totalBookings: 0,
  liveBookings: 0,
  cancelledBookings: 0,
});

const [selected, setSelected] = useState<Booking | null>(null);
const loadOverview = async () => {
  try {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    // Load Overview
    const overviewRes = await fetch(
      "https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_get_raf_overview",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const overviewData = await overviewRes.json();

    if (overviewData.success) {
      setOverview(overviewData.data);
      console.log("Overview Data", overviewData.data);
    }

    // Load Recent Bookings
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

    if (bookingData.success) {
      setRecentBookings(bookingData.bookings);
    console.log("Recent Bookings", bookingData.bookings);
  }

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  loadOverview();
}, []);

if (loading) {
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="text-gray-500 dark:text-gray-400">
        Loading RAF Overview...
      </div>
    </div>
  );
}

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Rent A Friend Overview</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">RAF Operations — key metrics and recent activity</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded">+12.4%</span>
          </div>
          <p className="text-2xl text-gray-900 dark:text-white mb-1">{overview.totalBookings}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
              <Radio className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
              <span className="text-xs text-green-600 dark:text-green-400">LIVE</span>
            </div>
          </div>
          <p className="text-2xl text-gray-900 dark:text-white mb-1">{overview.liveBookings}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Live Bookings</p>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded">-3.1%</span>
          </div>
          <p className="text-2xl text-gray-900 dark:text-white mb-1">{overview.cancelledBookings}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Cancelled Bookings</p>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg text-gray-900 dark:text-white">Recent Bookings</h2>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {['User ID', 'User Name', 'Service', 'Provider ID', 'Provider Name', 'Status', 'Location', 'Payment Amount', 'Date', 'Action'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-900/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
  {recentBookings.length === 0 ? (
    <tr>
      <td
        colSpan={10}
        className="text-center py-10 text-gray-500 dark:text-gray-400"
      >
        No bookings found.
      </td>
    </tr>
  ) : (
              recentBookings.map((b) => (
                <tr key={b.bookingId} className="hover:bg-blue-600 dark:hover:bg-gray-900/40 transition-colors">
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs whitespace-nowrap">{b.userId}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap">{b.userName}</td>
                  <td className="px-6 py-4 text-blue-600 dark:text-blue-400 whitespace-nowrap">{b.service}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs whitespace-nowrap">{b.providerId}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap">{b.providerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded capitalize ${statusClass(b.status)}`}>{b.status}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{b.location}</td>
                  <td className="px-6 py-4 text-green-600 dark:text-green-400 whitespace-nowrap">{b.amount}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{b.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelected(b)}
                      className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-green-500 transition-colors"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Drawer */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-[#1A1F2E] border-l border-gray-200 dark:border-gray-800 z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg text-gray-900 dark:text-white">Booking Details</h2>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-0.5">{selected.bookingId}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded capitalize ${statusClass(selected.status)}`}>{selected.status}</span>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Customer Info */}
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

              {/* Provider Info */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  <h4 className="text-sm text-gray-900 dark:text-white">Provider Information</h4>
                </div>
                <DetailRow label="Provider ID" value={selected.providerId} />
                <DetailRow label="Provider Name" value={selected.providerName} />
                <DetailRow label="Phone" value={selected.providerPhone} />
              </div>

              {/* Booking Info */}
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

              {/* Payment Info */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-green-500" />
                  <h4 className="text-sm text-gray-900 dark:text-white">Payment Details</h4>
                </div>
                <DetailRow label="Amount Paid" value={selected.amount} />
                <DetailRow label="Payment Status" value={selected.status === 'cancelled' ? 'Refunded' : selected.status === 'completed' ? 'Paid' : 'Pending'} />
              </div>

              {/* Notes */}
              {selected.notes && (
                <div className="bg-yellow-50 dark:bg-yellow-500/10 rounded-xl p-5">
                  <h4 className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">Admin Notes</h4>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">{selected.notes}</p>
                </div>
              )}

              {/* Location */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-900 dark:text-white">{selected.location}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
