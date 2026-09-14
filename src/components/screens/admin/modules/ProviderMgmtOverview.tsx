import React, { useEffect, useState } from 'react';
import { UserCheck, Wifi, Briefcase, WifiOff, MapPin, Eye, Navigation, Star, Phone, Mail, X, Calendar, Clock } from 'lucide-react';
import { supabase } from '../../../../supabase';



function statusClass(s: string) {
  if (s === 'Online') return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
  if (s === 'Busy') return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400';
  if (s === 'Available') return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
  return 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400';
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0`} style={{ background: color }}>
      {initials}
    </div>
  );
}
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 w-36">{label}</span>
      <span className="text-xs text-gray-900 dark:text-white text-right">{value || '—'}</span>
    </div>
  );
}
const AVATAR_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export function ProviderMgmtOverview() {

  const [overview, setOverview] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [selectedProvider, setSelectedProvider] = useState<any>(null);
const [providerDetails, setProviderDetails] = useState<any>(null);
const selected = providerDetails;
const [loadingProfile, setLoadingProfile] = useState(false);
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: any;
}) => (

  <div>

    <div className="text-xs text-gray-500">
      {label}
    </div>

    <div className="font-medium">
      {value || "-"}
    </div>

  </div>

);

const StatCard = ({
  title,
  value,
}: {
  title: string;
  value: any;
}) => (

<div className="
rounded-2xl
bg-white
dark:bg-[#1A1F2E]
border
border-gray-200
dark:border-gray-800
p-5">

    <div className="text-xs uppercase tracking-wider text-gray-500">

        {title}

    </div>

    <div className="
mt-3
text-3xl
font-bold
bg-gradient-to-r
from-purple-500
to-pink-500
bg-clip-text
text-transparent">

        {value ?? 0}

    </div>

</div>

);
const loadProviderProfile = async (providerId: string) => {
  try {
    setLoadingProfile(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const res = await fetch(
      "https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_get_provider_profile",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId,
        }),
      }
    );

    const data = await res.json();
    console.log("PROVIDER PROFILE", data);

    if (data.success) {
      setProviderDetails(data);
      setSelectedProvider(providerId);
    }

  } catch (err) {
    console.error(err);
  } finally {
    setLoadingProfile(false);
  }
};
const loadOverview = async () => {
  try {

    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch(
      "https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_get_provider_overview",
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );

    const result = await response.json();

    console.log(
      "PROVIDER OVERVIEW",
      result
    );

    if (result.success) {
      setOverview(result);
    }

  } finally {

    setLoading(false);

  }
};
useEffect(() => {
  loadOverview();
}, []);


  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Provider Management Overview</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Live provider availability and status monitoring</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded">+6.2%</span>
          </div>
       <p className="text-2xl text-gray-900 dark:text-white mb-1">
 {overview?.stats.availableProviders ?? 0}
</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Available Providers</p>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
              <Wifi className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
              <span className="text-xs text-green-600 dark:text-green-400">Live</span>
            </div>
          </div>
          <p className="text-2xl text-gray-900 dark:text-white mb-1">{overview?.stats.onlineProviders ?? 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Online Providers</p>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded">Active</span>
          </div>
          <p className="text-2xl text-gray-900 dark:text-white mb-1">{overview?.stats.busyProviders ?? 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Busy Providers</p>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700/40 flex items-center justify-center">
              <WifiOff className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/40 px-2 py-1 rounded">-2.1%</span>
          </div>
          <p className="text-2xl text-gray-900 dark:text-white mb-1">{overview?.stats.offlineProviders ?? 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Offline Providers</p>
        </div>
      </div>

      {/* Live Provider Status Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-base text-gray-900 dark:text-white">Live Provider Status</h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">— Online & Busy providers</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {['Provider ID', 'Provider Name', 'Status', 'Current Service', 'Live Location', 'City', 'Online Since', 'Active Booking', 'Rating', 'Last Updated', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-900/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {(overview?.providers ?? []).map((p: any, i: number) => (
                <tr key={p.id.substring(0,8)} className="hover:bg-blue-600 dark:hover:bg-gray-900/40 transition-colors">
                  <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 font-mono text-xs whitespace-nowrap">{p.id}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={p.full_name
  .split(" ")
  .map((n: string) => n[0])
  .join("")} color={AVATAR_COLORS[i % AVATAR_COLORS.length]} />
                      <span className="text-gray-900 dark:text-white">{p.full_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded ${statusClass(
  p.current_booking_id
    ? "Busy"
    : p.is_online
    ? "Online"
    : "Offline"
)}`}>{p.current_booking_id
  ? "Busy"
  : p.is_online
  ? "Online"
  : "Offline"}</span>
                  </td>
                  <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 whitespace-nowrap">{p.services?.[0] ?? "-"}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{p.city ?? "-"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{p.city ?? "-"}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{p.went_online_at
  ? new Date(
      p.went_online_at
    ).toLocaleString()
  : "-"}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {p.booking
                      ? <span className="text-xs px-2 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded font-mono">{p.current_booking_id
  ? p.current_booking_id.substring(0,8)
  : null}</span>
                      : <span className="text-xs text-gray-400">—</span>
                    }
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {'★★★★★'.split('').map((s, j) => (
                        <span key={j} className={j < Math.floor(p.avg_rating) ? 'text-yellow-400 text-xs' : 'text-gray-300 dark:text-gray-700 text-xs'}>{s}</span>
                      ))}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{p.avg_rating ?? "-"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">{p.last_seen
  ? new Date(
      p.last_seen
    ).toLocaleString()
  : "-"}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <button
  onClick={() => loadProviderProfile(p.id)}
  className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
