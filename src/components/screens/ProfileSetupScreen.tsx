import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import LanguageSelector from "../../components/modals/LanguageSelector";
import { motion } from 'motion/react';
import { Languages } from "lucide-react";
import { Button } from '../Button';
import {
  Camera,
  Upload,
  MapPin,
  CheckCircle,
  Calendar,
  User,
  Heart,
  FileText,
  ChevronDown,
  Search,
  X
} from "lucide-react";
interface ProfileSetupScreenProps {
  onComplete: () => void;
}

export function ProfileSetupScreen({ onComplete }: ProfileSetupScreenProps) {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState('');
const [age, setAge] = useState('');
const [gender, setGender] = useState('');
const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
const [bio, setBio] = useState(''); 
const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
const [languageSearch, setLanguageSearch] = useState("");
const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
  const interestOptions = [
    'Sports', 'Music', 'Travel', 'Food', 'Technology',
    'Art', 'Reading', 'Movies', 'Gaming', 'Fitness',
    'Photography', 'Cooking', 'Dancing', 'Writing', 'Fashion'
  ];
const languageOptions = [
  "English",
  "Hindi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Kannada",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Urdu",
  "Odia",
  "Assamese",
  "Konkani",
  "Kashmiri",
  "Dogri",
  "Sindhi",
  "Maithili",
  "Bodo",
  "Santali",
  "Manipuri",
  "Nepali",
  "Sanskrit",
  "Tulu",
  "Bhojpuri",
  "Rajasthani",
  "Other"
];
const filteredLanguages = languageOptions.filter((language) =>
  language.toLowerCase().includes(languageSearch.toLowerCase())
);
  useEffect(() => {

  async function loadDraft() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

  
  const { data, error } = await supabase
  .from('user_drafts')
  .select(
    'profile_photo_url, city, id_document_uploaded, age, gender, interests, bio, languages'
  )
  .eq('id', user.id)
  .maybeSingle();

// Ignore "no rows found"
if (error && error.code !== 'PGRST116') {
  console.error('LOAD DRAFT ERROR:', error);
  return;
}

// Draft deleted after onboarding complete
if (!data) {
  console.log('No draft found');
  return;
}

// SAFE ACCESS
if (data.languages) setSelectedLanguages(data.languages);

if (data.profile_photo_url) setProfilePic(data.profile_photo_url);

if (data.city) setSelectedCity(data.city);



if (data.age) setAge(String(data.age));

if (data.gender) setGender(data.gender);

if (data.interests) setSelectedInterests(data.interests);

if (data.bio) setBio(data.bio);
  }
  loadDraft();

  return () => {
  };
}, []);


  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

 const handleProfilePicUpload = async (file: File) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert('Session expired');
    return;
  }

  const fileExt = file.name.split('.').pop();
  const filePath = `${user.id}/avatar.${fileExt}`;

  const { error } = await supabase.storage
    .from('user-avatars')
    .upload(filePath, file, { upsert: true });

  if (error) {
    alert(error.message);
    return;
  }

  const { data } = supabase.storage
    .from('user-avatars')
    .getPublicUrl(filePath);

  setProfilePic(data.publicUrl);
};



const handleContinue = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Session expired");
    return;
  }

  // ✅ VALIDATION
  if (
    !profilePic ||
    !selectedCity ||
    !age ||
    !gender ||
    selectedInterests.length === 0 ||
    selectedLanguages.length === 0
  ) {
    alert("Please complete all required profile fields");
    return;
  }

  console.log("FINAL LANGUAGES:", selectedLanguages);

  // 🔥 SAVE COMPLETE DRAFT
const { error: draftError } = await supabase
  .from("user_drafts")
  .upsert(
    {
      id: user.id,

      // IMPORTANT
      email: user.email,
      name: user.user_metadata?.name || "",
      phone: user.user_metadata?.phone || "",

      city: selectedCity,
      age: parseInt(age),
      gender: gender,

      interests: selectedInterests,
      languages: selectedLanguages,

      bio: bio,
      profile_photo_url: profilePic,

      

      current_step: 6,

      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "id",
    }
  );

