import React, { useEffect, useState } from 'react';
import { Activity, Users, Clock, MapPin, Eye, X, User, Briefcase, CreditCard } from 'lucide-react';
import { supabase } from "../../../../supabase";


interface LiveBooking {
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
  amount: string;
  location: string;
  startTime: string;
  duration: string;
  paymentStatus: string;
  eta: string;
}

function statusClass(status: string) {
  switch (status) {
    case "pending_provider_acceptance":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";

    case "confirmed":
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400";

    case "provider_en_route":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400";

    case "provider_arrived":
    case "in_progress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
  }
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 w-36">{label}</span>
      <span className="text-xs text-gray-900 dark:text-white text-right">{value || '—'}</span>
    </div>
  );
}

export function RafLiveBookings() {
 const [selected, setSelected] = useState<LiveBooking | null>(null);

const [liveBookings, setLiveBookings] = useState<LiveBooking[]>([]);

const [stats, setStats] = useState({
  activeBookings: 0,
  providersBusy: 0,
  customersWaiting: 0,
});

const [loading, setLoading] = useState(true);

const loadLiveBookings = async () => {
  try {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const response = await fetch(
      "https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_get_live_raf_bookings",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    console.log("LIVE BOOKINGS:", result);

    if (result.success) {
      setStats(result.stats);
      setLiveBookings(result.bookings);
    }

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadLiveBookings();
}, []);
if (loading) {
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="text-gray-500 dark:text-gray-400">
        Loading Live Bookings...
      </div>
    </div>
  );
}
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Live Bookings</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Real-time monitoring of active bookings</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-500/10 px-3 py-2 rounded-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-green-600 dark:text-green-400">Live Feed</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          <p className="text-2xl text-gray-900 dark:text-white mb-1">{stats.activeBookings}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Bookings</p>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-2xl text-gray-900 dark:text-white mb-1">{stats.providersBusy}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Providers Busy</p>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-2xl text-gray-900 dark:text-white mb-1">{stats.customersWaiting}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Customers Waiting</p>
        </div>
      </div>

      {/* Live Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-base text-gray-900 dark:text-white">Active Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {['', 'Booking ID', 'User Name', 'Provider Name', 'Status', 'Service', 'Start Time', 'Duration', 'Location', 'Payment Amount', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-900/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {liveBookings.map((b, i) => (
                <tr key={b.bookingId}className="hover:bg-blue-600 dark:hover:bg-gray-900/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                  </td>
                  <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 font-mono text-xs whitespace-nowrap">{b.bookingId}</td>
                  <td className="px-5 py-3.5 text-gray-900 dark:text-white whitespace-nowrap">{b.userName}</td>
                  <td className="px-5 py-3.5 text-gray-900 dark:text-white whitespace-nowrap">{b.providerName}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded ${statusClass(b.status)}`}>{b.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 whitespace-nowrap">{b.service}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{b.startTime}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{b.duration}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{b.location}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-green-600 dark:text-green-400 whitespace-nowrap">{b.amount}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setSelected(b)}
                      className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-400 transition-colors whitespace-nowrap"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Booking Detail Drawer */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelected(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-[#1A1F2E] border-l border-gray-200 dark:border-gray-800 z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <h2 className="text-lg text-gray-900 dark:text-white">Live Booking Details</h2>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-0.5">{selected.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded ${statusClass(selected.status)}`}>{selected.status}</span>
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

              {/* Live Status */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-green-500" />
                  <h4 className="text-sm text-gray-900 dark:text-white">Live Status</h4>
                </div>
                <DetailRow label="Service" value={selected.service} />
                <DetailRow label="Start Time" value={selected.startTime} />
                <DetailRow label="Duration" value={selected.duration} />
                <DetailRow label="Provider ETA" value={selected.eta} />
                <DetailRow label="Location" value={selected.location} />
              </div>

              {/* Payment */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-green-500" />
                  <h4 className="text-sm text-gray-900 dark:text-white">Payment Details</h4>
                </div>
                <DetailRow label="Amount" value={selected.amount} />
                <DetailRow label="Payment Status" value={selected.paymentStatus} />
              </div>

              {/* Location card */}
              <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-700 dark:text-blue-400">{selected.location}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
