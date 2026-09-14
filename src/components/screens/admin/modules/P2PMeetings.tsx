import { supabase } from "../../../../supabase";
import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  XCircle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  X,
} from 'lucide-react';

interface Meeting {
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
  meetingTime: string;
  meetingCity: string;
  meetingArea?: string;
  meetingPoint?: string;
  price: number;
  meetingStatus: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export function P2PMeetings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

 const [meetings, setMeetings] = useState<any[]>([]);
const [selectedMeeting, setSelectedMeeting] = useState<any | null>(null);
const [showDetailsModal, setShowDetailsModal] = useState(false);

 const loadMeetings = async () => {

  const { data, error } = await supabase
    .from("p2p_meetings")
    .select(`
      id,
      meeting_time,
      meeting_city,
      meeting_area,
      meeting_point_text,
      price,
      status,
      created_at,
      user_a: user_a (id,name,profile_photo_url),
      user_b: user_b (id,name,profile_photo_url)
    `)
    .in("status", ["confirmed", "completed", "cancelled"])
    .order("meeting_time", { ascending: false });

  console.log("Admin meetings:", data);
  console.log("Admin meetings error:", error);

  if (error) {
    console.error(error);
    return;
  }

  const formatted = data.map((m: any) => ({
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
    meetingTime: m.meeting_time,
    meetingCity: m.meeting_city,
    meetingArea: m.meeting_area,
    meetingPoint: m.meeting_point_text,
    price: m.price,
    meetingStatus: m.status,
    createdAt: m.created_at
  }));

  setMeetings(formatted);
};

useEffect(() => {
  loadMeetings();
}, []);

useEffect(() => {

  const channel = supabase
    .channel("admin-meetings")
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

const markCompleted = async (id: string) => {

  const { error } = await supabase
    .from("p2p_meetings")
    .update({
      status: "completed",
      completed_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  loadMeetings();
};

const cancelMeeting = async (id: string) => {

  const { error } = await supabase
    .from("p2p_meetings")
    .update({
      status: "cancelled",
      cancel_reason: "Cancelled by admin"
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  loadMeetings();
};

const openMeetingDetails = (meeting: any) => {
  setSelectedMeeting(meeting);
  setShowDetailsModal(true);
};

const getMeetingTimeline = (meeting: any) => {

  const steps = [
    {
      label: "Meeting Created",
      time: meeting.createdAt,
      icon: Clock,
      done: true
    },
    {
      label: "Meeting Scheduled",
      time: meeting.meetingTime,
      icon: Calendar,
      done: meeting.meetingStatus !== "cancelled"
    },
    {
      label: "Meeting Completed",
      time: meeting.meetingStatus === "completed" ? meeting.meetingTime : null,
      icon: CheckCircle2,
      done: meeting.meetingStatus === "completed"
    },
    {
      label: "Meeting Cancelled",
      time: meeting.meetingStatus === "cancelled" ? meeting.meetingTime : null,
      icon: XCircle,
      done: meeting.meetingStatus === "cancelled"
    }
  ];

  return steps;
};

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmed',
          color: 'bg-green-500/20 text-green-300 border-green-500',
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-blue-500 text-blue-950 border-blue-500',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: 'bg-red-500 text-red-300 border-red-500',
        };
      default:
        return {
          label: status,
          color: 'bg-gray-500 text-gray-900 border-gray-500',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-b border-white/40 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-6">
          <h1 className="text-2xl lg:text-3xl text-white mb-2" style={{ fontWeight: 700 }}>
            Meetings
          </h1>
          <p className="text-sm text-gray-400">View scheduled, completed, and cancelled meetings</p>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-gray-800 border border-white/50 rounded-xl p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by meeting ID or user name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-white/10 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-w-[160px]"
              style={{ fontWeight: 500 }}
            >
              <option>All</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        {/* Meetings Table */}
        <div className="bg-gray-800 border border-white/40 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/90 border-b border-white/40">
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
                    Meeting Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
                    Meeting City
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
                    Meeting Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {meetings.map((meeting) => {
                  const statusConfig = getStatusConfig(meeting.meetingStatus);
                  return (
                    <tr key={meeting.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm text-white font-mono" style={{ fontWeight: 600 }}>
                          {meeting.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                            {meeting.userA.avatar}
                          </div>
                          <span className="text-sm text-gray-300">{meeting.userA.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                            {meeting.userB.avatar}
                          </div>
                          <span className="text-sm text-gray-300">{meeting.userB.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-white" style={{ fontWeight: 500 }}>
                            {new Date(meeting.meetingTime).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(meeting.meetingTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1 text-sm text-gray-300">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            {meeting.meetingCity}
                          </div>
                          {meeting.meetingArea && (
                            <span className="text-xs text-gray-500 ml-5">{meeting.meetingArea}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs border ${statusConfig.color}`}
                          style={{ fontWeight: 600 }}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
  onClick={() => openMeetingDetails(meeting)}
  className="p-2 rounded-lg bg-blue-500 hover:bg-blue-500/30 border border-blue-500 transition-colors"
  title="View Details"
>
                            <Eye className="w-4 h-4 text-blue-400" />
                          </button>
                          {meeting.meetingStatus === 'confirmed' && (
                            <>
                              <button
                                className="p-2 rounded-lg bg-green-500 hover:bg-green-500/30 border border-green-500 transition-colors"
                                onClick={() => markCompleted(meeting.id)}
                              >
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              </button>
                              <button
                                className="p-2 rounded-lg bg-red-500 hover:bg-red-500/30 border border-red-500 transition-colors"
                                onClick={() => cancelMeeting(meeting.id)}
                              >
                                <XCircle className="w-4 h-4 text-red-500/30" />
                              </button>
                            </>
                            
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {showDetailsModal && selectedMeeting && (
<>
{/* Backdrop */}
<div
className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
onClick={() => setShowDetailsModal(false)}
/>

```
{/* Modal */}
<div className="fixed inset-0 flex items-center justify-center z-50 p-6">
  <div className="w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl shadow-2xl">

    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
      <div>
        <h3 className="text-lg text-white font-semibold">
          Meeting Details
        </h3>
        <p className="text-xs text-gray-400">
          ID: {selectedMeeting.id}
        </p>
      </div>

      <button
        onClick={() => setShowDetailsModal(false)}
        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
      >
        <X className="w-4 h-4 text-gray-300" />
      </button>
    </div>

    {/* Body */}
    <div className="p-6 space-y-5">

      {/* Participants */}
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {selectedMeeting.userA.avatar}
          </div>
          <p className="text-sm text-white mt-2">
            {selectedMeeting.userA.name}
          </p>
        </div>

        <ChevronRight className="text-gray-500" />

        <div className="text-center">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
            {selectedMeeting.userB.avatar}
          </div>
          <p className="text-sm text-white mt-2">
            {selectedMeeting.userB.name}
          </p>
        </div>
      </div>

      {/* Meeting Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">

        <div>
          <p className="text-gray-400">Meeting Time</p>
          <p className="text-white">
            {new Date(selectedMeeting.meetingTime).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Price</p>
          <p className="text-white font-semibold">
            ₹{selectedMeeting.price}
          </p>
        </div>

        <div>
          <p className="text-gray-400">City</p>
          <p className="text-white">
            {selectedMeeting.meetingCity}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Area</p>
          <p className="text-white">
            {selectedMeeting.meetingArea || "—"}
          </p>
        </div>

      </div>

      {/* Meeting Point */}
<div>
  <p className="text-gray-400 text-sm">Meeting Point</p>
  <p className="text-white text-sm">
    {selectedMeeting.meetingPoint || "Not specified"}
  </p>
</div>

{/* Timeline */}
<div className="mt-6">
  <p className="text-gray-400 text-sm mb-4">Meeting Timeline</p>

  <div className="space-y-4">
    {getMeetingTimeline(selectedMeeting).map((step, index) => {
      const Icon = step.icon;

      return (
        <div key={index} className="flex items-center gap-4">

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center
            ${
              step.done
                ? "bg-green-500/20 border border-green-500"
                : "bg-gray-800 border border-gray-700"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                step.done ? "text-green-400" : "text-gray-500"
              }`}
            />
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-white">{step.label}</span>

            {step.time && (
              <span className="text-xs text-gray-500">
                {new Date(step.time).toLocaleString()}
              </span>
            )}
          </div>

        </div>
      );
    })}
  </div>
</div>

    </div>
  </div>
</div>
</>
)}

      </div>
    </div>
  );
}
