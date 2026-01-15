import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Users,
  UserPlus,
  Crown,
  CheckCircle,
  Award,
  Lock,
  Shield,
  AlertCircle,
  Clock,
  MapPin,
  Briefcase,
  DollarSign,
  Target,
  Send,
  Calendar,
  FileText,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Check,
  X,
  Bell,
  Video,
  MapPinned,
  Timer,
  TrendingDown,
  Zap,
  MessageSquare,
  ExternalLink,
  Star,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { BackButton } from '../ui/BackButton';
import { FilterButton } from '../ui/FilterButton';
import { ExpertEntryScreen } from '../ExpertEntryScreen';
import { ExpertSignup } from '../ExpertSignup';
import { ExpertAccessScreen } from '../ExpertAccessScreen';

interface FindExperiencedScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
  hasBusinessMeetupSubscription?: boolean;
}

type ViewMode = 'entry' | 'customer-discovery' | 'slot-booking' | 'expert-signup' | 'expert-dashboard' | 'expert-access';
type SubscriptionTier = 'free' | 'gold' | 'platinum' | 'diamond';
type VerificationStatus = 'none' | 'pending' | 'approved' | 'rejected';

interface TimeSlot {
  id: number;
  date: string;
  time: string;
  available: boolean;
  price: number;
}

interface ExperiencedProfile {
  id: number;
  name: string;
  expertise: string;
  yearsOfExperience: number;
  image: string;
  verified: boolean;
  rating: number;
  totalReviews: number;
  bio: string;
  hourlyRate: number;
  availableSlots: TimeSlot[];
  badges: string[];
}

interface Booking {
  id: number;
  userName: string;
  userImage: string;
  date: string;
  time: string;
  duration: string;
  amount: number;
  meetingMode: 'Online' | 'Offline';
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface Earning {
  id: number;
  date: string;
  userName: string;
  amount: number;
  commission: number;
  netEarning: number;
  payoutStatus: 'pending' | 'paid';
}

export function FindExperiencedScreen({ onNavigate, onBack, hasBusinessMeetupSubscription = false }: FindExperiencedScreenProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('entry');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<ExperiencedProfile | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  
  // Filters
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');

  // Subscription tier simulation (Diamond plan active)
  const subscriptionTier: SubscriptionTier = 'diamond';

  // Calendar state for availability management
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>([
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ]);
  const [newSlotTime, setNewSlotTime] = useState('');

  // Expert Dashboard active tab - MOVED TO TOP LEVEL
  const [activeTab, setActiveTab] = useState<'availability' | 'bookings' | 'earnings'>('availability');

  // New availability form state
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotTimeValue, setNewSlotTimeValue] = useState('');
  const [newSlotLocation, setNewSlotLocation] = useState<'Online' | 'Offline'>('Online');
  
  // Available slots with full details
  interface AvailabilitySlot {
    id: number;
    date: string;
    time: string;
    location: 'Online' | 'Offline';
  }
  
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([
    { id: 1, date: '2024-12-24', time: '10:00 AM', location: 'Online' },
    { id: 2, date: '2024-12-24', time: '02:00 PM', location: 'Offline' },
    { id: 3, date: '2024-12-25', time: '11:00 AM', location: 'Online' },
    { id: 4, date: '2024-12-26', time: '09:00 AM', location: 'Online' },
  ]);

