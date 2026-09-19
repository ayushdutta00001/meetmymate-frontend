import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Calendar,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { createBlindDateBooking } from '../../../lib/user-api';
import { BackButton } from '../../ui/BackButton';

interface BlindDateBookingProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDateBooking({
  onNavigate,
  onBack,
}: BlindDateBookingProps) {
  const [formData, setFormData] = useState({
    city: '',
    preferredLocations: [] as string[],
    genderPreference: '',
    minAge: 18,
    maxAge: 60,
    notes: '',
  });

  const [availability, setAvailability] = useState<
    Record<string, string[]>
  >({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
  ];

  const weekDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const timePeriods = [
    'Morning',
    'Afternoon',
    'Evening',
  ];

  const isValid = () => {
    return (
      !!formData.city &&
      Object.keys(availability).length > 0 &&
      !!formData.genderPreference &&
      Object.values(availability).some(
        (periods) => periods.length > 0
      )
    );
  };

  const togglePeriod = (
    day: string,
    period: string
  ) => {
    setAvailability((prev) => {
      const current = prev[day] || [];

      const next = current.includes(period)
        ? current.filter((p) => p !== period)
        : [...current, period];

      if (next.length === 0) {
        const { [day]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [day]: next,
      };
    });
  };

  const buildPreferences = () => ({
    availability: Object.entries(availability)
      .filter(([, periods]) => periods.length > 0)
      .map(([day, periods]) => ({
        day,
        periods,
      })),

    preferred_locations:
      formData.preferredLocations,

    gender_preference:
      formData.genderPreference,

    age_preference: {
      min: formData.minAge,
      max: formData.maxAge,
    },

    notes: formData.notes || null,
  });

  const handleContinue = async () => {
    if (!isValid()) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('FORM DATA', formData);

      console.log('REQUEST', {
        city: formData.city,
        preferences: buildPreferences(),
        date: '',
        time_slot: '',
      });

      const res = await createBlindDateBooking({
        preferences: buildPreferences(),
        city: formData.city,
        date: '',
        time_slot: '',
      });

      if (!res.success || !res.data) {
        throw new Error(
          res.error ||
            'Failed to prepare payment'
        );
      }

      sessionStorage.setItem(
        'blindDatePayment',
        JSON.stringify({
          paymentDraftId: res.data.id,
          amount: 399,
        })
      );

      onNavigate('blind-date-payment-new');
    } catch (err: any) {
      setError(
        err.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const totalSlots =
    Object.values(availability).reduce(
      (sum, periods) => sum + periods.length,
      0
    );

  const selectedDayCount =
    Object.keys(availability).length;

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-32 md:pb-12">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <motion.header
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-[#0A0F1F]/95 backdrop-blur-xl"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4">

          <div className="flex items-center gap-3">

            <BackButton onClick={onBack} />

            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Book a Blind Date
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Tell us when you're available — we'll handle the rest
              </p>
            </div>

            <div className="flex-shrink-0">
              <div className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-right">
                <p className="text-sm font-bold text-blue-700 dark:text-blue-400 leading-none">
                  ₹399
                </p>

                <p className="text-[10px] text-blue-500 dark:text-blue-400/70 mt-0.5">
                  one-time
                </p>
              </div>
            </div>

          </div>

        </div>
      </motion.header>

      {/* ====================================================== */}
      {/* MAIN CONTENT */}
      {/* ====================================================== */}

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-5">

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="space-y-4"
        >

          {/* ================================================== */}
          {/* LOCATION CARD */}
          {/* ================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.05,
            }}
            className="bg-blue-900 dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <div className="p-4 sm:p-5">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    Location
                  </h3>

                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Where would you like to meet?
                  </p>
                </div>

              </div>

              {/* City */}
              <div className="mb-4">

                <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                  City{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">

                  <select
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        city: e.target.value,
                      })
                    }
                    className="w-full h-11 appearance-none px-4 pr-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0F1F] text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                  >
                    <option value="">
                      Select your city
                    </option>

                    {cities.map((city) => (
                      <option
                        key={city}
                        value={city}
                      >
                        {city}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                </div>

              </div>

              {/* Preferred Location */}
              <div>

                <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                  Preferred Meeting Location{' '}
                  <span className="text-gray-400 font-normal">
                    (Optional)
                  </span>
                </label>

                <textarea
                  value={formData.preferredLocations.join(
                    '\n'
                  )}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredLocations:
                        e.target.value
                          .split('\n')
                          .map((s) =>
                            s.trim()
                          )
                          .filter(Boolean),
                    })
                  }
                  rows={3}
                  placeholder={`Example:
• South City Mall
• Park Street
• Near City Centre
• Any public café`}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0F1F] px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                />

                <p className="mt-2 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Tell us where you'd prefer to meet. We'll try to arrange a safe public location nearby.
                </p>

              </div>

            </div>
          </motion.section>

          {/* ================================================== */}
          {/* AVAILABILITY CARD */}
          {/* ================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className="bg-blue-900 dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <div className="p-4 sm:p-5">

              <div className="flex items-start justify-between gap-3 mb-5">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>

                  <div>

                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      Availability{' '}
                      <span className="text-red-500">
                        *
                      </span>
                    </h3>

                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Select all days you're available.
                    </p>

                  </div>

                </div>

                {totalSlots > 0 && (
                  <div className="flex-shrink-0 px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-right">

                    <p className="text-xs font-bold text-purple-700 dark:text-purple-300">
                      {totalSlots} slot
                      {totalSlots !== 1 ? 's' : ''}
                    </p>

                    <p className="text-[10px] text-purple-500 dark:text-purple-400">
                      {selectedDayCount} day
                      {selectedDayCount !== 1 ? 's' : ''}
                    </p>

                  </div>
                )}

              </div>

              {/* Days */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">

                {weekDays.map((day) => {

                  const selected =
                    availability[day] || [];

                  const active =
                    selected.length > 0;

                  return (
                    <motion.div
                      key={day}
                      layout
                      className={`rounded-xl border p-3 transition-all ${
                        active
                          ? 'border-blue-400 dark:border-blue-500 bg-blue-900 dark:bg-blue-900/10'
                          : 'border-gray-200 dark:border-gray-700 bg-blue-950 dark:bg-[#0D1526]'
                      }`}
                    >

                      <div className="flex items-center justify-between mb-3">

                        <span
                          className={`text-xs font-semibold ${
                            active
                              ? 'text-blue-700 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {day}
                        </span>

                        {active && (
                          <CheckCircleDot />
                        )}

                      </div>

                      <div className="space-y-1.5">

                        {timePeriods.map(
                          (period) => {

                            const selectedPeriod =
                              selected.includes(
                                period
                              );

                            return (
                              <button
                                key={period}
                                type="button"
                                onClick={() =>
                                  togglePeriod(
                                    day,
                                    period
                                  )
                                }
                                className={`w-full px-2 py-2 rounded-lg text-[11px] sm:text-xs font-medium border transition-all active:scale-95 ${
                                  selectedPeriod
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                    : 'bg-blue-950 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                                }`}
                              >
                                {period}
                              </button>
                            );
                          }
                        )}

                      </div>

                    </motion.div>
                  );
                })}

              </div>

              <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400">
                You can select multiple time periods on the same day.
              </p>

            </div>
          </motion.section>

          {/* ================================================== */}
          {/* MATCHING PREFERENCES */}
          {/* ================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
            }}
            className="bg-blue-900 dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
          >
            <div className="p-4 sm:p-5">

              <div className="mb-5">

                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Matching Preferences
                </h3>

                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  Tell us what kind of match you're looking for.
                </p>

              </div>

              <div className="space-y-4">

                {/* Gender */}
                <div>

                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Preferred Match Gender{' '}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <select
                      value={formData.genderPreference}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          genderPreference:
                            e.target.value,
                        })
                      }
                      className="w-full h-11 appearance-none px-4 pr-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0F1F] text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                    >
                      <option value="">
                        Select Gender
                      </option>

                      <option value="male">
                        Male
                      </option>

                      <option value="female">
                        Female
                      </option>

                      <option value="other">
                        Other
                      </option>
                    </select>

                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                  </div>

                </div>

                {/* Age */}
                <div>

                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Age Range
                  </label>

                  <div className="grid grid-cols-2 gap-3">

                    <div>

                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                        Minimum Age
                      </p>

                      <input
                        type="number"
                        min={18}
                        max={100}
                        value={formData.minAge}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minAge: Number(
                              e.target.value
                            ),
                          })
                        }
                        className="w-full h-11 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0F1F] text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                      />

                    </div>

                    <div>

                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                        Maximum Age
                      </p>

                      <input
                        type="number"
                        min={18}
                        max={100}
                        value={formData.maxAge}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxAge: Number(
                              e.target.value
                            ),
                          })
                        }
                        className="w-full h-11 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0F1F] text-sm text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                      />

                    </div>

                  </div>

                </div>

                {/* Notes */}
                <div>

                  <label className="block text-xs sm:text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                    Additional Notes{' '}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notes: e.target.value,
                      })
                    }
                    placeholder="E.g., Coffee preferred, vegetarian, allergies, etc."
                    rows={3}
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0F1F] px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all resize-none"
                  />

                </div>

              </div>

            </div>
          </motion.section>

          {/* ================================================== */}
          {/* REFUND ASSURANCE */}
          {/* ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="p-4 sm:p-5 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/40"
          >

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">

                <Shield className="w-5 h-5 text-yellow-700 dark:text-yellow-400" />

              </div>

              <div>

                <h4 className="text-sm sm:text-base font-bold text-yellow-800 dark:text-yellow-400 mb-1">
                  100% Refund Guarantee
                </h4>

                <p className="text-xs sm:text-sm leading-relaxed text-yellow-700 dark:text-yellow-300">
                  If we're unable to arrange your blind date within your selected date range, you'll receive a{' '}
                  <strong>
                    100% full refund automatically
                  </strong>
                  . No questions asked.
                </p>

              </div>

            </div>

          </motion.div>

          {/* ================================================== */}
          {/* ERROR */}
          {/* ================================================== */}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                }}
                className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================================================== */}
          {/* DESKTOP BUTTON */}
          {/* ================================================== */}

          <div className="hidden md:block pb-2">

            <button
            onClick={handleContinue}
            disabled={!isValid()}
            className={`w-full py-4 rounded-xl transition-all text-white font-medium ${
              isValid()
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            Continue to Payment
          </button>

          </div>

        </motion.div>
      </main>

      {/* ====================================================== */}
      {/* MOBILE BUTTON */}
      {/* ====================================================== */}

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0A0F1F]/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">

        <button
            onClick={handleContinue}
            disabled={!isValid()}
            className={`w-full py-4 rounded-xl transition-all text-white font-medium ${
              isValid()
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            Continue to Payment
          </button>

      </div>

    </div>
  );
}

/*
 * Small status indicator for selected availability days.
 */
function CheckCircleDot() {
  return (
    <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
  );
}