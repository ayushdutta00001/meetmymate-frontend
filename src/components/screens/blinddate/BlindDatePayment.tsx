import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Shield, AlertCircle, ArrowLeft, Check } from 'lucide-react';

interface BlindDatePaymentProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDatePayment({ onNavigate, onBack }: BlindDatePaymentProps) {
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [upiId, setUpiId] = useState('');

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
      setTimeout(() => {
        onNavigate('blind-date-dashboard');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              disabled={processing}
              className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2>Booking Payment</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Complete your blind date booking</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {completed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mb-2 text-green-600 dark:text-green-400">Payment Successful</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Redirecting to your dashboard...
            </p>
          </motion.div>
        ) : (
          <>
            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 p-6 rounded-xl bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-900/30"
            >
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                <div>
                  <h4 className="mb-2 text-amber-900 dark:text-amber-400">
                    This Payment Covers Meeting Arrangement
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-500 mb-3">
                    This payment is for arranging a public meeting. It does not guarantee a match, connection, or relationship outcome.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Booking Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 p-6 rounded-xl border border-gray-200 dark:border-gray-800"
            >
              <h4 className="mb-4">Booking Summary</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Service</span>
                  <span>Blind Date Meeting Arrangement</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Booking Fee</span>
                  <span>₹999</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Platform Fee</span>
                  <span>₹99</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-gray-300 dark:border-gray-700">
                  <span>Total Amount</span>
                  <span className="text-blue-600 dark:text-blue-400">₹1,098</span>
                </div>
              </div>
            </motion.div>

            {/* Refund Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 p-6 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
            >
              <h4 className="mb-4">Refund Policy</h4>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="mb-1">Full refund if no match is found</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      If we cannot arrange a compatible match within 7 days
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="mb-1">Full refund if system cancels</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      If we cancel due to technical or safety reasons
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="mb-1">No refund after match confirmation</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Once both parties confirm, payment is non-refundable
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="mb-1">No refund for meeting day cancellations</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Cancelling on the day of the meeting is non-refundable
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 p-6 rounded-xl border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h4>Payment Method</h4>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  disabled={processing}
                  className={`py-3 rounded-lg border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  💳 Credit/Debit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('upi')}
                  disabled={processing}
                  className={`py-3 rounded-lg border-2 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  📱 UPI
                </button>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      disabled={processing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        disabled={processing}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        disabled={processing}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      disabled={processing}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-900"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Enter your UPI ID (e.g., yourname@paytm, yourname@googlepay)
                    </p>
                  </div>
                  
                  {/* Popular UPI Apps */}
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-sm mb-3 text-gray-700 dark:text-gray-300">Or pay with</p>
                    <div className="grid grid-cols-4 gap-3">
                      {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                        <button
                          key={app}
                          disabled={processing}
                          className="py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-600 transition-all text-xs"
                        >
                          {app}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Agreement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <label className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-600 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  disabled={processing}
                  className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I understand and accept the refund policy. I confirm this payment is for meeting arrangement 
                  and does not guarantee compatibility, connection, or relationship outcomes.
                </span>
              </label>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <Shield className="w-4 h-4" />
              <span>Secure payment powered by Stripe</span>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <button
                onClick={handlePayment}
                disabled={!agreed || processing}
                className={`w-full py-4 rounded-xl transition-all flex items-center justify-center gap-3 ${
                  agreed && !processing
                    ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }`}
              >
                {processing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Confirm & Pay ₹1,098</span>
                  </>
                )}
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}