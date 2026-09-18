import React, { useState } from 'react';
import { motion } from 'motion/react';
import LocationSearchModal from "../../modals/LocationSearchModal";
import {
  MapPin,
  Calendar,
  Clock,
  Plus,
  X,
  Shield,
  Search,
} from 'lucide-react';
import { createBlindDateBooking } from '../../../lib/user-api';
import { BackButton } from '../../ui/BackButton';
interface BlindDateBookingProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}



export function BlindDateBooking({ onNavigate, onBack }: BlindDateBookingProps) {
const [formData, setFormData] = useState({
    city: '',
    preferredLocations: [] as string[],
    genderPreference: '',
    minAge: 18,
    maxAge: 60,
    notes: '',
});

const [locationInput, setLocationInput] = useState("");
const [availability, setAvailability] = useState<
  Record<string, string[]>
>({});
const [showLocationSearch, setShowLocationSearch] = useState(false);

const [searchLocation, setSearchLocation] = useState("");


  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'];
  const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const timePeriods = [
  "Morning",
  "Afternoon",
  "Evening",
];
  const areaOptions = ['Central', 'North', 'South', 'East', 'West'];
const popularLocations = [
  {
    name: "Phoenix Marketcity",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    name: "Marine Drive",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    name: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
  },
];


  


  const addLocation = () => {
    if (!locationInput.trim()) return;

    if (
        formData.preferredLocations.includes(locationInput.trim())
    )
        return;

    setFormData({
        ...formData,
        preferredLocations: [
            ...formData.preferredLocations,
            locationInput.trim(),
        ],
    });

    setLocationInput("");
};

const removeLocation = (location: string) => {
    setFormData({
        ...formData,
        preferredLocations: formData.preferredLocations.filter(
            (l) => l !== location
        ),
    });
};

 const isValid = () => {
  return (
    formData.city &&
Object.keys(availability).length > 0 &&    formData.genderPreference &&
   Object.values(availability).some(
  periods => periods.length > 0
)
  );
};





const buildPreferences = () => ({

  availability: Object.entries(availability)
    .filter(([, periods]) => periods.length > 0)
    .map(([day, periods]) => ({
      day,
      periods,
    })),

  preferred_locations: formData.preferredLocations,

  gender_preference: formData.genderPreference,

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

  try {
console.log("FORM DATA", formData);

console.log("REQUEST", {
  city: formData.city,
  preferences: buildPreferences(),
  date: "",
  time_slot: "",
});

 const res = await createBlindDateBooking({
  preferences: buildPreferences(),
  city: formData.city,
  date: '',
  time_slot: '',
});

if (!res.success || !res.data) {
  throw new Error(
    res.error || 'Failed to prepare payment'
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
    alert(err.message || 'Something went wrong');
  }
};


  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
           <BackButton onClick={onBack} />
            <div>
              <h2>Book a Blind Date</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tell us when you're available — we'll handle the rest
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Location Section */}
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3>Location</h3>
            </div>

            {/* City Selector */}
            <div className="mb-4">
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                City <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0F1F] focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all"
              >
                <option value="">Select your city</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

           {/* Preferred Meeting Locations */}

<div>
  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
    Preferred Meeting Location (Optional)
  </label>

  <textarea
    value={formData.preferredLocations.join('\n')}
    onChange={(e) =>
      setFormData({
        ...formData,
        preferredLocations: e.target.value
          .split('\n')
          .map(s => s.trim())
          .filter(Boolean),
      })
    }
    rows={3}
    placeholder="Example:
• South City Mall
• Park Street
• Near City Centre
• Any public café in Koramangala"
    className="
      w-full
      rounded-xl
      border
      border-gray-300
      dark:border-gray-700
      bg-white
      dark:bg-[#0A0F1F]
      px-4
      py-3
      text-sm
      resize-none
      focus:border-blue-500
      dark:focus:border-blue-500
      focus:outline-none
      transition-all
    "
  />

  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
    Tell us where you'd prefer to meet. We'll try to arrange a safe public
    location nearby.
  </p>
</div>

</div>

          {/* Available Days */}

<div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800">

  <div className="flex items-center gap-3 mb-6">

    <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
    </div>

    <div>
      <h3>Availability</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Select all days you're available.
      </p>
    </div>

  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

    {weekDays.map((day) => {

     const hasSelection =
  (availability[day]?.length ?? 0) > 0;

      return (

      <div
    key={day}
         className={`
rounded-2xl
border
p-4
transition-all
${
    hasSelection
        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
        : "border-gray-300 dark:border-gray-700"
}
`}
        >
          {day}
          <div className="mt-3 flex flex-wrap gap-2">

  {timePeriods.map((period) => {

    const selected =
      availability[day]?.includes(period);

    return (

      <button
        key={period}
        type="button"
        onClick={() => {

          const current =
            availability[day] || [];

          if (selected) {

            setAvailability({
              ...availability,
              [day]: current.filter(
                p => p !== period
              ),
            });

          } else {

            setAvailability({
              ...availability,
              [day]: [...current, period],
            });

          }

        }}
        className={`
          px-4
          py-2
          rounded-full
          text-sm
          transition-all

          ${
            selected
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 border border-gray-700 hover:border-blue-500"
          }
        `}
      >

        {period}

      </button>

    );

  })}

</div>
        </div>

      );

    })}

  </div>

</div>

         
          {/* Matching Preferences */}

          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800">
           <h3 className="mb-6">
  Matching Preferences
</h3>
            <div className="space-y-4">
              <div>
               <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
  Preferred Match Gender <span className="text-red-500">*</span>
</label>
                <select
                  value={formData.genderPreference}
                  onChange={(e) => setFormData({ ...formData, genderPreference: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0F1F] focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all"
                >
                 <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
<div className="grid grid-cols-2 gap-4">

  <div>
    <label className="block text-sm mb-2">
      Minimum Age
    </label>

    <input
      type="number"
      min={18}
      max={100}
      value={formData.minAge}
      onChange={(e)=>
        setFormData({
          ...formData,
          minAge:Number(e.target.value)
        })
      }
      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0F1F]"
    />
  </div>

  <div>
    <label className="block text-sm mb-2">
      Maximum Age
    </label>

    <input
      type="number"
      min={18}
      max={100}
      value={formData.maxAge}
      onChange={(e)=>
        setFormData({
          ...formData,
          maxAge:Number(e.target.value)
        })
      }
      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0F1F]"
    />
  </div>

</div>
              <div>
                <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="E.g., Coffee preferred, vegetarian, allergies, etc."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0F1F] focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Refund Assurance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-900/30"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-blue-900 dark:text-blue-400">100% Refund Guarantee</h4>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  If we're unable to arrange your blind date within your selected date range, 
                  you'll receive a <strong>100% full refund automatically</strong>. No questions asked.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Continue Button */}
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
        </motion.div>
      </div>
        

    </div>
  );
} 


