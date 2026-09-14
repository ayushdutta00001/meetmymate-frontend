import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../supabase";
import { BarChart, Bar, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
const tt = { background: '#1A1F2E', border: '1px solid #374151', borderRadius: 8, color: '#F9FAFB', fontSize: 12 };

export function RafReports() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const bookingsPerDay = useMemo(() => {
    if (!reportData) return [];

    const counts: Record<string, number> = {};

    reportData.bookings.forEach((booking: any) => {
      const day = new Date(booking.booking_date).toLocaleDateString("en-US", {
        weekday: "short",
      });

      counts[day] = (counts[day] || 0) + 1;
    });

    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      day,
      bookings: counts[day] || 0,
    }));
  }, [reportData]);
const revTrend = useMemo(() => {
  if (!reportData) return [];

  const revenueByMonth: Record<string, number> = {};

  reportData.bookings.forEach((booking: any) => {
    if (booking.payment_status !== "paid") return;

    const month = new Date(
      booking.booking_date
    ).toLocaleDateString("en-US", {
      month: "short",
    });

    revenueByMonth[month] =
      (revenueByMonth[month] || 0) +
      Number(booking.total_amount);
  });

  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ].map((month) => ({
    month,
    revenue: revenueByMonth[month] || 0,
  }));
}, [reportData]);

