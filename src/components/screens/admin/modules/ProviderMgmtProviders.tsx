import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, Edit2, ShieldOff, ShieldCheck, FileText, X, Star, Phone, Mail, MapPin, Calendar, DollarSign, BookOpen, CheckCircle, XCircle, Download } from 'lucide-react';
import { supabase } from '../../../../supabase';



const STATUS_FILTERS = ['All Providers', 'Pending Approval', 'Approved', 'Available', 'Online', 'Busy', 'Offline', 'Suspended'];
const AVATAR_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#EC4899'];

function statusClass(s: string) {
  if (s === 'Online' || s === 'Available') return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
  if (s === 'Busy') return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400';
  if (s === 'Offline') return 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-400';
  if (s === 'Approved') return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
  if (s === 'Pending Approval') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
  if (s === 'Suspended') return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
  return 'bg-gray-100 text-gray-600';
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0" style={{ background: color }}>
      {initials}
    </div>
  );
}

export function ProviderMgmtProviders() {
  const [filter, setFilter] = useState('All Providers');
  const [search, setSearch] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<typeof providers[0] | null>(null);
const [providers, setProviders] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

const loadProviders = async () => {
  try {
    setLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin_get_all_providers`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            (await supabase.auth.getSession()).data.session?.access_token
          }`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    console.log("ALL PROVIDERS", data);

    if (data.success) {
      setProviders(data.providers);
    }

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadProviders();
}, []);
  const filtered = providers.filter(p => {
   const matchSearch =
  !search ||
  p.full_name.toLowerCase().includes(search.toLowerCase()) ||
  p.id.includes(search) ||
  (p.city || "").toLowerCase().includes(search.toLowerCase());
   // Determine if provider matches the selected status/account filter
   const matchFilter = filter === 'All Providers' ||
    (filter === "Approved" &&
      p.provider_status?.toLowerCase() === "approved") ||
    (filter === "Pending Approval" &&
      p.provider_status?.toLowerCase() === "pending") ||
    (['Available','Online','Busy','Offline','Suspended'].includes(filter) && p.status === filter);

    return matchFilter && matchSearch;
  });
if (loading) {
  return (
    <div className="p-10 text-center">
      Loading Providers...
    </div>
  );
}
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Providers</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Manage all registered service providers</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white dark:bg-[#1A1F2E] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-[#1A1F2E] border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID, or city…" className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none" />
        </div>
        <select className="px-4 py-2.5 bg-white dark:bg-[#1A1F2E] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 outline-none">
          <option>Latest Joined</option>
          <option>Highest Rating</option>
          <option>Most Bookings</option>
          <option>Highest Earnings</option>
        </select>
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
                {['Provider ID', 'Provider', 'Email', 'Phone', 'City', 'Services', 'Rating', 'Bookings', 'Status', 'Account', 'Joined', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-900/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((p, i) => (
                <tr key={p.id} className="hover:bg-blue-600 dark:hover:bg-gray-900/40 transition-colors">
                  <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 font-mono text-xs whitespace-nowrap">{p.id}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                     {p.profile_photo_url ? (
  <img
    src={p.profile_photo_url}
    alt={p.full_name}
    className="w-8 h-8 rounded-full object-cover"
  />
) : (
  
  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
    {p.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)}
  </div>
)
}
                      <span className="text-gray-900 dark:text-white">{p.full_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{p.user_email}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{p.phone}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{p.city || "-"}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {p.services.slice(0, 2).map(s => (
                        <span key={s} className="text-xs px-1.5 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-gray-900 dark:text-white text-xs">{p.avg_rating}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-900 dark:text-white whitespace-nowrap">{p.totalBookings}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap"><span className={`text-xs px-2 py-1 rounded ${statusClass(p.status)}`}>{p.status}</span></td>
                  <td className="px-5 py-3.5 whitespace-nowrap"><span className={`text-xs px-2 py-1 rounded ${statusClass(p.provider_status)}`}>{p.provider_status}</span></td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setSelectedProvider(p)} className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors" title="View Profile"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded transition-colors" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors" title="Suspend"><ShieldOff className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 rounded transition-colors" title="Activate"><ShieldCheck className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors" title="Documents"><FileText className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Drawer */}
      {selectedProvider && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelectedProvider(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white dark:bg-[#1A1F2E] border-l border-gray-200 dark:border-gray-800 z-50 overflow-y-auto">
            {/* Drawer header */}
            <div className="sticky top-0 bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg text-gray-900 dark:text-white">Provider Profile</h2>
              <button onClick={() => setSelectedProvider(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Avatar + basic */}
              <div className="flex items-center gap-4">
                {selectedProvider.profile_photo_url ? (
                  <img
                    src={selectedProvider.profile_photo_url}
                    alt={selectedProvider.full_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl" style={{ background: '#4F46E5' }}>
                    {selectedProvider.full_name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg text-gray-900 dark:text-white">{selectedProvider.full_name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedProvider.id}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-gray-900 dark:text-white">{selectedProvider.avg_rating}</span>
                  </div>
                </div>
                <span className={`ml-auto text-xs px-3 py-1.5 rounded-full ${statusClass(selectedProvider.provider_status)}`}>{selectedProvider.provider_status}</span>
              </div>

              {/* Personal Info */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 space-y-3">
                <h4 className="text-sm text-gray-900 dark:text-white mb-3">Personal Information</h4>
                {[
                  { icon: Mail, label: 'Email', value: selectedProvider.user_email },
                  { icon: Phone, label: 'Phone', value: selectedProvider.phone },
                  { icon: MapPin, label: 'City', value: selectedProvider.city || "-" },
                  { icon: Calendar, label: 'Joined', value: new Date(selectedProvider.created_at).toLocaleDateString() },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-16">{label}</span>
                    <span className="text-xs text-gray-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>

              {/* Services */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <h4 className="text-sm text-gray-900 dark:text-white mb-3">Services Offered</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.services.map(s => (
                    <span key={s} className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">{s}</span>
                  ))}
                </div>
              </div>

              {/* Booking Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
  {
    label: "Total Bookings",
    value: selectedProvider.totalBookings,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Completed",
    value: selectedProvider.completedBookings,
    color: "text-green-600 dark:text-green-400",
  },
  {
    label: "Cancelled",
    value:
      selectedProvider.totalBookings -
      selectedProvider.completedBookings -
      selectedProvider.activeBookings,
    color: "text-red-500",
  },
  {
    label: "Completion Rate",
    value:
      selectedProvider.totalBookings > 0
        ? `${Math.round(
            (selectedProvider.completedBookings /
              selectedProvider.totalBookings) *
              100
          )}%`
        : "0%",
    color: "text-purple-600 dark:text-purple-400",
  },
].map(item => (
                  <div key={item.label} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <p className={`text-xl ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Earnings */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <h4 className="text-sm text-gray-900 dark:text-white mb-3">Earnings Summary</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
  {
    label: "Total Earnings",
    value: "₹0",
  },
  {
    label: "This Month",
    value: "₹0",
  },
  {
    label: "Today",
    value: "₹0",
  },
  {
    label: "Pending",
    value: "₹0",
  },
].map(item => (
                    <div key={item.label}>
                      <p className="text-sm text-gray-900 dark:text-white">{item.value}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-sm text-gray-900 dark:text-white mb-3">Documents</h4>
                <div className="grid grid-cols-2 gap-3">
                  {['Government ID', 'Selfie Verification', 'Address Proof', 'PAN Card'].map(doc => (
                    <div key={doc} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-900 dark:text-white">{doc}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">Verified</span>
                        </div>
                      </div>
                      <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
                        <Download className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Actions */}
              <div className="pt-2 grid grid-cols-2 gap-3">
                <button className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">Approve Provider</button>
                <button className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors">Suspend Provider</button>
                <button className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors">Reset Password</button>
                <button className="px-4 py-2.5 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm rounded-lg transition-colors">Send Notification</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
