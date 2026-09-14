import React, { useEffect, useState } from 'react';
import { supabase } from "../../../supabase";
import { motion } from 'motion/react';
import { 
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Star,
  ChevronRight,
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { BackButton } from '../../ui/BackButton';

interface RentFriendBookingProps {
  onNavigate: (
    page: string,
    param?: string
  ) => void;

  onBack: () => void;

  bookingData?: string;
}

export function RentFriendBooking({
  onNavigate,
  onBack,
  bookingData
}: RentFriendBookingProps) {
 
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('2');
  const [customHours, setCustomHours] = useState(1);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [baseRate, setBaseRate] = useState(0);
const selectedService =
  bookingData || "movie-buddy";

  const serviceNames: Record<string, string> = {
    'movie-buddy': 'Movie Buddy',
    'dining-partner': 'Dining Partner',
    'party-companion': 'Party Companion',
    'explore-city': 'Explore City',
    'emotional-support': 'Emotional Support',
    'study-partner': 'Study Partner',
    'coffee-chat': 'Coffee Chat',
    'gaming-buddy': 'Gaming Buddy',
    'shopping-companion': 'Shopping Companion',
    'photo-walk': 'Photo Walk',
    'concert-buddy': 'Concert Buddy',
    'workout-partner': 'Workout Partner',
  };

 
const loadServicePrice = async () => {
  try {

    const { data: sessionData } =
      await supabase.auth.getSession();

    const token =
      sessionData.session?.access_token;

    const response = await fetch(
      "https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_get_raf_services",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!result.success) return;

    const service =
      result.services.find(
        (s: any) =>
          s.service_slug === selectedService
      );

    if (service) {

      setBaseRate(
        Number(service.price_per_hour)
      );

    }

  } catch (err) {

    console.error(err);

  }
};

useEffect(() => {

  loadServicePrice();

}, [selectedService]);



 const timeSlots = [
  '06:00 AM',
  '07:00 AM',
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM'
];

const isBookingForTomorrow =
  new Date().getHours() >= 20;

const isPastTimeSlot = (slot: string) => {

  const now = new Date();

  const [time, period] = slot.split(" ");

  let [hours, minutes] = time
    .split(":")
    .map(Number);

  if (period === "PM" && hours !== 12)
    hours += 12;

  if (period === "AM" && hours === 12)
    hours = 0;

  const slotTime = new Date();

  slotTime.setHours(hours);
  slotTime.setMinutes(minutes);
  slotTime.setSeconds(0);
  slotTime.setMilliseconds(0);

 // After 8 PM, tomorrow's slots should all be available
if (now.getHours() >= 20) {
  return false;
}

return slotTime <= now;

};


const durationOptions = React.useMemo(() => [
  {
    value: '1',
    label: '1 Hour',
    price: baseRate,
    discount: 0
  },
  {
    value: '2',
    label: '2 Hours',
    price: baseRate * 2,
    discount: 5
  },
  {
    value: '3',
    label: '3 Hours',
    price: baseRate * 3,
    discount: 10
  },
  {
    value: '4',
    label: '4 Hours',
    price: baseRate * 4,
    discount: 15
  },
  {
    value: 'custom',
    label: 'Custom',
    price: baseRate,
    discount: 0
  }
], [baseRate]);

 const hours =
  duration === 'custom'
    ? customHours
    : Number(duration);

const totalPrice =
  baseRate * hours;

const discount =
  hours >= 4
    ? 15
    : hours === 3
    ? 10
    : hours === 2
    ? 5
    : 0;

const finalPrice =
  totalPrice -
  (totalPrice * discount) / 100;

  const handleContinue = async () => {

 if (!selectedTime || !duration || !location) {
    return;
  }


  const {
    data: { user }
  } = await supabase.auth.getUser();

 if (!user) {
  console.error("Missing user");
  return;
}
  const totalAmount =
    Math.round(
      finalPrice + (finalPrice * 0.1)
    );
const bookingDateObj = new Date();

const currentHour = bookingDateObj.getHours();

// If it's after 8 PM, automatically book for tomorrow
if (currentHour >= 20) {
  bookingDateObj.setDate(
    bookingDateObj.getDate() + 1
  );
}

const bookingDate = bookingDateObj
  .toISOString()
  .split("T")[0];
  // CREATE BOOKING
 

  // SEND DATA TO PAYMENT SCREEN
  onNavigate(
  "rent-friend-payment",
 JSON.stringify({

  service: selectedService,
date: bookingDate,

  time: selectedTime,

  duration:
  duration === 'custom'
    ? customHours
    : Number(duration),

  location,

  notes,

  total: totalAmount,
})
  );
};
const isFormValid =
  baseRate > 0 &&
  selectedTime &&
  duration &&
  location;

  

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-[#0A0F1F] dark:via-[#0D1425] dark:to-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-[#0A0F1F]/80 border-b border-gray-200/50 dark:border-gray-800/50"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <BackButton onClick={onBack} />
            <div>
              <h1 className="text-xl md:text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
               Book {serviceNames[selectedService] || 'Your Friend'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Complete the details below
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
           

          

            {/* Time Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg">Select Time</h3>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {timeSlots.map((time) => (
                 <button
  key={time}
  disabled={isPastTimeSlot(time)}

  onClick={() => {
    if (isPastTimeSlot(time)) return;
    setSelectedTime(time);
  }}

  className={`p-3 rounded-xl text-sm text-center transition-all ${
    isPastTimeSlot(time)
      ? 'opacity-40 cursor-not-allowed bg-gray-200 dark:bg-gray-900'
      : selectedTime === time
      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg scale-105'
      : 'glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50 hover:border-pink-500'
  }`}
>
                    {time}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Duration Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg">Duration</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

                
                {durationOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDuration(option.value)}
                    className={`p-4 rounded-xl text-center transition-all relative ${
                      duration === option.value
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105'
                        : 'glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50 hover:border-blue-500'
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1">{option.label}</div>
                    <div
  className={`text-xs ${
    duration === option.value
      ? "text-white"
      : "text-gray-500 dark:text-gray-400"
  }`}
>
  ₹{option.price.toLocaleString()}
</div>
                    {option.discount && (
                      <div className={`text-xs ${duration === option.value ? 'text-white' : 'text-green-600 dark:text-green-400'}`}>
                        Save {option.discount}%
                      </div>
                    )}



                  </button>
                ))}

                {duration === 'custom' && (
  <div className="mt-4">
    <label className="block mb-2 text-sm">
      Enter Hours (Minimum 1 Hour)
    </label>

    <input
      type="number"
      min="1"
      value={customHours}
      onChange={(e) =>
        setCustomHours(
          Math.max(
            1,
            Number(e.target.value)
          )
        )
      }
      className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border border-gray-200 dark:border-gray-800"
    />

   {customHours >= 2 && (
  <p className="mt-2 text-green-500 text-sm">

    {customHours >= 4
      ? '15% discount applied'
      : customHours === 3
      ? '10% discount applied'
      : '5% discount applied'}

  </p>
)}
  </div>
)}
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg">Meeting Location</h3>
              </div>
              <input
                type="text"
                placeholder="Enter address or landmark"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border border-gray-200 dark:border-gray-800 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Choose a safe, public location for your first meeting
              </p>
            </motion.div>

            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg">Additional Notes (Optional)</h3>
              </div>
              <textarea
                placeholder="Any special requests or things to know..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border border-gray-200 dark:border-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all resize-none"
              />
            </motion.div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 p-6 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50"
            >
              <h3 className="text-lg mb-4">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                
<div className="flex items-center gap-3 text-sm">
  <Calendar className="w-5 h-5 text-purple-500" />

  <div className="flex-1">
    <div className="text-gray-600 dark:text-gray-400">
      Date
    </div>

   <div className="font-medium">
  {isBookingForTomorrow ? "Tomorrow" : "Today"}
</div>
  </div>
</div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-pink-500" />
                  <div className="flex-1">
                    <div className="text-gray-600 dark:text-gray-400">Time</div>
                    <div className="font-medium">{selectedTime || 'Not selected'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div className="flex-1">
                    <div className="text-gray-600 dark:text-gray-400">Duration</div>
                    <div className="font-medium">
                      {durationOptions.find(d => d.value === duration)?.label}
                    </div>
                  </div>
                </div>

                {location && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <div className="text-gray-600 dark:text-gray-400">Location</div>
                      <div className="font-medium line-clamp-2">{location}</div>
                    </div>
                  </div>
                )}
{notes && (
  <div className="flex items-start gap-3 text-sm">
    <MessageSquare className="w-5 h-5 text-amber-500 mt-0.5" />

    <div className="flex-1">
      <div className="text-gray-600 dark:text-gray-400">
        Notes
      </div>

      <div className="font-medium break-words">
        {notes}
      </div>
    </div>
  </div>
)}

              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Base Price</span>
                  <span>₹{totalPrice}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>Discount ({discount}%)</span>
                    <span>-₹{totalPrice * discount / 100}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Platform Fee</span>
                  <span>₹{Math.round(finalPrice * 0.1)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ₹{Math.round(finalPrice + (finalPrice * 0.1))}
                  </span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!isFormValid}
                className={`w-full mt-6 px-6 py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                  isFormValid
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }`}
              >
                {isFormValid ? (
                  <>
                    Continue to Payment
                    <ChevronRight className="w-5 h-5" />
                  </>
                ) : (
                  'Complete all fields'
                )}
              </button>

              {/* Safety Note */}
              <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>
                    Your safety is our priority. Always meet in public places and follow our safety guidelines.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
