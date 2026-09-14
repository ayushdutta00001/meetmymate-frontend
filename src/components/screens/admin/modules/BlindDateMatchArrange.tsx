import { supabase } from '../../../../supabase';


import React, { useState, useEffect, ReactNode } from 'react';

import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  X,
  User,
  Heart,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';

interface BlindDateBooking {
  id: string                // booking id (BD-2401)
  user_id: string
  user_name: string
  gender: string
  age: number
  photo?: string
  preferences?: any
  meeting_date?: string
  status: string
  payment_status: string
  created_at: string
}
interface Profile {
  location: ReactNode;
  id: string;
  name: string;
  age: number;
  gender: string;

  city: string;

  interests: string[];

  notes: string;

  preferredGender: string;

  minAge: number | null;

  maxAge: number | null;

  availability: any[];

  preferredLocations: string[];

  photo: string;

  bookingId: string;

  bookedAt: string;
}
export function BlindDateMatchArrange() {
  const [selectedProfile1, setSelectedProfile1] = useState<Profile | null>(null);
  const [selectedProfile2, setSelectedProfile2] = useState<Profile | null>(null);
  const [showArrangementModal, setShowArrangementModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
const [holdingProfiles, setHoldingProfiles] = useState<Profile[]>([]);
const [loading, setLoading] = useState(false);
const [meetingLocation, setMeetingLocation] = useState('');
const [meetingDate, setMeetingDate] = useState('');
const [meetingTime, setMeetingTime] = useState('');

console.log('MATCH ARRANGE SCREEN LOADED');
  
useEffect(() => {
  fetchHoldingProfiles();
}, []);

  const fetchHoldingProfiles = async () => {
  try {
    setLoading(true);
console.log('FETCH HOLDING BOOKINGS CALLED');

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    const res = await fetch(
      'https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_list_blind_date_bookings',
      {
        method: 'GET',
        headers: {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
}

      }
    );

    const result = await res.json();
console.log('ADMIN BOOKINGS RESPONSE:', result);

  // Convert BOOKINGS → your existing Profile UI format
const transformed = (result.data || [])
  .filter(
    (b: any) =>
      b.status === "pending" &&
      b.payment_status === "paid" &&
      !b.meeting_date
  )
  .map((b: any) => ({
    id: b.id,

    name: b.users?.name || "Unknown",

    age: b.users?.age || 0,

    gender: b.users?.gender || "Unknown",

    city: b.city || b.users?.city || "N/A",

    interests: b.users?.interests || [],

    notes: b.preferences?.notes || "",

    preferredGender: b.gender_preference || "",

    minAge: b.min_age,

    maxAge: b.max_age,

    availability: b.availability || [],

    preferredLocations: b.preferred_locations || [],

    photo: b.users?.profile_photo_url
      ? b.users.profile_photo_url
      : (b.users?.name?.charAt(0) || "U"),

    bookingId: b.id,

    bookedAt: b.created_at,
  }));



    setHoldingProfiles(transformed);
    console.log('TRANSFORMED PROFILES:', transformed);

  } catch (err) {
    console.error('Failed to load bookings', err);
  } finally {
    setLoading(false);
  }
};


  const handleProfileSelect = (profile: Profile) => {
    if (!selectedProfile1) {
      setSelectedProfile1(profile);
    } else if (!selectedProfile2 && profile.id !== selectedProfile1.id) {
      setSelectedProfile2(profile);
    } else if (selectedProfile1.id === profile.id) {
      setSelectedProfile1(null);
    } else if (selectedProfile2?.id === profile.id) {
      setSelectedProfile2(null);
    }
  };

  const handleArrange = () => {
    if (selectedProfile1 && selectedProfile2) {
      setShowArrangementModal(true);
    }
  };

 const handleConfirmArrangement = async () => {
  try {
    if (!selectedProfile1 || !selectedProfile2) return;

    console.log('CONFIRM CLICKED', selectedProfile1, selectedProfile2);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

   

   

    const res1 = await fetch(
      'https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_assign_blind_date',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
       body: JSON.stringify({
  booking_id: selectedProfile1.bookingId,

  partner_booking_id: selectedProfile2.bookingId,

  meeting_date: meetingDate,
  meeting_time: meetingTime,
  meeting_location: meetingLocation,

  create_match: false,
}),
      }
    );

   const text1 = await res1.text();

console.log("Response 1:", text1);

let data1;

try {
  data1 = JSON.parse(text1);
} catch {
  console.error("Server returned non-JSON:", text1);
}
    console.log('ASSIGN RESPONSE 1', data1);

    const res2 = await fetch(
      'https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_assign_blind_date',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
       body: JSON.stringify({
  booking_id: selectedProfile2.bookingId,

  partner_booking_id: selectedProfile1.bookingId,

  meeting_date: meetingDate,
  meeting_time: meetingTime,
  meeting_location: meetingLocation,

  create_match: true,
}),
      }
    );

    const data2 = await res2.json();
    console.log('ASSIGN RESPONSE 2', data2);





    await fetchHoldingProfiles();

    setShowArrangementModal(false);
    setSelectedProfile1(null);
    setSelectedProfile2(null);
    setMeetingLocation('');
    setMeetingDate('');
    setMeetingTime('');

  } catch (err) {
    console.error('Arrangement failed', err);
  }
};


 const filteredProfiles = holdingProfiles.filter((profile) => {
  const safeName = (profile.name || '').toLowerCase();
  const safeBookingId = (profile.bookingId || '').toLowerCase();

  const matchesSearch =
    safeName.includes(searchQuery.toLowerCase()) ||
    safeBookingId.includes(searchQuery.toLowerCase());

  const matchesGender =
   genderFilter === "All" ||
profile.gender?.toLowerCase() === genderFilter.toLowerCase()

  return matchesSearch && matchesGender;
});


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl text-white mb-2" style={{ fontWeight: 700 }}>
                Match & Arrange Meetings
              </h1>
              <p className="text-sm text-gray-400">Select two profiles in holding status and arrange their blind date</p>
            </div>
            {selectedProfile1 && selectedProfile2 && (
              <button
                onClick={handleArrange}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg min-h-[44px]"
                style={{ fontWeight: 600 }}
              >
                <Heart className="w-5 h-5" />
                Arrange Meeting
              </button>
            )}
          </div>

          {/* Selection Status Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Selected Profile 1 */}
            <div className={`p-4 rounded-xl border-2 transition-all ${
              selectedProfile1 
                ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-500/50' 
                : 'bg-gray-800/30 border-gray-700/50 border-dashed'
            }`}>
              {selectedProfile1 ? (
                <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
  {(selectedProfile1.photo || '').startsWith('http') ? (
    <img src={selectedProfile1.photo} className="w-full h-full object-cover" />
  ) : (
    <span className="text-white font-bold">{selectedProfile1.photo}</span>
  )}
</div>

                  <div className="flex-1">
                    <p className="text-white" style={{ fontWeight: 600 }}>{selectedProfile1.name}</p>
                    <p className="text-xs text-gray-400">{selectedProfile1.bookingId} • {selectedProfile1.age} • {selectedProfile1.gender}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProfile1(null)}
                    className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <p className="text-sm">Select first profile...</p>
                </div>
              )}
            </div>

            {/* Selected Profile 2 */}
            <div className={`p-4 rounded-xl border-2 transition-all ${
              selectedProfile2 
                ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border-pink-500/50' 
                : 'bg-gray-800/30 border-gray-700/50 border-dashed'
            }`}>
              {selectedProfile2 ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
  {(selectedProfile2.photo || '').startsWith('http') ? (
    <img src={selectedProfile2.photo} className="w-full h-full object-cover" />
  ) : (
    <span className="text-white font-bold">{selectedProfile2.photo}</span>
  )}
</div>
                  <div className="flex-1">
                    <p className="text-white" style={{ fontWeight: 600 }}>{selectedProfile2.name}</p>
                    <p className="text-xs text-gray-400">{selectedProfile2.bookingId} • {selectedProfile2.age} • {selectedProfile2.gender}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProfile2(null)}
                    className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <p className="text-sm">Select second profile...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Users className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Awaiting Arrangement</p>
            <p className="text-3xl text-white" style={{ fontWeight: 700 }}>
              {holdingProfiles.length}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <User className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Male Profiles</p>
            <p className="text-3xl text-white" style={{ fontWeight: 700 }}>
              {holdingProfiles.filter(
  p => p.gender?.toLowerCase() === "male"
).length}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-pink-500/20">
                <User className="w-6 h-6 text-pink-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Female Profiles</p>
            <p className="text-3xl text-white" style={{ fontWeight: 700 }}>
              {holdingProfiles.filter(p => p.gender?.toLowerCase() === "female").length}
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-500"
              />
            </div>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              style={{ fontWeight: 500 }}
            >
              <option>All</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => {
            const isSelected = selectedProfile1?.id === profile.id || selectedProfile2?.id === profile.id;
            const isProfile1 = selectedProfile1?.id === profile.id;
            const isProfile2 = selectedProfile2?.id === profile.id;

            return (
              <motion.div
                key={profile.bookingId}

                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleProfileSelect(profile)}
                className={`cursor-pointer rounded-2xl p-6 transition-all ${
                  isProfile1
                    ? 'bg-gradient-to-br from-blue-500/30 to-indigo-600/30 border-2 border-blue-500 shadow-2xl shadow-blue-500/20'
                    : isProfile2
                    ? 'bg-gradient-to-br from-pink-500/30 to-rose-600/30 border-2 border-pink-500 shadow-2xl shadow-pink-500/20'
                    : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 hover:border-gray-600'
                }`}
              >
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
  {profile.photo?.startsWith('http') ? (
   <img
  src={profile.photo}
  className="w-full h-full object-cover rounded-full"
/>

  ) : (
    <span className="text-white text-xl font-bold">
      {profile.photo}
    </span>
  )}
</div>

                  <div className="flex-1">
                    <h3 className="text-white mb-1" style={{ fontWeight: 700 }}>{profile.name}</h3>
                    <p className="text-xs text-gray-400">{profile.age} years • {profile.gender}</p>
                  </div>
                  {isSelected && (
                    <div className={`p-2 rounded-full ${
                      isProfile1 ? 'bg-blue-500' : 'bg-pink-500'
                    }`}>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Booking Info */}
                <div className="mb-4 p-3 bg-gray-900/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Booking ID</span>
                    <span className="text-xs text-white" style={{ fontWeight: 600 }}>{profile.bookingId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Booked At</span>
                    <span className="text-xs text-gray-400">{new Date(profile.bookedAt).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 mb-3 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{profile.city}</span>
                </div>

                {/* Interests */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-lg"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-2">

  <div>
    <p className="text-xs text-gray-500">City</p>
    <p className="text-sm text-white">
      {profile.city}
    </p>
  </div>

  <div>
    <p className="text-xs text-gray-500">Preferred Match</p>
    <p className="text-sm text-white">
      {profile.preferredGender}
    </p>
  </div>

  <div>
    <p className="text-xs text-gray-500">Age Preference</p>
    <p className="text-sm text-white">
      {profile.minAge} - {profile.maxAge}
    </p>
  </div>

  <div>
    <p className="text-xs text-gray-500">Preferred Locations</p>
    <p className="text-sm text-white">
      {Array.isArray(profile.preferredLocations)
  ? profile.preferredLocations.join(", ")
  : "Not specified"}
    </p>
  </div>

  <div>
    <p className="text-xs text-gray-500">Availability</p>
    {Array.isArray(profile.availability) &&
    profile.availability.map((slot: any) => (
      <p key={slot.day} className="text-sm text-white">
        {slot.day}: {slot.periods.join(", ")}
      </p>
    ))} 
  </div>

  <div>
    <p className="text-xs text-gray-500">Notes</p>

    <p className="text-sm text-gray-300">
      {profile.notes || "No notes"}
    </p>
  </div>

</div>
                </motion.div>
             
                );
              })}
          </div>

      {/* Arrangement Modal */}
      <AnimatePresence>
        {showArrangementModal && selectedProfile1 && selectedProfile2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowArrangementModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-white" style={{ fontWeight: 700 }}>Arrange Blind Date Meeting</h2>
                <button
                  onClick={() => setShowArrangementModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Selected Profiles Display */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white" style={{ fontWeight: 700 }}>
                      <img
  src={selectedProfile1.photo}
  className="w-full h-full object-cover rounded-full"
/>

                    </div>
                    <div>
                      <p className="text-white" style={{ fontWeight: 600 }}>{selectedProfile1.name}</p>
                      <p className="text-xs text-gray-400">{selectedProfile1.age} • {selectedProfile1.gender}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-xl border border-pink-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                      <img
  src={selectedProfile2.photo}
  className="w-full h-full object-cover rounded-full"
/>
                    </div>
                    <div>
                      <p className="text-white" style={{ fontWeight: 600 }}>{selectedProfile2.name}</p>
                      <p className="text-xs text-gray-400">{selectedProfile2.age} • {selectedProfile2.gender}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meeting Details Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2" style={{ fontWeight: 500 }}>
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Meeting Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Starbucks, Phoenix Mall, Mumbai"
                    value={meetingLocation}
                    onChange={(e) => setMeetingLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2" style={{ fontWeight: 500 }}>
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2" style={{ fontWeight: 500 }}>
                      <Clock className="w-4 h-4 inline mr-2" />
                      Time
                    </label>
                    <input
                      type="time"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2" style={{ fontWeight: 500 }}>
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Any special instructions or notes for the participants..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-500 resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowArrangementModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all min-h-[44px]"
                  style={{ fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmArrangement}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg min-h-[44px]"
                  style={{ fontWeight: 600 }}
                >
                  Confirm & Notify Both
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
</div>
  );
}