  // Mock experienced people data
  const [experiencedPeople] = useState<ExperiencedProfile[]>([
    {
      id: 1,
      name: 'Dr. Arvind Kumar',
      expertise: 'Startup Strategy',
      yearsOfExperience: 15,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      verified: true,
      rating: 4.9,
      totalReviews: 127,
      bio: 'Serial entrepreneur with 3 exits. Helped 200+ startups scale from idea to Series A.',
      hourlyRate: 5000,
      badges: ['Verified Expert', 'Top Rated', 'Fast Response'],
      availableSlots: [
        { id: 1, date: '2024-12-24', time: '10:00 AM', available: true, price: 5000 },
        { id: 2, date: '2024-12-24', time: '02:00 PM', available: true, price: 5000 },
        { id: 3, date: '2024-12-25', time: '11:00 AM', available: true, price: 5000 },
        { id: 4, date: '2024-12-26', time: '09:00 AM', available: true, price: 5000 },
      ]
    },
    {
      id: 2,
      name: 'Priya Sharma',
      expertise: 'Legal & Compliance',
      yearsOfExperience: 12,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      verified: true,
      rating: 5.0,
      totalReviews: 89,
      bio: 'Corporate lawyer specializing in startup legal, IP, and compliance matters.',
      hourlyRate: 4000,
      badges: ['Verified Expert', 'Legal Specialist'],
      availableSlots: [
        { id: 5, date: '2024-12-23', time: '03:00 PM', available: true, price: 4000 },
        { id: 6, date: '2024-12-24', time: '11:00 AM', available: true, price: 4000 },
        { id: 7, date: '2024-12-25', time: '04:00 PM', available: true, price: 4000 },
      ]
    },
    {
      id: 3,
      name: 'Rajesh Patel',
      expertise: 'Finance & Fundraising',
      yearsOfExperience: 18,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      verified: true,
      rating: 4.8,
      totalReviews: 156,
      bio: 'Ex-CFO turned consultant. Expertise in financial modeling, fundraising, and investor relations.',
      hourlyRate: 6000,
      badges: ['Verified Expert', 'Top Rated', 'Finance Expert'],
      availableSlots: [
        { id: 8, date: '2024-12-24', time: '09:00 AM', available: true, price: 6000 },
        { id: 9, date: '2024-12-24', time: '03:00 PM', available: true, price: 6000 },
        { id: 10, date: '2024-12-26', time: '10:00 AM', available: true, price: 6000 },
      ]
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      expertise: 'Tech & Product',
      yearsOfExperience: 10,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      verified: true,
      rating: 4.9,
      totalReviews: 103,
      bio: 'Product leader at top tech companies. Specializing in product strategy and tech stack decisions.',
      hourlyRate: 4500,
      badges: ['Verified Expert', 'Tech Specialist'],
      availableSlots: [
        { id: 11, date: '2024-12-23', time: '02:00 PM', available: true, price: 4500 },
        { id: 12, date: '2024-12-25', time: '10:00 AM', available: true, price: 4500 },
        { id: 13, date: '2024-12-26', time: '03:00 PM', available: true, price: 4500 },
      ]
    }
  ]);

  // Mock bookings data (for expert dashboard)
  const [upcomingBookings] = useState<Booking[]>([
    {
      id: 1,
      userName: 'Amit Verma',
      userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      date: '2024-12-24',
      time: '10:00 AM',
      duration: '60 mins',
      amount: 5000,
      meetingMode: 'Online',
      status: 'upcoming'
    },
    {
      id: 2,
      userName: 'Neha Singh',
      userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: '2024-12-25',
      time: '02:00 PM',
      duration: '60 mins',
      amount: 5000,
      meetingMode: 'Offline',
      status: 'upcoming'
    }
  ]);

  // Mock earnings data
  const [earnings] = useState<Earning[]>([
    {
      id: 1,
      date: '2024-12-15',
      userName: 'Rahul Sharma',
      amount: 5000,
      commission: 750,
      netEarning: 4250,
      payoutStatus: 'paid'
    },
    {
      id: 2,
      date: '2024-12-18',
      userName: 'Priya Gupta',
      amount: 5000,
      commission: 750,
      netEarning: 4250,
      payoutStatus: 'pending'
    },
    {
      id: 3,
      date: '2024-12-19',
      userName: 'Vikram Patel',
      amount: 5000,
      commission: 750,
      netEarning: 4250,
      payoutStatus: 'pending'
    }
  ]);

  const totalEarnings = earnings.reduce((sum, e) => sum + e.netEarning, 0);
  const pendingPayout = earnings.filter(e => e.payoutStatus === 'pending').reduce((sum, e) => sum + e.netEarning, 0);

  const handleBookSlot = (expert: ExperiencedProfile, slot: TimeSlot) => {
    if (subscriptionTier === 'free') {
      onNavigate('business-meetup-subscription');
      return;
    }
    setSelectedExpert(expert);
    setSelectedSlot(slot);
    setViewMode('slot-booking');
  };

  const handleConfirmBooking = () => {
    alert('Payment flow would open here. After successful payment, booking is confirmed and both parties are notified.');
    setViewMode('discovery');
    setSelectedExpert(null);
    setSelectedSlot(null);
  };

