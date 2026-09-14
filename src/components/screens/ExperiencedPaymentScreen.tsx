import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  Lock,
  GraduationCap,
  Calendar,
  Clock,
  DollarSign
} from 'lucide-react';

interface ExperiencedPaymentScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
  bookingDetails?: {
    expert: {
      name: string;
      image: string;
      expertise: string;
      hourlyRate: number;
    };
    slot: {
      date: string;
      time: string;
      price: number;
    };
  };
}

export function ExperiencedPaymentScreen({ 
  onNavigate, 
  onBack,
  bookingDetails
}: ExperiencedPaymentScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Default booking details if none provided
  const booking = bookingDetails || {
    expert: {
      name: 'Dr. Arvind Kumar',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      expertise: 'Startup Strategy',
      hourlyRate: 5000
    },
    slot: {
      date: '2024-12-24',
      time: '10:00 AM',
      price: 5000
    }
  };

  const sessionFee = booking.slot.price;
  const platformFee = sessionFee * 0.15;
  const totalAmount = sessionFee + platformFee;

  const handlePayment = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onNavigate('experienced-booking-confirmation');
    }, 2000);
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
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass dark:glass-dark border-b border-white/20 dark:border-gray-800/50 backdrop-blur-xl"
      >
        <div className="max-w-5xl mx-auto px-4 py-6">
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2>Complete Payment</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Session with {booking.expert.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Payment Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Payment Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border border-orange-200 dark:border-orange-800"
            >
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                <div>
                  <h3 className="mb-2">Expert Session Booking</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Payment is required upfront to confirm your session. The expert will be notified 
                    once payment is successful, and you'll receive confirmation via email.
                  </p>
                </div>
              </div>
              
              <div className="p-3 rounded-xl glass dark:glass-dark backdrop-blur-xl">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Session Fee</span>
                  <span>₹{sessionFee.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Platform Fee (15%)</span>
                  <span>₹{platformFee.toLocaleString()}</span>
                </div>
                <div className="h-px bg-white/20 dark:bg-gray-800/50 my-2"></div>
                <div className="flex items-center justify-between">
                  <span>Total Amount</span>
                  <span className="text-xl text-orange-600 dark:text-orange-400">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>

            {/* Payment Method Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl glass dark:glass-dark backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
            >
              <h2 className="text-xl mb-4">Payment Method</h2>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-orange-500 dark:border-orange-400 bg-orange-500/5 dark:bg-orange-400/5'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <CreditCard className="w-6 h-6 mx-auto mb-2 text-orange-500 dark:text-orange-400" />
                  <p className="text-sm">Card</p>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-orange-500 dark:border-orange-400 bg-orange-500/5 dark:bg-orange-400/5'
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
                      ? 'border-orange-500 dark:border-orange-400 bg-orange-500/5 dark:bg-orange-400/5'
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
                      className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm backdrop-blur-xl"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm backdrop-blur-xl"
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
                        className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm backdrop-blur-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm backdrop-blur-xl"
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
                    className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm backdrop-blur-xl"
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
                  <select className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm backdrop-blur-xl">
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
              className="p-5 rounded-2xl glass dark:glass-dark backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to pay ₹{totalAmount.toLocaleString()} for this expert session. Payment is non-refundable once the session is confirmed. I agree to the Terms of Service and Privacy Policy.
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
                disabled={!isFormValid() || processing}
                className={`w-full py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  isFormValid() && !processing
                    ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:shadow-xl hover:scale-[1.02]'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                }`}
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Pay ₹{totalAmount.toLocaleString()} & Book Session</span>
                  </>
                )}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Secured by 256-bit SSL encryption</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Booking Summary */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 p-6 rounded-2xl glass dark:glass-dark backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
            >
              <h2 className="text-xl mb-4">Booking Summary</h2>
              
              {/* Expert Info */}
              <div className="flex items-center gap-3 p-4 mb-4 rounded-xl glass dark:glass-dark backdrop-blur-xl">
                <img
                  src={booking.expert.image}
                  alt={booking.expert.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <p className="mb-0.5">{booking.expert.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{booking.expert.expertise}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="ml-auto">{booking.slot.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="ml-auto">{booking.slot.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="ml-auto">60 minutes</span>
                </div>
                <div className="h-px bg-white/10 dark:bg-gray-800/50" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Session Fee</span>
                  <span>₹{sessionFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Platform Fee (15%)</span>
                  <span>₹{platformFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-orange-500/5 dark:bg-orange-400/5 border border-orange-500/20 dark:border-orange-400/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Total Amount</span>
                  <span className="text-xl text-orange-600 dark:text-orange-400">₹{totalAmount.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Expert will be notified after payment
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
