import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Phone, MapPin, Briefcase, Building, Globe, Calendar, AtSign, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Button } from '../Button';

interface UserProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile: {
  name: string;
  bio: string;
  city: string;
  age: number;
  gender: string;
  interests: string[];
   languages: string[]; 
};

  onSave: (profile: any) => void;
}

export function UserProfileEditModal({ isOpen, onClose, initialProfile, onSave }: UserProfileEditModalProps) {
  const [formData, setFormData] = useState({
  name: initialProfile.name ?? "",
  bio: initialProfile.bio ?? "",
  city: initialProfile.city ?? "",
  age: initialProfile.age ?? "",
  gender: initialProfile.gender ?? "",
  interests: Array.isArray(initialProfile.interests)
    ? initialProfile.interests
    : [],
      languages: Array.isArray(initialProfile.languages)
    ? initialProfile.languages
    : [],
});

  

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
  const newLang = prompt('Enter a language:');
  if (newLang && !formData.languages.includes(newLang)) {
    setFormData({
      ...formData,
      languages: [...formData.languages, newLang],
    });
  }
};

const handleRemoveLanguage = (lang: string) => {
  setFormData({
    ...formData,
    languages: formData.languages.filter(l => l !== lang),
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
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-6 py-4">
            {/* Basic Info Section */}
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
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="25"
                    min={18}
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

            {/* Preferences Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm">Interests</label>
                    <Button
                      onClick={handleAddInterest}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      + Add Interest
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.interests ?? []).map((interest) => (

                      <span
                        key={interest}
                        className="px-3 py-1.5 rounded-full bg-gradient-to-r from-black to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 text-sm flex items-center gap-2"
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
              </motion.div>
                
                <div>
  <div className="flex items-center justify-between mb-3">
    <label className="block text-sm">Languages</label>
    <Button
      onClick={handleAddLanguage}
      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
    >
      + Add Language
    </Button>
  </div>

  <div className="flex flex-wrap gap-2">
    {(formData.languages ?? []).map((lang) => (
      <span
        key={lang}
        className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-700 dark:text-green-300 text-sm flex items-center gap-2"
      >
        {lang}
        <button
          onClick={() => handleRemoveLanguage(lang)}
          className="hover:text-red-500 transition-colors"
        >
          ×
        </button>
      </span>
    ))}
  </div>
</div>

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
