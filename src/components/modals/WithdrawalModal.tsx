import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Wallet,
  CreditCard,
  Building2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Landmark,
  Shield
} from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableAmount: number;
  onWithdraw: (amount: number, method: string) => void;
}

export function WithdrawalModal({ isOpen, onClose, availableAmount, onWithdraw }: WithdrawalModalProps) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'upi' | ''>('');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '****1234',
    ifscCode: 'SBIN0001234',
    accountHolderName: 'Priya Sharma',
    bankName: 'State Bank of India'
  });
  const [upiId, setUpiId] = useState('priya@paytm');
  const [step, setStep] = useState<'amount' | 'method' | 'confirm' | 'success'>('amount');

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > 0 && withdrawAmount <= availableAmount) {
      onWithdraw(withdrawAmount, selectedMethod);
      setStep('success');
      setTimeout(() => {
        onClose();
        resetForm();
      }, 3000);
    }
  };

  const resetForm = () => {
    setAmount('');
    setSelectedMethod('');
    setStep('amount');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="mb-0">Withdraw Earnings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available: ₹{availableAmount.toLocaleString()}</p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="w-8 h-8 rounded-lg glass dark:glass-dark flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Step 1: Enter Amount */}
            {step === 'amount' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6">
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                    Withdrawal Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="100"
                      max={availableAmount}
                      className="w-full pl-10 pr-4 py-4 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-green-500 dark:focus:border-green-400 transition-all outline-none text-xl"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">Minimum: ₹100</p>
                    <button
                      onClick={() => setAmount(availableAmount.toString())}
                      className="text-xs text-green-600 dark:text-green-400 hover:underline"
                    >
                      Withdraw All
                    </button>
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {[1000, 5000, 10000, 20000].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(Math.min(quickAmount, availableAmount).toString())}
                      disabled={quickAmount > availableAmount}
                      className={`py-2 px-3 rounded-lg text-sm transition-all ${
                        quickAmount <= availableAmount
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      ₹{(quickAmount / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>

                {/* Info */}
                <div className="p-4 rounded-xl glass dark:glass-dark bg-blue-500/5 border border-blue-500/20 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm mb-1"><strong>Withdrawal Information</strong></p>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Processing time: 1-2 business days</li>
                        <li>• No withdrawal fees</li>
                        <li>• Minimum withdrawal amount: ₹100</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const withdrawAmount = parseFloat(amount);
                    if (withdrawAmount >= 100 && withdrawAmount <= availableAmount) {
                      setStep('method');
                    } else {
                      alert('Please enter a valid amount between ₹100 and ₹' + availableAmount.toLocaleString());
                    }
                  }}
                  disabled={!amount || parseFloat(amount) < 100 || parseFloat(amount) > availableAmount}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Select Method */}
            {step === 'method' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6">
                  <h4 className="text-sm mb-4">Select Withdrawal Method</h4>

                  {/* Bank Transfer */}
                  <button
                    onClick={() => setSelectedMethod('bank')}
                    className={`w-full p-4 rounded-xl mb-3 transition-all text-left ${
                      selectedMethod === 'bank'
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                        : 'glass dark:glass-dark border-2 border-transparent hover:border-green-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <Landmark className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm">Bank Transfer</p>
                          <p className="text-xs text-gray-500">{bankDetails.bankName}</p>
                        </div>
                      </div>
                      {selectedMethod === 'bank' && (
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div className="pl-13 text-xs text-gray-600 dark:text-gray-400">
                      A/C: {bankDetails.accountNumber} • {bankDetails.ifscCode}
                    </div>
                  </button>

                  {/* UPI */}
                  <button
                    onClick={() => setSelectedMethod('upi')}
                    className={`w-full p-4 rounded-xl transition-all text-left ${
                      selectedMethod === 'upi'
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                        : 'glass dark:glass-dark border-2 border-transparent hover:border-green-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm">UPI Transfer</p>
                          <p className="text-xs text-gray-500">Instant transfer</p>
                        </div>
                      </div>
                      {selectedMethod === 'upi' && (
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div className="pl-13 text-xs text-gray-600 dark:text-gray-400">
                      UPI ID: {upiId}
                    </div>
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('amount')}
                    className="flex-1 py-3 rounded-xl glass dark:glass-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep('confirm')}
                    disabled={!selectedMethod}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirm */}
            {step === 'confirm' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-6">
                  <h4 className="text-sm mb-4">Confirm Withdrawal</h4>

                  <div className="space-y-3 mb-6">
                    <div className="p-4 rounded-xl glass dark:glass-dark">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                        <span className="text-xl">₹{parseFloat(amount).toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Method</span>
                        <span>{selectedMethod === 'bank' ? 'Bank Transfer' : 'UPI Transfer'}</span>
                      </div>
                    </div>

                    {selectedMethod === 'bank' && (
                      <div className="p-4 rounded-xl glass dark:glass-dark">
                        <div className="flex items-center gap-2 mb-2">
                          <Landmark className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm">Bank Details</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-6">
                          <p>{bankDetails.accountHolderName}</p>
                          <p>A/C: {bankDetails.accountNumber}</p>
                          <p>IFSC: {bankDetails.ifscCode}</p>
                          <p>{bankDetails.bankName}</p>
                        </div>
                      </div>
                    )}

                    {selectedMethod === 'upi' && (
                      <div className="p-4 rounded-xl glass dark:glass-dark">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm">UPI Details</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 ml-6">
                          <p>UPI ID: {upiId}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl glass dark:glass-dark bg-yellow-500/5 border border-yellow-500/20 mb-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm mb-1"><strong>Processing Time</strong></p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Your withdrawal will be processed within 1-2 business days. You'll receive a confirmation email once the transfer is completed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('method')}
                    className="flex-1 py-3 rounded-xl glass dark:glass-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleWithdraw}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Confirm Withdrawal</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="mb-2">Withdrawal Requested!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Your withdrawal of ₹{parseFloat(amount).toLocaleString()} has been submitted successfully.
                </p>
                <p className="text-xs text-gray-500">
                  Processing will complete in 1-2 business days
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