if (draftError) {
  console.error("DRAFT SAVE ERROR:", draftError);
  alert("Error saving draft");
  return;
}

  // 🔥 3. SYNC PROVIDER (SAFE)
  await supabase
    .from("providers")
    .update({
      languages: selectedLanguages,
    })
    .eq("user_id", user.id);

    
  // ✅ DONE
  onComplete();
};

 const completedSteps = [
  profilePic,
  selectedCity,
  age && parseInt(age) >= 18 && parseInt(age) <= 100,
  gender,
  selectedInterests.length > 0,
  selectedLanguages.length > 0,
].filter(Boolean).length;

const totalSteps = 6;
const canContinue = completedSteps === totalSteps; 
  

  function toggleInterest(interest: string): void {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  }

  function toggleLanguage(language: string): void {
  setSelectedLanguages((prev) =>
    prev.includes(language)
      ? prev.filter((item) => item !== language)
      : [...prev, language]
  );
}

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
             {completedSteps} of {totalSteps} completed
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#3C82F6] to-[#1F3C88]"
              initial={{ width: 0 }}
              animate={{
              width: `${(completedSteps / totalSteps) * 100}%` 
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
  onClick={() => document.getElementById('profilePicInput')?.click()}
  icon={<Upload className="w-4 h-4" />}
>
  {profilePic ? 'Change Photo' : 'Upload Photo'}
</Button>
  <input
  type="file"
  accept="image/*"
  hidden
  id="profilePicInput"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) handleProfilePicUpload(file);
  }}
/>

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
           {/* Age */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass dark:glass-dark rounded-3xl p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">Your Age</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Enter your age to help us match you better
                </p>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  className="w-full px-4 py-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] text-[#0B0B0C] dark:text-white placeholder-gray-400 transition-all duration-300 outline-none"
                />
                {age && (parseInt(age) < 18 || parseInt(age) > 100) && (
                  <p className="text-sm text-red-500 mt-2">
                    Age must be between 18 and 100
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Gender */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="glass dark:glass-dark rounded-3xl p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">Gender</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select your gender identity
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {genderOptions.map((option) => (
                <motion.button
                  key={option}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGender(option)}
                  className={`
                    p-3 rounded-xl transition-all
                    ${gender === option
                      ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                      : 'bg-[#F2F4F7] dark:bg-[#0A0F1F] text-[#0B0B0C] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
          {/* Interests */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="glass dark:glass-dark rounded-3xl p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">Your Interests</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select at least one interest (you can choose multiple)
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <motion.button
                  key={interest}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleInterest(interest)}
                  className={`
                    p-3 rounded-xl transition-all
                    ${selectedInterests.includes(interest)
                      ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                      : 'bg-[#F2F4F7] dark:bg-[#0A0F1F] text-[#0B0B0C] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {interest}
                </motion.button>
              ))}
            </div>
            {selectedInterests.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-[#3C82F6] dark:text-[#3758FF] mt-3"
              >
                {selectedInterests.length} interest{selectedInterests.length !== 1 ? 's' : ''} selected
              </motion.p>
            )}
          </motion.div>
{/* Languages */}

<motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.8 }}
    className="glass dark:glass-dark rounded-3xl p-6"
>
    <div className="flex items-start gap-4">

        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] flex items-center justify-center">
            <Languages className="w-8 h-8 text-white" />
        </div>

        <div className="flex-1">

            <LanguageSelector
                options={languageOptions}
                selected={selectedLanguages}
                onChange={setSelectedLanguages}
                placeholder="Select languages"
            />

        </div>

    </div>

</motion.div>
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="glass dark:glass-dark rounded-3xl p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">About You (Optional)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Write a brief bio to introduce yourself (optional)
                </p>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] text-[#0B0B0C] dark:text-white placeholder-gray-400 transition-all duration-300 outline-none resize-none"
                />
                <div className="flex items-center justify-end mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {bio.length}/500
                  </p>
                </div>
              </div>
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
            onClick={handleContinue}
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
