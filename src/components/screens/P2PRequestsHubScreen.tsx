import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Send,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Briefcase,
  User,
  CheckCircle,
  Target,
  Sparkles,
  ArrowRight,
  Calendar,
} from 'lucide-react';

interface Request {
  id: string;
  name: string;
  peerId: string;
  avatar: string;
  location?: string;
  role?: string;

  // Request Meeting details
  purpose?: string;
  whatIBring?: string;
  whatISeek?: string;
  preferredDate?: string;
  preferredLocation?: string;

  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  timestamp: string;
  unread?: boolean;
}

interface P2PRequestsHubScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
  onSelectPeer: (peerId: string) => void;
  setSelectedMeetingId: (id: string | null) => void;
  setSelectedRequestId: (id: string | null) => void;
  defaultTab?: 'incoming' | 'sent';
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'accepted':
      return {
        label: 'Accepted',
        icon: CheckCircle2,
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-50 dark:bg-green-900/30',
        border: 'border-green-200 dark:border-green-700',
      };

    case 'rejected':
      return {
        label: 'Rejected',
        icon: XCircle,
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-900/30',
        border: 'border-red-200 dark:border-red-700',
      };

    case 'expired':
      return {
        label: 'Expired',
        icon: Clock,
        color: 'text-gray-500 dark:text-gray-400',
        bg: 'bg-gray-50 dark:bg-gray-900/30',
        border: 'border-gray-200 dark:border-gray-700',
      };

    default:
      return {
        label: 'Pending',
        icon: Clock,
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-900/30',
        border: 'border-amber-200 dark:border-amber-700',
      };
  }
};

const getAvatarGradient = (name: string) => {
  const gradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
  ];

  const safeName = name || 'U';
  const index = safeName.charCodeAt(0) % gradients.length;

  return gradients[index];
};

