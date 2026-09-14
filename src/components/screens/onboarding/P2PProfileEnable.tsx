import { supabase } from '../../../supabase';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { P2PProfilePreviewCard } from "../../cards/P2PProfilePreviewCard";
import {
  Briefcase,
  Target,
  Lightbulb,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  Search,
  X,
  ChevronDown,
  User,
  MapPin,
  Clock,
  Zap,
} from 'lucide-react';
import { BackButton } from '../../ui/BackButton';

interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
}

interface P2PProfileData {
  education: string | number | readonly string[];
  profession: string;
  workingOn: string;
  lookingFor: string[];
  skills: string[];
  isVisible: boolean;

  // ✅ NEW
  experience: ExperienceItem[];
}

interface P2PProfileEnableProps {
  onNavigate?: (screen: string) => void;
  onBack?: () => void;
  onProfileEnabled?: () => void;
}

// Professional categories
const professionCategories = [
  'Developers',
  'Designers',
  'Marketing Experts',
  'Creators',
  'Founders',
  'Students',
  'Writers',
  'Engineers',
  'Researchers',
  'Product Managers',
  'Sales Professionals',
  'Finance',
  'Healthcare',
  'Educators',
  'Freelancers',
  'Artists',
  'Musicians',
  'Videographers',
  'Photographers',
  'AI Enthusiasts',
  'Game Developers',
  'UI/UX Designers',
  'Data Analysts',
  'Content Strategists',
  'Consultants',
  'Entrepreneurs',
];

// Who to find options
const lookingForOptions = [
  'Developers',
  'Marketing Experts',
  'Co-Founders',
  'Creators',
  'Mentors',
  'Investors',
  'Designers',
  'Networking Partners',
  'Business Collaborators',
  'Technical Advisors',
  'Industry Peers',
  'Freelancers',
  'Students',
  'Researchers',
  'Content Creators',
];

// Skills options
const skillsOptions = [
  'Coding',
  'Graphic Design',
  'Content Creation',
  'Public Speaking',
  'Music Production',
  'Photography',
  'Video Editing',
  'Writing',
  'Fitness Coaching',
  'Language Learning',
  'Event Planning',
  'Social Media Strategy',
  'AI Tools',
  'Gaming',
  'Podcasting',
  'Teaching',
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Data Analysis',
  'Digital Marketing',
  'SEO',
  'Copywriting',
  'Brand Strategy',
  'Project Management',
  'Business Development',
  'Sales',
  'Networking',
  'Mentoring',
  'Consulting',
  'Research',
  'Animation',
  'Illustration',
  '3D Modeling',
  'Motion Graphics',
  'Sound Design',
  'Film Production',
  'Product Design',
  'Fashion Design',
  'Interior Design',
  'Architecture',
];

export function P2PProfileEnable({ onNavigate, onBack, onProfileEnabled }: P2PProfileEnableProps) {
 const [formData, setFormData] = useState<P2PProfileData>({
  education: '',
  profession: '',
  workingOn: '',
  lookingFor: [],
  skills: [],
  isVisible: true,

  // ✅ NEW
  experience: [],
});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  // Dropdown states
  const [professionSearch, setProfessionSearch] = useState('');
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);
  const [lookingForSearch, setLookingForSearch] = useState('');
  const [showLookingForDropdown, setShowLookingForDropdown] = useState(false);
  const [skillsSearch, setSkillsSearch] = useState('');
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);

  const professionRef = useRef<HTMLDivElement>(null);
  const lookingForRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
