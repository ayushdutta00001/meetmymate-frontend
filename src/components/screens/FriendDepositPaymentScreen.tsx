import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CreditCard,
  Shield,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Lock,
  Briefcase,
  ArrowRight
} from 'lucide-react';

interface FriendDepositPaymentScreenProps {
  onBack: () => void;
  onPaymentComplete: () => void;
  depositAmount: number;
}

export function FriendDepositPaymentScreen({ onBack, onPaymentComplete, depositAmount }: FriendDepositPaymentScreenProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | null>(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (selectedPaymentMethod === 'card') {
      if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
        alert('Please fill in all card details');
        return;
      }
    }

    if (selectedPaymentMethod === 'upi') {
      if (!upiId) {
        alert('Please enter your UPI ID');
        return;
      }
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      alert('✅ Payment Successful!\n\nSecurity deposit of ₹' + depositAmount.toLocaleString() + ' has been received.\n\nTransaction ID: RAF-SD-' + Date.now());
      onPaymentComplete();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass dark:glass-dark border-b border-white/20 dark:border-gray-800/50 backdrop-blur-xl"
      >
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2>Security Deposit Payment</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  One-time refundable deposit
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Amount Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-pink-500/20 bg-pink-500/5 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
              <p className="text-4xl">₹{depositAmount.toLocaleString()}</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="h-px bg-white/20 dark:bg-gray-800/50 mb-4"></div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Security Deposit</p>
              <p>₹{depositAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">Refundable</p>
              <p className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>100%</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Refund Policy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass dark:glass-dark rounded-2xl p-4 backdrop-blur-xl border border-blue-500/20 bg-blue-500/5 mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm mb-1"><strong>Why Security Deposit?</strong></p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                <li>• Ensures commitment and reliability</li>
                <li>• Protects platform and customer safety</li>
                <li>• Full refund after 3 months of good standing</li>
                <li>• Refundable if you decide to leave the platform</li>
                <li>• Instant refund if application is rejected</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Payment Method Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6"
        >
          <h3 className="mb-4">Select Payment Method</h3>

          <div className="space-y-3">
            {/* Credit/Debit Card */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedPaymentMethod('card')}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                selectedPaymentMethod === 'card'
                  ? 'border-pink-500 bg-pink-500/10'
                  : 'border-white/20 dark:border-gray-800/50 glass dark:glass-dark hover:border-pink-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  <div>
                    <p className="text-sm">Credit / Debit Card</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Visa, Mastercard, Rupay</p>
                  </div>
                </div>
                {selectedPaymentMethod === 'card' && (
                  <CheckCircle className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                )}
              </div>
            </motion.button>

            {/* UPI */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedPaymentMethod('upi')}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                selectedPaymentMethod === 'upi'
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-white/20 dark:border-gray-800/50 glass dark:glass-dark hover:border-green-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm">UPI Payment</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Google Pay, PhonePe, Paytm</p>
                  </div>
                </div>
                {selectedPaymentMethod === 'upi' && (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                )}
              </div>
            </motion.button>

            {/* Net Banking */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedPaymentMethod('netbanking')}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                selectedPaymentMethod === 'netbanking'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/20 dark:border-gray-800/50 glass dark:glass-dark hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm">Net Banking</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">All major banks supported</p>
                  </div>
                </div>
                {selectedPaymentMethod === 'netbanking' && (
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Payment Details Form */}
        {selectedPaymentMethod === 'card' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6"
          >
            <h4 className="text-sm mb-4">Card Details</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Card Number</label>
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-pink-500 dark:focus:border-pink-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Cardholder Name</label>
                <input
                  type="text"
                  value={cardDetails.cardName}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                  placeholder="Name on card"
                  className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-pink-500 dark:focus:border-pink-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Expiry Date</label>
                  <input
                    type="text"
                    value={cardDetails.expiryDate}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-pink-500 dark:focus:border-pink-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">CVV</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    placeholder="123"
                    maxLength={3}
                    className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-pink-500 dark:focus:border-pink-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedPaymentMethod === 'upi' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6"
          >
            <h4 className="text-sm mb-4">UPI Details</h4>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-green-500 dark:focus:border-green-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
          </motion.div>
        )}

        {selectedPaymentMethod === 'netbanking' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6"
          >
            <h4 className="text-sm mb-4">Select Your Bank</h4>
            <select className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm">
              <option value="">Choose your bank</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="axis">Axis Bank</option>
              <option value="kotak">Kotak Mahindra Bank</option>
              <option value="pnb">Punjab National Bank</option>
            </select>
          </motion.div>
        )}

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass dark:glass-dark rounded-xl p-4 backdrop-blur-xl border border-green-500/20 bg-green-500/5 mb-6"
        >
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Your payment is secured with 256-bit SSL encryption
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            disabled={processing}
            className="flex-1 py-4 rounded-xl glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={handlePayment}
            disabled={!selectedPaymentMethod || processing}
            className={`flex-1 py-4 rounded-xl text-white hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
              selectedPaymentMethod && !processing
                ? 'bg-gradient-to-r from-pink-500 to-rose-600'
                : 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
            }`}
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Pay ₹{depositAmount.toLocaleString()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
