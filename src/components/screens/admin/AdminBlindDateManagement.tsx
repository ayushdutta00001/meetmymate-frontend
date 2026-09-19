import { api } from '../../../lib/api';
import { supabase } from '../../../supabase';
import React, { useState, useEffect, useMemo } from 'react';

import { motion, AnimatePresence } from 'motion/react';

import {
  RefreshCw,
  Search,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Circle,
  Users,
  Zap,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Timer,
  X,
  ChevronDown,
  ChevronRight,
  Ban,
  AlertTriangle,
  Activity,
} from 'lucide-react';

// Types matching backend structure
interface BlindDateBooking {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  status:
    | 'pending_payment'
    | 'pending'
    | 'holding'
    | 'confirmed'
    | 'completed'
    | 'cancelled'
    | 'refunded';
  payment_status: 'paid' | 'pending' | 'refunded';
  payment_id: string | null;
  paid_at: string | null;
  amount: number;
  meeting_date: string | null;
  meeting_time: string | null;
  meeting_location: string | null;
  updated_at?: string | null;
  preferences: {
    areas: string[];
    date_range: string;
    time_windows: string[];
  };
  created_at: string;
  flags: string[];
  audit_log: AuditEntry[];
}

interface AuditEntry {
  timestamp: string;
  action: string;
  admin?: string;
}

// =====================================================
// 🧠 SMART AI ADMIN ENGINE (FRONTEND SIDE)
// =====================================================

function generateSmartFlags(
  b: BlindDateBooking,
  settings?: { autoFlagHours: number; highRiskHours: number }
): string[] {
  const flags: string[] = [...(b.flags || [])];

  const created = new Date(b.created_at).getTime();
  const now = Date.now();
  const hoursSinceCreated = Number.isFinite(created)
    ? (now - created) / (1000 * 60 * 60)
    : 0;

  const autoFlag = settings?.autoFlagHours ?? 24;
  const highRisk = settings?.highRiskHours ?? 48;

  const isHolding =
    b.status === 'pending' ||
    b.status === 'holding';

  if (isHolding && hoursSinceCreated > autoFlag) {
    if (!flags.includes('Delayed')) flags.push('Delayed');
  }

  if (isHolding && hoursSinceCreated > highRisk) {
    if (!flags.includes('Refund Likely')) flags.push('Refund Likely');
  }

  if (isHolding && b.payment_status === 'paid') {
    if (!flags.includes('Match Ready')) flags.push('Match Ready');
  }

  return flags;
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const styles = {
    holding: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    confirmed: 'bg-green-500/20 text-green-300 border-green-500/30',
    completed: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    refunded: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    paid: 'bg-green-500/20 text-green-300 border-green-500/30',
    pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs border ${
        styles[status as keyof typeof styles] || 'bg-gray-500/20 text-gray-300'
      }`}
      style={{ fontWeight: 600 }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Flag badge
function FlagBadge({ flag }: { flag: string }) {
  const colors = {
  Delayed: 'bg-yellow-500/20 text-yellow-300',
  'High Risk': 'bg-red-500/20 text-red-300',
  'Refund Likely': 'bg-orange-500/20 text-orange-300',
  'Match Ready': 'bg-green-500/20 text-green-300',
};


  return (
    <span
      className={`px-2 py-1 rounded-md text-xs ${colors[flag as keyof typeof colors] || 'bg-gray-500/20 text-gray-300'}`}
      style={{ fontWeight: 500 }}
    >
      {flag}
    </span>
  );
}

// Metric card component
function MetricCard({
  label,
  value,
  icon: Icon,
  color,
  trend,
}: {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  trend?: { value: string; up: boolean };
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trend.up ? 'text-green-400' : 'text-red-400'}`}>
            {trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span style={{ fontWeight: 600 }}>{trend.value}</span>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-3xl text-white" style={{ fontWeight: 700 }}>
        {value}
      </p>
    </motion.div>
  );
}

