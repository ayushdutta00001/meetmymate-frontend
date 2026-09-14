import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { RentFriendProfilePreviewCard } from "../../cards/RentFriendProfilePreviewCard";
import { supabase } from "../../../supabase";
import { 
  UserPlus, 
  CheckCircle, 
  Shield, 
  Clock, 
  Users, 
  DollarSign,
  Upload,
FileText,
  Star,
  Heart,
  Zap,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Camera,
  ChevronRight,
  BadgeCheck
} from 'lucide-react';
import { BackButton } from '../../ui/BackButton';

interface BecomeFriendProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BecomeFriend({ onNavigate, onBack }: BecomeFriendProps) {
  const [currentStep, setCurrentStep] = useState<'overview' | 'form'>('overview');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userName, setUserName] = useState("Your Name");
const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
const [formData, setFormData] = useState({
  services: [] as string[],
  documentType: "aadhaar",
  documentFile: null as File | null,
});

const serviceMap: Record<string, string> = {
  "Movie Buddy": "movie-buddy",
  "Dining Partner": "dining-partner",
  "Party Companion": "party-companion",
  "Explore City": "explore-city",
  "Emotional Support": "emotional-support",
  "Study Partner": "study-partner",
  "Coffee Chat": "coffee-chat",
  "Gaming Buddy": "gaming-buddy",
  "Shopping Companion": "shopping-companion",
  "Photo Walk": "photo-walk",
  "Concert Buddy": "concert-buddy",
  "Workout Partner": "workout-partner",
};

  const services = [
    'Movie Buddy', 'Dining Partner', 'Party Companion', 'Explore City',
    'Emotional Support', 'Study Partner', 'Coffee Chat', 'Gaming Buddy',
    'Shopping Companion', 'Photo Walk', 'Concert Buddy', 'Workout Partner'
  ];
  

 


  
  useEffect(() => {
  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("users")
      .select("name, profile_photo_url")
      .eq("id", user.id)
      .single();

    console.log("PROFILE:", data);

    if (data?.name) setUserName(data.name);
    if (data?.profile_photo_url) setProfilePhoto(data.profile_photo_url);
  };

  loadProfile();
}, []);

useEffect(() => {
  fetchUserProfile();
}, []);

const fetchUserProfile = async () => {
  const { data, error } = await supabase.functions.invoke("get_my_profile");

  if (error) {
    console.error("Profile fetch error:", error);
    return;
  }

  console.log("Fresh profile:", data);
  setUserProfile(data);
};
  
    const toggleService = (service: string) => {
      setFormData(prev => ({
        ...prev,
        services: prev.services.includes(service)
          ? prev.services.filter(s => s !== service)
          : [...prev.services, service]
      }));
    };

    const handleDocumentUpload = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const allowed = [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];

  if (!allowed.includes(file.type)) {
    alert("Only JPG, PNG and PDF files are allowed.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Maximum file size is 5MB.");
    return;
  }

  setFormData(prev => ({
    ...prev,
    documentFile: file,
  }));
};

const uploadProviderDocument = async () => {
  if (!formData.documentFile) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not logged in.");

  const extension = formData.documentFile.name.split(".").pop();

  const fileName = `${user.id}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from("provider-documents")
    .upload(fileName, formData.documentFile, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  return fileName;
};

const saveProviderDocument = async (storagePath: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not logged in.");

  const { error } = await supabase
    .from("provider_documents")
    .insert({
      provider_id: user.id,
      document_type: formData.documentType,
      document_url: storagePath,
    });

  if (error) throw error;
};

const handleSubmit = async () => {
  try {
    if (formData.services.length === 0) {
  alert("Please select at least one service.");
  return;
}

if (!formData.documentFile) {
  alert("Please upload your Aadhaar or PAN card.");
  return;
}

    const mappedServices = formData.services
  .map((s) => serviceMap[s])
  .filter(Boolean);
  
const storagePath = await uploadProviderDocument();

if (!storagePath) {
  alert("Document upload failed.");
  return;
}

await saveProviderDocument(storagePath);

    console.log("SENDING:", {
      
      services: mappedServices,
    });

    const { data, error } = await supabase.functions.invoke(
      "create_provider_account",
      {
       body: {
  services: mappedServices
}
      }
    );

    console.log("FULL RESPONSE:", data);
    console.log("FULL ERROR:", error);

    if (error) {
    const errText = await error.context?.json?.();

console.log(
  "SERVER ERROR BODY:",
  JSON.stringify(errText, null, 2)
);

alert(JSON.stringify(errText, null, 2));
      alert("Failed: " + (errText?.error || "Unknown error"));
      return;
    }

    alert("You're now a provider!");
    onNavigate("provider-dashboard");

  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

if (!userProfile && currentStep === "form") {
  return (
    <div className="p-10 text-center text-gray-500">
      Loading profile...
    </div>
  );
}

if (currentStep === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-[#0A0F1F] dark:via-[#0D1425] dark:to-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-[#0A0F1F]/80 border-b border-gray-200/50 dark:border-gray-800/50"
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <BackButton onClick={() => setCurrentStep('overview')} />
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Create Your Profile
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Complete your profile to start earning
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Profile Preview */}
          <RentFriendProfilePreviewCard
              userName={userName}
              profilePhoto={profilePhoto}
              services={formData.services}
              isEditing={true} hourlyRate={''} availability={[]}/>

          

         
          {/* Services Offered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50"
            >
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Services You Offer
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select all activities you're comfortable with
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {services.map((service) => (
                  <button
                    key={service}
                    onClick={() => toggleService(service)}
                    className={`px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                      formData.services.includes(service)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </motion.div>
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.45 }}
  className="p-6 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50"
