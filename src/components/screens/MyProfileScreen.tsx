import { supabase } from '../../supabase';

import React, { useEffect, useState, useRef } from 'react';
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
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [userData, setUserData] = useState<any | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadProfile();
}, []);

async function loadProfile() {
  try {
    setLoading(true);

    const res = await supabase.functions.invoke('get_my_profile');

    if (res?.data) {
      const parsed =
        typeof res.data === 'string'
          ? JSON.parse(res.data)
          : res.data;

      setUserData({
  ...parsed,
  interests: Array.isArray(parsed.interests) ? parsed.interests : [],
  languages: Array.isArray(parsed.languages) ? parsed.languages : [],
});

    }
  } catch (err) {
    console.error('Profile load failed:', err);
  } finally {
    setLoading(false);
  }
}

 

  

  const interestIcons: Record<string, any> = {
    Technology: Code,
    Coffee: Coffee,
    Travel: Plane,
    Photography: Camera,
    Music: Music,
    Reading: BookOpen,
    Coding: Code,
  };

 
  
 

  async function handleSaveProfile(updatedProfile: any) {
console.log("LANGUAGES:", updatedProfile.languages);
  // ✅ VALIDATE FIRST
 if (!updatedProfile.gender || updatedProfile.gender.trim() === "") {
  alert("Please select gender");
  return;
}
console.log("GENDER VALUE:", updatedProfile.gender);
  const { error } = await supabase
    .from('users')
    .update({
      name: updatedProfile.name || "",
      bio: updatedProfile.bio || "",
      city: updatedProfile.city || "",
      interests: Array.isArray(updatedProfile.interests)
        ? updatedProfile.interests
        : [],
      languages: Array.isArray(updatedProfile.languages)
        ? updatedProfile.languages
        : [],
      gender:
  updatedProfile.gender &&
  updatedProfile.gender.trim() !== ""
    ? updatedProfile.gender
    : "other",
      age: updatedProfile.age || 18,
    })
    .eq('id', userData.id);

  console.log("ERROR:", error);

  if (!error) {
    setUserData({ ...userData, ...updatedProfile });
    setShowEditModal(false);
  }
}


 async function onProfileFileSelected(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const file = e.target.files?.[0];
  if (!file) return;
if (file.size > 2 * 1024 * 1024) {
  alert("Image must be under 2MB");
  return;
}

  try {
    setUploadingPhoto(true);

    const formData = new FormData();
    formData.append("file", file);

    const { error } = await supabase.functions.invoke(
      "upload_user_profile_photo",
      { body: formData }
    );

   if (!error) {
  setUserData((prev: any) => ({
    ...prev,
    profile_photo_url:
      `${prev.profile_photo_url}?v=${Date.now()}`,
  }));
}

  } catch (err) {
    console.error("Profile photo upload failed", err);
  } finally {
    setUploadingPhoto(false);
  }
}

  
if (loading || !userData) {
  return <div className="p-6 text-center">Loading profile…</div>;
}

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
  src={
    userData.cover_photo_url ||
    '/magnific__talk__65708.png'
  }
  alt="Cover"
  className="w-full h-full object-cover"
  onError={(e) => {
    (e.currentTarget as HTMLImageElement).src =
      '/magnific__talk__65708.png';
  }}
/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
  disabled
  className="absolute bottom-4 right-4 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl opacity-60 cursor-not-allowed flex items-center gap-2"
>
  <Camera className="w-4 h-4" />
  Change Cover (Coming Soon)
</button>

            </div>

            {/* Profile Info Section */}
            <div className="p-6 relative">
              {/* Profile Picture - Overlapping */}
              <div className="absolute -top-16 left-6">
                <div className="relative">
                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl bg-white dark:bg-gray-800">
  <img
    src={`${userData.profile_photo_url}?v=${userData.updated_at ?? Date.now()}`}
    alt={userData.name}
    className="w-full h-full object-cover cursor-pointer"
    onClick={() => setShowProfilePhoto(true)}
    onError={(e) => {
      (e.currentTarget as HTMLImageElement).src = "/default-avatar.png";
    }}
  />
</div>
              <input
  type="file"
  accept="image/*"
  ref={fileInputRef}
  onChange={onProfileFileSelected}
  className="hidden"
/>

<button
  disabled={uploadingPhoto}
  onClick={() => fileInputRef.current?.click()}
  aria-label="Change profile photo"
  className={`
    absolute bottom-0 right-0
    w-11 h-11
    rounded-l-sm
    flex items-center justify-center
    shadow-sm
    transition-all duration-200
    border-2 border-white dark:border-gray-800
    bg-blue-600
    ${
      uploadingPhoto
        ? "opacity-60 cursor-not-allowed"
        : "hover:scale-110 hover:bg-blue-500 cursor-pointer"
    }
  `}
>
<Edit
    className="w-5 h-5 text-black dark:text-white"
    strokeWidth={2.5}
  />
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
                      <div className="text-xl mb-1">{userData.totalBookings || 0}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Bookings</div>
                    </div>
                    <div className="text-center px-4 py-2 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
                      <div className="text-xl mb-1">{userData.averageRating || '0.0'}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
                    </div>
                    <div className="text-center px-4 py-2 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <div className="text-xl mb-1">{userData.trustScore || 0}%</div>
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
                      <div className="text-xs text-gray-500 dark:text-gray-400">
  Age
</div>

{userData.age ? (
  <span className="text-sm">
    {userData.age} years old
  </span>
) : (
  <span className="text-sm text-gray-500 dark:text-gray-400">
    Not set
  </span>
)}
                      
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
                    {(userData.interests ?? []).map((interest) => {

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
                    {(userData.languages ?? []).map((language) => (

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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Photo Viewer */}
<AnimatePresence>
  {showProfilePhoto && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setShowProfilePhoto(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-4xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={`${userData.profile_photo_url}?v=${userData.updated_at ?? Date.now()}`}
          alt={userData.name}
          className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "/public/default-avatar.png";
          }}
        />

        {/* Close Button */}
        <button
          onClick={() => setShowProfilePhoto(false)}
          className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="Close photo viewer"
        >
          ✕
        </button>

        {/* Change Photo Button */}
        <button
          disabled={uploadingPhoto}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className={`absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/70 backdrop-blur-sm text-white border border-white/20 shadow-lg
            ${uploadingPhoto ? "opacity-60 cursor-not-allowed" : "hover:bg-black/90"}
          `}
        >
          <Camera className="w-4 h-4" />
          Change Photo
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

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
    </div>
  );
}