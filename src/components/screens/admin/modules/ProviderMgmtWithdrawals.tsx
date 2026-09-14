import React, { useEffect, useState } from "react";
import { Clock, CheckCircle, AlertCircle, Wallet, Eye, Check, X } from 'lucide-react';
import { supabase } from "../../../../supabase";
type Status = 'Pending' | 'Approved' | 'Rejected' | 'Paid';

interface Withdrawal {
  paymentMethod: any;
  availableBalance(availableBalance: any): unknown;
  bankAccount: string;
  id: string;
  providerId: string;
  providerName: string;
  method: string;
  amount: string;
  balance: string;
  requestDate: string;
  status: Status;
  bank: string;
  upi: string;
  phone: string;
  totalEarned: string;
  totalWithdrawn: string;
  pendingBalance: string;
  processingDate: string;
  txnId: string;
}



function statusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";

    case "approved":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

    case "paid":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    case "rejected":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";

    default:
      return "bg-gray-100 text-gray-700";
  }

}

export function ProviderMgmtWithdrawals() {
  
  const [detail, setDetail] = useState<Withdrawal | null>(null);
  const [notes, setNotes] = useState('');
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

const loadWithdrawals = async () => {
  try {
    setLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin_get_provider_withdrawals`,
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

    console.log("WITHDRAWALS", data);

    if (data.success) {
      setWithdrawals(data.withdrawals);
      setKpis(data.kpis);
    }

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadWithdrawals();
}, []);

if (loading) {
  return (
    <div className="p-10 text-center">
      Loading withdrawals...
    </div>
  );
}
 const updateWithdrawal = async (
  withdrawalId: string,
  action: "approve" | "reject"
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin_update_provider_withdrawal`,
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
          withdrawalId,
          action,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      await loadWithdrawals();
      setDetail(null);
    } else {
      alert(data.error || "Operation failed");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
};

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Withdrawals</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Manage provider withdrawal requests and payouts</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
  {
    label: "Pending Withdrawals",
    value: kpis?.pendingWithdrawals ?? 0,
    icon: Clock,
    color: "yellow",
  },
  {
    label: "Approved Withdrawals",
    value: kpis?.approvedWithdrawals ?? 0,
    icon: CheckCircle,
    color: "green",
  },
  {
    label: "Pending Amount",
    value: `₹${Number(kpis?.totalPendingAmount || 0).toFixed(2)}`,
    icon: AlertCircle,
    color: "orange",
  },
  {
    label: "Total Withdrawn",
    value: `₹${Number(kpis?.totalWithdrawn || 0).toFixed(2)}`,
    icon: Wallet,
    color: "blue",
  },
].map(k => {
          const Icon = k.icon;
          const bg = { yellow: 'bg-yellow-50 dark:bg-yellow-500/10', green: 'bg-green-50 dark:bg-green-500/10', orange: 'bg-orange-50 dark:bg-orange-500/10', blue: 'bg-blue-50 dark:bg-blue-500/10' }[k.color];
          const ic = { yellow: 'text-yellow-600 dark:text-yellow-400', green: 'text-green-600 dark:text-green-400', orange: 'text-orange-600 dark:text-orange-400', blue: 'text-blue-600 dark:text-blue-400' }[k.color];
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

      {/* Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-base text-gray-900 dark:text-white">Withdrawal Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {['Withdrawal ID', 'Provider ID', 'Provider Name', 'Bank / UPI', 'Requested Amount', 'Available Balance', 'Request Date', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap bg-gray-50 dark:bg-gray-900/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {withdrawals.map(w => (
                <tr key={w.id} className="hover:bg-blue-600 dark:hover:bg-gray-900/40 transition-colors">
                  <td className="px-5 py-3.5 text-blue-600 dark:text-blue-400 font-mono text-xs whitespace-nowrap">{w.id}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 font-mono text-xs whitespace-nowrap">{w.providerId}</td>
                  <td className="px-5 py-3.5 text-gray-900 dark:text-white whitespace-nowrap">{w.providerName}</td>
                 <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">
  {w.paymentMethod === "upi"
  ? "UPI"
  : w.paymentMethod === "bank"
  ? "Bank Transfer"
  : "-"}
</td>
                  <td className="px-5 py-3.5 text-green-600 dark:text-green-400 whitespace-nowrap">₹{Number(w.amount).toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">₹{Number(w.availableBalance).toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap">{new Date(w.requestDate).toLocaleString()}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded ${statusBadge(w.status)}`}>{w.status}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {w.status === "pending" && (
                        <>
                          <button onClick={() => updateWithdrawal(w.id, "approve")} className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded hover:bg-green-100 transition-colors">
                            <Check className="w-3 h-3" /> Approve
                          </button>
                          <button onClick={() => updateWithdrawal(w.id, "reject")} className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded hover:bg-red-100 transition-colors">
                            <X className="w-3 h-3" /> Reject
                          </button>
                        </>
                      )}
                      <button onClick={() => { setDetail(w); setNotes(''); }} className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 transition-colors">
                        <Eye className="w-3 h-3" /> Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      {detail && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setDetail(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-[#1A1F2E] border-l border-gray-200 dark:border-gray-800 z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg text-gray-900 dark:text-white">Withdrawal Details</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{detail.id}</p>
              </div>
              <button onClick={() => setDetail(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Provider Info */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 space-y-3">
                <h4 className="text-sm text-gray-900 dark:text-white mb-3">Provider Information</h4>
                {[
                  ['Provider Name', detail.providerName],
                  ['Provider ID', detail.providerId],
                  ['Contact Number', detail.phone],
                  ['Bank Account', detail.bankAccount || "-"],
                  ['UPI ID', detail.upi || "-"],,
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{label}</span>
                    <span className="text-gray-900 dark:text-white">{val}</span>
                  </div>
                ))}
              </div>
              {/* Wallet Summary */}
              <div className="grid grid-cols-2 gap-3">
                {[
  {
    label: "Total Earnings",
    value: `₹${Number(detail.totalEarned).toFixed(2)}`,
    color: "text-green-600 dark:text-green-400",
  },
  {
    label: "Total Withdrawn",
    value: `₹${Number(detail.totalWithdrawn).toFixed(2)}`,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Available Balance",
    value: `₹${Number(detail.availableBalance).toFixed(2)}`,
    color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    label: "Pending Balance",
    value: `₹${Number(detail.pendingBalance).toFixed(2)}`,
    color: "text-yellow-600 dark:text-yellow-400",
  },
].map(item => (
                  <div key={item.label} className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <p className={`text-base ${item.color}`}>{item.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
              {/* Withdrawal Info */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-5 space-y-3">
                <h4 className="text-sm text-gray-900 dark:text-white mb-3">Withdrawal Information</h4>
                {[
                 ['Withdrawal Amount', `₹${Number(detail.amount).toFixed(2)}`],
                  ['Request Date', new Date(detail.requestDate).toLocaleString()],
                  ['Processing Date', detail.processingDate],
                  ['Transaction ID', detail.txnId],
                  ['Payment Method', detail.paymentMethod?.toUpperCase()],
                  ['Status', detail.status],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{label}</span>
                    <span className={`text-gray-900 dark:text-white ${label === 'Status' ? statusBadge(detail.status) + ' text-xs px-2 py-0.5 rounded' : ''}`}>{val}</span>
                  </div>
                ))}
              </div>
              {/* Admin Notes */}
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Admin Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Add internal notes..."
                  className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Action Buttons */}
              {detail.status === 'Pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
  updateWithdrawal(detail.id, "approve");
}}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <Check className="w-4 h-4" /> Approve Withdrawal
                  </button>
                  <button
                    onClick={() => { updateWithdrawal(detail.id, "reject"); setDetail(null); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" /> Reject Withdrawal
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
