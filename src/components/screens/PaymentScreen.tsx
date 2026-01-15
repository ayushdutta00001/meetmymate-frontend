import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Shield, Lock, Calendar, Gift, CheckCircle } from 'lucide-react';
import { BackButton } from '../ui/BackButton';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { ResponsiveContainer } from '../ui/ResponsiveContainer';

interface PaymentScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function PaymentScreen({ onNavigate, onBack }: PaymentScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi' | 'wallet'>('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const paymentMethods = [
    { id: 'card', icon: CreditCard, label: 'Credit/Debit Card' },
    { id: 'upi', icon: CreditCard, label: 'UPI' },
    { id: 'wallet', icon: CreditCard, label: 'Wallet' },
  ];

  const amount = 550;
  const discount = promoApplied ? 50 : 0;
  const finalAmount = amount - discount;

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        onNavigate('booking-confirmation');
      }, 2000);
    }, 2000);
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'FIRST50') {
      setPromoApplied(true);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          <Card variant="glass" className="max-w-md text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="mb-3">Booking Confirmed!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your booking with Priya has been confirmed. Chat feature coming soon to coordinate the details.
            </p>
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={() => onNavigate('bookings')}
            >
              Go to Bookings
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} />
              <div>
                <h2>Payment</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete your booking
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="glass" hover={false}>
                <h3 className="mb-4">Select Payment Method</h3>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <motion.button
                        key={method.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMethod(method.id as any)}
                        className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                          selectedMethod === method.id
                            ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white shadow-lg'
                            : 'bg-[#F2F4F7] dark:bg-[#0A0F1F] hover:bg-gray-200 dark:hover:bg-gray-800'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-xs text-center">{method.label}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Payment Details Form */}
                <div className="space-y-4">
                  {selectedMethod === 'card' && (
                    <>
                      <Input
                        type="text"
                        label="Card Number"
                        placeholder="1234 5678 9012 3456"
                        icon={<CreditCard className="w-5 h-5" />}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="text"
                          label="Expiry Date"
                          placeholder="MM/YY"
                        />
                        <Input
                          type="text"
                          label="CVV"
                          placeholder="123"
                        />
                      </div>
                      <Input
                        type="text"
                        label="Cardholder Name"
                        placeholder="John Doe"
                      />
                    </>
                  )}

                  {selectedMethod === 'upi' && (
                    <Input
                      type="text"
                      label="UPI ID"
                      placeholder="yourname@upi"
                      icon={<CreditCard className="w-5 h-5" />}
                    />
                  )}

                  {selectedMethod === 'wallet' && (
                    <div className="space-y-3">
                      {['Paytm', 'PhonePe', 'Google Pay', 'Amazon Pay'].map((wallet) => (
                        <button
                          key={wallet}
                          className="w-full p-4 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F] hover:bg-gray-200 dark:hover:bg-gray-800 transition-all text-left"
                        >
                          {wallet}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Promo Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="glass" hover={false}>
                <h3 className="mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#3C82F6] dark:text-[#3758FF]" />
                  Promo Code
                </h3>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                  />
                  <Button
                    variant={promoApplied ? 'outline' : 'primary'}
                    onClick={applyPromo}
                    disabled={promoApplied || !promoCode}
                  >
                    {promoApplied ? 'Applied' : 'Apply'}
                  </Button>
                </div>
                {promoApplied && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Promo code applied! You saved ₹{discount}
                  </motion.p>
                )}
                <p className="mt-3 text-xs text-gray-500">
                  Try code: FIRST50 for ₹50 off
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24"
            >
              <Card variant="gradient" hover={false}>
                <h3 className="text-white mb-4">Payment Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-white/90">
                    <span>Booking Amount</span>
                    <span>₹{amount}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-green-300">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="border-t border-white/20 pt-3 flex justify-between text-white">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-2xl font-bold">₹{finalAmount}</span>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="large"
                  fullWidth
                  loading={processing}
                  onClick={handlePayment}
                >
                  {processing ? 'Processing...' : `Pay ₹${finalAmount}`}
                </Button>

                <p className="text-xs text-white/60 text-center mt-4">
                  Your payment is secure and encrypted
                </p>
              </Card>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4"
              >
                <Card variant="glass" hover={false}>
                  <h4 className="text-sm mb-3">Booking Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Date</span>
                      <span>Nov 28</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Time</span>
                      <span>2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration</span>
                      <span>1 hour</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}