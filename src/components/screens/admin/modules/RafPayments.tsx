import React, { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Users, Zap, Calendar, BarChart2 } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "../../../../supabase";
interface PayoutDistribution {
  name: string;
  value: number;
}

interface Transaction {
  txId: string;
  bookingId: string;
  user: string;
  provider: string;
  amount: number;
  commission: number;
  provEarnings: number;
  status: string;
  date: string;
}
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#F97316'];

const colorMap: Record<string, string> = {
  green: 'bg-green-50 dark:bg-green-500/10', blue: 'bg-blue-50 dark:bg-blue-500/10',
  purple: 'bg-purple-50 dark:bg-purple-500/10', orange: 'bg-orange-50 dark:bg-orange-500/10',
  cyan: 'bg-cyan-50 dark:bg-cyan-500/10', indigo: 'bg-indigo-50 dark:bg-indigo-500/10',
};
const iconColorMap: Record<string, string> = {
  green: 'text-green-600 dark:text-green-400', blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400', orange: 'text-orange-600 dark:text-orange-400',
  cyan: 'text-cyan-600 dark:text-cyan-400', indigo: 'text-indigo-600 dark:text-indigo-400',
};

const tt = { background: '#1A1F2E', border: '1px solid #374151', borderRadius: 8, color: '#F9FAFB', fontSize: 12 };

export function RafPayments() {
  const [loading, setLoading] = useState(true);

const [dashboard, setDashboard] = useState({
  kpis: {
    totalRevenue: 0,
    monthlyRevenue: 0,
    providerEarnings: 0,
    todayPlatformEarnings: 0,
    monthlyPlatformEarnings: 0,
    totalPlatformEarnings: 0,
  },
  dailyRevenue: [] as { day: string; revenue: number }[],
  monthlyRevenueChart: [] as { month: string; revenue: number }[],
  payoutDistribution: [] as PayoutDistribution[],
  transactions: [] as Transaction[],
});
const kpis = [
  {
    label: "Total Revenue",
    value: `₹${dashboard.kpis.totalRevenue.toLocaleString()}`,
    icon: DollarSign,
    color: "green",
  },
  {
    label: "Monthly Revenue",
    value: `₹${dashboard.kpis.monthlyRevenue.toLocaleString()}`,
    icon: TrendingUp,
    color: "blue",
  },
  {
    label: "Provider Earnings",
    value: `₹${dashboard.kpis.providerEarnings.toLocaleString()}`,
    icon: Users,
    color: "purple",
  },
  {
    label: "Platform Earnings Today",
    value: `₹${dashboard.kpis.todayPlatformEarnings.toLocaleString()}`,
    icon: Zap,
    color: "orange",
  },
  {
    label: "Platform Earnings Month",
    value: `₹${dashboard.kpis.monthlyPlatformEarnings.toLocaleString()}`,
    icon: Calendar,
    color: "cyan",
  },
  {
    label: "Platform Total Earnings",
    value: `₹${dashboard.kpis.totalPlatformEarnings.toLocaleString()}`,
    icon: BarChart2,
    color: "indigo",
  },
];

const loadPaymentsDashboard = async () => {
  try {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const response = await fetch(
      "https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_get_raf_payments_dashboard",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    console.log("PAYMENTS DASHBOARD:", result);

   if (result.success) {
  setDashboard({
    kpis: result.kpis,
    dailyRevenue: result.dailyRevenue ?? [],
    monthlyRevenueChart: result.monthlyRevenueChart ?? [],
    payoutDistribution: result.payoutDistribution ?? [],
    transactions: result.transactions ?? [],
  });
}
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadPaymentsDashboard();
}, []);
if (loading) {
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="text-gray-500 dark:text-gray-400">
        Loading Payments Dashboard...
      </div>
    </div>
  );
}
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Payments</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Revenue analytics and payment management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       {kpis.map((k) => {
  const Icon = k.icon;

  return (
    <div
      key={k.label}
      className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg ${colorMap[k.color]} flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${iconColorMap[k.color]}`} />
        </div>
      </div>

      <p className="text-xl text-gray-900 dark:text-white mb-1">
        {k.value}
      </p>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        {k.label}
      </p>
    </div>
  );
})}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-base text-gray-900 dark:text-white mb-5">Daily Revenue</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dashboard.dailyRevenue}>
              <defs>
                <linearGradient id="rafDayGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" stroke="#374151" strokeDasharray="3 3" />
              <XAxis key="x" dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis key="y" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip key="tt" contentStyle={tt} />
              <Area key="area" type="monotone" dataKey="revenue" stroke="#3B82F6" fill="url(#rafDayGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-base text-gray-900 dark:text-white mb-5">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dashboard.monthlyRevenueChart}>
              <CartesianGrid key="grid" stroke="#374151" strokeDasharray="3 3" />
              <XAxis key="x" dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis key="y" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip key="tt" contentStyle={tt} />
              <Bar key="bar" dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-base text-gray-900 dark:text-white mb-5">Provider Payout Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie key="pie" data={dashboard.payoutDistribution} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name }) => name}>
                {dashboard.payoutDistribution.map((entry) => (
                  <Cell key={`pd-${entry.name}`} fill={COLORS[dashboard.payoutDistribution.indexOf(entry) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip key="tt" contentStyle={tt} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-base text-gray-900 dark:text-white mb-5">Revenue Trend (6 months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dashboard.monthlyRevenueChart}>
              <CartesianGrid key="grid" stroke="#374151" strokeDasharray="3 3" />
              <XAxis key="x" dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis key="y" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip key="tt" contentStyle={tt} />
              <Line key="line" type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-base text-gray-900 dark:text-white">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {['Transaction ID', 'Booking ID', 'User', 'Provider', 'Amount', 'Platform Commission', 'Provider Earnings', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-900/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {dashboard.transactions.map((t, i) => (
                <tr key={t.txId} className="hover:bg-blue-600 dark:hover:bg-gray-900/40 transition-colors">
                  <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 font-mono text-xs whitespace-nowrap">{t.txId}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 font-mono text-xs whitespace-nowrap">{t.bookingId}</td>
                  <td className="px-5 py-3.5 text-gray-900 dark:text-white whitespace-nowrap">{t.user}</td>
                  <td className="px-5 py-3.5 text-gray-900 dark:text-white whitespace-nowrap">{t.provider}</td>
                  <td className="px-5 py-3.5 text-green-600 dark:text-green-400 whitespace-nowrap">₹{Number(t.amount).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-orange-600 dark:text-orange-400 whitespace-nowrap">₹{Number(t.commission).toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 whitespace-nowrap">₹{Number(t.provEarnings).toLocaleString()}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded ${t.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : t.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400'}`}>{t.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
