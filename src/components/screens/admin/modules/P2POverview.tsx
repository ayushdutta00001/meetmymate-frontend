import { supabase } from "../../../../supabase";
import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  TrendingUp,
  Activity,
  Send,
  CreditCard,
  AlertCircle,
} from 'lucide-react';

export function P2POverview() {
 
 const [metrics, setMetrics] = useState<any[]>([]);
const [recentActivity, setRecentActivity] = useState<any[]>([]);
  
useEffect(() => {

  loadMetrics();
  loadRecentActivity();

  const channel = supabase
    .channel("p2p-admin-overview")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "p2p_meetings" },
      () => {
        loadMetrics();
        loadRecentActivity();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };

}, []);

const loadMetrics = async () => {
  const { count: requestCount } = await supabase
    .from("p2p_match_requests")
    .select("*", { count: "exact", head: true });

  const { count: activeMeetings } = await supabase
    .from("p2p_meetings")
    .select("*", { count: "exact", head: true })
    .neq("status", "completed")
    .neq("status", "cancelled");

  const { count: awaitingAdmin } = await supabase
    .from("p2p_meetings")
    .select("*", { count: "exact", head: true })
    .eq("status", "paid_waiting_admin");

  const { count: completed } = await supabase
    .from("p2p_meetings")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  const { count: cancelled } = await supabase
    .from("p2p_meetings")
    .select("*", { count: "exact", head: true })
    .eq("status", "cancelled");

  const { data: revenue } = await supabase
    .from("p2p_meetings")
    .select("price")
    .eq("status", "completed");

  const totalRevenue =
    revenue?.reduce((sum, m) => sum + (m.price || 0), 0) || 0;

  setMetrics([
    {
      label: "Total Requests",
      value: requestCount || 0,
      icon: Send,
      color: "bg-blue-500",
      textColor: "text-blue-400",
    },
    {
      label: "Active Meetings",
      value: activeMeetings || 0,
      icon: Calendar,
      color: "bg-purple-500",
      textColor: "text-purple-400",
    },
    {
      label: "Awaiting Admin",
      value: awaitingAdmin || 0,
      icon: Clock,
      color: "bg-orange-500",
      textColor: "text-orange-400",
    },
    {
      label: "Completed",
      value: completed || 0,
      icon: CheckCircle2,
      color: "bg-green-500",
      textColor: "text-green-400",
    },
    {
      label: "Cancelled",
      value: cancelled || 0,
      icon: XCircle,
      color: "bg-red-500",
      textColor: "text-red-900",
    },
    {
      label: "Total Revenue",
      value: `$${totalRevenue}`,
      icon: DollarSign,
      color: "bg-yellow-500",
      textColor: "text-yellow-900",
    },
  ]);
};

const loadRecentActivity = async () => {
  const { data: meetings } = await supabase
    .from("p2p_meetings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(6);

  const activity = meetings?.map((m, index) => ({
    id: index,
    message: `Meeting ${m.id} status updated to ${m.status}`,
    timestamp: new Date(m.updated_at).toLocaleString(),
    icon: Calendar,
    color: "text-purple-700",
  }));

  setRecentActivity(activity || []);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-6">
          <h1 className="text-2xl lg:text-3xl text-white mb-2" style={{ fontWeight: 700 }}>
            P2P Matching Overview
          </h1>
          <p className="text-sm text-gray-400">System statistics and recent activity</p>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Metrics Cards */}
         <div className="grid  lg:grid-cols-3 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="bg-gray-900 border-4 border-gray-700/60 rounded-xl p-5 shadow-lg hover:border-blue-500 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.color}`}>
                    <Icon className={`w-6 h-6 ${metric.textColor}`} />
                  </div>

                  {metric.trend && (
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        metric.trend.up
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {metric.trend.up ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span className="font-semibold">
                        {metric.trend.value}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-400 mb-1">
                  {metric.label}
                </p>

                <p className="text-4xl font-bold text-white tracking-tight">
                  {metric.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 border border-white/40 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/30">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg text-white" style={{ fontWeight: 600 }}>
                Recent Activity
              </h2>
            </div>
          </div>
          <div className="divide-y divide-white/10">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="px-6 py-4 hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}  