// Budget Control Dropdown
function BudgetControlDropdown({
  isOpen,
  onToggle,
  totalBookings,
  totalRevenue,
  refundPercentage,
}: {
  isOpen: boolean;
  onToggle: () => void;
  totalBookings: number;
  totalRevenue: number;
  refundPercentage: string | number;
}) {
  const fixedPrice = 399;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-xl hover:from-blue-600/30 hover:to-indigo-600/30 transition-all min-h-[44px]"
      >
        <DollarSign className="w-5 h-5 text-blue-400" />
        <span className="text-sm text-white" style={{ fontWeight: 600 }}>
          Budget Control
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-80 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-2xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl z-50"
          >
            <h3 className="text-lg text-white mb-4" style={{ fontWeight: 700 }}>
              Revenue Overview
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Blind Date Price (Fixed)</p>
                  <p className="text-2xl text-white" style={{ fontWeight: 700 }}>
                    ₹{fixedPrice}
                  </p>
                </div>
                <div className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                  Locked
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-700/20 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">Total Bookings</p>
                  <p className="text-xl text-white" style={{ fontWeight: 700 }}>
                    {totalBookings.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-gray-700/20 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">Refund Rate</p>
                  <p className="text-xl text-orange-400" style={{ fontWeight: 700 }}>
                    {refundPercentage}%
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl border border-green-500/30">
                <p className="text-xs text-green-300 mb-1">Total Revenue Generated</p>
                <p className="text-2xl text-white" style={{ fontWeight: 700 }}>
                  ₹{Number(totalRevenue || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Booking Action Drawer
function BookingActionDrawer({
  booking,
  onClose,
  onConfirm,
  onRefund,
}: {
  booking: BlindDateBooking;
  onClose: () => void;
  onConfirm: (data: { meeting_date: string; meeting_time: string; meeting_location: string }) => void;
  onRefund: (reason: string) => void;
}) {
  const [meetingDate, setMeetingDate] = useState(booking.meeting_date || '');
  const [meetingTime, setMeetingTime] = useState(booking.meeting_time || '');
  const [meetingLocation, setMeetingLocation] = useState(booking.meeting_location || '');
  const [refundReason, setRefundReason] = useState('');
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);

  const handleConfirm = () => {
    if (meetingDate && meetingTime && meetingLocation) {
      onConfirm({ meeting_date: meetingDate, meeting_time: meetingTime, meeting_location: meetingLocation });
    }
  };

  const handleRefund = () => {
    if (refundReason) {
      onRefund(refundReason);
      setShowRefundConfirm(false);
    }
  };

  const canEdit = booking.status === 'pending' || booking.status === 'holding';
  const canRefund =
    booking.status !== 'refunded' &&
    booking.payment_status !== 'refunded' &&
    booking.status !== 'completed' &&
    booking.payment_status === 'paid';

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-gradient-to-br from-gray-900/98 to-gray-950/98 backdrop-blur-2xl border-l border-gray-700/50 shadow-2xl z-50 overflow-y-auto"
    >
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl text-white mb-1" style={{ fontWeight: 700 }}>
              Booking Details
            </h2>
            <p className="text-sm text-gray-400">{booking.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* User Info */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 mb-6 border border-gray-700/30">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={booking.user_avatar}
              alt={booking.user_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-700"
            />
            <div>
              <h3 className="text-lg text-white mb-1" style={{ fontWeight: 600 }}>
                {booking.user_name}
              </h3>
              <p className="text-xs text-gray-400">{booking.user_id}</p>
            </div>
          </div>

          {/* Flags */}
          {booking.flags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {booking.flags.map((flag) => (
                <FlagBadge key={flag} flag={flag} />
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <StatusBadge status={booking.status} />
            <StatusBadge status={booking.payment_status} />
          </div>
        </div>

       {/* User Availability */}
<div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 mb-6 border border-gray-700/20">
  <h3 className="text-sm text-gray-400 mb-4 uppercase tracking-wide" style={{ fontWeight: 600 }}>
    User Availability
  </h3>

  <div className="space-y-3">

    {/* Areas */}
    <div className="flex items-start gap-3">
      <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-gray-400 mb-1">Preferred Areas</p>
        <p className="text-sm text-white">
          {(booking.preferences?.areas ?? []).join(', ')}
        </p>
      </div>
    </div>

    {/* Date Range */}
    <div className="flex items-start gap-3">
      <Calendar className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-gray-400 mb-1">Date Range</p>
        <p className="text-sm text-white">
          {booking.preferences?.date_range || 'N/A'}
        </p>
      </div>
    </div>

    {/* Time Windows */}
    <div className="flex items-start gap-3">
      <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-gray-400 mb-1">Time Windows</p>
        <p className="text-sm text-white">
          {(booking.preferences?.time_windows ?? []).join(', ')}
        </p>
      </div>
    </div>

  </div>
</div>


        {/* Meeting Arrangement */}
        {canEdit && (
          <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-2xl p-6 mb-6 border border-blue-500/20">
            <h3 className="text-sm text-blue-300 mb-4 uppercase tracking-wide" style={{ fontWeight: 600 }}>
              Meeting Arrangement
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2" style={{ fontWeight: 500 }}>
                  Meeting Date
                </label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2" style={{ fontWeight: 500 }}>
                  Meeting Time
                </label>
                <input
                  type="time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2" style={{ fontWeight: 500 }}>
                  Meeting Location
                </label>
                <input
                  type="text"
                  placeholder="Enter venue name"
                  value={meetingLocation}
                  onChange={(e) => setMeetingLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-500"
                />
              </div>
              <button
                onClick={handleConfirm}
                disabled={!meetingDate || !meetingTime || !meetingLocation}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20 min-h-[44px]"
                style={{ fontWeight: 600 }}
              >
                <CheckCircle2 className="w-5 h-5 inline mr-2" />
                Confirm Arrangement
              </button>
            </div>
          </div>
        )}

        {/* Payment Control */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 mb-6 border border-gray-700/20">
          <h3 className="text-sm text-gray-400 mb-4 uppercase tracking-wide" style={{ fontWeight: 600 }}>
            Payment Control
          </h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Payment Status</span>
              <StatusBadge status={booking.payment_status} />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Amount</span>
              <span className="text-sm text-white" style={{ fontWeight: 600 }}>
                ₹{booking.amount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Payment ID</span>
              <span className="text-xs text-gray-500 break-all">{booking.payment_id || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Paid At</span>
              <span className="text-xs text-gray-500">
                {booking.paid_at ? new Date(booking.paid_at).toLocaleString('en-IN') : 'N/A'}
              </span>
            </div>
          </div>

          {/* Refund Control */}
          {canRefund && !showRefundConfirm && (
            <button
              onClick={() => setShowRefundConfirm(true)}
              className="w-full py-3 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-600/30 transition-all min-h-[44px]"
              style={{ fontWeight: 600 }}
            >
              <Ban className="w-5 h-5 inline mr-2" />
              Issue Refund
            </button>
          )}

          {showRefundConfirm && (
            <div className="space-y-3 p-4 bg-red-600/10 border border-red-500/30 rounded-xl">
              <p className="text-sm text-red-300" style={{ fontWeight: 600 }}>
                Select refund reason:
              </p>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-red-500/30 bg-gray-800/50 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                style={{ fontWeight: 500 }}
              >
                <option value="">Select reason...</option>
                <option value="no_match">No Match Found</option>
                <option value="user_unavailable">User Unavailable</option>
                <option value="admin_delay">Admin Delay</option>
                <option value="other">Other</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRefundConfirm(false)}
                  className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-all min-h-[44px]"
                  style={{ fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefund}
                  disabled={!refundReason}
                  className="flex-1 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  style={{ fontWeight: 600 }}
                >
                  Confirm Refund
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Audit Log */}
        <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 border border-gray-700/20">
          <h3 className="text-sm text-gray-400 mb-4 uppercase tracking-wide" style={{ fontWeight: 600 }}>
            Audit Log
          </h3>
          <div className="space-y-3">
            {booking.audit_log.map((entry, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-800 last:border-0">
                <Activity className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-white mb-1">{entry.action}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{new Date(entry.timestamp).toLocaleString('en-IN')}</span>
                    {entry.admin && <span>• {entry.admin}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
function normalizeBooking(
  raw: any,
  serviceSettings?: { autoFlagHours: number; highRiskHours: number }
): BlindDateBooking {
  const pref = raw?.preferences && typeof raw.preferences === 'object'
    ? raw.preferences
    : {};

  const user = raw?.users || raw?.user || {};

  const status = String(
    raw?.status ??
    (raw?.cancelled ? 'cancelled' : 'pending')
  ).toLowerCase() as BlindDateBooking['status'];

  const paymentStatus = String(
    raw?.payment_status ?? 'pending'
  ).toLowerCase() as BlindDateBooking['payment_status'];

  const normalized: BlindDateBooking = {
    id: String(raw?.id ?? ''),
    user_id: String(raw?.user_id ?? ''),
    user_name:
      raw?.user_name ||
      user?.name ||
      user?.full_name ||
      'User',
    user_avatar:
      raw?.user_avatar ||
      raw?.avatar_url ||
      raw?.profile_image ||
      user?.profile_photo_url ||
      user?.avatar_url ||
      user?.profile_image ||
      'https://placehold.co/200x200',
    status,
    payment_status: paymentStatus,
    payment_id:
      raw?.payment_id ||
      raw?.razorpay_payment_id ||
      raw?.payment_reference ||
      null,
    paid_at:
      raw?.paid_at ||
      raw?.payment_paid_at ||
      null,
    amount: Number(raw?.amount ?? raw?.total_amount ?? 0),
    meeting_date: raw?.meeting_date ?? null,
    meeting_time: raw?.meeting_time ?? null,
    meeting_location:
      raw?.meeting_location ??
      raw?.location ??
      null,
    updated_at: raw?.updated_at ?? null,
    created_at: raw?.created_at ?? new Date().toISOString(),
    flags: Array.isArray(raw?.flags) ? raw.flags : [],
    audit_log: Array.isArray(raw?.audit_log) ? raw.audit_log : [],
    preferences: {
      areas:
        Array.isArray(pref?.areas)
          ? pref.areas
          : Array.isArray(raw?.preferred_locations)
            ? raw.preferred_locations
            : [],
      date_range:
        typeof pref?.date_range === 'string'
          ? pref.date_range
          : pref?.date_range && typeof pref.date_range === 'object'
            ? `${pref.date_range.from ?? ''} - ${pref.date_range.to ?? ''}`.replace(/^\s*-\s*$/, 'N/A')
            : Array.isArray(raw?.availability) && raw.availability.length
              ? raw.availability
                  .map((item: any) => item?.day || '')
                  .filter(Boolean)
                  .join(', ')
              : 'N/A',
      time_windows:
        Array.isArray(pref?.time_windows)
          ? pref.time_windows
          : Array.isArray(raw?.availability)
            ? raw.availability.flatMap((item: any) =>
                Array.isArray(item?.periods) ? item.periods : []
              )
            : [],
    },
  };

  // Keep payment timing meaningful when the backend does not expose a paid_at field.
  if (!normalized.paid_at && paymentStatus === 'paid') {
    normalized.paid_at = raw?.created_at ?? null;
  }

  normalized.flags = generateSmartFlags(normalized, serviceSettings);

  return normalized;
}

// Main Component
export function AdminBlindDateManagement() {

  const [bookings, setBookings] = useState<BlindDateBooking[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BlindDateBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);
const [realtimeConnected, setRealtimeConnected] = useState(false);
const [serviceSettings, setServiceSettings] = useState({
  autoFlagHours: 24,
  highRiskHours: 48,
});

const loadBookings = async () => {
  try {
    setIsLoading(true);

    // Bookings are the primary source. Do not let optional settings failure
    // prevent the real booking data from loading.
    const res = await api.get<any[]>('admin_list_blind_date_bookings');

    console.log('BLIND DATE ADMIN BOOKINGS RESPONSE:', res);

    if (!res?.success) {
      console.error('Blind Date bookings API failed:', res?.error || res);
      setBookings([]);
    } else {
      const rows = Array.isArray(res?.data)
        ? res.data
        : Array.isArray((res as any)?.data?.bookings)
          ? (res as any).data.bookings
          : Array.isArray((res as any)?.bookings)
            ? (res as any).bookings
            : [];

      console.log('BLIND DATE BOOKING COUNT:', rows.length);
      console.log('BLIND DATE FIRST BOOKING:', rows[0] || null);

      const normalized = rows.map((row: any) =>
        normalizeBooking(row, serviceSettings)
      );

      setBookings(normalized);
    }

    // Optional AI settings. Booking data must continue even if this endpoint fails.
    try {
      const settingsRes = await api.get<any>('admin_get_service_settings');

      if (settingsRes?.success && settingsRes?.data) {
        const nextSettings = {
          autoFlagHours: Number(settingsRes.data.auto_flag_hours ?? 24),
          highRiskHours: Number(settingsRes.data.high_risk_hours ?? 48),
        };

        setServiceSettings(nextSettings);

        setBookings(prev =>
          prev.map(booking => ({
            ...booking,
            flags: generateSmartFlags(booking, nextSettings),
          }))
        );
      }
    } catch (settingsError) {
      console.warn('Blind Date service settings could not be loaded:', settingsError);
    }
  } catch (err) {
    console.error('Failed loading Blind Date admin bookings:', err);
    setBookings([]);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  let channel: ReturnType<typeof supabase.channel> | null = null;

  const initRealtime = async () => {
    await loadBookings();

    channel = supabase
      .channel('admin-blind-date-ops')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blind_date_bookings',
        },
        (payload: any) => {
          console.log('Realtime Blind Date booking change:', payload);

          if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id;
            if (deletedId) {
              setBookings(prev =>
                prev.filter(booking => booking.id !== deletedId)
              );
            }
            return;
          }

          const incoming = normalizeBooking(
            payload.new,
            serviceSettings
          );

          setBookings(prev => {
            const exists = prev.some(
              booking => booking.id === incoming.id
            );

            if (!exists) {
              return [incoming, ...prev];
            }

            return prev.map(booking =>
              booking.id === incoming.id
                ? { ...booking, ...incoming }
                : booking
            );
          });
        }
      )
      .subscribe((status: any) => {
        console.log('Blind Date realtime channel status:', status);

        if (status === 'SUBSCRIBED') {
          setRealtimeConnected(true);
        }

        if (
          status === 'CLOSED' ||
          status === 'CHANNEL_ERROR' ||
          status === 'TIMED_OUT'
        ) {
          setRealtimeConnected(false);
        }
      });
  };

  initRealtime();

  return () => {
    if (channel) {
      supabase.removeChannel(channel);
    }
  };
}, []);

 const filteredBookings = useMemo(() => {
  let filtered = [...bookings];

  if (statusFilter && statusFilter !== 'All') {
    const sf = statusFilter.toLowerCase();
    filtered = filtered.filter((b) => (b.status || '') === sf);
  }

  if (paymentFilter && paymentFilter !== 'All') {
    const pf = paymentFilter.toLowerCase();
    filtered = filtered.filter((b) => (b.payment_status || '') === pf);
  }

  if (riskFilter !== 'All') {
    if (riskFilter === 'Delayed') {
      filtered = filtered.filter((b) => (b.flags || []).includes('Delayed'));
    } else if (riskFilter === 'Refund Candidate') {
      filtered = filtered.filter(
        (b) =>
          (b.flags || []).includes('High Risk') ||
          (b.flags || []).includes('Refund Likely')
      );
    }
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();

    filtered = filtered.filter((b) => {
      const bookingId = (b.id || '').toLowerCase();
      const userName = (b.user_name || '').toLowerCase();
      return bookingId.includes(query) || userName.includes(query);
    });
  }

  // 🧠 AI PRIORITY SORT
  filtered.sort((a, b) => {
    const aReady = (a.flags || []).includes('Match Ready');
    const bReady = (b.flags || []).includes('Match Ready');
    return Number(bReady) - Number(aReady);
  });

  return filtered;
}, [bookings, statusFilter, paymentFilter, riskFilter, searchQuery]);

 // =============================
// REAL ADMIN METRICS
// =============================
const now = new Date();
const todayKey = now.toISOString().slice(0, 10);
const monthStart = new Date(
  now.getFullYear(),
  now.getMonth(),
  1
);

const isRefundedBooking = (booking: BlindDateBooking) =>
  booking.status === 'refunded' ||
  booking.payment_status === 'refunded';

const stats = {
  holding: bookings.filter(
    b => b.status === 'pending' || b.status === 'holding'
  ).length,

  confirmed: bookings.filter(
    b => b.status === 'confirmed'
  ).length,

  completed: bookings.filter(
    b => b.status === 'completed'
  ).length,

  refunded: bookings.filter(isRefundedBooking).length,

  revenueToday: bookings
    .filter(b => {
      if (b.payment_status !== 'paid') return false;
      const paidDate = b.paid_at || b.created_at;
      return String(paidDate || '').slice(0, 10) === todayKey;
    })
    .reduce((sum, b) => sum + Number(b.amount || 0), 0),

  revenueMonth: bookings
    .filter(b => {
      if (b.payment_status !== 'paid') return false;
      const paidDate = new Date(b.paid_at || b.created_at);
      return !Number.isNaN(paidDate.getTime()) && paidDate >= monthStart;
    })
    .reduce((sum, b) => sum + Number(b.amount || 0), 0),

  avgArrangeTime: (() => {
    const durations = bookings
      .map(b => {
        const auditConfirmed = (b.audit_log || [])
          .filter(entry =>
            /meeting confirmed|arrangement confirmed/i.test(
              String(entry.action || '')
            )
          )
          .sort(
            (a, z) =>
              new Date(a.timestamp).getTime() -
              new Date(z.timestamp).getTime()
          )[0];

        const start = new Date(b.created_at).getTime();
        const end = auditConfirmed
          ? new Date(auditConfirmed.timestamp).getTime()
          : b.updated_at
            ? new Date(b.updated_at).getTime()
            : NaN;

        if (
          !Number.isFinite(start) ||
          !Number.isFinite(end) ||
          end < start
        ) {
          return null;
        }

        const hours = (end - start) / (1000 * 60 * 60);
        return hours >= 0 ? hours : null;
      })
      .filter((hours): hours is number => hours !== null);

    if (!durations.length) return '-';

    const average =
      durations.reduce((sum, hours) => sum + hours, 0) /
      durations.length;

    return `${average.toFixed(1)}h`;
  })(),

  refundRate:
    bookings.length > 0
      ? (
          (bookings.filter(isRefundedBooking).length /
            bookings.length) *
          100
        ).toFixed(1)
      : '0.0',
};

  // Handle confirm arrangement
 const handleConfirmArrangement = async (
  bookingId: string,
  data: { meeting_date: string; meeting_time: string; meeting_location: string }
) => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      throw new Error('Admin session expired. Please sign in again.');
    }

    const response = await fetch(
      'https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_assign_blind_date',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: bookingId,
          meeting_date: data.meeting_date,
          meeting_time: data.meeting_time,
          meeting_location: data.meeting_location,
        }),
      }
    );

    const result = await response.json().catch(() => null);

    console.log('ADMIN ASSIGN BLIND DATE RESPONSE:', result);

    if (!response.ok || !result?.success) {
      throw new Error(
        result?.error ||
        result?.message ||
        'Failed to confirm the Blind Date arrangement.'
      );
    }

    setSelectedBooking(null);
    await loadBookings();
  } catch (error: any) {
    console.error('Confirm arrangement failed:', error);
    alert(error?.message || 'Failed to confirm arrangement.');
  }
};

  // Handle refund
  // Kept as a local UI update because this component does not currently
  // have a verified admin refund Edge Function in the provided source.
  const handleRefund = (bookingId: string, reason: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              status: 'refunded',
              payment_status: 'refunded',
              flags: [],
              audit_log: [
                ...(b.audit_log || []),
                {
                  timestamp: new Date().toISOString(),
                  action: `Refund Issued - ${reason.replace(/_/g, ' ')}`,
                  admin: 'Admin',
                },
              ],
            }
          : b
      )
    );
    setSelectedBooking(null);
  };

  // Get row color
  const getRowBorderColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'holding':
        return 'border-l-4 border-yellow-500';
      case 'confirmed':
        return 'border-l-4 border-green-500';
      case 'refunded':
      case 'cancelled':
        return 'border-l-4 border-orange-500';
      default:
        return 'border-l-4 border-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading operations dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-30 shadow-2xl">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl text-white mb-2" style={{ fontWeight: 700 }}>
                Blind Date Operations
              </h1>
              <p className="text-sm text-gray-400">Manage logistics for surprise date bookings</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Realtime indicator */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30">
                <Zap className="w-4 h-4 text-green-400 animate-pulse" />
                <span
  className={`text-sm ${
    realtimeConnected ? 'text-green-300' : 'text-yellow-300'
  }`}
  style={{ fontWeight: 600 }}
>
  {realtimeConnected ? 'Realtime Active' : 'Connecting...'}
</span>

              </div>
              {/* Budget Control */}
              <BudgetControlDropdown
                isOpen={budgetDropdownOpen}
                onToggle={() => setBudgetDropdownOpen(!budgetDropdownOpen)}
                totalBookings={bookings.length}
                totalRevenue={bookings
                  .filter(b => b.payment_status === 'paid')
                  .reduce((sum, b) => sum + Number(b.amount || 0), 0)}
                refundPercentage={stats.refundRate}
              />
              {/* Refresh button */}
              <button
                onClick={loadBookings}
                className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Refresh Blind Date data"
              >
                <RefreshCw className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-8 space-y-6">
       
        {/* Stats Row 1 */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  <MetricCard
    label="Holding"
    value={stats.holding}
    icon={Circle}
    color="bg-yellow-500"
  />

  <MetricCard
    label="Confirmed"
    value={stats.confirmed}
    icon={CheckCircle2}
    color="bg-green-500"
  />

  <MetricCard
    label="Completed"
    value={stats.completed}
    icon={Users}
    color="bg-gray-500"
  />

  <MetricCard
    label="Refunded"
    value={stats.refunded}
    icon={XCircle}
    color="bg-orange-500"
  />
</div>


        {/* Stats Row 2 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Revenue Today"
            value={`₹${stats.revenueToday.toLocaleString()}`}
            icon={DollarSign}
            color="bg-green-500"
          />
          <MetricCard
            label="Revenue This Month"
            value={`₹${stats.revenueMonth.toLocaleString()}`}
            icon={TrendingUp}
            color="bg-blue-500"
          />
          <MetricCard label="Avg Arrangement Time" value={stats.avgArrangeTime} icon={Timer} color="bg-indigo-500" />
          <MetricCard
            label="Refund Rate"
            value={`${stats.refundRate}%`}
            icon={AlertTriangle}
            color="bg-orange-500"
          />
        </div>

        {/* Search + Filter Bar */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search booking ID or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-500"
              />
            </div>
              {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-700 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer"
                style={{ fontWeight: 500 }}
              >
                <option>All</option>
                <option>Pending</option>
                <option>Holding</option>
                <option>Confirmed</option>
                <option>Completed</option>
                <option>Cancelled</option>
                <option>Refunded</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
            {/* Risk Filter */}
            <div className="relative">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-700 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer"
                style={{ fontWeight: 500 }}
              >
                <option>All</option>
                <option>Delayed</option>
                <option>Refund Candidate</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
   </div>

            {/* Bookings Table */}
<div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-900/90 border-b border-gray-800">
        <tr>
          <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
            Booking ID
          </th>
          <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
            User
          </th>
          <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
            Preferred Areas
          </th>
          <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
            Availability
          </th>
          <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
            Payment
          </th>
          <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
            Created
          </th>
          <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider w-20">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-800">
        {filteredBookings.length === 0 ? (
          <tr>
            <td
              colSpan={8}
              className="px-6 py-16 text-center text-sm text-gray-500"
            >
              No Blind Date bookings found.
            </td>
          </tr>
        ) : (
          filteredBookings.map((booking) => (
          <motion.tr
            key={booking.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className={`${getRowBorderColor(
              booking.status
            )} transition-colors hover:bg-gray-800/50 cursor-pointer`}
            onClick={() => setSelectedBooking(booking)}
          >
            {/* Booking ID */}
            <td className="px-6 py-4">
              <div>
                <span className="text-sm text-white font-semibold">
                  {booking.id}
                </span>

                {booking.flags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {booking.flags.map((flag) => (
                      <FlagBadge key={flag} flag={flag} />
                    ))}
                  </div>
                )}
              </div>
            </td>

            {/* User */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <img
                  src={booking.user_avatar}
                  alt={booking.user_name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                />
                <div>
                  <p className="text-sm text-white font-semibold">
                    {booking.user_name}
                  </p>
                  <p className="text-xs text-gray-500">{booking.user_id}</p>
                </div>
              </div>
            </td>

            {/* Preferred Areas */}
            <td className="px-6 py-4">
              <p className="text-sm text-gray-300">
                {(booking.preferences?.areas ?? []).join(', ')}
              </p>
            </td>

            {/* Availability */}
            <td className="px-6 py-4">
              <p className="text-xs text-gray-400 mb-1">
                {booking.preferences?.date_range || 'N/A'}
              </p>
              <p className="text-xs text-gray-500">
                {(booking.preferences?.time_windows ?? []).join(', ')}
              </p>
            </td>

            {/* Payment */}
            <td className="px-6 py-4">
              <StatusBadge status={booking.payment_status} />
            </td>

            {/* Status */}
            <td className="px-6 py-4">
              <StatusBadge status={booking.status} />
            </td>

            {/* Created */}
            <td className="px-6 py-4">
              <p className="text-xs text-gray-500">
                {booking.created_at ? new Date(booking.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                }) : 'N/A'}
              </p>
            </td>

            {/* Actions */}
            <td className="px-6 py-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBooking(booking);
                }}
                className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <Eye className="w-5 h-5 text-gray-400" />
              </button>
            </td>
          </motion.tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>

          
      {/* Booking Action Drawer */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <BookingActionDrawer
              booking={selectedBooking}
              onClose={() => setSelectedBooking(null)}
              onConfirm={(data) => handleConfirmArrangement(selectedBooking.id, data)}
              onRefund={(reason) => handleRefund(selectedBooking.id, reason)}
            />
          </>
        )}
      </AnimatePresence>
        </div>
      );
}
