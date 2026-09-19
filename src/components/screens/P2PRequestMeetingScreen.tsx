
import { useState, useEffect, useRef } from 'react';
import { supabase } from "../../supabase";
import { motion } from 'motion/react';
import { Send, Calendar, MapPin, Target } from 'lucide-react';
import { BackButton } from '../ui/BackButton';

interface P2PRequestMeetingScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
  peerId: string | null;
}

export function P2PRequestMeetingScreen({ onNavigate, onBack, peerId }: P2PRequestMeetingScreenProps){
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    purpose: '',
    whatIBring: '',
    whatISeek: '',
    preferredTime: '',
    preferredLocation: ''
  });

  const purposes = [
    'Co-Founder Partnership',
    'Investment Discussion',
    'Strategic Advisory',
    'Technical Collaboration',
    'Business Development',
    'Knowledge Exchange',
    'Other'
  ];

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("No authenticated user");
      return;
    }

    if (!peerId) {
      console.error("Missing peerId");
      return;
    }

if (!formData.preferredLocation) {
  alert("Please select a preferred location");
  return;
}

 const { data: existing } = await supabase
  .from("p2p_match_requests")
  .select("id, status")
  .eq("requester_id", user.id)
  .eq("receiver_id", peerId)
  .maybeSingle();

if (existing) {
  // Update existing request
  const { error: updateError } = await supabase
    .from("p2p_match_requests")
    .update({
      purpose: formData.purpose,
      what_i_bring: formData.whatIBring,
      what_i_seek: formData.whatISeek,
      preferred_time: formData.preferredTime,
      preferred_location: formData.preferredLocation,
      status: "pending",
      responded_at: null,
    })
    .eq("id", existing.id);

  if (updateError) {
    console.error("Update failed:", updateError);
    alert("Something went wrong.");
    return;
  }



} else {
  // Insert new request
const { data: requestData, error: insertError } = await supabase
  .from("p2p_match_requests")
  .upsert({
    requester_id: user.id,
    receiver_id: peerId,
    purpose: formData.purpose,
    what_i_bring: formData.whatIBring,
    what_i_seek: formData.whatISeek,
    preferred_time: formData.preferredTime,
    preferred_location: formData.preferredLocation,
    status: "pending"
  }, {
    onConflict: "requester_id,receiver_id"
  })
  .select()
  .single();

if (insertError || !requestData) {
 console.error(
  "Insert failed:",
  JSON.stringify(insertError, null, 2)
);
  alert("Something went wrong.");
  return;
}

}
    console.log("✅ Request sent successfully");

    onNavigate("p2p-request-status");
  } catch (err) {
    console.error(err);
  }
};
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid =
  formData.purpose &&
  formData.whatIBring &&
  formData.whatISeek &&
  formData.preferredTime &&
  formData.preferredLocation;

const locations = [
  "Kolkata",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Virtual"
];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-2xl mx-auto px-6 py-6">
          <BackButton onClick={onBack} />
          <div className="mt-4">
            <h1 className="mb-2">Request Meeting</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share details about your collaboration interest
            </p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          {/* Purpose */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <label className="block text-sm mb-2">
              Meeting Purpose
            </label>
            <select
              value={formData.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Select purpose...</option>
              {purposes.map(purpose => (
                <option key={purpose} value={purpose}>{purpose}</option>
              ))}
            </select>
          </motion.div>

          {/* What I Bring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <label className="block text-sm mb-2">
              What I Bring to the Table
            </label>
            <textarea
              value={formData.whatIBring}
              onChange={(e) => handleChange('whatIBring', e.target.value)}
              placeholder="Describe your expertise, resources, or what you can contribute..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors resize-none h-32"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Be specific about your skills, experience, or resources
            </p>
          </motion.div>

          {/* What I Seek */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <label className="block text-sm mb-2">
              What I'm Looking For
            </label>
            <textarea
              value={formData.whatISeek}
              onChange={(e) => handleChange('whatISeek', e.target.value)}
              placeholder="What do you hope to gain from this collaboration..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors resize-none h-32"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Clearly outline your expectations and goals
            </p>
          </motion.div>

    {/* Preferred Meeting Date */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="mb-6"
>
  <label className="block text-sm mb-2 text-white">
    <Calendar className="inline w-4 h-4 mr-2 text-white" />
    Preferred Meeting Date
  </label>

  <div className="relative">
    <input
      type="date"
      value={formData.preferredTime}
      min={new Date().toISOString().split("T")[0]}
      onChange={(e) =>
        handleChange("preferredTime", e.target.value)
      }
     className="
  w-full
  h-16
  px-6
  pr-14
  rounded-xl
  border
  border-slate-600
  bg-[#1E293B]
  text-white
  text-lg
  focus:outline-none
  focus:border-blue-500
  transition-colors
  cursor-pointer
"
      style={{
        colorScheme: "dark",
      }}
      required
    />
  </div>

  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
    Select your preferred date for the meeting. The exact time will be scheduled later.
  </p>
</motion.div>
          {/* Preferred Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <label className="block text-sm mb-2">
              <MapPin className="inline w-4 h-4 mr-2" />
              Preferred Location
            </label>
           <select
  value={formData.preferredLocation}
  onChange={(e) => handleChange('preferredLocation', e.target.value)}
  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
  required
>
  <option value="">Select preferred location</option>

  {locations.map((loc) => (
    <option key={loc} value={loc}>
      {loc}
    </option>
  ))}
</select>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Optional - Leave blank for virtual meeting
            </p>
          </motion.div>

          {/* Important Notice */}
         <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6 }}
  className="mb-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30"
>
  <p className="text-sm text-blue-800 dark:text-blue-300">
    <strong>Note:</strong> After submitting, the other person will review
    your request. If accepted, you'll proceed to payment. The exact meeting
    time will be scheduled later.
  </p>
</motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex gap-3"
          >
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>Send Request</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