const [userName, setUserName] = useState("Your Name");
const [profilePhoto, setProfilePhoto] = useState<string | null>(null);


 useEffect(() => {
  const loadProfile = async () => {
    try {
       const { data: { user } } = await supabase.auth.getUser();

if (user) {
  const { data: userProfile, error } = await supabase
    .from("users")
    .select("name, profile_photo_url")
    .eq("id", user.id)   // ✅ CORRECT COLUMN
    .single();

  console.log("USER PROFILE:", userProfile);

  if (userProfile?.name) {
    setUserName(userProfile.name);
  }
  if (userProfile?.profile_photo_url) {
  setProfilePhoto(userProfile.profile_photo_url);
}
}
      // wait for auth session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

     
      const { data, error } = await supabase.functions.invoke(
  "get_p2p_profile"
);

      if (error || !data) return;

      console.log("Loaded profile:", data);
console.log("PROFILE DATA FROM EDGE:", data);
     setFormData({
    education: data.education ?? "",
  profession: data.headline ?? "",
  workingOn: data.bio ?? "",
  lookingFor: data.interests ?? [],
  skills: data.skills ?? [],
  isVisible: data.is_active ?? true,

  // ✅ NEW
  experience: Array.isArray(data.experience)
    ? data.experience
    : [],
});
    } catch (err) {
      console.error("Profile load failed:", err);
    }
  };

  loadProfile();
}, []);
  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (professionRef.current && !professionRef.current.contains(event.target as Node)) {
        setShowProfessionDropdown(false);
      }
      if (lookingForRef.current && !lookingForRef.current.contains(event.target as Node)) {
        setShowLookingForDropdown(false);
      }
      if (skillsRef.current && !skillsRef.current.contains(event.target as Node)) {
        setShowSkillsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (field: keyof P2PProfileData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const toggleLookingFor = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(option)
        ? prev.lookingFor.filter((i) => i !== option)
        : [...prev.lookingFor, option],
    }));
  };

  const removeLookingFor = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.filter((i) => i !== option),
    }));
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addCustomSkill = () => {
    if (skillsSearch.trim() && !formData.skills.includes(skillsSearch.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillsSearch.trim()],
      }));
      setSkillsSearch('');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.profession.trim()) {
      newErrors.profession = 'Please select or enter your profession';
    }
    if (!formData.workingOn.trim()) {
      newErrors.workingOn = 'Please tell us what you\'re working on';
    }
    if (formData.lookingFor.length === 0) {
      newErrors.lookingFor = 'Select at least one option';
    }
    if (formData.skills.length === 0) {
      newErrors.skills = 'Add at least one skill you can offer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const addExperience = () => {
  setFormData(prev => ({
    ...prev,
    experience: [
      ...prev.experience,
      { title: "", company: "", duration: "" }
    ]
  }));
};

const updateExperience = (index: number, field: string, value: string) => {
  setFormData(prev => {
    const updated = [...prev.experience];
    updated[index] = { ...updated[index], [field]: value };
    return { ...prev, experience: updated };
  });
};

