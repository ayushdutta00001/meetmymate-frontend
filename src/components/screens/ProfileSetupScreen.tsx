import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../Button';
import { Camera, Upload, MapPin, CheckCircle } from 'lucide-react';

interface ProfileSetupScreenProps {
  onComplete: () => void;
}

export function ProfileSetupScreen({ onComplete }: ProfileSetupScreenProps) {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [idUploaded, setIdUploaded] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  const handleProfilePicUpload = () => {
    // Simulate file upload
    setProfilePic('https://images.unsplash.com/photo-1543807641-bd607cfa8dca?w=400');
  };

  const handleIdUpload = () => {
    // Simulate ID upload
    setIdUploaded(true);
  };

  const canContinue = profilePic && idUploaded && selectedCity;

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2>Complete Your Profile</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Help us verify your identity and personalize your experience
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Profile Setup</span>
            <span className="text-sm text-[#3C82F6] dark:text-[#3758FF]">
              {[profilePic, idUploaded, selectedCity].filter(Boolean).length} of 3 completed
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#3C82F6] to-[#1F3C88]"
              initial={{ width: 0 }}
              animate={{
                width: `${([profilePic, idUploaded, selectedCity].filter(Boolean).length / 3) * 100}%`
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass dark:glass-dark rounded-3xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {profilePic ? (
                  <div className="relative">
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] flex items-center justify-center">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="mb-2">Profile Picture</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Upload a clear photo of yourself. This helps build trust in the community.
                </p>
                <Button
                  variant={profilePic ? 'outline' : 'primary'}
                  size="small"
                  onClick={handleProfilePicUpload}
                  icon={<Upload className="w-4 h-4" />}
                >
                  {profilePic ? 'Change Photo' : 'Upload Photo'}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* ID Verification */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass dark:glass-dark rounded-3xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] flex items-center justify-center">
                {idUploaded ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <Upload className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="mb-2">ID Verification</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Upload a government-issued ID for verification. Your ID will be securely stored and not shared.
                </p>
                <Button
                  variant={idUploaded ? 'outline' : 'primary'}
                  size="small"
                  onClick={handleIdUpload}
                  icon={<Upload className="w-4 h-4" />}
                >
                  {idUploaded ? 'Re-upload ID' : 'Upload ID'}
                </Button>
                {idUploaded && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    ID uploaded successfully
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>

          {/* City Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass dark:glass-dark rounded-3xl p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">Select Your City</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose your city to find people nearby
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {cities.map((city) => (
                <motion.button
                  key={city}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCity(city)}
                  className={`
                    p-3 rounded-xl transition-all
                    ${selectedCity === city
                      ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                      : 'bg-[#F2F4F7] dark:bg-[#0A0F1F] text-[#0B0B0C] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {city}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={onComplete}
            disabled={!canContinue}
          >
            Continue
          </Button>
          {!canContinue && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Complete all steps to continue
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
