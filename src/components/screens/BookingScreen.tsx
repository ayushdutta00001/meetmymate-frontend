import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { BackButton } from '../ui/BackButton';

interface BookingScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BookingScreen({ onNavigate, onBack }: BookingScreenProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const [location, setLocation] = useState<string>('');

  const dates = ['Nov 28', 'Nov 29', 'Nov 30', 'Dec 1', 'Dec 2', 'Dec 3', 'Dec 4'];
  const times = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];
  const durations = [1, 2, 3, 4];
  const locations = ['Cafe Coffee Day, Bandra', 'Starbucks, Powai', 'The Coffee Bean, Andheri', 'Custom Location'];

  const pricePerHour = 500;
  const totalPrice = pricePerHour * duration;
  const platformFee = totalPrice * 0.1;
  const finalAmount = totalPrice + platformFee;

  const canProceed = selectedDate && selectedTime && duration && location;

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} />
              <div>
                <h2>Book Your Time</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Schedule a meeting with Priya
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Select Date */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="glass" hover={false}>
                <h3 className="mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#3C82F6] dark:text-[#3758FF]" />
                  Select Date
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                  {dates.map((date) => (
                    <motion.button
                      key={date}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 rounded-xl text-sm transition-all ${
                        selectedDate === date
                          ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white shadow-lg'
                          : 'bg-[#F2F4F7] dark:bg-[#0A0F1F] hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      {date}
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Select Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="glass" hover={false}>
                <h3 className="mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#3C82F6] dark:text-[#3758FF]" />
                  Select Time
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {times.map((time) => (
                    <motion.button
                      key={time}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-xl text-sm transition-all ${
                        selectedTime === time
                          ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white shadow-lg'
                          : 'bg-[#F2F4F7] dark:bg-[#0A0F1F] hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Duration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="glass" hover={false}>
                <h3 className="mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#3C82F6] dark:text-[#3758FF]" />
                  Duration
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {durations.map((dur) => (
                    <motion.button
                      key={dur}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDuration(dur)}
                      className={`p-3 rounded-xl transition-all ${
                        duration === dur
                          ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white shadow-lg'
                          : 'bg-[#F2F4F7] dark:bg-[#0A0F1F] hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      {dur} {dur === 1 ? 'hour' : 'hours'}
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="glass" hover={false}>
                <h3 className="mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#3C82F6] dark:text-[#3758FF]" />
                  Meeting Location
                </h3>
                <div className="space-y-3">
                  {locations.map((loc) => (
                    <motion.button
                      key={loc}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setLocation(loc)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        location === loc
                          ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white shadow-lg'
                          : 'bg-[#F2F4F7] dark:bg-[#0A0F1F] hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      {loc}
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="sticky top-24"
            >
              <Card variant="glass" hover={false}>
                <h3 className="mb-4">Booking Summary</h3>
                
                <div className="flex items-center gap-3 mb-6 p-3 bg-[#F2F4F7] dark:bg-[#0A0F1F] rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1543807641-bd607cfa8dca?w=200"
                    alt="Priya"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm">Priya, 25</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Graphic Designer</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                    <span>{selectedDate || 'Not selected'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Time:</span>
                    <span>{selectedTime || 'Not selected'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span>{duration} {duration === 1 ? 'hour' : 'hours'}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-400">Location:</span>
                    <span className="flex-1 text-right">{location || 'Not selected'}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Price ({duration}h × ₹{pricePerHour})
                    </span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Platform Fee</span>
                    <span>₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold text-[#3C82F6] dark:text-[#3758FF]">
                      ₹{finalAmount}
                    </span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="large"
                  fullWidth
                  disabled={!canProceed}
                  onClick={() => onNavigate('payment')}
                >
                  Proceed to Payment
                </Button>

                {!canProceed && (
                  <p className="text-xs text-center text-gray-500 mt-3">
                    Complete all fields to proceed
                  </p>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}