>
  <Eye className="w-3 h-3" />
  Profile
</button>
                     <button
  disabled={!p.latitude || !p.longitude}
  onClick={() => {
    window.open(
      `https://www.google.com/maps?q=${p.latitude},${p.longitude}`,
      "_blank"
    );
  }}
  className="..."
>
  <Navigation className="w-3 h-3" />
  Location
</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>



       {/* Provider Profile Drawer */}
      {providerDetails && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setProviderDetails(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-[#1A1F2E] border-l border-gray-200 dark:border-gray-800 z-50 overflow-y-auto">

            {/* Drawer Header */}
            <div className="sticky top-0 bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg text-gray-900 dark:text-white">Provider Profile</h2>
               <p className="text-xs text-blue-600 dark:text-blue-400 font-mono mt-0.5">
  {providerDetails.provider.id}
</p>
              </div>
              <button onClick={() => setProviderDetails(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Avatar + name + status */}
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                {(() => {
                  const idx = (overview?.providers ?? []).findIndex((p: any) => p.id === providerDetails.id);
                  return <div className="relative">

  {providerDetails?.provider?.profile_photo_url ? (

    <img
      src={providerDetails.provider.profile_photo_url}
      alt={providerDetails.provider.full_name}
      className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-[#1A1F2E] shadow-lg"
    />

  ) : (

    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">

      {providerDetails.provider.full_name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)}

    </div>

  )}

</div>
                })()}
                <div className="flex-1 min-w-0">
                  <p className="text-base text-gray-900 dark:text-white">{providerDetails.provider.full_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{providerDetails.provider.id}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${statusClass(providerDetails.provider.status)}`}>{providerDetails.provider.is_online
  ? providerDetails.provider.current_booking_id
    ? "Busy"
    : "Online"
  : "Offline"}</span>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(j => (
                        <Star key={j} className={`w-3 h-3 ${j <= Math.floor(providerDetails.provider.avg_rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} />
                      ))}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{providerDetails.provider.avg_rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                  <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-xs text-gray-900 dark:text-white mt-0.5">{providerDetails.provider.phone}</p>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 min-w-0">
                  <Mail className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-xs text-gray-900 dark:text-white mt-0.5 truncate">{providerDetails.provider.user_email}</p>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <h4 className="text-sm text-gray-900 dark:text-white mb-3">Personal Information</h4>                                   
              <DetailRow label="Joined" value={new Date(providerDetails.provider.created_at).toLocaleDateString()} />
              </div>

              {/* Bio */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <h4 className="text-sm text-gray-900 dark:text-white mb-2">Bio</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{providerDetails.provider.bio || "-"}</p>
              </div>

              {/* Service Info */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <h4 className="text-sm text-gray-900 dark:text-white mb-3">Service Information</h4>
                <DetailRow label="Current Service" value={providerDetails.provider.services?.join(", ") || "-"} />
                
                <DetailRow label="Languages" value={providerDetails.provider.languages?.join(", ") || "-"} />
                
                <DetailRow label="Online Since" value={providerDetails.provider.went_online_at
  ? new Date(providerDetails.provider.went_online_at).toLocaleString()
  : "-"} />
              </div>

              {/* Booking Stats */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <h4 className="text-sm text-gray-900 dark:text-white mb-3">Booking Statistics</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Total Bookings', value: String(providerDetails.stats.totalBookings), icon: Calendar, color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'Completed', value: String(providerDetails.stats.completedBookings), icon: Clock, color: 'text-green-600 dark:text-green-400' },
                    { label: 'Cancelled', value: String(providerDetails.stats.totalBookings -
providerDetails.stats.completedBookings -
providerDetails.stats.activeBookings), icon: X, color: 'text-red-500 dark:text-red-400' },
                    { label: 'Active Now', value: String(providerDetails.stats.activeBookings), icon: Briefcase, color: 'text-orange-600 dark:text-orange-400' },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="bg-white dark:bg-[#1A1F2E] rounded-lg p-3 border border-gray-200 dark:border-gray-800">
                        <Icon className={`w-4 h-4 ${item.color} mb-1.5`} />
                        <p className={`text-base ${item.color}`}>{item.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Earnings */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <h4 className="text-sm text-gray-900 dark:text-white mb-3">Earnings Summary</h4>
                <DetailRow label="Total Earnings" value={`₹${providerDetails.stats.totalEarnings}`} />
                <DetailRow label="Active Booking" value={providerDetails.stats.activeBookings > 0 ? "Yes" : "No"} />
              </div>

              {/* Current location pill */}
              <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm text-blue-700 dark:text-blue-400">{providerDetails.provider.location}, {providerDetails.provider.city}</span>
                <span className="ml-auto text-xs text-blue-500 dark:text-blue-400 animate-pulse">● Live</span>
              </div>

            </div>
          </div>
        </>
      )}

    </div>
  
  );
}
