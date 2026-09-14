import React, { useEffect, useState } from 'react';
import { supabase } from "../../../../supabase";
import { DollarSign, TrendingUp, Calendar, BookOpen, Eye, Download, X } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../../../Button';

const tt = { background: '#1A1F2E', border: '1px solid #374151', borderRadius: 8, color: '#F9FAFB', fontSize: 12 };

export function ProviderMgmtEarnings() {
 const [providers, setProviders] = useState<any[]>([]);
const [kpis, setKpis] = useState<any>(null);
const [detailProvider, setDetailProvider] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [dailyChart, setDailyChart] = useState<any[]>([]);
const [monthlyChart, setMonthlyChart] = useState<any[]>([]);
const [earningDetails, setEarningDetails] = useState<any>(null);
const [loadingDetails, setLoadingDetails] = useState(false);

const loadEarnings = async () => {
  try {

    setLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin_get_provider_earnings`,
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

    console.log("PROVIDER EARNINGS", data);

    if (data.success) {

      setProviders(data.providers);

      setKpis(data.kpis);

      setDailyChart(data.dailyChart);
setMonthlyChart(data.monthlyChart);

    }

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(false);

  }
};
const loadEarningDetails = async (providerId: string) => {
  try {
    setLoadingDetails(true);

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin_get_provider_earnings_detail`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            (await supabase.auth.getSession()).data.session?.access_token
          }`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId,
        }),
      }
    );

    const data = await response.json();

    console.log("EARNING DETAILS", data);


    if (data.success) {
      setEarningDetails(data);
    }

  } catch (err) {
    console.error(err);
  } finally {
    setLoadingDetails(false);
  }
};

useEffect(() => {
  loadEarnings();
}, []);



if (loading) {
  return (
    <div className="p-10 text-center">
      Loading earnings...
    </div>
  );
}


  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Earnings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Provider earnings dashboard and payout management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
  {
    label: "Total Earnings",
    value: `₹${kpis?.totalEarnings?.toFixed(2) ?? "0.00"}`,
    icon: DollarSign,
    color: "green",
  },
  {
    label: "Monthly Earnings",
    value: `₹${kpis?.monthlyEarnings?.toFixed(2) ?? "0.00"}`,
    icon: TrendingUp,
    color: "blue",
  },
  {
    label: "Today's Earnings",
    value: `₹${kpis?.todayEarnings?.toFixed(2) ?? "0.00"}`,
    icon: Calendar,
    color: "purple",
  },
  {
    label: "Completed Bookings",
    value: kpis?.completedBookings ?? 0,
    icon: BookOpen,
    color: "orange",
  },
].map(k => {
          const Icon = k.icon;
          const bg = { green: 'bg-green-50 dark:bg-green-500/10', blue: 'bg-blue-50 dark:bg-blue-500/10', purple: 'bg-purple-50 dark:bg-purple-500/10', orange: 'bg-orange-50 dark:bg-orange-500/10' }[k.color];
          const ic = { green: 'text-green-600 dark:text-green-400', blue: 'text-blue-600 dark:text-blue-400', purple: 'text-purple-600 dark:text-purple-400', orange: 'text-orange-600 dark:text-orange-400' }[k.color];
          return (
            <div key={k.label} className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${ic}`} />
              </div>
              <p className="text-2xl text-gray-900 dark:text-white mb-1">{k.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-base text-gray-900 dark:text-white mb-5">Daily Earnings</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyChart}>
              <defs>
                <linearGradient id="pmEarnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" stroke="#374151" strokeDasharray="3 3" />
              <XAxis key="x" dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis key="y" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip key="tt" contentStyle={tt} />
              <Area key="area" type="monotone" dataKey="earnings" stroke="#10B981" fill="url(#pmEarnGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-base text-gray-900 dark:text-white mb-5">Monthly Earnings</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyChart}>
              <CartesianGrid key="grid" stroke="#374151" strokeDasharray="3 3" />
              <XAxis key="x" dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis key="y" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip key="tt" contentStyle={tt} />
              <Bar key="bar" dataKey="earnings" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-base text-gray-900 dark:text-white">Provider Earnings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {['Provider ID', 'Provider Name', 'Total Earnings', 'Monthly', "Today's", 'Commission', 'Provider Share', 'Bookings', 'Pending Payout', 'Last Booking', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-900/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {providers.map((p) => (
                <tr key={p.id} className="hover:bg-blue-600 dark:hover:bg-gray-900/40 transition-colors">
                  <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 font-mono text-xs whitespace-nowrap">{p.id}</td>
                  <td className="px-5 py-3.5 text-gray-900 dark:text-white whitespace-nowrap">{p.name}</td>
                  <td className="px-5 py-3.5 text-green-600 dark:text-green-400 whitespace-nowrap">₹{p.total.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-gray-900 dark:text-white whitespace-nowrap">₹{p.total.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-gray-900 dark:text-white whitespace-nowrap">₹0.00</td>
                  <td className="px-5 py-3.5 text-orange-600 dark:text-orange-400 whitespace-nowrap">₹{(p.total * 0.15).toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 whitespace-nowrap">₹{p.available.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-gray-900 dark:text-white whitespace-nowrap">{p.bookings}</td>
                  <td className="px-5 py-3.5 text-yellow-600 dark:text-yellow-400 whitespace-nowrap">₹{p.pending.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{new Date(p.lastUpdated).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                     <Button
  onClick={() => {
    setDetailProvider(p);
    loadEarningDetails(p.id);
  }}
>
  Details
</Button>
                     
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      {detailProvider && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setDetailProvider(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-[#1A1F2E] border-l border-gray-200 dark:border-gray-800 z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg text-gray-900 dark:text-white">Earnings Detail — {earningDetails?.provider?.full_name}</h2>
              <button onClick={() => setDetailProvider(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"><X className="w-5 h-5 text-green-500" /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Wallet summary */}
              <div className="grid grid-cols-2 gap-3">
                {[
  {
    label: "Total Earnings",
    value: `₹${earningDetails?.wallet?.total_earned?.toFixed(2) ?? "0.00"}`,
    color: "text-green-600 dark:text-green-400",
  },
  {
    label: "Available Balance",
    value: `₹${earningDetails?.wallet?.available_balance?.toFixed(2) ?? "0.00"}`,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Pending Balance",
    value: `₹${earningDetails?.wallet?.pending_balance?.toFixed(2) ?? "0.00"}`,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    label: "Withdrawn",
    value: `₹${earningDetails?.wallet?.total_withdrawn?.toFixed(2) ?? "0.00"}`,
    color: "text-red-600 dark:text-red-400",
  },
  {
    label: "Completed Bookings",
    value: earningDetails?.stats?.completedBookings ?? 0,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    label: "Completion Rate",
    value: `${earningDetails?.stats?.completionRate ?? 0}%`,
    color: "text-indigo-600 dark:text-indigo-400",
  },
].map(item => (
                  <div key={item.label} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <p className={`text-base ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5">
                <h4 className="text-sm text-gray-900 dark:text-white mb-4">Earnings Trend</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={dailyChart}>
                    <CartesianGrid key="grid" stroke="#374151" strokeDasharray="3 3" />
                    <XAxis key="x" dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                    <YAxis key="y" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                    <Tooltip key="tt" contentStyle={tt} />
                    <Bar key="bar" dataKey="earnings" fill="#10B981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