const removeExperience = (index: number) => {
  setFormData(prev => ({
    ...prev,
    experience: prev.experience.filter((_, i) => i !== index)
  }));
};
 const handleActivate = async () => {
  if (!validateForm()) return;
const { data: sessionData } = await supabase.auth.getSession();
console.log("SESSION:", sessionData);
  try {
    const { data, error } = await supabase.functions.invoke(
      "upsert_p2p_profile",
      {
    body: {
  headline: formData.profession,
  bio: formData.workingOn,
  interests: formData.lookingFor,
  skills: formData.skills,
   education: formData.education,
  is_active: formData.isVisible,

  // ✅ NEW
  experience: formData.experience,
}
      }
    );
if (error) {
  console.error("Edge Function Error:", error);
  console.log("Returned data:", data);
  return;
}
    console.log("P2P profile saved:", data);

    onProfileEnabled?.();

  } catch (err) {
    console.error(err);
  }
};

  const handleSkip = () => {
    console.log('Skipping P2P profile setup');
    if (onBack) {
      onBack();
    }
  };

  // Filter functions
  const filteredProfessions = professionCategories.filter((cat) =>
    cat.toLowerCase().includes(professionSearch.toLowerCase())
  );

  const filteredLookingFor = lookingForOptions.filter((opt) =>
    opt.toLowerCase().includes(lookingForSearch.toLowerCase())
  );

  const filteredSkills = skillsOptions.filter(
    (skill) =>
      skill.toLowerCase().includes(skillsSearch.toLowerCase()) &&
      !formData.skills.includes(skill)
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-4xl mx-auto px-6 py-6">
          <BackButton onClick={onBack} />
          <div className="text-center mt-6">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20"
            >
              <User className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="mb-2">Activate P2P Profile</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Connect with entrepreneurs, creators, and professionals for collaborations and networking
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form Section - Left Side */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profession */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-950/20 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Profession / Primary Role
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      What do you do?
                    </p>
                  </div>
                </div>
                <div className="relative" ref={professionRef}>
                  <input
                    type="text"
                    value={professionSearch || formData.profession}
                    onChange={(e) => {
                      setProfessionSearch(e.target.value);
                      handleInputChange('profession', e.target.value);
                      setShowProfessionDropdown(true);
                    }}
                    onFocus={() => setShowProfessionDropdown(true)}
                    placeholder="Search or type your profession..."
                    className="w-full px-4 py-3.5 pr-12 rounded-xl border-2 border-gray-800 dark:border-gray-700 bg-black dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-shadow-blue-950 pointer-events-none" />
                  
                  {showProfessionDropdown && filteredProfessions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute w-full mt-2 rounded-xl bg-black dark:bg-slate-800 border-2 border-gray-700 dark:border-gray-700 shadow-2xl overflow-hidden"
                      style={{ zIndex: 99999, maxHeight: '240px', overflowY: 'auto' }}
                    >
                      {filteredProfessions.map((profession, idx) => (
                        <motion.button
                          key={profession}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleInputChange('profession', profession);
                            setProfessionSearch('');
                            setShowProfessionDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-blue-500 dark:hover:bg-blue-900/20 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
                        >
                          {profession}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
                {errors.profession && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-red-500 mt-2 flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    {errors.profession}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* What I'm Working On */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-blue-950 dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <label className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      What I'm Currently Working On
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Share your current projects or goals
                    </p>
                  </div>
                </div>
                <textarea
                  value={formData.workingOn}
                  onChange={(e) => handleInputChange('workingOn', e.target.value)}
                  placeholder="E.g., Building a startup, Learning AI tools, Looking for collaborators..."
                  rows={4}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                />
                {errors.workingOn && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-red-500 mt-2 flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    {errors.workingOn}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Who I Want to Find */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-blue-950 dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <label className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Who I Want to Find
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Select multiple options
                    </p>
                  </div>
                </div>

                {/* Selected Chips */}
                {formData.lookingFor.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    <AnimatePresence>
                      {formData.lookingFor.map((option) => (
                        <motion.div
                          key={option}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium shadow-sm"
                        >
                          {option}
                          <button
                            type="button"
                            onClick={() => removeLookingFor(option)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                <div className="relative" ref={lookingForRef}>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={lookingForSearch}
                    onChange={(e) => {
                      setLookingForSearch(e.target.value);
                      setShowLookingForDropdown(true);
                    }}
                    onFocus={() => setShowLookingForDropdown(true)}
                    placeholder="Search and select..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                  
                  {showLookingForDropdown && filteredLookingFor.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute w-full mt-2 rounded-xl bg-black dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden"
                      style={{ zIndex: 99999, maxHeight: '240px', overflowY: 'auto' }}
                    >
                      {filteredLookingFor.map((option, idx) => {
                        const isSelected = formData.lookingFor.includes(option);
                        return (
                          <motion.button
                            key={option}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              toggleLookingFor(option);
                              setLookingForSearch('');
                            }}
                            className={`w-full text-left px-4 py-3 text-sm font-medium flex items-center justify-between border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                : 'text-gray-900 dark:text-gray-100 hover:bg-blue-500 dark:hover:bg-blue-900/20'
                            }`}
                          >
                            {option}
                            {isSelected && <CheckCircle2 className="w-4 h-4" />}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
                {errors.lookingFor && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-red-500 mt-2 flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    {errors.lookingFor}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-blue-950 from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-950/20 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Skills I Can Offer
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Add professional and extracurricular skills
                    </p>
                  </div>
                </div>

                {/* Selected Skills */}
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <AnimatePresence>
                      {formData.skills.map((skill) => (
                        <motion.div
                          key={skill}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium shadow-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                <div className="relative" ref={skillsRef}>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={skillsSearch}
                    onChange={(e) => {
                      setSkillsSearch(e.target.value);
                      setShowSkillsDropdown(true);
                    }}
                    onFocus={() => setShowSkillsDropdown(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomSkill();
                      }
                    }}
                    placeholder="Search skills or type custom skill + Enter..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                  
                  {showSkillsDropdown && (filteredSkills.length > 0 || skillsSearch.trim()) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute w-full mt-2 rounded-xl bg-black dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden"
                      style={{ zIndex: 99999, maxHeight: '240px', overflowY: 'auto' }}
                    >
                      {skillsSearch.trim() && !skillsOptions.includes(skillsSearch.trim()) && (
                        <motion.button
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            addCustomSkill();
                          }}
                          className="w-full text-left px-4 py-3 text-sm font-bold text-blue-600 dark:text-blue-400 bg-black dark:bg-blue-900/30 hover:bg-blue-800 dark:hover:bg-blue-900/40 border-b-2 border-gray-100 dark:border-gray-700 transition-colors"
                        >
                          + Add "{skillsSearch.trim()}" as custom skill
                        </motion.button>
                      )}
                      {filteredSkills.map((skill, idx) => (
                        <motion.button
                          key={skill}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            toggleSkill(skill);
                            setSkillsSearch('');
                          }}
                          className="w-full text-left px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-blue-950 dark:hover:bg-blue-900/20 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
                        >
                          {skill}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
                {errors.skills && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-red-500 mt-2 flex items-center gap-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    {errors.skills}
                  </motion.p>
                )}
              </div>
            </motion.div>
            {/* Experience */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-blue-950 dark:bg-slate-900 shadow-sm">

    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
        <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>

      <div>
        <label className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Experience
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Add your professional experience
        </p>
      </div>
    </div>

    <div className="space-y-4">
      {formData.experience.map((exp, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3">

          <input
            placeholder="Role"
            value={exp.title}
            onChange={(e) => updateExperience(index,"title",e.target.value)}
            className="px-3 py-2 rounded-lg bg-blue-950 dark:bg-slate-800 border border-gray-700"
          />

          <input
            placeholder="Company"
            value={exp.company}
            onChange={(e) => updateExperience(index,"company",e.target.value)}
            className="px-3 py-2 rounded-lg bg-blue-950 dark:bg-slate-800 border border-gray-700"
          />

          <input
            placeholder="Duration"
            value={exp.duration}
            onChange={(e) => updateExperience(index,"duration",e.target.value)}
            className="px-3 py-2 rounded-lg bg-blue-950 dark:bg-slate-800 border border-gray-700"
          />

          <button
            type="button"
            onClick={() => removeExperience(index)}
            className="text-red-400 text-sm"
          >
            Remove
          </button>
        </div>
      ))}
    </div>

    <button
      type="button"
      onClick={addExperience}
      className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
    >
      + Add Experience
    </button>

  </div>
</motion.div>

{/* Education */}
<div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
  <label>Education</label>

  <input
    value={formData.education}
    onChange={(e)=>handleInputChange("education", e.target.value)}
    placeholder="Education"
    className="w-full mt-2 p-3 rounded-lg"
  />
</div>
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 pt-4"
            >
              <button
                type="button"
                onClick={handleSkip}
                className="px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-fuchsia-800 dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
              >
                Not Now
              </button>
              <button
                type="button"
                onClick={handleActivate}
                className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                Activate Profile
              </button>
            </motion.div>
          </div>

          {/* Preview Section - Right Side (Sticky) */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-6"
            >
              <div className="p-6 rounded-2xl border border-b-blue-400 dark:border-gray-800 bg-blue-900 dark:bg-slate-900 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Profile Preview
                  </h3>
                </div>

            <P2PProfilePreviewCard
  formData={formData}
  userName={userName}
  profilePhoto={profilePhoto}
  isEditing={true}
/>
</div>
</motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}