>
  <h3 className="text-lg mb-4 flex items-center gap-2">
    <Shield className="w-5 h-5 text-green-600" />
    Identity Verification
  </h3>

  <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
    Upload one government-issued identity document for verification.
  </p>

  <div className="grid grid-cols-2 gap-3 mb-6">

    <button
      onClick={() =>
        setFormData(prev => ({
          ...prev,
          documentType: "aadhaar",
        }))
      }
      className={`p-4 rounded-xl border-2 transition ${
        formData.documentType === "aadhaar"
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      Aadhaar Card
    </button>

    <button
      onClick={() =>
        setFormData(prev => ({
          ...prev,
          documentType: "pan",
        }))
      }
      className={`p-4 rounded-xl border-2 transition ${
        formData.documentType === "pan"
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      PAN Card
    </button>

  </div>

  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 cursor-pointer hover:border-blue-500 transition">

    <Upload className="w-10 h-10 mb-3 text-blue-500" />

    <span className="font-medium">
      Upload {formData.documentType === "aadhaar" ? "Aadhaar" : "PAN"} Card
    </span>

    <span className="text-sm text-gray-500 mt-2">
      JPG • PNG • PDF (Max 5MB)
    </span>

    <input
      type="file"
      accept=".jpg,.jpeg,.png,.pdf"
      className="hidden"
      onChange={handleDocumentUpload}
    />

  </label>

  {formData.documentFile && (
    <div className="mt-4 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center gap-3">

      <FileText className="w-5 h-5 text-green-600" />

      <div>
        <p className="font-medium">
          {formData.documentFile.name}
        </p>

        <p className="text-xs text-gray-500">
          Ready to upload
        </p>
      </div>

    </div>
  )}

  <div className="mt-5 rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 text-sm text-gray-600 dark:text-gray-300">
    🔒 Your document is securely stored and is only used for identity verification by the admin team.
  </div>

</motion.div>
           

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white text-lg font-medium shadow-lg hover:shadow-2xl transition-all"
            >
             Continue →
            </motion.button>

            <p className="text-center text-xs text-gray-600 dark:text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-[#0A0F1F] dark:via-[#0D1425] dark:to-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-[#0A0F1F]/80 border-b border-gray-200/50 dark:border-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <BackButton onClick={onBack} />
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
                Become a Companion
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Start earning while making meaningful connections
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass dark:glass-dark border border-blue-200/50 dark:border-blue-800/30 mb-6"
          >
            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Join 500+ Active Companions</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent"
          >
            Start Earning as a Companion
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-8"
          >
            Turn your free time into income.Choose your services, get approved, and start receiving bookings, and earn while meeting amazing people.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentStep('form')}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white text-lg font-medium shadow-lg hover:shadow-2xl transition-all inline-flex items-center gap-2"
          >
            Join Now
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl text-center mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Why Join Us?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mb-4 shadow-lg">
                <DollarSign className="w-7 h-7" />
              </div>
              <h4 className="text-lg mb-2">Earn Money</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Make ₹20K-50K/month on your own terms
              </p>
            </div>

            <div className="p-6 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white mb-4 shadow-lg">
                <Clock className="w-7 h-7" />
              </div>
              <h4 className="text-lg mb-2">Flexible Schedule</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Work when you want, as much as you want
              </p>
            </div>

            <div className="p-6 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mb-4 shadow-lg">
                <Users className="w-7 h-7" />
              </div>
              <h4 className="text-lg mb-2">Meet New People</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Build meaningful connections daily
              </p>
            </div>

            <div className="p-6 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white mb-4 shadow-lg">
                <Shield className="w-7 h-7" />
              </div>
              <h4 className="text-lg mb-2">Safe & Verified</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All users verified, 24/7 support
              </p>
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl text-center mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            How It Works
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                  1
                </div>
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center mb-3">
                  <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-lg mb-2">Create Profile</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sign up and complete your profile in 5 minutes
                </p>
              </div>
              <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500" />
            </div>

            <div className="relative">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                  2
                </div>
                <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 flex items-center justify-center mb-3">
                  <BadgeCheck className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h4 className="text-lg mb-2">Get Verified</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quick identity verification for safety
                </p>
              </div>
              <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-500" />
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-green-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                3
              </div>
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-teal-100 to-green-100 dark:from-teal-900/30 dark:to-green-900/30 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h4 className="text-lg mb-2">Start Receiving Bookings</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get matched with users and start earning
              </p>
            </div>
          </div>
        </motion.div>

        {/* Trust & Safety */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-8 md:p-12 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50 text-center"
        >
          <h3 className="text-2xl md:text-3xl mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Your Safety is Our Priority
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium">ID Verification</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center mb-2">
                <BadgeCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-medium">Background Check</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-medium">Rating System</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center mb-2">
                <Heart className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-sm font-medium">24/7 Support</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentStep('form')}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white text-lg font-medium shadow-lg hover:shadow-2xl transition-all inline-flex items-center gap-2"
          >
            Start Your Journey
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