export function P2PRequestsHubScreen({
  onNavigate,
  onBack,
  onSelectPeer,
  setSelectedMeetingId,
  setSelectedRequestId,
  defaultTab = 'sent',
}: P2PRequestsHubScreenProps) {
  const [activeTab, setActiveTab] =
    useState<'incoming' | 'sent'>(defaultTab);

  const [sentRequests, setSentRequests] = useState<Request[]>([]);
  const [incomingRequests, setIncomingRequests] =
    useState<Request[]>([]);

  const [loading, setLoading] = useState(true);

  /*
   * IMPORTANT:
   * Meetings are keyed by request_id.
   *
   * This prevents:
   *   Request #1 -> cancelled
   *   Request #2 -> new booking
   *
   * from sharing the same meeting state.
   */
  const [meetingsMap, setMeetingsMap] =
    useState<Record<string, any>>({});

  /* =========================================================
     LOAD REQUESTS
  ========================================================= */

  const loadRequests = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      /* =======================================================
         SENT REQUESTS
      ======================================================= */

      const {
        data: sentData,
        error: sentError,
      } = await supabase
        .from('p2p_match_requests')
        .select(`
          id,
          status,
          created_at,
          users!p2p_match_requests_receiver_id_fkey (
            id,
            name,
            city,
            profile_photo_url
          )
        `)
        .eq('requester_id', user.id)
        .neq('status', 'expired')
        .order('created_at', {
          ascending: false,
        });

      if (sentError) {
        console.error(
          'Sent requests error:',
          sentError
        );
      }

      const mappedSent: Request[] =
        (sentData || []).map((item: any) => {
          const peerUser = Array.isArray(item.users)
            ? item.users[0]
            : item.users;

          return {
            id: item.id,
            peerId: peerUser?.id,
            name: peerUser?.name ?? 'User',
            avatar:
              peerUser?.profile_photo_url ?? '',
            location: peerUser?.city ?? '',
            role: '',
            status: item.status,
            timestamp: new Date(
              item.created_at
            ).toLocaleDateString(),
          };
        });

      setSentRequests(mappedSent);

      /* =======================================================
         INCOMING REQUESTS
      ======================================================= */

      const {
        data: incomingData,
        error: incomingError,
      } = await supabase
        .from('p2p_match_requests')
        .select(`
          id,
          requester_id,
          receiver_id,
          status,
          purpose,
          what_i_bring,
          what_i_seek,
          preferred_time,
          preferred_location,
          created_at,
          users!p2p_match_requests_requester_id_fkey (
            id,
            name,
            city,
            profile_photo_url
          )
        `)
        .eq('receiver_id', user.id)
        .neq('status', 'expired')
        .order('created_at', {
          ascending: false,
        });

      if (incomingError) {
        console.error(
          'Incoming requests error:',
          incomingError
        );
      }

      const mappedIncoming: Request[] =
        (incomingData || []).map((item: any) => {
          const peerUser = Array.isArray(item.users)
            ? item.users[0]
            : item.users;

          return {
            id: item.id,
            peerId: peerUser?.id,
            name: peerUser?.name ?? 'User',
            avatar:
              peerUser?.profile_photo_url ?? '',
            location: peerUser?.city ?? '',
            role: '',

            purpose: item.purpose ?? '',
            whatIBring:
              item.what_i_bring ?? '',
            whatISeek:
              item.what_i_seek ?? '',
            preferredDate:
              item.preferred_time ?? '',
            preferredLocation:
              item.preferred_location ?? '',

            status: item.status,
            timestamp: new Date(
              item.created_at
            ).toLocaleDateString(),
            unread: false,
          };
        });

      setIncomingRequests(mappedIncoming);
    } catch (err) {
      console.error(
        'P2P request loading error:',
        err
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOAD ACTIVE MEETINGS
     
     IMPORTANT:
     A meeting is associated with ONE request using
     p2p_meetings.request_id.

     Historical meetings:
       cancelled
       completed

     are deliberately ignored here.
  ========================================================= */

  const loadMeetings = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const {
      data,
      error,
    } = await supabase
      .from('p2p_meetings')
      .select(`
        id,
        request_id,
        user_a,
        user_b,
        status,
        meeting_time,
        payment_user_a,
        payment_user_b
      `)
      .or(
        `user_a.eq.${user.id},user_b.eq.${user.id}`
      )
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error(
        'Meeting load error:',
        error
      );
      return;
    }

    const map: Record<string, any> = {};

    /*
     * ONLY active booking statuses belong in the
     * request -> meeting map.
     *
     * Cancelled/completed/expired meetings stay in
     * history and cannot affect a new request.
     */
    const activeStatuses = [
      'pending_payment',
      'awaiting_second_payment',
      'paid_waiting_admin',
      'confirmed',
      'scheduled',
    ];

    (data || []).forEach((meeting: any) => {
      if (!meeting.request_id) {
        return;
      }

      if (
        !activeStatuses.includes(
          meeting.status
        )
      ) {
        return;
      }

      map[meeting.request_id] =
        meeting;
    });

    console.log(
      '🔥 ACTIVE meetings by request:',
      map
    );

    setMeetingsMap(map);
  };

  /* =========================================================
     ACCEPT REQUEST
     
     Creates a brand-new meeting linked to the exact
     request that was accepted.
  ========================================================= */

  const handleAcceptRequest = async (
    requestId: string
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      /* -------------------------------------------------------
         Load the exact request
      ------------------------------------------------------- */

      const {
        data: requestData,
        error: reqError,
      } = await supabase
        .from('p2p_match_requests')
        .select(
          'id, requester_id, receiver_id'
        )
        .eq('id', requestId)
        .single();

      if (
        reqError ||
        !requestData
      ) {
        console.error(
          'Request fetch failed:',
          reqError
        );

        return;
      }

      /* -------------------------------------------------------
         Make sure the request is still pending
      ------------------------------------------------------- */

      if (
        requestData.receiver_id !==
        user.id
      ) {
        console.error(
          'Unauthorized request acceptance attempt.'
        );

        return;
      }

      /* -------------------------------------------------------
         Accept exact request
      ------------------------------------------------------- */

      const {
        error: updateError,
      } = await supabase
        .from('p2p_match_requests')
        .update({
          status: 'accepted',
        })
        .eq('id', requestId)
        .eq('status', 'pending');

      if (updateError) {
        console.error(
          'Accept failed:',
          updateError
        );

        return;
      }

      /* -------------------------------------------------------
         Create NEW meeting for THIS request

         IMPORTANT:
         The admin price is stored in p2p_settings, but normal
         authenticated users may not have SELECT access to that
         table because of RLS. Use a narrowly-scoped RPC that
         returns only the current P2P price.

         IMPORTANT:
         Do NOT fall back to a hardcoded price. If the current
         admin price cannot be read, stop the meeting creation
         and revert the request to pending.
      ------------------------------------------------------- */

      const {
        data: currentP2PPrice,
        error: p2pPriceError,
      } = await supabase.rpc(
        'get_current_p2p_price'
      );
console.log(
  "🔥 P2P PRICE RPC RESULT:",
  currentP2PPrice
);
      if (p2pPriceError) {
        console.error(
          'P2P current price RPC error:',
          p2pPriceError
        );

        await supabase
          .from('p2p_match_requests')
          .update({
            status: 'pending',
          })
          .eq('id', requestId)
          .eq('status', 'accepted');

        return;
      }

      const defaultMeetingPrice = Number(
        currentP2PPrice
      );
console.log(
  "🔥 P2P PRICE RPC RESULT:",
  currentP2PPrice
);
      if (
        !Number.isFinite(defaultMeetingPrice) ||
        defaultMeetingPrice <= 0
      ) {
        console.error(
          'Invalid current P2P price returned by RPC:',
          currentP2PPrice
        );

        await supabase
          .from('p2p_match_requests')
          .update({
            status: 'pending',
          })
          .eq('id', requestId)
          .eq('status', 'accepted');

        return;
      }

      const {
        data: newMeeting,
        error: meetingError,
      } = await supabase
        .from('p2p_meetings')
        .insert({
          request_id:
            requestData.id,

          user_a:
            requestData.requester_id,

          user_b:
            requestData.receiver_id,

          status:
            'pending_payment',

          price:
            defaultMeetingPrice,

          payment_deadline:
            new Date(
              Date.now() +
                24 * 60 * 60 * 1000
            ),
        })
        .select()
        .single();

      if (meetingError) {
        console.error(
          'Meeting creation failed:',
          meetingError
        );

        /*
         * IMPORTANT:
         * If meeting creation fails, revert the request
         * to pending so the user is not left with an
         * accepted request that has no meeting.
         */
        await supabase
          .from('p2p_match_requests')
          .update({
            status: 'pending',
          })
          .eq('id', requestId)
          .eq('status', 'accepted');

        return;
      }

      console.log(
        '✅ New request-specific meeting created:',
        newMeeting
      );

      /* -------------------------------------------------------
         Get receiver profile
      ------------------------------------------------------- */

      const {
        data: receiverProfile,
      } = await supabase
        .from('users')
        .select(
          'name, profile_photo_url'
        )
        .eq('id', user.id)
        .single();

      /* -------------------------------------------------------
         Notification
      ------------------------------------------------------- */

      const {
        error: notifError,
      } = await supabase
        .from('notifications')
        .insert({
          user_id:
            requestData.requester_id,

          sender_id:
            user.id,

          type:
            'p2p_request_accepted',

          module:
            'p2p',

          reference_id:
            requestData.id,

          title:
            'Request Accepted',

          message:
            `${receiverProfile?.name || 'Someone'} accepted your collaboration request`,

          link:
            'p2p-requests-hub',

          is_read: false,

          metadata: {
            sender_name:
              receiverProfile?.name,

            sender_avatar:
              receiverProfile?.profile_photo_url,
          },
        });

      if (notifError) {
        console.error(
          '❌ Accept notification failed:',
          notifError
        );
      }

      console.log(
        '✅ Request accepted + request-specific meeting created + notification sent'
      );

      await loadRequests();
      await loadMeetings();
    } catch (err) {
      console.error(
        'Accept request error:',
        err
      );
    }
  };

  /* =========================================================
     REJECT REQUEST
  ========================================================= */

  const handleRejectRequest = async (
    requestId: string
  ) => {
    try {
      const {
        error,
      } = await supabase
        .from('p2p_match_requests')
        .update({
          status: 'rejected',
        })
        .eq('id', requestId)
        .eq('status', 'pending');

      if (error) {
        console.error(
          'Reject failed:',
          error
        );

        return;
      }

      console.log(
        '❌ Request rejected'
      );

      await loadRequests();
      await loadMeetings();
    } catch (err) {
      console.error(
        'Reject request error:',
        err
      );
    }
  };

  /* =========================================================
     INITIAL LOAD + REALTIME
  ========================================================= */

  useEffect(() => {
    loadRequests();
    loadMeetings();

    const channel =
      supabase
        .channel(
          'p2p-requests-hub-realtime'
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'p2p_match_requests',
          },
          async (payload) => {
            console.log(
              '🔥 HUB REQUEST UPDATE:',
              payload
            );

            await loadRequests();
            await loadMeetings();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'p2p_meetings',
          },
          async (payload) => {
            console.log(
              '🔥 HUB MEETING UPDATE:',
              payload
            );

            await loadMeetings();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  const currentRequests =
    activeTab === 'sent'
      ? sentRequests
      : incomingRequests;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={onBack}
            className="w-11 h-11 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          <h1 className="mb-2">
            My Requests
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track sent and received meeting requests
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="mb-6"
        >
          <div className="flex gap-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() =>
                setActiveTab('sent')
              }
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'sent'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Send className="w-4 h-4" />

              <span>
                Sent
              </span>

              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'sent'
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                {sentRequests.length}
              </span>
            </button>

            <button
              onClick={() =>
                setActiveTab(
                  'incoming'
                )
              }
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab ===
                'incoming'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Inbox className="w-4 h-4" />

              <span>
                Incoming
              </span>

              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab ===
                  'incoming'
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                {
                  incomingRequests.length
                }
              </span>
            </button>
          </div>
        </motion.div>

        {loading && (
          <p className="text-center text-gray-400 py-10">
            Loading requests...
          </p>
        )}

        {/* Requests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRequests.length ===
          0 ? (
            <div className="col-span-full p-12 text-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <div className="w-full rounded-2xl bg-[#031a5a] border-2 border-emerald-400/70 overflow-hidden shadow-lg">
                {activeTab ===
                'sent' ? (
                  <Send className="w-8 h-8 text-gray-400" />
                ) : (
                  <Inbox className="w-8 h-8 text-gray-400" />
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-400 mt-4">
                {activeTab ===
                'sent'
                  ? "You haven't sent any requests yet"
                  : 'No incoming requests at the moment'}
              </p>
            </div>
          ) : activeTab ===
            'sent' ? (
            sentRequests.map(
              (
                request,
                index
              ) => {
                /*
                 * IMPORTANT:
                 * Find meeting by REQUEST ID.
                 */
                const meeting =
                  meetingsMap[
                    request.id
                  ];

                const statusConfig =
                  getStatusConfig(
                    request.status
                  );

                const StatusIcon =
                  statusConfig.icon;

                const avatarGradient =
                  getAvatarGradient(
                    request.name
                  );

                return (
                  <motion.div
                    key={
                      request.id
                    }
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index *
                        0.05,
                      duration: 0.3,
                    }}
                    whileHover={{
                      y: -4,
                    }}
                    className="group relative"
                  >
                    <div className="w-full rounded-2xl bg-[#031a5a] border-2 border-emerald-400/70 hover:border-cyan-300 transition-all overflow-hidden shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20">
                      {/* Gradient Top Bar */}
                      <div
                        className={`h-2 bg-gradient-to-r ${
                          request.status ===
                          'accepted'
                            ? 'from-green-500 via-emerald-500 to-teal-500'
                            : request.status ===
                              'rejected'
                            ? 'from-red-500 via-rose-500 to-pink-500'
                            : request.status ===
                              'expired'
                            ? 'from-gray-500 via-gray-600 to-gray-700'
                            : 'from-amber-500 via-orange-500 to-yellow-500'
                        }`}
                      />

                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4 pb-4 border-b-2 border-gray-100 dark:border-gray-800">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                            {request.avatar ? (
                              <img
                                src={
                                  request.avatar
                                }
                                alt={
                                  request.name
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${avatarGradient} text-white font-bold text-xl`}
                              >
                                {request.name?.charAt(
                                  0
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="mb-2 truncate font-bold text-gray-900 dark:text-gray-100">
                              {request.name}
                            </h3>

                            {request.role && (
                              <div className="inline-block px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-md mb-2">
                                <p className="text-xs text-white font-bold">
                                  {
                                    request.role
                                  }
                                </p>
                              </div>
                            )}

                            {request.location && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <MapPin className="w-3.5 h-3.5" />

                                <span className="font-medium">
                                  {
                                    request.location
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status */}
                        <div
                          className={`p-3 rounded-xl ${statusConfig.bg} border-2 ${statusConfig.border} mb-4`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <StatusIcon
                                className={`w-4 h-4 ${statusConfig.color}`}
                              />

                              <span
                                className={`text-sm font-bold ${statusConfig.color}`}
                              >
                                {
                                  statusConfig.label
                                }
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-3.5 h-3.5" />

                              {
                                request.timestamp
                              }
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4 flex-wrap">
                          {/* BOOK NOW / VIEW BOOKING STATUS */}
{request.status === 'accepted' && !!meeting && (
  <>
    {/* USER A HAS NOT PAID */}
    {meeting.payment_user_a !== true && (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          onSelectPeer(request.peerId);
          setSelectedRequestId(request.id);
          onNavigate('p2p-peer-payment');
        }}
        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/30"
      >
        Book Now
      </motion.button>
    )}

    {/* USER A HAS PAID */}
    {meeting.payment_user_a === true && (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setSelectedMeetingId(meeting.id);
          setSelectedRequestId(request.id);
          onNavigate('p2p-meeting-confirmation');
        }}
        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg"
      >
        View Booking Status
      </motion.button>
    )}
  </>
)}

                          {/* Meeting Date */}
                          {request.status ===
                            'accepted' &&
                            meeting?.meeting_time && (
                              <div className="w-full mt-2 flex items-center justify-center gap-2 text-sm text-gray-400">
                                <Clock className="w-4 h-4" />

                                <span>
                                  {new Date(
                                    meeting.meeting_time
                                  ).toLocaleString(
                                    'en-IN',
                                    {
                                      dateStyle:
                                        'medium',
                                      timeStyle:
                                        'short',
                                    }
                                  )}
                                </span>
                              </div>
                            )}

                          {/* REJECTED */}
                          {String(request.status) ===
                            'rejected' && (
                            <button
                              disabled
                              className="flex-1 px-4 py-3 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-500 font-bold cursor-not-allowed"
                            >
                              Rejected
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }
            )
                   ) : (
            incomingRequests.map(
              (request, index) => {
                /*
                 * IMPORTANT:
                 * Find meeting by REQUEST ID.
                 * Never use peer ID for meeting lookup.
                 */
                const meeting =
                  meetingsMap[request.id];

                const avatarGradient =
                  getAvatarGradient(request.name);

                const statusConfig =
                  getStatusConfig(request.status);

                const StatusIcon =
                  statusConfig.icon;

                return (
                  <motion.div
                    key={request.id}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.04,
                      duration: 0.25,
                    }}
                    className="group"
                  >
                    <div className="w-full overflow-hidden rounded-2xl bg-[#071126] border border-white/15 hover:border-blue-400/50 transition-all duration-200 shadow-lg hover:shadow-blue-500/10">

                      {/* =========================================
                          TOP ACCENT
                         ========================================= */}
                      <div className="h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400" />

                      <div className="p-4">

                        {/* =========================================
                            PROFILE HEADER
                           ========================================= */}
                        <div className="flex items-center gap-3">

                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10">
                              {request.avatar ? (
                                <img
                                  src={request.avatar}
                                  alt={request.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div
                                  className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${avatarGradient} text-white font-bold text-base`}
                                >
                                  {request.name?.charAt(0)}
                                </div>
                              )}
                            </div>

                            {/* Verified */}
                            <div className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-[#071126] flex items-center justify-center">
                              <CheckCircle
                                className="w-3 h-3 text-white"
                                fill="white"
                              />
                            </div>

                            {/* Unread */}
                            {request.unread && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-purple-500 border-2 border-[#071126] animate-pulse" />
                            )}
                          </div>

                          {/* Name / Location */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="truncate text-[15px] font-bold text-white">
                                {request.name}
                              </h3>

                              {request.role && (
                                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-purple-500/15 text-[9px] font-semibold text-purple-300 border border-purple-400/20">
                                  {request.role}
                                </span>
                              )}
                            </div>

                            {request.location && (
                              <div className="flex items-center gap-1 mt-0.5 text-[11px] text-gray-400">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">
                                  {request.location}
                                </span>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Divider */}
                        <div className="my-3 h-px bg-white/8" />

                        {/* =========================================
                            PURPOSE
                           ========================================= */}
                        {request.purpose && (
                          <div className="mb-3">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-400" />

                              <span className="text-[10px] font-semibold uppercase tracking-wide text-purple-300">
                                Purpose
                              </span>
                            </div>

                            <p className="text-sm font-medium text-white leading-snug line-clamp-2">
                              {request.purpose}
                            </p>
                          </div>
                        )}

                        {/* =========================================
                            LOOKING FOR / CAN BRING
                           ========================================= */}
                        {(request.whatISeek ||
                          request.whatIBring) && (
                          <div className="grid grid-cols-2 gap-2 mb-3">

                            {/* Looking For */}
                            <div className="min-w-0 rounded-xl bg-white/[0.035] px-3 py-2.5">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Target className="w-3.5 h-3.5 text-orange-400" />

                                <span className="text-[10px] font-semibold text-orange-300">
                                  Looking For
                                </span>
                              </div>

                              <p className="text-xs text-gray-200 leading-snug line-clamp-2">
                                {request.whatISeek || "—"}
                              </p>
                            </div>

                            {/* Can Bring */}
                            <div className="min-w-0 rounded-xl bg-white/[0.035] px-3 py-2.5">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />

                                <span className="text-[10px] font-semibold text-emerald-300">
                                  Can Bring
                                </span>
                              </div>

                              <p className="text-xs text-gray-200 leading-snug line-clamp-2">
                                {request.whatIBring || "—"}
                              </p>
                            </div>

                          </div>
                        )}

                        {/* =========================================
                            DATE / LOCATION
                           ========================================= */}
                        {(request.preferredDate ||
                          request.preferredLocation) && (
                          <div className="flex items-center gap-2 mb-3">

                            {/* Date */}
                            {request.preferredDate && (
                              <div className="flex-1 min-w-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/5">
                                <Calendar className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />

                                <div className="min-w-0">
                                  <p className="text-[9px] uppercase tracking-wide text-blue-300">
                                    Date
                                  </p>

                                  <p className="text-[11px] font-semibold text-white truncate">
                                    {(() => {
                                      const [
                                        year,
                                        month,
                                        day,
                                      ] =
                                        request.preferredDate!.split(
                                          "-"
                                        );

                                      return `${day}-${month}-${year}`;
                                    })()}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Location */}
                            {request.preferredLocation && (
                              <div className="flex-1 min-w-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/5">
                                <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />

                                <div className="min-w-0">
                                  <p className="text-[9px] uppercase tracking-wide text-cyan-300">
                                    Location
                                  </p>

                                  <p className="text-[11px] font-semibold text-white truncate">
                                    {request.preferredLocation}
                                  </p>
                                </div>
                              </div>
                            )}

                          </div>
                        )}

                        {/* =========================================
                            STATUS
                           ========================================= */}
                        <div
                          className={`flex items-center justify-between px-3 py-2 rounded-xl ${statusConfig.bg} border ${statusConfig.border} mb-3`}
                        >
                          <div className="flex items-center gap-1.5">
                            <StatusIcon
                              className={`w-3.5 h-3.5 ${statusConfig.color}`}
                            />

                            <span
                              className={`text-[11px] font-semibold ${statusConfig.color}`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              {request.timestamp}
                            </span>
                          </div>
                        </div>

                        {/* =========================================
                            ACCEPT / REJECT
                           ========================================= */}
                        {request.status === "pending" && (
                          <div className="grid grid-cols-2 gap-2">

                            <motion.button
                              whileTap={{
                                scale: 0.98,
                              }}
                              onClick={() =>
                                handleAcceptRequest(
                                  request.id
                                )
                              }
                              className="h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold shadow-md shadow-green-500/15"
                            >
                              Accept
                            </motion.button>

                            <motion.button
                              whileTap={{
                                scale: 0.98,
                              }}
                              onClick={() =>
                                handleRejectRequest(
                                  request.id
                                )
                              }
                              className="h-10 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm font-semibold hover:bg-red-500/10 hover:text-red-300 hover:border-red-400/20 transition-all"
                            >
                              Reject
                            </motion.button>

                          </div>
                        )}

                        {/* =========================================
                            ACCEPTED → PAYMENT / BOOKING
                           ========================================= */}
                        {request.status === "accepted" &&
                          !!meeting && (
                            <div className="space-y-2">

                              {/* Payment notice */}
                              {meeting.payment_user_b !==
                                true && (
                                <div className="px-3 py-2.5 rounded-xl bg-blue-500/8 border border-blue-400/15">
                                  <p className="text-[9px] text-blue-100 leading-relaxed">
                                    Request accepted. Complete your payment within 24 hours to book the meeting.
                                  </p>

                                  {meeting.payment_deadline && (
                                    <p className="text-[9px9i] text-blue-300 mt-1">
                                      Deadline:{" "}
                                      {new Date(
                                        meeting.payment_deadline
                                      ).toLocaleString(
                                        "en-IN"
                                      )}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Book Now */}
                              {meeting.payment_user_b !==
                                true && (
                                <motion.button
                                  whileTap={{
                                    scale: 0.98,
                                  }}
                                  onClick={() => {
                                    onSelectPeer(
                                      request.peerId
                                    );

                                    setSelectedRequestId(
                                      request.id
                                    );

                                    onNavigate(
                                      "p2p-peer-payment"
                                    );
                                  }}
                                  className="w-full h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20"
                                >
                                  Book Now
                                </motion.button>
                              )}

                              {/* Already Paid */}
                              {meeting.payment_user_b ===
                                true && (
                                <motion.button
                                  whileTap={{
                                    scale: 0.98,
                                  }}
                                  onClick={() => {
                                    setSelectedMeetingId(
                                      meeting.id
                                    );

                                    setSelectedRequestId(
                                      request.id
                                    );

                                    onNavigate(
                                      "p2p-meeting-confirmation"
                                    );
                                  }}
                                  className="w-full h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold shadow-md shadow-green-500/20"
                                >
                                  View Booking Status
                                </motion.button>
                              )}

                              {/* Meeting Date */}
                              {meeting.meeting_time && (
                                <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 pt-0.5">
                                  <Clock className="w-3 h-3" />

                                  <span>
                                    {new Date(
                                      meeting.meeting_time
                                    ).toLocaleString(
                                      "en-IN",
                                      {
                                        dateStyle:
                                          "medium",
                                        timeStyle:
                                          "short",
                                      }
                                    )}
                                  </span>
                                </div>
                              )}

                            </div>
                          )}

                        {/* =========================================
                            REJECTED
                           ========================================= */}
                        {request.status ===
                          "rejected" && (
                          <button
                            disabled
                            className="w-full h-10 rounded-xl bg-white/5 border border-white/10 text-gray-500 font-semibold text-sm cursor-not-allowed"
                          >
                            Request Rejected
                          </button>
                        )}

                        {/* =========================================
                            VIEW PROFILE
                           ========================================= */}
                        <motion.button
                          whileTap={{
                            scale: 0.98,
                          }}
                          onClick={() => {
                            onSelectPeer(
                              request.peerId
                            );

                            onNavigate(
                              "p2p-peer-profile"
                            );
                          }}
                          className="w-full h-9 mt-2.5 rounded-xl bg-transparent border border-white/10 hover:border-blue-400/40 hover:bg-blue-500/5 text-gray-400 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                        >
                          View Profile
                          <ArrowRight className="w-3.5 h-3.5" />
                        </motion.button>

                      </div>
                    </div>
                  </motion.div>
                );
              }
            )
          )}
        </div>
      </div>
    </div>
  );
}