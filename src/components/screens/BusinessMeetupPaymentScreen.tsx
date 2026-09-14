import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  Lock,
  Crown,
  Gem,
  Diamond,
  Users,
  Award,
  TrendingUp,
  Calendar,
  Infinity
} from 'lucide-react';

interface BusinessMeetupPaymentScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
  selectedPackage?: {
    tier: string;
    duration: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    p2pRequests: number | 'unlimited';
    experiencedRequests: number | 'unlimited';
    investorRequests: number | 'unlimited';
    features: string[];
  };
  onSubscriptionComplete?: (subscriptionData: any) => void;
}

export function BusinessMeetupPaymentScreen({ 
  onNavigate, 
  onBack,
  selectedPackage,
  onSubscriptionComplete
}: BusinessMeetupPaymentScreenProps) {
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
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Default package if none selected
  const packageDetails = selectedPackage || {
    tier: 'Gold',
    duration: '1M',
    price: 2999,
    p2pRequests: 5,
    experiencedRequests: 8,
    investorRequests: 3,
    features: ['5% booking discount', 'Standard support', 'Email notifications', 'Basic analytics']
  };

  const getTierIcon = () => {
    switch (packageDetails.tier) {
      case 'Gold':
        return Crown;
      case 'Platinum':
        return Gem;
      case 'Diamond':
        return Diamond;
      default:
        return Crown;
    }
  };

  const getTierGradient = () => {
    switch (packageDetails.tier) {
      case 'Gold':
        return 'from-yellow-400 via-yellow-500 to-orange-500';
      case 'Platinum':
        return 'from-gray-300 via-gray-400 to-gray-500';
      case 'Diamond':
        return 'from-cyan-400 via-blue-500 to-purple-600';
      default:
        return 'from-yellow-400 via-yellow-500 to-orange-500';
    }
  };

  const handlePayment = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
      
      if (onSubscriptionComplete) {
        // Calculate expiry date
        const expiryDate = new Date();
        const duration = packageDetails.duration;
        if (duration.includes('M')) {
          const months = parseInt(duration);
          expiryDate.setMonth(expiryDate.getMonth() + months);
        } else if (duration.includes('Y')) {
          const years = parseInt(duration);
          expiryDate.setFullYear(expiryDate.getFullYear() + years);
        }
        
        onSubscriptionComplete({
          tier: packageDetails.tier,
          duration: packageDetails.duration,
          expiryDate,
          p2pRequestsRemaining: packageDetails.p2pRequests,
          experiencedRequestsRemaining: packageDetails.experiencedRequests,
          investorRequestsRemaining: packageDetails.investorRequests
        });
      }
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

  const TierIcon = getTierIcon();

  // Success Screen
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="max-w-md w-full"
        >
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl glass dark:glass-dark border border-white/20 dark:border-gray-800/50 p-8 text-center">
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-2xl md:text-3xl mb-3">Subscription Activated! 🎉</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your {packageDetails.tier} plan is now active. Start connecting with business professionals!
              </p>

              {/* Package Summary */}
              <div className="p-5 rounded-2xl glass dark:glass-dark border border-white/10 dark:border-gray-800/30 backdrop-blur-xl mb-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Plan</span>
                    <span className={`flex items-center gap-2 bg-gradient-to-r ${getTierGradient()} bg-clip-text text-transparent`}>
                      <TierIcon className="w-4 h-4" style={{ color: 'inherit' }} />
                      {packageDetails.tier}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-gray-800" />
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">P2P Requests</span>
                    <span className="text-[#3C82F6] dark:text-[#3758FF] flex items-center gap-1">
                      {packageDetails.p2pRequests === 'unlimited' ? (
                        <><Infinity className="w-4 h-4" /> Unlimited</>
                      ) : (
                        `${packageDetails.p2pRequests} available`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Experienced Requests</span>
                    <span className="text-[#3C82F6] dark:text-[#3758FF] flex items-center gap-1">
                      {packageDetails.experiencedRequests === 'unlimited' ? (
                        <><Infinity className="w-4 h-4" /> Unlimited</>
                      ) : (
                        `${packageDetails.experiencedRequests} available`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Investor Requests</span>
                    <span className="text-[#3C82F6] dark:text-[#3758FF] flex items-center gap-1">
                      {packageDetails.investorRequests === 'unlimited' ? (
                        <><Infinity className="w-4 h-4" /> Unlimited</>
                      ) : (
                        `${packageDetails.investorRequests} available`
                      )}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-gray-800" />
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Valid Until</span>
                    <span>
                      {new Date(
                        Date.now() + 
                        (packageDetails.duration.includes('Y') 
                          ? parseInt(packageDetails.duration) * 365 * 24 * 60 * 60 * 1000
                          : parseInt(packageDetails.duration) * 30 * 24 * 60 * 60 * 1000)
                      ).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('business-meetup')}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] dark:from-[#3758FF] dark:to-[#3C82F6] text-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                Start Networking
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="w-full mt-3 py-3 text-gray-600 dark:text-gray-400 hover:text-[#3C82F6] dark:hover:text-[#3758FF] transition-colors"
              >
                Back to Home
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Processing Screen
  if (processing) {
    return (
      <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-[#3C82F6] dark:border-[#3758FF] border-t-transparent"
          />
          <h2 className="text-xl mb-2">Processing Payment...</h2>
          <p className="text-gray-600 dark:text-gray-400">Please wait while we confirm your subscription</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-8 transition-colors duration-300">
      {/* Glassmorphic Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/70 dark:bg-[#0A0F1F]/70 border-b border-white/20 dark:border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#3C82F6] dark:hover:text-[#3758FF] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass dark:glass-dark border border-white/20 dark:border-gray-800/50 backdrop-blur-xl mb-4">
            <Lock className="w-4 h-4 text-[#3C82F6] dark:text-[#3758FF]" />
            <span className="text-sm">Secure Payment</span>
          </div>
          <h1 className="text-2xl md:text-3xl mb-3">Complete Your Subscription</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Subscribe to unlock all Business Meetup features
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Payment Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Payment Method Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl glass dark:glass-dark border border-white/20 dark:border-gray-800/50 backdrop-blur-xl"
            >
              <h2 className="text-xl mb-4">Payment Method</h2>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#3C82F6] dark:border-[#3758FF] glass dark:glass-dark'
                      : 'border-white/20 dark:border-gray-800/30 glass dark:glass-dark hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <CreditCard className="w-6 h-6 mx-auto mb-2 text-[#3C82F6] dark:text-[#3758FF]" />
                  <p className="text-sm">Card</p>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-[#3C82F6] dark:border-[#3758FF] glass dark:glass-dark'
                      : 'border-white/20 dark:border-gray-800/30 glass dark:glass-dark hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">📱</div>
                  <p className="text-sm">UPI</p>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#3C82F6] dark:border-[#3758FF] glass dark:glass-dark'
                      : 'border-white/20 dark:border-gray-800/30 glass dark:glass-dark hover:border-gray-300 dark:hover:border-gray-700'
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
                      maxLength={19}
                      className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border border-white/20 dark:border-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF] backdrop-blur-xl"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border border-white/20 dark:border-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF] backdrop-blur-xl"
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
                        maxLength={5}
                        className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border border-white/20 dark:border-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF] backdrop-blur-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        maxLength={3}
                        className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border border-white/20 dark:border-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF] backdrop-blur-xl"
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
                    className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border border-white/20 dark:border-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF] backdrop-blur-xl"
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
                  <select className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border border-white/20 dark:border-gray-800/50 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF] backdrop-blur-xl">
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
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl glass dark:glass-dark border border-white/20 dark:border-gray-800/50 backdrop-blur-xl"
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#3C82F6] focus:ring-[#3C82F6]"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the subscription terms. The {packageDetails.tier} plan will be valid for {packageDetails.duration.replace('M', ' month(s)').replace('Y', ' year(s)')} with the specified request limits. Unused requests do not carry forward. Payment is non-refundable.
                </span>
              </label>
            </motion.div>

            {/* Pay Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={handlePayment}
                disabled={!isFormValid()}
                className={`w-full py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  isFormValid()
                    ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] dark:from-[#3758FF] dark:to-[#3C82F6] text-white hover:shadow-xl hover:scale-[1.02]'
                    : 'glass dark:glass-dark text-gray-400 cursor-not-allowed border border-white/10 dark:border-gray-800/30'
                }`}
              >
                <Lock className="w-5 h-5" />
                <span>Pay ₹{packageDetails.price.toLocaleString()} & Activate</span>
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Secured by 256-bit SSL encryption</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Package Summary */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 p-6 rounded-2xl glass dark:glass-dark border border-white/20 dark:border-gray-800/50 backdrop-blur-xl"
            >
              <h2 className="text-xl mb-4">Package Summary</h2>
              
              {/* Package Header */}
              <div className="flex items-center gap-3 p-4 mb-4 rounded-xl glass dark:glass-dark border border-white/10 dark:border-gray-800/30">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${getTierGradient()} text-white shadow-lg`}>
                  <TierIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="mb-0.5">{packageDetails.tier} Plan</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {packageDetails.duration.replace('M', ' Month').replace('Y', ' Year')}
                  </p>
                </div>
              </div>

              {/* Request Limits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-xl glass dark:glass-dark border border-white/10 dark:border-gray-800/30">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">P2P Requests</span>
                  </div>
                  <span className="text-sm flex items-center gap-1">
                    {packageDetails.p2pRequests === 'unlimited' ? (
                      <><Infinity className="w-4 h-4" /> ∞</>
                    ) : (
                      packageDetails.p2pRequests
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl glass dark:glass-dark border border-white/10 dark:border-gray-800/30">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Experienced</span>
                  </div>
                  <span className="text-sm flex items-center gap-1">
                    {packageDetails.experiencedRequests === 'unlimited' ? (
                      <><Infinity className="w-4 h-4" /> ∞</>
                    ) : (
                      packageDetails.experiencedRequests
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl glass dark:glass-dark border border-white/10 dark:border-gray-800/30">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Investors</span>
                  </div>
                  <span className="text-sm flex items-center gap-1">
                    {packageDetails.investorRequests === 'unlimited' ? (
                      <><Infinity className="w-4 h-4" /> ∞</>
                    ) : (
                      packageDetails.investorRequests
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl glass dark:glass-dark border border-white/10 dark:border-gray-800/30">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#3C82F6] dark:text-[#3758FF]" />
                    <span className="text-sm">Valid For</span>
                  </div>
                  <span className="text-sm">{packageDetails.duration.replace('M', 'mo').replace('Y', 'yr')}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                {packageDetails.originalPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Original Price</span>
                    <span className="line-through text-gray-500">₹{packageDetails.originalPrice.toLocaleString()}</span>
                  </div>
                )}
                {packageDetails.discount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Discount</span>
                    <span className="text-green-600 dark:text-green-400">Save {packageDetails.discount}</span>
                  </div>
                )}
                <div className="h-px bg-gray-200 dark:bg-gray-800" />
                <div className="flex justify-between items-center">
                  <span>Total Amount</span>
                  <span className="text-2xl text-[#3C82F6] dark:text-[#3758FF]">₹{packageDetails.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Features */}
              <div className="p-4 rounded-xl glass dark:glass-dark border border-white/10 dark:border-gray-800/30">
                <p className="text-sm mb-3 text-gray-600 dark:text-gray-400">Includes:</p>
                <div className="space-y-2">
                  {packageDetails.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
                      <span className="text-xs text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
