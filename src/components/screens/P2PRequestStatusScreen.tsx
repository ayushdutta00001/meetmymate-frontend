import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { motion } from 'motion/react';
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
} from 'lucide-react';
import { BackButton } from '../ui/BackButton';

interface P2PRequestStatusScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
  peerId: string | null;
  setSelectedRequestId: (id: string) => void;
}

type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'expired';

interface RequestDetails {
  peer: {
    name: string;
    image: string;
    role: string;
  };
  submittedAt: string;
  purpose: string;
  preferredTime: string;
  preferredLocation: string;
  whatIBring: string;
  whatISeek: string;
}

export function P2PRequestStatusScreen({
  onNavigate,
  onBack,
  peerId,
  setSelectedRequestId,
}: P2PRequestStatusScreenProps) {
  const [status, setStatus] =
    useState<RequestStatus>('pending');

  const [requestDetails, setRequestDetails] =
    useState<RequestDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);

  useEffect(() => {
    const loadP2PStatus = async () => {
      if (!peerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        // ============================================
        // LOAD LATEST REQUEST
        // ============================================

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
            preferred_location,
            users!p2p_match_requests_receiver_id_fkey (
              name,
              profile_photo_url,
              city
            )
          `)
          .eq("requester_id", user.id)
          .eq("receiver_id", peerId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error(
            "P2P request status load error:",
            error
          );
          return;
        }

        if (!data) {
          setRequestDetails(null);
          return;
        }

        // Keep the exact request ID in the parent navigation state.
        // The payment screen loads the meeting by this request ID.
        setCurrentRequestId(data.id);
        setSelectedRequestId(data.id);

        // ============================================
        // NORMALIZE USER RELATION
        // ============================================

        const peerUser = Array.isArray(data.users)
          ? data.users[0]
          : data.users;

        // ============================================
        // NORMALIZE STATUS
        // ============================================

        const normalizedStatus: RequestStatus =
          data.status === "accepted"
            ? "accepted"
            : data.status === "rejected"
            ? "rejected"
            : data.status === "expired"
            ? "expired"
            : "pending";

        setStatus(normalizedStatus);

        // ============================================
        // REQUEST DETAILS
        // ============================================

        setRequestDetails({
          peer: {
            name: peerUser?.name ?? "Unknown",
            image:
              peerUser?.profile_photo_url ??
              "/default-avatar.png",
            role: peerUser?.city ?? "",
          },

          submittedAt: new Date(
            data.created_at
          ).toLocaleDateString(),

          purpose: data.purpose ?? "-",

          preferredTime:
            data.preferred_time ?? "-",

          preferredLocation:
            data.preferred_location ?? "-",

          whatIBring:
            data.what_i_bring ?? "-",

          whatISeek:
            data.what_i_seek ?? "-",
        });
      } catch (err) {
        console.error(
          "P2P request status error:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    loadP2PStatus();
  }, [peerId, setSelectedRequestId]);

  // ============================================
  // REALTIME STATUS UPDATES
  // ============================================

  useEffect(() => {
    if (!peerId) return;

    let channel: any;

    const subscribeRealtime = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      channel = supabase
        .channel("p2p-request-status")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "p2p_match_requests",
            filter: `requester_id=eq.${user.id}`,
          },
          (payload) => {
            console.log(
              "🔥 REALTIME P2P REQUEST UPDATE:",
              payload
            );

            const updated = payload.new as {
              requester_id?: string;
              receiver_id?: string;
              status?: string;
            };

            // Ignore updates belonging to another receiver.
            if (
              updated.receiver_id &&
              updated.receiver_id !== peerId
            ) {
              return;
            }

            // Explicitly handle every supported status.
            if (updated.status === "accepted") {
              setStatus("accepted");
            } else if (
              updated.status === "rejected"
            ) {
              setStatus("rejected");
            } else if (
              updated.status === "expired"
            ) {
              setStatus("expired");
            } else {
              setStatus("pending");
            }
          }
        )
        .subscribe();
    };

    subscribeRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [peerId]);

  // ============================================
  // STATUS CONFIG
  // ============================================

  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: (
            <Clock className="w-12 h-12" />
          ),
          color:
            "text-amber-600 dark:text-amber-400",
          bgColor:
            "bg-amber-50 dark:bg-amber-900/20",
          borderColor:
            "border-amber-200 dark:border-amber-800",
          title: "Request Pending",
          description:
            "Your meeting request has been sent. They will review it and respond soon.",
          showActions: false,
        };

      case "accepted":
        return {
          icon: (
            <CheckCircle className="w-12 h-12" />
          ),
          color:
            "text-green-600 dark:text-green-400",
          bgColor:
            "bg-green-50 dark:bg-green-900/20",
          borderColor:
            "border-green-200 dark:border-green-800",
          title: "Request Accepted!",
          description:
            "Great news! Your meeting request has been accepted. Proceed to payment to schedule the meeting.",
          showActions: true,
        };

      case "rejected":
        return {
          icon: (
            <XCircle className="w-12 h-12" />
          ),
          color:
            "text-red-600 dark:text-red-400",
          bgColor:
            "bg-red-50 dark:bg-red-900/20",
          borderColor:
            "border-red-200 dark:border-red-800",
          title: "Request Declined",
          description:
            "Unfortunately, your meeting request has been declined. You can browse other peers.",
          showActions: false,
        };

      case "expired":
        return {
          icon: (
            <Clock className="w-12 h-12" />
          ),
          color:
            "text-gray-600 dark:text-gray-400",
          bgColor:
            "bg-gray-50 dark:bg-gray-900/30",
          borderColor:
            "border-gray-200 dark:border-gray-700",
          title: "Request Expired",
          description:
            "The payment deadline expired before both participants completed payment. This request has been closed.",
          showActions: false,
        };

      default:
        return {
          icon: (
            <Clock className="w-12 h-12" />
          ),
          color:
            "text-amber-600 dark:text-amber-400",
          bgColor:
            "bg-amber-50 dark:bg-amber-900/20",
          borderColor:
            "border-amber-200 dark:border-amber-800",
          title: "Request Pending",
          description:
            "Your meeting request is being processed.",
          showActions: false,
        };
    }
  };

  const statusConfig = getStatusConfig();

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading request status...</p>
      </div>
    );
  }

  // ============================================
  // NO REQUEST
  // ============================================

  if (!requestDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No request selected
      </div>
    );
  }

  // ============================================
  // MAIN UI
  // ============================================

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
            <h1 className="mb-2">
              Request Status
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your meeting request
            </p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`mb-8 p-6 rounded-2xl border-2 ${statusConfig.borderColor} ${statusConfig.bgColor}`}
        >
          <div className="flex items-start gap-4">
            <div className={statusConfig.color}>
              {statusConfig.icon}
            </div>

            <div className="flex-1">
              <h3
                className={`mb-2 ${statusConfig.color}`}
              >
                {statusConfig.title}
              </h3>

              <p className="text-sm text-gray-700 dark:text-gray-300">
                {statusConfig.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Peer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="mb-4">
            Meeting With
          </h3>

          <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={requestDetails.peer.image}
                alt={requestDetails.peer.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="mb-1">
                {requestDetails.peer.name}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {requestDetails.peer.role}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Request Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="mb-4">
            Request Details
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Submitted
              </p>

              <p>
                {requestDetails.submittedAt}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Purpose
              </p>

              <p>
                {requestDetails.purpose}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Preferred Time
              </p>

              <p className="text-sm">
                {requestDetails.preferredTime}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Preferred Location
              </p>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />

                <span className="font-medium">
                  {requestDetails.preferredLocation ||
                    "Not specified"}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                What I Bring
              </p>

              <p className="text-sm">
                {requestDetails.whatIBring}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                What I Seek
              </p>

              <p className="text-sm">
                {requestDetails.whatISeek}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        {statusConfig.showActions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3"
          >
            <button
              onClick={() => {
                if (!currentRequestId) return;
                setSelectedRequestId(currentRequestId);
                onNavigate("p2p-peer-payment");
              }}
              className="flex-1 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all"
            >
              Proceed to Payment
            </button>

            <button
              onClick={onBack}
              className="px-6 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              Back
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}