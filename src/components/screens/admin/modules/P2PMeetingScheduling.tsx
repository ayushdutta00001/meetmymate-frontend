import { supabase } from "../../../../supabase";
import { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  X,
  AlertCircle,
} from 'lucide-react';

interface MeetingAwaitingScheduling {
  id: string;
  userA: {
    id: string;
    name: string;
    avatar: string;
  };
  userB: {
    id: string;
    name: string;
    avatar: string;
  };
  city: string;
  price: number;
  paymentStatus: {
    userA: 'paid';
    userB: 'paid';
  };
  createdAt: string;
}

export function P2PMeetingScheduling() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSchedulePanel, setShowSchedulePanel] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingAwaitingScheduling | null>(null);

  const [meetingTime, setMeetingTime] = useState('');
  const [meetingCity, setMeetingCity] = useState('');
 
  const [meetingPoint, setMeetingPoint] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
const [selectedUser, setSelectedUser] = useState<any | null>(null);
const [showUserProfile, setShowUserProfile] = useState(false);
  const [meetingsAwaitingScheduling, setMeetingsAwaitingScheduling] = useState<any[]>([]);

const loadMeetings = async () => {

  const { data, error } = await supabase
    .from("p2p_meetings")
    .select(`
      id,
      price,
      created_at,
      meeting_city,
      payment_user_a,
      payment_user_b,
      user_a: user_a (id,name,profile_photo_url),
      user_b: user_b (id,name,profile_photo_url)
    `)
    .eq("status", "paid_waiting_admin")
    .order("created_at", { ascending: false });

  console.log("Scheduling meetings:", data);
  console.log("Scheduling error:", error);

  if (error) {
    console.error(error);
    return;
  }

  const formatted = (data || []).map((m: any) => ({
    id: m.id,
    userA: {
      id: m.user_a?.id,
      name: m.user_a?.name,
      avatar: m.user_a?.name?.charAt(0) || "U"
    },
    userB: {
      id: m.user_b?.id,
      name: m.user_b?.name,
      avatar: m.user_b?.name?.charAt(0) || "U"
    },
    city: m.meeting_city || "Kolkata",
    price: m.price,
    paymentStatus: {
      userA: m.payment_user_a ? "paid" : "unpaid",
      userB: m.payment_user_b ? "paid" : "unpaid"
    },
    createdAt: m.created_at
  }));

  setMeetingsAwaitingScheduling(formatted);
};

useEffect(() => {
  loadMeetings();
}, []);

