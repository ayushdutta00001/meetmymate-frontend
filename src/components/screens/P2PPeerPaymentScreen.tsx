import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CreditCard, Shield, Users, CheckCircle, AlertCircle, Lock } from 'lucide-react';

interface P2PPeerPaymentScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function P2PPeerPaymentScreen({ onNavigate, onBack }: P2PPeerPaymentScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [agreed, setAgreed] = useState(false);

  const meetingDetails = {
    peer: {
      name: 'Rajesh Kumar',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      role: 'Technical Co-Founder'
    },
    purpose: 'Co-Founder Partnership',
    meetingType: 'online',
    amount: 1499,
    peerAmount: 1499
  };

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      onNavigate('p2p-meeting-confirmation');
    }, 1000);
  };

  const isFormValid = () => {
    if (!agreed) return false;
    
    if (paymentMethod === 'card') {
      return cardDetails.number && cardDetails.name && cardDetails.expiry && cardDetails.cvv;
    } else if (paymentMethod === 'upi') {
      return upiId;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-8 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-[#0A0F1F]/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#3C82F6] dark:hover:text-[#3758FF] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 mb-4">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Request Accepted</span>
          </div>
          <h1 className="text-2xl md:text-3xl mb-3">Confirm Your Payment</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete payment to schedule your meeting
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Payment Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Equal Payment Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-start gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="mb-2">Equal Payment System</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Both you and {meetingDetails.peer.name} pay ₹{meetingDetails.amount.toLocaleString()} each. 
                    The meeting will be scheduled only after both payments are confirmed.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white dark:bg-[#1a1f35]">
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Your Payment</p>
                  <p className="text-lg text-[#3C82F6] dark:text-[#3758FF]">₹{meetingDetails.amount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#1a1f35]">
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Peer's Payment</p>
                  <p className="text-lg text-[#3C82F6] dark:text-[#3758FF]">₹{meetingDetails.peerAmount.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>

            {/* Payment Method Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
            >
              <h2 className="text-xl mb-4">Payment Method</h2>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#3C82F6] dark:border-[#3758FF] bg-[#3C82F6]/5 dark:bg-[#3758FF]/5'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <CreditCard className="w-6 h-6 mx-auto mb-2 text-[#3C82F6] dark:text-[#3758FF]" />
                  <p className="text-sm">Card</p>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#3C82F6] dark:border-[#3758FF] bg-[#3C82F6]/5 dark:bg-[#3758FF]/5'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">📱</div>
                  <p className="text-sm">UPI</p>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#3C82F6] dark:border-[#3758FF] bg-[#3C82F6]/5 dark:bg-[#3758FF]/5'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">🏦</div>
                  <p className="text-sm">Banking</p>
                </button>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF]"
                  />
                </motion.div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'netbanking' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">Select Bank</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF]">
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </motion.div>
              )}
            </motion.div>

            {/* Terms Agreement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#3C82F6] focus:ring-[#3C82F6]"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I understand that this is a paid peer conversation with no guaranteed outcomes. Payment is non-refundable once both parties confirm. I agree to the Terms of Service and Privacy Policy.
                </span>
              </label>
            </motion.div>

            {/* Pay Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={handlePayment}
                disabled={!isFormValid()}
                className={`w-full py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  isFormValid()
                    ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] dark:from-[#3758FF] dark:to-[#3C82F6] text-white hover:shadow-xl hover:scale-[1.02]'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Lock className="w-5 h-5" />
                <span>Pay ₹{meetingDetails.amount.toLocaleString()} & Confirm</span>
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Secured by 256-bit SSL encryption</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Meeting Summary */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
            >
              <h2 className="text-xl mb-4">Meeting Summary</h2>
              
              {/* Peer Info */}
              <div className="flex items-center gap-3 p-4 mb-4 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F]">
                <img
                  src={meetingDetails.peer.image}
                  alt={meetingDetails.peer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="mb-0.5">{meetingDetails.peer.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{meetingDetails.peer.role}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Purpose</span>
                  <span>{meetingDetails.purpose}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Format</span>
                  <span className="capitalize">{meetingDetails.meetingType}</span>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-800" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Your Payment</span>
                  <span>₹{meetingDetails.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Peer's Payment</span>
                  <span>₹{meetingDetails.peerAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#3C82F6]/5 dark:bg-[#3758FF]/5 border border-[#3C82F6]/20 dark:border-[#3758FF]/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Total Amount</span>
                  <span className="text-xl text-[#3C82F6] dark:text-[#3758FF]">₹{meetingDetails.amount.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Meeting scheduled after both payments
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