  const handleAddSlot = () => {
    if (!newSlotDate || !newSlotTimeValue || !newSlotLocation) {
      alert('Please fill all fields: date, time, and location');
      return;
    }
    
    const newSlot: AvailabilitySlot = {
      id: availabilitySlots.length + 1,
      date: newSlotDate,
      time: newSlotTimeValue,
      location: newSlotLocation
    };
    
    setAvailabilitySlots([...availabilitySlots, newSlot]);
    setNewSlotDate('');
    setNewSlotTimeValue('');
    setNewSlotLocation('Online');
  };

  const handleRemoveAvailabilitySlot = (slotId: number) => {
    setAvailabilitySlots(availabilitySlots.filter(s => s.id !== slotId));
  };

  const handleRemoveSlot = (slot: string) => {
    setTimeSlots(timeSlots.filter(s => s !== slot));
  };

  // Discovery Screen
  const renderDiscoveryScreen = () => {
    const filteredExperts = experiencedPeople.filter(expert => {
      if (searchQuery && !expert.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !expert.expertise.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedExpertise !== 'all' && expert.expertise !== selectedExpertise) {
        return false;
      }
      if (selectedExperience !== 'all') {
        const years = parseInt(selectedExperience);
        if (expert.yearsOfExperience < years) {
          return false;
        }
      }
      return true;
    });

    return (
      <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 glass dark:glass-dark border-b border-white/20 dark:border-gray-800/50 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-4">
              <BackButton onClick={onBack} />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2>Find Experienced People</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Book sessions with verified professionals
                  </p>
                </div>
              </div>

              {/* Subscription + Become Expert Buttons */}
              <div className="ml-auto flex items-center gap-3">
                <button
                  onClick={() => onNavigate('business-meetup-subscription')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg transition-all"
                >
                  <Crown className="w-4 h-4" />
                  <span className="text-sm">
                    {subscriptionTier === 'diamond' ? 'Diamond Plan' : 'Upgrade Plan'}
                  </span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm backdrop-blur-xl"
              />
              <FilterButton
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  showFilters ? 'bg-orange-500 text-white' : 'glass dark:glass-dark hover:bg-orange-500 hover:text-white'
                }`}
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                {/* Expertise Filter */}
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Expertise</label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {['all', 'Startup Strategy', 'Legal & Compliance', 'Finance & Fundraising', 'Tech & Product', 'Marketing', 'Sales'].map((expertise) => (
                      <button
                        key={expertise}
                        onClick={() => setSelectedExpertise(expertise)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all ${
                          selectedExpertise === expertise
                            ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                            : 'glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10'
                        }`}
                      >
                        {expertise === 'all' ? 'All Expertise' : expertise}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Years of Experience</label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {['all', '5', '10', '15'].map((years) => (
                      <button
                        key={years}
                        onClick={() => setSelectedExperience(years)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all ${
                          selectedExperience === years
                            ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                            : 'glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10'
                        }`}
                      >
                        {years === 'all' ? 'All Experience' : `${years}+ years`}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Expert Profiles */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredExperts.map((expert, index) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
              >
                {/* Expert Header */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg">{expert.name}</h3>
                      {expert.verified && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          <Shield className="w-3 h-3" />
                          <span className="text-xs">Verified</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{expert.expertise}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm">{expert.rating}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">({expert.totalReviews})</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        {expert.yearsOfExperience}+ years
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex gap-2 mb-4">
                  {expert.badges.map((badge, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                      {badge}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{expert.bio}</p>

                {/* Hourly Rate */}
                <div className="flex items-center gap-2 mb-4 p-3 rounded-xl glass dark:glass-dark">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm">Hourly Rate:</span>
                  <span className="ml-auto">₹{expert.hourlyRate.toLocaleString()}</span>
                </div>

                {/* Available Slots */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Available Slots</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {expert.availableSlots.slice(0, 4).map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => handleBookSlot(expert, slot)}
                        className="p-3 rounded-xl glass dark:glass-dark hover:bg-orange-500/10 hover:border-orange-500/20 border border-transparent transition-all text-left"
                      >
                        <p className="text-xs text-gray-500 dark:text-gray-500">{slot.date}</p>
                        <p className="text-sm">{slot.time}</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">₹{slot.price}</p>
                      </button>
                    ))}
                  </div>
                  {expert.availableSlots.length > 4 && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
                      +{expert.availableSlots.length - 4} more slots available
                    </p>
                  )}
                </div>

                {/* Book Button */}
                {subscriptionTier === 'free' ? (
                  <button
                    onClick={() => onNavigate('business-meetup-subscription')}
                    className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2 relative group"
                  >
                    <Lock className="w-5 h-5" />
                    <span>View All Slots</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedExpert(expert);
                      setViewMode('slot-booking');
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>View All Slots & Book</span>
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {filteredExperts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">No experts found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Slot Booking Screen
  const renderSlotBookingScreen = () => {
    if (!selectedExpert) return null;

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
              <BackButton
                onClick={() => {
                  setViewMode('customer-discovery');
                  setSelectedExpert(null);
                  setSelectedSlot(null);
                }}
              />
              <div className="flex items-center gap-3">
                <img
                  src={selectedExpert.image}
                  alt={selectedExpert.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h2>Book Session with {selectedExpert.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedExpert.expertise}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Available Slots */}
            <div>
              <h3 className="mb-4">Select Available Slot</h3>
              <div className="space-y-3">
                {selectedExpert.availableSlots.map((slot) => (
                  <motion.button
                    key={slot.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full p-4 rounded-xl transition-all text-left ${
                      selectedSlot?.id === slot.id
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                        : 'glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5 border border-white/20 dark:border-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${selectedSlot?.id === slot.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-500'}`}>
                          {slot.date}
                        </p>
                        <p className="text-lg">{slot.time}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${selectedSlot?.id === slot.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-500'}`}>
                          Session Fee
                        </p>
                        <p className="text-lg">₹{slot.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Booking Summary */}
            <div>
              <h3 className="mb-4">Booking Summary</h3>
              <div className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 sticky top-24">
                {selectedSlot ? (
                  <>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Expert</span>
                        <span className="text-sm">{selectedExpert.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Expertise</span>
                        <span className="text-sm">{selectedExpert.expertise}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                        <span className="text-sm">{selectedSlot.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Time</span>
                        <span className="text-sm">{selectedSlot.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                        <span className="text-sm">60 minutes</span>
                      </div>
                      <div className="h-px bg-white/10 dark:bg-gray-800/50"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Session Fee</span>
                        <span className="text-sm">₹{selectedSlot.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Platform Fee (15%)</span>
                        <span className="text-sm">₹{(selectedSlot.price * 0.15).toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-white/10 dark:bg-gray-800/50"></div>
                      <div className="flex items-center justify-between">
                        <span>Total Amount</span>
                        <span className="text-xl">₹{(selectedSlot.price * 1.15).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="glass dark:glass-dark rounded-xl p-4 mb-6 bg-blue-500/5 border border-blue-500/20">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            <strong>Payment Terms:</strong>
                          </p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• Payment required upfront to confirm booking</li>
                            <li>• Slot will be reserved upon successful payment</li>
                            <li>• Both parties will receive email confirmation</li>
                            <li>• Expert receives weekly payout (every Monday)</li>
                            <li>• Platform commission: 15%</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleConfirmBooking}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Proceed to Payment</span>
                    </button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Select a time slot to continue
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Expert Dashboard Screen
  const renderExpertDashboardScreen = () => {
    return (
      <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 glass dark:glass-dark border-b border-white/20 dark:border-gray-800/50 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewMode('entry')}
                className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2>Expert Dashboard</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage availability & earnings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Total Bookings</p>
                  <p className="text-2xl">{upcomingBookings.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Total Earnings</p>
                  <p className="text-2xl">₹{(totalEarnings / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Pending Payout</p>
                  <p className="text-2xl">₹{(pendingPayout / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Rating</p>
                  <p className="text-2xl">4.9</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('availability')}
              className={`px-6 py-3 rounded-xl transition-all ${
                activeTab === 'availability'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                  : 'glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5'
              }`}
            >
              Manage Availability
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 rounded-xl transition-all ${
                activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                  : 'glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5'
              }`}
            >
              Upcoming Bookings
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`px-6 py-3 rounded-xl transition-all ${
                activeTab === 'earnings'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                  : 'glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5'
              }`}
            >
              Earnings Record
            </button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'availability' && (
              <motion.div
                key="availability"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50">
                  <h3 className="mb-4">Set Your Availability</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Add time slots when you're available for bookings. Users can only book from these pre-set slots.
                  </p>

                  {/* Add Slot */}
                  <div className="glass dark:glass-dark rounded-xl p-4 mb-6 bg-blue-500/5 border border-blue-500/20">
                    <h4 className="text-sm mb-4">Add New Time Slot</h4>
                    <div className="flex gap-3">
                      <input
                        type="date"
                        value={newSlotDate}
                        onChange={(e) => setNewSlotDate(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                      />
                      <input
                        type="time"
                        value={newSlotTimeValue}
                        onChange={(e) => setNewSlotTimeValue(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                      />
                      <select
                        value={newSlotLocation}
                        onChange={(e) => setNewSlotLocation(e.target.value as 'Online' | 'Offline')}
                        className="flex-1 px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                      </select>
                      <button
                        onClick={handleAddSlot}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add Slot</span>
                      </button>
                    </div>
                  </div>

                  {/* Current Slots */}
                  <h4 className="text-sm mb-4">Your Available Time Slots</h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    {availabilitySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-start justify-between p-4 rounded-xl glass dark:glass-dark border border-white/20 dark:border-gray-800/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{slot.date}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span className="text-sm">{slot.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {slot.location === 'Online' ? (
                              <Video className="w-4 h-4 text-green-600 dark:text-green-400" />
                            ) : (
                              <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            )}
                            <span className="text-xs">{slot.location}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveAvailabilitySlot(slot.id)}
                          className="w-6 h-6 rounded-lg hover:bg-red-500/10 flex items-center justify-center transition-all"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h3 className="mb-4">Upcoming Bookings</h3>
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={booking.userImage}
                            alt={booking.userName}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <h4 className="mb-1">{booking.userName}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {booking.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {booking.time}
                              </span>
                              <span className="flex items-center gap-1">
                                {booking.meetingMode === 'Online' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                {booking.meetingMode}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Session Fee</p>
                          <p className="text-xl">₹{booking.amount.toLocaleString()}</p>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'earnings' && (
              <motion.div
                key="earnings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-green-500/20 bg-green-500/5 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Earnings</p>
                      <p className="text-3xl">₹{totalEarnings.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Payout</p>
                      <p className="text-3xl text-orange-600 dark:text-orange-400">₹{pendingPayout.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    💰 Payouts are processed weekly every Monday. Platform commission: 15%
                  </p>
                </div>

                <h3 className="mb-4">Earnings Record</h3>
                <div className="space-y-3">
                  {earnings.map((earning) => (
                    <motion.div
                      key={earning.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass dark:glass-dark rounded-xl p-4 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm mb-1">{earning.userName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">{earning.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Session: ₹{earning.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-red-500">
                            Commission: -₹{earning.commission.toLocaleString()}
                          </p>
                          <p className="text-sm mt-1">
                            Net: <span className="text-green-600 dark:text-green-400">₹{earning.netEarning.toLocaleString()}</span>
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            earning.payoutStatus === 'paid'
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                              : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                          }`}>
                            {earning.payoutStatus}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      {viewMode === 'entry' && (
        <ExpertEntryScreen
          onBack={onBack}
          onSelectCustomer={() => setViewMode('customer-discovery')}
          onSelectExpert={() => setViewMode('expert-access')}
          onNavigate={onNavigate}
        />
      )}
      {viewMode === 'customer-discovery' && renderDiscoveryScreen()}
      {viewMode === 'slot-booking' && renderSlotBookingScreen()}
      {viewMode === 'expert-signup' && (
        <ExpertSignup
          onBack={() => setViewMode('entry')}
          onNavigate={onNavigate}
          onGoToDashboard={() => setViewMode('expert-dashboard')}
          hasBusinessMeetupSubscription={hasBusinessMeetupSubscription}
        />
      )}
      {viewMode === 'expert-dashboard' && renderExpertDashboardScreen()}
      {viewMode === 'expert-access' && (
        <ExpertAccessScreen
          onBack={() => setViewMode('entry')}
          onNavigate={onNavigate}
          onGoToVerification={() => setViewMode('expert-signup')}
          onGoToDashboard={() => setViewMode('expert-dashboard')}
          isVerified={true}
          hasBusinessMeetupSubscription={hasBusinessMeetupSubscription}
        />
      )}
    </AnimatePresence>
  );
}