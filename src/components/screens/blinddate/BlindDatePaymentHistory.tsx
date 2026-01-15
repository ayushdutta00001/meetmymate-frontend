import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Receipt, CheckCircle, XCircle, Clock, Download } from 'lucide-react';

interface BlindDatePaymentHistoryProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDatePaymentHistory({ onNavigate, onBack }: BlindDatePaymentHistoryProps) {
  const payments = [
    {
      id: 'BD-PAY-001',
      date: 'December 23, 2024',
      amount: 1098,
      status: 'completed',
      bookingId: 'BD-2024-12-23-4892',
      paymentMethod: 'UPI',
      description: 'Blind Date Meeting Arrangement',
    },
    {
      id: 'BD-PAY-002',
      date: 'November 15, 2024',
      amount: 1098,
      status: 'refunded',
      bookingId: 'BD-2024-11-15-3421',
      paymentMethod: 'Card',
      description: 'Blind Date Meeting Arrangement',
      refundReason: 'No match found',
    },
    {
      id: 'BD-PAY-003',
      date: 'October 8, 2024',
      amount: 1098,
      status: 'completed',
      bookingId: 'BD-2024-10-08-2109',
      paymentMethod: 'UPI',
      description: 'Blind Date Meeting Arrangement',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2>Payment History</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All your blind date transactions
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl border border-gray-200 dark:border-gray-800"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Spent</p>
            <p className="text-2xl">₹3,294</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 rounded-xl border border-gray-200 dark:border-gray-800"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Completed</p>
            <p className="text-2xl text-green-600 dark:text-green-400">2</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl border border-gray-200 dark:border-gray-800"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Refunded</p>
            <p className="text-2xl text-amber-600 dark:text-amber-400">1</p>
          </motion.div>
        </div>

        {/* Payment List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="mb-4">Transaction History</h3>
          {payments.map((payment, i) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    payment.status === 'completed' 
                      ? 'bg-green-50 dark:bg-green-900/20' 
                      : payment.status === 'refunded'
                      ? 'bg-amber-50 dark:bg-amber-900/20'
                      : 'bg-gray-50 dark:bg-gray-900/50'
                  }`}>
                    {payment.status === 'completed' && (
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    )}
                    {payment.status === 'refunded' && (
                      <XCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    )}
                    {payment.status === 'pending' && (
                      <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4>{payment.description}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        payment.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : payment.status === 'refunded'
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{payment.date}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>ID: {payment.id}</span>
                      <span>•</span>
                      <span>Booking: {payment.bookingId}</span>
                      <span>•</span>
                      <span>{payment.paymentMethod}</span>
                    </div>
                    {payment.refundReason && (
                      <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                        Refund reason: {payment.refundReason}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl mb-2">₹{payment.amount.toLocaleString()}</p>
                  <button className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    <Download className="w-4 h-4" />
                    Invoice
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State (if no payments) */}
        {payments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-gray-700 dark:text-gray-300">No Payments Yet</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your payment history will appear here
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
