import { supabase } from '../../supabase';
import { useBookings } from '../../lib/BookingContext';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  MessageCircle, 
  MoreVertical,
  Heart,
  Filter,
  Search,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Star,
  X,
  BadgeCheck,
} from 'lucide-react';
import { Card } from '../Card';
import { ResponsiveContainer } from '../ui/ResponsiveContainer';
import { ResponsiveButton } from '../ui/ResponsiveButton';
import { api, handleApiError } from '../../lib/api';
import { BookingCard, type BookingCardData } from '../bookings/BookingCard';
import type { Screen } from "../../UserApp";

interface UserBookingDashboardProps {
  onNavigate: (
    page: Screen,
    param?: string
  ) => void;

  setSelectedMeetingId: (id: string) => void;
}

interface PastBooking {
  id: string;
  provider: {
    name: string;
    image: string;
    rating: number;
  };
  date: string;
  time: string;
  location: string;
  type: string;
  status: string;
  amount: number;
  reviewed: boolean;
}

export function UserBookingDashboard({
  onNavigate,
  setSelectedMeetingId
}: UserBookingDashboardProps) {

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'saved'>('upcoming');
 const { bookings } = useBookings();

  const [searchQuery, setSearchQuery] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<PastBooking | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showError, setShowError] = useState(false);
  const [blindDates, setBlindDates] = useState([]);
const [rentFriends, setRentFriends] = useState<any[]>([]);
const [experts, setExperts] = useState([]);
const [errorMessage, setErrorMessage] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);
const [p2pMeetings, setP2pMeetings] = useState<any[]>([]);
const [savedProviders, setSavedProviders] = useState<any[]>([]);
const [currentUserId, setCurrentUserId] = useState<string | null>(null);

useEffect(() => {
  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setCurrentUserId(user.id);

   const { data } = await supabase
  .from("p2p_meetings")
  .select(`
    *,
    user_a:users!p2p_meetings_user_a_fkey (
      id, name, profile_photo_url
    ),
    user_b:users!p2p_meetings_user_b_fkey (
      id, name, profile_photo_url
    )
  `)
  .or(`user_a.eq.${user.id},user_b.eq.${user.id}`);
    if (data) setP2pMeetings(data);
  };

  load();
}, []);

useEffect(() => {
  loadRentFriendBookings();
}, []);

