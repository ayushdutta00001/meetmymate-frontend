import React, { useState } from 'react';
import { Clock, CheckCircle, DollarSign, AlertCircle } from 'lucide-react';

const initialRefunds = [
  { userId: 'U-1058', userName: 'Rohan Mehta', bookingId: 'BK-3004', status: 'Pending', amount: '₹3,000', date: '2026-04-13' },
  { userId: 'U-1083', userName: 'Riya Gupta', bookingId: 'BK-3007', status: 'Approved', amount: '₹900', date: '2026-04-12' },
  { userId: 'U-1091', userName: 'Vikash Roy', bookingId: 'BK-3008', status: 'Pending', amount: '₹1,100', date: '2026-04-11' },
  { userId: 'U-1102', userName: 'Ananya Bose', bookingId: 'BK-3012', status: 'Rejected', amount: '₹2,200', date: '2026-04-10' },
  { userId: 'U-1115', userName: 'Rahul Das', bookingId: 'BK-3015', status: 'Pending', amount: '₹1,800', date: '2026-04-09' },
  { userId: 'U-1128', userName: 'Sonia Verma', bookingId: 'BK-3019', status: 'Approved', amount: '₹2,500', date: '2026-04-08' },
  { userId: 'U-1134', userName: 'Tarun Kapoor', bookingId: 'BK-3022', status: 'Pending', amount: '₹700', date: '2026-04-07' },
];

function statusClass(s: string) {
  if (s === 'Approved') return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
  if (s === 'Pending') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
  if (s === 'Rejected') return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
  return 'bg-gray-100 text-gray-600';
}

export function RafRefunds() {
  const [refunds, setRefunds] = useState(initialRefunds.map(r => ({ ...r })));

  const approve = (i: number) => setRefunds(p => p.map((r, j) => j === i ? { ...r, status: 'Approved' } : r));
  const reject = (i: number) => setRefunds(p => p.map((r, j) => j === i ? { ...r, status: 'Rejected' } : r));

  const pending = refunds.filter(r => r.status === 'Pending').length;
  const approved = refunds.filter(r => r.status === 'Approved').length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Refunds</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Review and process refund requests</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="w-12 h-12 rounded-lg bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl text-gray-900 dark:text-white mb-1">{pending}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending Refunds</p>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl text-gray-900 dark:text-white mb-1">{approved}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Approved Refunds</p>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-2xl text-gray-900 dark:text-white mb-1">₹5,600</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending Refund Amount</p>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl text-gray-900 dark:text-white mb-1">₹3,400</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Approved Refund Amount</p>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-base text-gray-900 dark:text-white">Refund Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {['User ID', 'User Name', 'Booking ID', 'Status', 'Refund Amount', 'Request Date', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-900/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {refunds.map((r, i) => (
                <tr key={i} className="hover:bg-blue-600 dark:hover:bg-gray-900/40 transition-colors">
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs whitespace-nowrap">{r.userId}</td>
                  <td className="px-5 py-4 text-gray-900 dark:text-white whitespace-nowrap">{r.userName}</td>
                  <td className="px-5 py-4 text-blue-600 dark:text-blue-400 font-mono text-xs whitespace-nowrap">{r.bookingId}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded ${statusClass(r.status)}`}>{r.status}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-900 dark:text-white whitespace-nowrap">{r.amount}</td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{r.date}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {r.status === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => approve(i)}
                          className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => reject(i)}
                          className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
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