const topServices = useMemo(() => {
  if (!reportData) return [];

  const serviceCounts: Record<string, number> = {};

  reportData.bookings.forEach((booking: any) => {
    const service = booking.service_type;

    serviceCounts[service] =
      (serviceCounts[service] || 0) + 1;
  });

  return Object.entries(serviceCounts)
    .map(([slug, bookings]) => ({
      name: slug
        .split("-")
        .map(
          word =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(" "),
      bookings,
    }))
    .sort((a, b) => b.bookings - a.bookings);

}, [reportData]);

const outcomeData = useMemo(() => {
  if (!reportData) return [];

  const completed =
    reportData.bookings.filter(
      (b: any) => b.booking_status === "completed"
    ).length;

  const cancelled =
    reportData.bookings.filter(
      (b: any) => b.booking_status === "cancelled"
    ).length;

  const providerNotFound =
    reportData.bookings.filter(
      (b: any) =>
        b.booking_status === "provider_not_found"
    ).length;

  const pending =
    reportData.bookings.filter(
      (b: any) =>
        ![
          "completed",
          "cancelled",
          "provider_not_found",
        ].includes(b.booking_status)
    ).length;

  return [
    {
      name: "Completed",
      value: completed,
    },
    {
      name: "Cancelled",
      value: cancelled,
    },
    {
      name: "Provider Not Found",
      value: providerNotFound,
    },
    {
      name: "Pending",
      value: pending,
    },
  ];

}, [reportData]);

const growthData = useMemo(() => {
  if (!reportData) return [];

  return [
    {
      month: "Current",
      customers: reportData.totalUsers || 0,
      providers: reportData.totalProviders || 0,
    },
  ];
}, [reportData]);

const cityData = useMemo(() => {
  if (!reportData) return [];

  const cityCounts: Record<string, number> = {};

  reportData.bookings.forEach((booking: any) => {

    const city =
      booking.customer_city || "Unknown";

    cityCounts[city] =
      (cityCounts[city] || 0) + 1;

  });

  return Object.entries(cityCounts)
    .map(([city, bookings]) => ({
      city,
      bookings,
    }))
    .sort((a, b) => b.bookings - a.bookings);

}, [reportData]);

const topProviders = useMemo(() => {
  if (!reportData) return [];

  const providerMap: Record<
    string,
    {
      earnings: ReactNode;
      name: string;
      bookings: number;
      rating: number;
    }
  > = {};

  reportData.bookings.forEach((booking: any) => {
    if (!booking.providers) return;

    const id = booking.providers.id;

    if (!providerMap[id]) {
      providerMap[id] = {
        earnings: null,
        name: booking.providers.full_name,
        bookings: 0,
        rating: booking.providers.avg_rating ?? 0,
      };
    }

    providerMap[id].bookings++;
  });

  return Object.values(providerMap).sort(
    (a, b) => b.bookings - a.bookings
  );
}, [reportData]);

const loadReports = async () => {
  try {

    setLoading(true);

    const { data: sessionData } =
      await supabase.auth.getSession();

    const token =
      sessionData.session?.access_token;

    const response = await fetch(
      "https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_get_raf_reports",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    console.log("RAF REPORTS", result);

    if (result.success) {
      setReportData(result);
    }

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(false);

  }
};

useEffect(() => {
  loadReports();
}, []);

if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      Loading Reports...
    </div>
  );
}

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Reports & Analytics</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive RAF performance insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings per Day */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-base text-gray-900 dark:text-white mb-5">Bookings per Day</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bookingsPerDay}>
              <CartesianGrid key="grid" stroke="#374151" strokeDasharray="3 3" />
              <XAxis key="x" dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis key="y" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip key="tt" contentStyle={tt} />
              <Bar key="bar" dataKey="bookings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-base text-gray-900 dark:text-white mb-5">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revTrend}>
              <defs>
                <linearGradient id="rafRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" stroke="#374151" strokeDasharray="3 3" />
              <XAxis key="x" dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis key="y" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip key="tt" contentStyle={tt} />
              <Area key="area" type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#rafRevGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Most Booked Services */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-base text-gray-900 dark:text-white mb-5">Most Booked Services</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topServices} layout="vertical">
              <CartesianGrid key="grid" stroke="#374151" strokeDasharray="3 3" horizontal={false} />
              <XAxis key="x" type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis key="y" type="category" dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 10 }} width={95} />
              <Tooltip key="tt" contentStyle={tt} />
              <Bar key="bar" dataKey="bookings" radius={[0, 4, 4, 0]}>
                {topServices.map((entry) => (
                  <Cell key={`svc-${entry.name}`} fill={COLORS[topServices.indexOf(entry) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Outcome */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-base text-gray-900 dark:text-white mb-5">Cancellation & Refund Rate</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie key="pie" data={outcomeData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {outcomeData.map((entry) => (
                  <Cell key={`out-${entry.name}`} fill={COLORS[outcomeData.indexOf(entry) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip key="tt" contentStyle={tt} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Customer & Provider Growth */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-base text-gray-900 dark:text-white mb-5">Customer & Provider Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={growthData}>
              <CartesianGrid key="grid" stroke="#374151" strokeDasharray="3 3" />
              <XAxis key="x" dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <YAxis key="y" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip key="tt" contentStyle={tt} />
              <Legend key="legend" wrapperStyle={{ color: '#9CA3AF', fontSize: 11 }} />
              <Line key="cust" type="monotone" dataKey="customers" stroke="#3B82F6" strokeWidth={2} dot={false} name="Customers" />
              <Line key="prov" type="monotone" dataKey="providers" stroke="#10B981" strokeWidth={2} dot={false} name="Providers" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Cities */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-base text-gray-900 dark:text-white mb-5">Top Cities by Bookings</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cityData}>
              <CartesianGrid key="grid" stroke="#374151" strokeDasharray="3 3" />
              <XAxis key="x" dataKey="city" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <YAxis key="y" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
              <Tooltip key="tt" contentStyle={tt} />
              <Bar key="bar" dataKey="bookings" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Providers Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-base text-gray-900 dark:text-white">Top Performing Providers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {['#', 'Provider Name', 'Total Bookings', 'Earnings', 'Rating'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {topProviders.map((p, i) => (
                <tr key={p.name} className="hover:bg-blue-600 dark:hover:bg-gray-900/40 transition-colors">
                  <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-bold">#{i + 1}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{p.name}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{p.bookings}</td>
                  <td className="px-6 py-4 text-green-600 dark:text-green-400">{p.earnings}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, j) => (
                          <span key={j} className={j < Math.floor(p.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-700'}>★</span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{p.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
