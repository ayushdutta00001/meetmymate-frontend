import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Phone, MapPin, Briefcase, Building, Globe, Calendar, AtSign, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Button } from '../Button';

interface UserProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile: {
    name: string;
    email: string;
    phone: string;
    bio: string;
    city: string;
    state?: string;
    age: number;
    profession: string;
    company: string;
    interests: string[];
    languages: string[];
    gender: string;
    dateOfBirth: string;
    website?: string;
    socialMedia?: {
      linkedin?: string;
      twitter?: string;
      instagram?: string;
    };
  };
  onSave: (profile: any) => void;
}

export function UserProfileEditModal({ isOpen, onClose, initialProfile, onSave }: UserProfileEditModalProps) {
  const [formData, setFormData] = useState({
    ...initialProfile,
    state: initialProfile.state || '',
    website: initialProfile.website || '',
    socialMedia: {
      linkedin: initialProfile.socialMedia?.linkedin || '',
      twitter: initialProfile.socialMedia?.twitter || '',
      instagram: initialProfile.socialMedia?.instagram || '',
    }
  });
  const [activeSection, setActiveSection] = useState<'basic' | 'professional' | 'preferences' | 'social'>('basic');

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleAddInterest = () => {
    const newInterest = prompt('Enter a new interest:');
    if (newInterest && !formData.interests.includes(newInterest)) {
      setFormData({ ...formData, interests: [...formData.interests, newInterest] });
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    });
  };

  const handleAddLanguage = () => {
    const newLanguage = prompt('Enter a new language:');
    if (newLanguage && !formData.languages.includes(newLanguage)) {
      setFormData({ ...formData, languages: [...formData.languages, newLanguage] });
    }
  };

  const handleRemoveLanguage = (language: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter(l => l !== language)
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#0A0F1F] rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3>Edit Profile</h3>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              <button
                onClick={() => setActiveSection('basic')}
                className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                  activeSection === 'basic'
                    ? 'bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveSection('professional')}
                className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                  activeSection === 'professional'
                    ? 'bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                Professional
              </button>
              <button
                onClick={() => setActiveSection('preferences')}
                className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                  activeSection === 'preferences'
                    ? 'bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                Preferences
              </button>
              <button
                onClick={() => setActiveSection('social')}
                className={`px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                  activeSection === 'social'
                    ? 'bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                Social Media
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6 py-4">
            {/* Basic Info Section */}
            {activeSection === 'basic' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all resize-none"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </motion.div>
            )}

            {/* Professional Section */}
            {activeSection === 'professional' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Profession
                  </label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="Tech Corp"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Website / Portfolio
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="yourwebsite.com"
                  />
                </div>
              </motion.div>
            )}

            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm">Interests</label>
                    <button
                      onClick={handleAddInterest}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      + Add Interest
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 text-sm flex items-center gap-2"
                      >
                        {interest}
                        <button
                          onClick={() => handleRemoveInterest(interest)}
                          className="hover:text-red-500 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Languages
                    </label>
                    <button
                      onClick={handleAddLanguage}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      + Add Language
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.languages.map((language) => (
                      <span
                        key={language}
                        className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 text-sm flex items-center gap-2"
                      >
                        {language}
                        <button
                          onClick={() => handleRemoveLanguage(language)}
                          className="hover:text-red-500 transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Social Media Section */}
            {activeSection === 'social' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    LinkedIn Username
                  </label>
                  <input
                    type="text"
                    value={formData.socialMedia.linkedin}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialMedia: { ...formData.socialMedia, linkedin: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="your-username"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-sky-500" />
                    Twitter Handle
                  </label>
                  <input
                    type="text"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialMedia: { ...formData.socialMedia, twitter: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="@yourhandle"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    Instagram Username
                  </label>
                  <input
                    type="text"
                    value={formData.socialMedia.instagram}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialMedia: { ...formData.socialMedia, instagram: e.target.value }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="@yourusername"
                  />
                </div>

                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    💡 Tip: Adding your social media profiles helps others connect with you and builds trust!
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-[#0A0F1F] border-t border-gray-200 dark:border-gray-800 px-6 py-4">
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} fullWidth>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} fullWidth>
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