useEffect(() => {

  const channel = supabase
    .channel("admin-meeting-scheduling")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "p2p_meetings" },
      () => {
        loadMeetings();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };

}, []);

 const handleScheduleMeeting = (meeting: MeetingAwaitingScheduling) => {
  setSelectedMeeting(meeting);
  setMeetingCity(meeting.city);

  setMeetingTime("");
 
  setMeetingPoint("");
  setAdminNotes("");

  setShowSchedulePanel(true);
};
 const handleConfirmScheduling = async () => {

  if (!selectedMeeting) return;

  if (!meetingTime || !meetingCity || !meetingPoint) {
    alert("Please fill all meeting details before confirming.");
    return;
  }

if (!selectedMeeting?.id) return;

if (!meetingTime) {
  alert("Meeting time missing");
  return;
}

const parsedDate = new Date(meetingTime);

if (isNaN(parsedDate.getTime())) {
  console.error("Invalid meeting time:", meetingTime);
  alert("Invalid meeting time");
  return;
}

const isoTime = parsedDate.toISOString();

const { data, error } = await supabase
  .from("p2p_meetings")
  .update({
    meeting_time: isoTime,
    meeting_city: meetingCity,
    meeting_point_text: meetingPoint,
    admin_note: adminNotes,
    status: "confirmed"
  })
  .eq("id", selectedMeeting.id)
  .select();

if (error) {
  console.error("❌ FULL ERROR:", error); // 🔥 IMPORTANT
  alert(error.message);
  return;
}

  if (!data || data.length === 0) {
    console.warn("No rows updated — check RLS or meeting id");
    return;
  }

  console.log("Meeting scheduled successfully");

  // Create notifications for both users
const payload = [
  {
    user_id: selectedMeeting.userA.id,
    type: String("p2p_meeting_scheduled"), // 🔥 force string
    title: "P2P Meeting Scheduled",
    message: `Your meeting is scheduled on ${meetingTime} at ${meetingPoint}.`,
    reference_id: selectedMeeting.id,
    reference_type: "p2p_meeting",
    is_read: false
  },
  {
    user_id: selectedMeeting.userB.id,
    type: String("p2p_meeting_scheduled"), // 🔥 force string
    title: "P2P Meeting Scheduled",
    message: `Your meeting is scheduled on ${meetingTime} at ${meetingPoint}.`,
    reference_id: selectedMeeting.id,
    reference_type: "p2p_meeting",
    is_read: false
  }
];

console.log("🚀 FINAL PAYLOAD:", JSON.stringify(payload, null, 2));

const { error: insertError } = await supabase
  .from("notifications")
  .insert(payload);

if (insertError) {
  console.error("❌ INSERT ERROR:", insertError);
} else {
  console.log("🚀 FINAL PAYLOAD:", payload);
}

alert("Meeting scheduled and users notified.");

  setShowSchedulePanel(false);

  // Clear form
  setMeetingTime("");
  setMeetingCity("");
  
  setMeetingPoint("");
  setAdminNotes("");

  // Reload meetings
  loadMeetings();
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl text-white mb-2" style={{ fontWeight: 700 }}>
                Meeting Scheduling
              </h1>
              <p className="text-sm text-gray-400">Schedule meetings awaiting admin confirmation</p>
            </div>
            {meetingsAwaitingScheduling.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 border border-orange-500/30">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                <span className="text-sm text-orange-300" style={{ fontWeight: 600 }}>
                  {meetingsAwaitingScheduling.length} meetings awaiting scheduling
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Search Bar */}
        <div className="bg-gray-800 border border-white/40 rounded-xl p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by meeting ID or user name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-white bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-500"
            />
          </div>
        </div>
<p className="text-white mb-4">
  Meetings awaiting scheduling: {meetingsAwaitingScheduling.length}
</p>

{/* Meetings Table */}

<div className="bg-gray-800 border border-white/10 rounded-xl overflow-hidden">
  <div className="overflow-x-auto">
    
```
<table className="w-full">

 {/* Table Head */}
  <thead className="bg-gray-900/90 border-b border-white/10">
    <tr>
      <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
        Meeting ID
      </th>
      <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
        User A
      </th>
      <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
        User B
      </th>
      <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
        City
      </th>
      <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
        Price
      </th>
      <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
        Payment Status
      </th>
      <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
        Created Time
      </th>
      <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
        Action
      </th>
    </tr>
  </thead>

  {/* Table Body */}
  <tbody className="divide-y divide-white/10">

    {meetingsAwaitingScheduling.length === 0 && (
      <tr>
        <td colSpan={8} className="px-6 py-10 text-center text-gray-400">
          No meetings awaiting scheduling
        </td>
      </tr>
    )}

   {meetingsAwaitingScheduling
  .filter((m) => {
    const q = searchQuery.toLowerCase();

    return (
      m.id?.toLowerCase().includes(q) ||
      m.userA?.name?.toLowerCase().includes(q) ||
      m.userB?.name?.toLowerCase().includes(q)
    );
  })
  .map((meeting) => (
      <tr key={meeting.id} className="hover:bg-gray-700/50 transition-colors">

        {/* Meeting ID */}
        <td className="px-6 py-4">
          <span className="text-sm text-white font-mono font-semibold">
            {meeting.id}
          </span>
        </td>

        {/* User A */}
        <td className="px-6 py-4">
          <div
  onClick={() => {
    setSelectedUser(meeting.userA);
    setShowUserProfile(true);
  }}
  className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition"
>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
              {meeting.userA?.avatar || "U"}
            </div>

            <div>
              <p className="text-sm text-gray-300">
                {meeting.userA?.name || "Unknown"}
              </p>

              <p className="text-xs text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Paid
              </p>
            </div>
          </div>
        </td>

        {/* User B */}
        <td className="px-6 py-4">
          <div
  onClick={() => {
    setSelectedUser(meeting.userB);
    setShowUserProfile(true);
  }}
  className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition"
>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              {meeting.userB?.avatar || "U"}
            </div>

            <div>
              <p className="text-sm text-gray-300">
                {meeting.userB?.name || "Unknown"}
              </p>

              <p className="text-xs text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Paid
              </p>
            </div>
          </div>
        </td>

        {/* City */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-1 text-sm text-gray-300">
            <MapPin className="w-4 h-4 text-gray-500" />
            {meeting.city}
          </div>
        </td>

        {/* Price */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-1 text-sm text-white font-semibold">
            <span className="text-green-400 font-bold">₹</span>
            {meeting.price}
          </div>
        </td>

        {/* Payment Status */}
        <td className="px-6 py-4">
          <span className="px-3 py-1 rounded-full text-xs border bg-green-500/20 text-green-300 border-green-500 font-semibold">
            Both Paid
          </span>
        </td>

        {/* Created Time */}
        <td className="px-6 py-4">
          <span className="text-xs text-gray-500">
            {new Date(meeting.createdAt).toLocaleString()}
          </span>
        </td>

        {/* Action */}
        <td className="px-6 py-4">
          <button
            onClick={() => handleScheduleMeeting(meeting)}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-500/30 border border-green-500 text-green-900 text-sm transition-colors flex items-center gap-2 font-medium"
          >
            <Calendar className="w-4 h-4" />
            Schedule Meeting
          </button>
        </td>

      </tr>
    ))}

  </tbody>
</table>
```

  </div>
</div>


      </div>

      {/* Schedule Meeting Side Panel */}
      {showSchedulePanel && selectedMeeting && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowSchedulePanel(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Side Panel */}
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-gray-900 border-l border-white/10 shadow-2xl z-50 overflow-y-auto">
            {/* Panel Header */}
            <div className="sticky top-0 px-6 py-5 border-b border-white/10 bg-gray-900/95 backdrop-blur-xl flex items-center justify-between">
              <div>
                <h3 className="text-xl text-white" style={{ fontWeight: 700 }}>
                  Schedule Meeting
                </h3>
                <p className="text-sm text-gray-400">Meeting ID: {selectedMeeting.id}</p>
              </div>
              <button
                onClick={() => setShowSchedulePanel(false)}
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="p-6 space-y-5">
              {/* Meeting Participants */}
              <div className="p-4 rounded-xl bg-gray-800 border border-white/10">
                <p className="text-sm text-gray-400 mb-3">Participants</p>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg mx-auto mb-2">
                      {selectedMeeting.userA.avatar}
                    </div>
                    <p className="text-sm text-white" style={{ fontWeight: 500 }}>
                      {selectedMeeting.userA.name}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg mx-auto mb-2">
                      {selectedMeeting.userB.avatar}
                    </div>
                    <p className="text-sm text-white" style={{ fontWeight: 500 }}>
                      {selectedMeeting.userB.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Meeting Time */}
              <div>
                <label className="block text-sm text-gray-300 mb-2" style={{ fontWeight: 500 }}>
                  Meeting Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Meeting City */}
              <div>
                <label className="block text-sm text-gray-300 mb-2" style={{ fontWeight: 500 }}>
                  Meeting City
                </label>
                <select
                  value={meetingCity}
                  onChange={(e) => setMeetingCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">{selectedMeeting.city || 'Select city'}</option>
                 <option value="kolkata">Kolkata</option>
<option value="mumbai">Mumbai</option>
<option value="bangalore">Bangalore</option>
<option value="delhi">Delhi</option>
<option value="hyderabad">Hyderabad</option>
<option value="pune">Pune</option>
                </select>
              </div>

             

              {/* Meeting Point */}
              <div>
                <label className="block text-sm text-gray-300 mb-2" style={{ fontWeight: 500 }}>
                  Meeting Point Description
                </label>
                <input
                  type="text"
                  value={meetingPoint}
                  onChange={(e) => setMeetingPoint(e.target.value)}
                  placeholder="e.g., Starbucks on Main Street, near Central Park..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm text-gray-300 mb-2" style={{ fontWeight: 500 }}>
                  Admin Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any special instructions or notes..."
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            {/* Panel Footer */}
            <div className="sticky bottom-0 px-6 py-5 border-t border-white/10 bg-gray-900/95 backdrop-blur-xl flex gap-3">
              <button
                onClick={() => setShowSchedulePanel(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                style={{ fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmScheduling}
                className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Meeting</span>
              </button>
            </div>
          </div>
          
        
        
  {showUserProfile && selectedUser && (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={() => setShowUserProfile(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
        <div className="w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg text-white font-semibold">
              User Profile
            </h3>
            <button
              onClick={() => setShowUserProfile(false)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold mb-3">
              {selectedUser.name?.charAt(0)}
            </div>

            <h4 className="text-white text-lg font-semibold">
              {selectedUser.name}
            </h4>

            <p className="text-gray-400 text-sm mt-1">
              ID: {selectedUser.id}
            </p>
          </div>

        </div>
      </div>
    </>
  )}
        </>
      )}
    </div>
  );
}
