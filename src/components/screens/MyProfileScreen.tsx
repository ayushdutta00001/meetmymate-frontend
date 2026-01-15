import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../Card';
import { Button } from '../Button';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Edit,
  Camera,
  Shield,
  Star,
  Heart,
  Settings,
  LogOut,
  Bell,
  Lock,
  Globe,
  Clock,
  Award,
  TrendingUp,
  Activity,
  Building,
  Cake,
  UserCheck,
  CreditCard,
  MessageSquare,
  CheckCircle,
  Target,
  Zap,
  Coffee,
  Music,
  BookOpen,
  Plane,
  Code,
} from 'lucide-react';
import { UserProfileEditModal } from '../modals/UserProfileEditModal';
import { ResponsiveContainer } from '../ui/ResponsiveContainer';
import { ResponsiveButton } from '../ui/ResponsiveButton';

interface MyProfileScreenProps {
  onNavigate: (page: string) => void;
}

export function MyProfileScreen({ onNavigate }: MyProfileScreenProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'settings'>('overview');

  const [userData, setUserData] = useState({
    name: 'Alex Kumar',
    email: 'alex.kumar@email.com',
    phone: '+91 98765 43210',
    bio: 'Tech enthusiast and coffee lover. Always up for exploring new places and meeting interesting people! I believe in making meaningful connections and love engaging conversations over a cup of coffee. ☕',
    city: 'Mumbai',
    state: 'Maharashtra',
    age: 28,
    profession: 'Software Engineer',
    company: 'Tech Corp',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200',
    verified: true,
    joinDate: 'January 2024',
    interests: ['Technology', 'Coffee', 'Travel', 'Photography', 'Music', 'Reading', 'Coding'],
    languages: ['English', 'Hindi', 'Marathi'],
    gender: 'Male',
    dateOfBirth: '1996-05-15',
    website: 'alexkumar.dev',
    socialMedia: {
      linkedin: 'alex-kumar',
      twitter: '@alexkumar',
      instagram: '@alex.kumar'
    }
  });

  const stats = {
    totalBookings: 24,
    completedMeetings: 18,
    upcomingBookings: 3,
    cancelledBookings: 3,
    totalSpent: 45000,
    reviewsGiven: 15,
    reviewsReceived: 12,
    averageRating: 4.7,
    memberSince: 'Jan 2024',
    responseRate: 95,
    trustScore: 98,
  };

  const recentActivity = [
    {
      id: '1',
      type: 'booking',
      title: 'Booked Business Meetup with Rajesh Kumar',
      description: 'Startup Strategy consultation scheduled for Dec 28',
      time: '2 hours ago',
      icon: Calendar,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      id: '2',
      type: 'review',
      title: 'Left a review for Priya Sharma',
      description: 'Rated 5 stars - "Great experience!"',
      time: '1 day ago',
      icon: Star,
      color: 'from-yellow-500 to-amber-500',
    },
    {
      id: '3',
      type: 'match',
      title: 'New Blind Date Match Found',
      description: 'View your match profile now',
      time: '2 days ago',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: '4',
      type: 'booking',
      title: 'Completed meeting with Arjun Singh',
      description: 'Rent-a-Friend session in Bandra',
      time: '3 days ago',
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: '5',
      type: 'payment',
      title: 'Payment Successful',
      description: '₹2,500 paid for Business Meetup',
      time: '5 days ago',
      icon: CreditCard,
      color: 'from-purple-500 to-violet-500',
    },
  ];

  const badges = [
    { name: 'Early Adopter', icon: Award, earned: true, color: 'from-purple-500 to-violet-500', description: 'Joined in the first month' },
    { name: 'Super User', icon: Star, earned: true, color: 'from-yellow-500 to-amber-500', description: '20+ bookings completed' },
    { name: 'Verified Profile', icon: Shield, earned: true, color: 'from-blue-500 to-cyan-500', description: 'Identity verified' },
    { name: 'Diamond Member', icon: TrendingUp, earned: true, color: 'from-pink-500 to-orange-500', description: 'Premium membership' },
    { name: 'Top Reviewer', icon: MessageSquare, earned: true, color: 'from-green-500 to-emerald-500', description: '15+ reviews given' },
    { name: 'Trusted User', icon: CheckCircle, earned: true, color: 'from-indigo-500 to-blue-500', description: '98% trust score' },
  ];

  const interestIcons: Record<string, any> = {
    Technology: Code,
    Coffee: Coffee,
    Travel: Plane,
    Photography: Camera,
    Music: Music,
    Reading: BookOpen,
    Coding: Code,
  };

  const handleSaveProfile = (updatedProfile: any) => {
    setUserData(updatedProfile);
    console.log('Profile updated:', updatedProfile);
  };

  const handleImageUpload = () => {
    alert('Image upload functionality - integrate with your backend');
  };

  const handleCoverImageUpload = () => {
    alert('Cover image upload functionality - integrate with your backend');
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header with Sticky Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-1">My Profile</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your account and preferences
              </p>
            </div>
            <Button
              variant="primary"
              icon={<Edit className="w-4 h-4" />}
              onClick={() => setShowEditModal(true)}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Cover Image & Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card variant="glass" hover={false} className="overflow-hidden p-0">
            {/* Cover Image */}
            <div className="relative h-48 md:h-64 overflow-hidden">
              <img
                src={userData.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={handleCoverImageUpload}
                className="absolute bottom-4 right-4 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Change Cover
              </button>
            </div>

            {/* Profile Info Section */}
            <div className="p-6 relative">
              {/* Profile Picture - Overlapping */}
              <div className="absolute -top-16 left-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl bg-white dark:bg-gray-800">
                    <img
                      src={userData.image}
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={handleImageUpload}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  {userData.verified && (
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="mt-20 md:mt-0 md:ml-40">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3>{userData.name}</h3>
                      {userData.verified && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {userData.profession} at {userData.company}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{userData.city}, {userData.state}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {userData.joinDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Cake className="w-4 h-4" />
                        <span>{userData.age} years old</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex gap-3">
                    <div className="text-center px-4 py-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <div className="text-xl mb-1">{stats.totalBookings}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Bookings</div>
                    </div>
                    <div className="text-center px-4 py-2 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
                      <div className="text-xl mb-1">{stats.averageRating}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
                    </div>
                    <div className="text-center px-4 py-2 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <div className="text-xl mb-1">{stats.trustScore}%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Trust</div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {userData.bio}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Detailed Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6"
        >
          <Card variant="glass" hover={true}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl mb-1">{stats.totalBookings}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Bookings</div>
            </div>
          </Card>

          <Card variant="glass" hover={true}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl mb-1">{stats.completedMeetings}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
            </div>
          </Card>

          <Card variant="glass" hover={true}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl mb-1">{stats.upcomingBookings}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Upcoming</div>
            </div>
          </Card>

          <Card variant="glass" hover={true}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl mb-1">{stats.averageRating}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Avg Rating</div>
            </div>
          </Card>

          <Card variant="glass" hover={true}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl mb-1">₹{(stats.totalSpent / 1000).toFixed(0)}k</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Spent</div>
            </div>
          </Card>

          <Card variant="glass" hover={true}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl mb-1">{stats.trustScore}%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Trust Score</div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-6"
        >
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all text-sm ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              Overview
            </span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all text-sm ${
              activeTab === 'activity'
                ? 'bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Activity className="w-4 h-4" />
              Activity
            </span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all text-sm ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </span>
          </button>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Personal Information */}
              <Card variant="glass" hover={false}>
                <div className="flex items-center justify-between mb-4">
                  <h3>Personal Information</h3>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Email</div>
                      <div className="text-sm truncate">{userData.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Phone</div>
                      <div className="text-sm truncate">{userData.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Location</div>
                      <div className="text-sm truncate">{userData.city}, {userData.state}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Profession</div>
                      <div className="text-sm truncate">{userData.profession}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Company</div>
                      <div className="text-sm truncate">{userData.company}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <UserCheck className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Gender</div>
                      <div className="text-sm truncate">{userData.gender}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                      <Cake className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</div>
                      <div className="text-sm truncate">{new Date(userData.dateOfBirth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Website</div>
                      <div className="text-sm truncate text-blue-600 dark:text-blue-400">{userData.website}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Interests & Languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="glass" hover={false}>
                  <div className="flex items-center justify-between mb-4">
                    <h3>Interests</h3>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {userData.interests.map((interest) => {
                      const Icon = interestIcons[interest] || Heart;
                      return (
                        <span
                          key={interest}
                          className="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 text-sm flex items-center gap-2"
                        >
                          <Icon className="w-4 h-4" />
                          {interest}
                        </span>
                      );
                    })}
                  </div>
                </Card>

                <Card variant="glass" hover={false}>
                  <div className="flex items-center justify-between mb-4">
                    <h3>Languages</h3>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {userData.languages.map((language) => (
                      <span
                        key={language}
                        className="px-3 py-2 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 text-sm flex items-center gap-2"
                      >
                        <Globe className="w-4 h-4" />
                        {language}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Achievements & Badges */}
              <Card variant="glass" hover={false}>
                <h3 className="mb-4">Achievements & Badges</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {badges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <motion.div
                        key={badge.name}
                        whileHover={{ scale: 1.05 }}
                        className={`p-4 rounded-xl text-center cursor-pointer transition-all ${
                          badge.earned
                            ? `bg-gradient-to-br ${badge.color}`
                            : 'bg-gray-100 dark:bg-gray-800 opacity-50'
                        }`}
                        title={badge.description}
                      >
                        <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                          badge.earned ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                          <Icon className={`w-6 h-6 ${badge.earned ? 'text-white' : 'text-gray-400'}`} />
                        </div>
                        <div className={`text-xs ${badge.earned ? 'text-white' : 'text-gray-500'}`}>
                          {badge.name}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>

              {/* Social Media */}
              <Card variant="glass" hover={false}>
                <h3 className="mb-4">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      L
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">LinkedIn</div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">{userData.socialMedia.linkedin}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20">
                    <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white">
                      T
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Twitter</div>
                      <div className="text-sm text-sky-600 dark:text-sky-400">{userData.socialMedia.twitter}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 dark:bg-pink-900/20">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white">
                      I
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Instagram</div>
                      <div className="text-sm text-pink-600 dark:text-pink-400">{userData.socialMedia.instagram}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Card variant="glass" hover={false}>
                <h3 className="mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      >
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${activity.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm mb-1">{activity.title}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            {activity.description}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card variant="glass" hover={false}>
                <h3 className="mb-4">Account Settings</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigate('settings')}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm">General Settings</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          App preferences and configurations
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>

                  <button
                    onClick={() => onNavigate('notifications')}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm">Notifications</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Manage notification preferences
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>

                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm">Privacy & Security</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Manage your privacy settings
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>

                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm">Language & Region</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Change app language and region
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                </div>
              </Card>

              <Card variant="glass" hover={false}>
                <h3 className="mb-4 text-red-600 dark:text-red-400">Danger Zone</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                        <LogOut className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm text-red-600 dark:text-red-400">Log Out</div>
                        <div className="text-xs text-red-500 dark:text-red-400/70">
                          Sign out of your account
                        </div>
                      </div>
                    </div>
                    <span className="text-red-400">→</span>
                  </button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <UserProfileEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          initialProfile={userData}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}