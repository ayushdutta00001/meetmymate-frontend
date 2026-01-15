import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Save,
  CheckCircle,
  Plus,
  Trash2
} from 'lucide-react';

interface ProfileData {
  name: string;
  phone: string;
  email: string;
  bio: string;
  interests: string[];
  languages: string[];
  city: string;
  hourlyRate: number;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile: ProfileData;
  onSave: (profile: ProfileData) => void;
}

export function ProfileEditModal({ isOpen, onClose, initialProfile, onSave }: ProfileEditModalProps) {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [newInterest, setNewInterest] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile({ ...profile, interests: [...profile.interests, newInterest.trim()] });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setProfile({ ...profile, interests: profile.interests.filter(i => i !== interest) });
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !profile.languages.includes(newLanguage.trim())) {
      setProfile({ ...profile, languages: [...profile.languages, newLanguage.trim()] });
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setProfile({ ...profile, languages: profile.languages.filter(l => l !== language) });
  };

  const handleSave = () => {
    onSave(profile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-white dark:bg-[#1a1f2e] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="mb-0">Edit Profile</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update your information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg glass dark:glass-dark flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-purple-500 dark:focus:border-purple-400 transition-all outline-none text-sm"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-purple-500 dark:focus:border-purple-400 transition-all outline-none text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-purple-500 dark:focus:border-purple-400 transition-all outline-none text-sm"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                  Bio <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell customers about yourself..."
                  rows={4}
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-purple-500 dark:focus:border-purple-400 transition-all outline-none text-sm resize-none"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {profile.bio.length}/200 characters
                </p>
              </div>

              {/* Languages */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                  Languages Spoken
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.languages.map((language) => (
                      <span
                        key={language}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm"
                      >
                        <Globe className="w-3 h-3" />
                        {language}
                        <button
                          onClick={() => removeLanguage(language)}
                          className="hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                      placeholder="Add a language"
                      className="flex-1 px-4 py-2 rounded-lg glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-sm"
                    />
                    <button
                      onClick={addLanguage}
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                  Interests & Hobbies
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-sm"
                      >
                        <MessageCircle className="w-3 h-3" />
                        {interest}
                        <button
                          onClick={() => removeInterest(interest)}
                          className="hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                      placeholder="Add an interest"
                      className="flex-1 px-4 py-2 rounded-lg glass dark:glass-dark border-2 border-transparent focus:border-purple-500 dark:focus:border-purple-400 transition-all outline-none text-sm"
                    />
                    <button
                      onClick={addInterest}
                      className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                  Hourly Rate (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={profile.hourlyRate}
                    onChange={(e) => setProfile({ ...profile, hourlyRate: parseInt(e.target.value) || 0 })}
                    placeholder="500"
                    min="100"
                    step="50"
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-purple-500 dark:focus:border-purple-400 transition-all outline-none text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  You'll receive ₹{(profile.hourlyRate * 0.8).toFixed(0)} per hour (after 20% commission)
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl glass dark:glass-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
