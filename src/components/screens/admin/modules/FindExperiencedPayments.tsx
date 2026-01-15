import React from 'react';
import { Download, AlertCircle } from 'lucide-react';

export function FindExperiencedPayments() {
  const handleExport = () => {
    const blob = new Blob(['Expert Consultation Payouts CSV Data'], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expert-payouts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <h1 className="text-2xl text-gray-900 dark:text-white">Find Experienced People — Payments & Finance</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Expert consultation fee management</p>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Total Revenue', value: '₹1.8M', color: 'green' },
            { label: 'Pending Payouts', value: '₹240K', color: 'yellow' },
            { label: 'Platform Commission', value: '₹216K', color: 'purple' },
            { label: 'Avg Session Fee', value: '₹9,500', color: 'blue' },
          ].map((metric, idx) => (
            <div key={idx} className={`bg-white dark:bg-[#1A1F2E] border-l-4 border-${metric.color}-500 p-4 rounded-lg`}>
              <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
              <p className="text-2xl text-gray-900 dark:text-white mt-1">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-300 dark:border-orange-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <p className="text-sm text-gray-900 dark:text-white">
              <strong>Manual Approval Required</strong> — All expert consultation payouts require manual review.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-900 dark:text-white">Payout Requests</h2>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">No pending payout requests at this time.</p>
        </div>
      </div>
    </div>
  );
}
