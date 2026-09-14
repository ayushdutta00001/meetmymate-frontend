import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { supabase } from "../../supabase";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { BackButton } from "../ui/BackButton";

interface Props {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

type IncomingRequest = {
  id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  purpose: string | null;
  what_i_bring: string | null;
  what_i_seek: string | null;
  preferred_time: string | null;
  users: {
    name: string | null;
    profile_photo_url: string | null;
    city: string | null;
  }[];
};

export function P2PIncomingRequestsScreen({ onNavigate, onBack }: Props) {
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // ==============================
  // LOAD REAL INCOMING REQUESTS
  // ==============================
  useEffect(() => {
    const loadRequests = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
          .from("p2p_match_requests")
          .select(`
            id,
            status,
            created_at,
            purpose,
            what_i_bring,
            what_i_seek,
            preferred_time,
            users!p2p_match_requests_requester_id_fkey (
              name,
              profile_photo_url,
              city
            )
          `)
          .eq("receiver_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error(error);
          return;
        }

        setRequests(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  // ==============================
  // ACCEPT REQUEST
  // ==============================
  const handleAccept = async (id: string) => {
    const { error } = await supabase
      .from("p2p_match_requests")
      .update({
        status: "accepted",
        responded_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (!error) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r))
      );
    }
  };

  // ==============================
  // REJECT REQUEST
  // ==============================
  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from("p2p_match_requests")
      .update({
        status: "rejected",
        responded_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (!error) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-2xl mx-auto px-6 py-6">
          <BackButton onClick={onBack} />
          <h1 className="mt-4">Incoming Requests</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Review collaboration requests from peers
          </p>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {requests.length === 0 && (
          <p className="text-gray-500">No incoming requests yet.</p>
        )}

        {requests.map((req) => {
          const user = req.users?.[0];

          return (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              {/* USER INFO */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user?.profile_photo_url || "/default-avatar.png"}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p>{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.city}</p>
                </div>
              </div>

              {/* DETAILS */}
              <div className="space-y-3 text-sm">
                <p><strong>Purpose:</strong> {req.purpose || "-"}</p>
                <p><strong>What I Bring:</strong> {req.what_i_bring || "-"}</p>
                <p><strong>What I Seek:</strong> {req.what_i_seek || "-"}</p>
                <p><strong>Preferred Time:</strong> {req.preferred_time || "-"}</p>
              </div>

              {/* STATUS / ACTIONS */}
              <div className="mt-6 flex gap-3">
                {req.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="flex-1 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </button>

                    <button
                      onClick={() => handleReject(req.id)}
                      className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}

                {req.status === "accepted" && (
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle className="w-5 h-5" />
                    Accepted
                  </div>
                )}

                {req.status === "rejected" && (
                  <div className="flex items-center gap-2 text-red-500">
                    <XCircle className="w-5 h-5" />
                    Rejected
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}