const loadRentFriendBookings = async () => {

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("rent_friend_bookings")
    .select(`
      *,
      providers (
        full_name,
        profile_photo_url,
        avg_rating
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false
    });

  if (error) {
    console.error(
      "Rent friend bookings error:",
      error
    );
    return;
  }

  setRentFriends(data || []);
};

  const maxCharacters = 500;

 const normalizedBookings: BookingCardData[] = bookings.map((b) => {
  // Blind Date booking (your table has preferences column)
  if (b.preferences) {
  const isArranged =
    !!b.meeting_date &&
    !!b.meeting_time &&
    !!b.meeting_location;

  const status =
    b.payment_status === 'refunded'
      ? 'refunded'
      : b.status === 'completed'
      ? 'completed'
      : isArranged
      ? 'confirmed'
      : 'holding';

  return {
    id: b.id,
    type: "blind_date" as const,
    createdAt: b.created_at,
    status,
    date: b.meeting_date ?? 'To be decided',
    time: b.meeting_time ?? 'To be decided',
    location: b.meeting_location ?? 'To be decided',
    amount: b.amount,
    reviewed: false,
    provider: {
      name: 'Blind Date Match',
      image: '/placeholder.jpg',
      rating: null,
    },
  };
}

  // Rent Friend / Expert fallback
  return {
    id: b.id,
    type: "service" as const,
    createdAt: b.created_at,
    status: b.status,
    date: b.booking_date ?? b.consultation_date ?? '—',
    time: b.start_time ?? b.consultation_time ?? '—',
    location: b.location ?? '—',
    amount: b.amount ?? 0,
    reviewed: false,
    provider: {
      name: 'Provider',
      image: '/placeholder.jpg',
      rating: null,
    },
  };
});

// ⭐ P2P NORMALIZATION (MUST BE OUTSIDE THE MAP)
const normalizedP2PBookings = p2pMeetings.map((m) => {
  const peer =
  m.user_a?.id === currentUserId ? m.user_b : m.user_a;

  return {
    id: m.id,
    type: "p2p" as const,
    createdAt: m.created_at,
    status: m.status,

    // BASIC DISPLAY
    date: m.meeting_time
      ? new Date(m.meeting_time).toLocaleDateString()
      : "To be scheduled",

    time: m.meeting_time
      ? new Date(m.meeting_time).toLocaleTimeString()
      : "",

    location: m.meeting_point_text ?? "To be decided",

    // ⭐ IMPORTANT (FOR RIGHT SIDE CARD UI)
    confirmedDate: m.meeting_time
      ? new Date(m.meeting_time).toLocaleDateString()
      : undefined,

    confirmedTime: m.meeting_time
      ? new Date(m.meeting_time).toLocaleTimeString()
      : undefined,

    confirmedLocation: m.meeting_point_text ?? undefined,

    // PEER
    peerName: peer?.name,
    peerImage: peer?.profile_photo_url,
  };
});
// ⭐ MERGE ALL BOOKINGS
const normalizedRentFriendBookings =
  rentFriends.map((b) => ({
    id: b.id,
createdAt: b.created_at,
    type: "service" as const,

    status:
      b.booking_status === "pending"
        ? "holding"
        : b.booking_status,

    date: b.booking_date,

    time: b.booking_time,

    location:
      b.meetup_location || "To be decided",

    amount: b.total_amount || 0,

    reviewed: false,

    provider: {
      name:
        b.providers?.full_name ||
        "Provider",

      image:
        b.providers?.profile_photo_url ||
        "/placeholder.jpg",

      rating:
        b.providers?.avg_rating || 4.8,
    },
    notes:
  b.special_request || "",
  }));

const allBookings = [
  ...normalizedBookings,
  ...normalizedRentFriendBookings,
  ...normalizedP2PBookings
].sort((a, b) => {
  const timeA = a.createdAt
    ? new Date(a.createdAt).getTime()
    : 0;

  const timeB = b.createdAt
    ? new Date(b.createdAt).getTime()
    : 0;

  return timeB - timeA;
});

const activeStatuses = [
  "confirmed",
  "paid_waiting_admin",
  "scheduled",
  "provider_en_route",
  "provider_arrived",
  "in_progress",
  "awaiting_customer_confirmation",
];



const completedBookings = allBookings.filter(
  (b) => b.status === "completed"
);

const refundedBookings = allBookings.filter(
  (b) =>
    b.status === "cancelled" ||
    b.status === "refunded"
);

 



  const handleReviewSubmit = () => {
    if (selectedRating > 0 && reviewText.trim().length > 0) {
      
      setShowReviewModal(false);
      setSelectedBooking(null);
      setSelectedRating(0);
      setReviewText('');
    } else {
      setShowError(true);
    }
  };


function handleBookingClick(booking: BookingCardData): void {
  if (booking.type === "blind_date") {
    onNavigate(
      "blind-date-booking-status",
      booking.id
    );
    return;
  }

  if (booking.type === "p2p") {
    setSelectedMeetingId(booking.id);
    onNavigate("p2p-meeting-confirmation");
    return;
  }

  if (booking.type === "service") {
    onNavigate(
      "rent-friend-booking-details",
      booking.id
    );
    return;
  }
}

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="mb-4">My Bookings</h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2.5 rounded-full text-sm transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                  : 'glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              Upcoming ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2.5 rounded-full text-sm transition-all ${
                activeTab === 'past'
                  ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                  : 'glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              Past ({bookings.length})
            </button>
           
          </div>

          {/* Search */}
          {activeTab !== 'saved' && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Upcoming Bookings */}
       {activeTab === "upcoming" && (
  <>
    {allBookings.length === 0 ? (
      <div className="text-center py-20">
        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          No upcoming bookings
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Your upcoming bookings will appear here.
        </p>
      </div>
    ) : (
      <div className="space-y-6">
        {allBookings.map((booking, index) => (
          <BookingCard
            key={`${booking.type}-${booking.id}`}
            booking={booking}
            index={index}
            onClick={() => handleBookingClick(booking)}
          />
        ))}
      </div>
    )}
  </>
)}

        {/* Past Bookings */}
        {activeTab === 'past' && (
          <>
{completedBookings.map((booking, index) => (
<BookingCard
  key={booking.id}
  booking={booking}
  index={index}
 onClick={() => {

  if (booking.type === "blind_date") {

   onNavigate(
    "blind-date-booking-status",
    booking.id
);
    return;
  }

  if (booking.type === "p2p") {

    setSelectedMeetingId(booking.id);

    onNavigate("p2p-meeting-confirmation");

    return;
  }

  if (booking.type === "service") {

    onNavigate(
      "rent-friend-booking-details",
      booking.id
    );

    return;
  }

}}
/>
))}

{refundedBookings.map((booking, index) => (
 <BookingCard
  key={booking.id}
  booking={booking}
  index={index}
onClick={() => {

  if (booking.type === "blind_date") {

  onNavigate(
    "blind-date-booking-status",
    booking.id
);
    return;
  }

  if (booking.type === "p2p") {

    setSelectedMeetingId(booking.id);

    onNavigate("p2p-meeting-confirmation");

    return;
  }

  if (booking.type === "service") {

    onNavigate(
      "rent-friend-booking-details",
      booking.id
    );

    return;
  }

}}
/>
))}
</>
        )}

        {/* Saved Providers */}
        {activeTab === 'saved' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {savedProviders.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="overflow-hidden group cursor-pointer">
                  <div className="relative h-48 -m-6 mb-4 overflow-hidden">
                    <img
                      src={provider.image}
                      alt={provider.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </motion.button>
                    <div className="absolute bottom-3 left-3">
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        provider.availability 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }`}>
                        {provider.availability ? 'Available' : 'Busy'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4>{provider.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-500 text-sm">★</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {provider.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">from</p>
                        <p className="text-[#3C82F6] dark:text-[#3758FF]">₹{provider.price}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {provider.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-1 bg-[#F2F4F7] dark:bg-[#0A0F1F] rounded-full text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavigate('user-profile')}
                      className="w-full py-2 bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white rounded-full text-sm"
                    >
                      View Profile
                    </motion.button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && selectedBooking && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowReviewModal(false);
                setSelectedBooking(null);
                setSelectedRating(0);
                setReviewText('');
                setShowError(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg glass dark:glass-dark rounded-2xl border border-white/10 dark:border-gray-800/50 backdrop-blur-xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-gray-800/50">
                  <div>
                    <h3 className="text-xl mb-1">Write a Review</h3>
                    <p className="text-sm text-gray-400">
                      How was your experience with {selectedBooking.provider.name}?
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setSelectedBooking(null);
                      setSelectedRating(0);
                      setReviewText('');
                      setShowError(false);
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center flex-shrink-0"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Provider Info */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 dark:bg-white/5">
                    <img
                      src={selectedBooking.provider.image}
                      alt={selectedBooking.provider.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm mb-1">{selectedBooking.provider.name}</h4>
                      <p className="text-xs text-gray-400">{selectedBooking.type}</p>
                      <p className="text-xs text-gray-500">{selectedBooking.date}</p>
                    </div>
                  </div>

                  {/* Rating Selector */}
                  <div>
                    <label className="text-sm text-gray-400 mb-3 block">
                      Your Rating <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            setSelectedRating(star);
                            setShowError(false);
                          }}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              star <= (hoveredRating || selectedRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-700 text-gray-600 hover:text-gray-500'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {showError && selectedRating === 0 && (
                      <p className="text-xs text-red-400 mt-2">Please select a rating</p>
                    )}
                  </div>

                  {/* Review Text Input */}
                  <div>
                    <label className="text-sm text-gray-400 mb-3 block">
                      Your Review <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => {
                        if (e.target.value.length <= maxCharacters) {
                          setReviewText(e.target.value);
                          setShowError(false);
                        }
                      }}
                      placeholder="Share your experience with this service..."
                      rows={6}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-900/50 border-2 transition-all outline-none text-sm text-gray-200 placeholder-gray-500 resize-none ${
                        showError && reviewText.trim().length === 0
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-white/10 focus:border-blue-500'
                      }`}
                    />
                    <div className="flex items-center justify-between mt-2">
                      {showError && reviewText.trim().length === 0 && (
                        <p className="text-xs text-red-400">Please write a review</p>
                      )}
                      <div className="ml-auto text-xs text-gray-500">
                        {reviewText.length} / {maxCharacters}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center gap-3 p-6 border-t border-white/10 dark:border-gray-800/50">
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setSelectedBooking(null);
                      setSelectedRating(0);
                      setReviewText('');
                      setShowError(false);
                    }}
                    className="flex-1 px-6 py-3 rounded-xl glass dark:glass-dark hover:bg-white/5 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReviewSubmit}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm font-medium"
                  >
                    Submit Review
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}