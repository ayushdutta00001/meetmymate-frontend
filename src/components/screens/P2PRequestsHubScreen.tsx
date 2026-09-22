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
         The default P2P meeting price is controlled from
         the Admin P2P Settings screen (p2p_settings.default_price).
         If settings cannot be loaded, keep the existing 999
         fallback so the request flow is not broken.
      ------------------------------------------------------- */

      let defaultMeetingPrice = 999;

      const {
        data: p2pSettings,
        error: p2pSettingsError,
      } = await supabase
        .from('p2p_settings')
        .select('default_price')
        .order('created_at', {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (p2pSettingsError) {
        console.error(
          'P2P settings price load error:',
          p2pSettingsError
        );
      } else if (
        p2pSettings?.default_price !== null &&
        p2pSettings?.default_price !== undefined &&
        Number.isFinite(Number(p2pSettings.default_price)) &&
        Number(p2pSettings.default_price) >= 0
      ) {
        defaultMeetingPrice = Number(
          p2pSettings.default_price
        );
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
              (
                request,
                index
              ) => {
                /*
                 * IMPORTANT:
                 * Find meeting by REQUEST ID,
                 * never by peer ID.
                 */
                const meeting =
                  meetingsMap[
                    request.id
                  ];

                const avatarGradient =
                  getAvatarGradient(
                    request.name
                  );

                const statusConfig =
                  getStatusConfig(
                    request.status
                  );

                const StatusIcon =
                  statusConfig.icon;

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
                      {/* Top Bar */}
                      <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500" />

                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4 pb-4 border-b-2 border-gray-100 dark:border-gray-800">
                          <div className="relative flex-shrink-0">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
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

                            {/* Verified */}
                            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-md">
                              <CheckCircle
                                className="w-4 h-4 text-white"
                                fill="white"
                              />
                            </div>

                            {/* Unread */}
                            {request.unread && (
                              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-purple-500 border-2 border-white dark:border-gray-900 shadow-sm animate-pulse" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="mb-2 truncate font-bold text-gray-900 dark:text-gray-100">
                              {request.name}
                            </h3>

                            <div className="inline-block px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-md mb-2">
                              <p className="text-xs text-white font-bold">
                                {
                                  request.role
                                }
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <MapPin className="w-3.5 h-3.5" />

                              <span className="font-medium">
                                {
                                  request.location
                                }
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Purpose */}
                        {request.purpose && (
                          <div className="mb-4 p-4 rounded-xl border border-purple-500/50 bg-purple-500/5">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-purple-400" />

                              <span className="text-sm font-semibold text-purple-300">
                                Purpose
                              </span>
                            </div>

                            <p className="text-sm text-gray-200 leading-relaxed">
                              {
                                request.purpose
                              }
                            </p>
                          </div>
                        )}

                        {/* What I'm Looking For */}
                        {request.whatISeek && (
                          <div className="mb-4 p-4 rounded-xl border border-orange-400/60 bg-orange-500/5">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="w-4 h-4 text-orange-400" />

                              <span className="text-sm font-semibold text-orange-300">
                                What I'm Looking For
                              </span>
                            </div>

                            <p className="text-sm text-gray-200 leading-relaxed">
                              {
                                request.whatISeek
                              }
                            </p>
                          </div>
                        )}

                        {/* What I Can Bring */}
                        {request.whatIBring && (
                          <div className="mb-4 p-4 rounded-xl border border-green-400/60 bg-green-500/5">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-green-400" />

                              <span className="text-sm font-semibold text-green-300">
                                What I Can Bring
                              </span>
                            </div>

                            <p className="text-sm text-gray-200 leading-relaxed">
                              {
                                request.whatIBring
                              }
                            </p>
                          </div>
                        )}

                        {/* Preferred Meeting Date */}
                        {request.preferredDate && (
                          <div className="mb-4 p-4 rounded-xl border border-blue-400/60 bg-blue-500/5">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-blue-400" />

                              <span className="text-sm font-semibold text-blue-300">
                                Preferred Meeting Date
                              </span>
                            </div>

                            <p className="text-sm font-semibold text-white">
                              {(() => {
                                const [
                                  year,
                                  month,
                                  day,
                                ] =
                                  request.preferredDate!.split(
                                    '-'
                                  );

                                return `${day}-${month}-${year}`;
                              })()}
                            </p>
                          </div>
                        )}

                        {/* Preferred Location */}
                        {request.preferredLocation && (
                          <div className="mb-4 p-4 rounded-xl border border-cyan-400/60 bg-cyan-500/5">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-cyan-400" />

                              <span className="text-sm font-semibold text-cyan-300">
                                Preferred Location
                              </span>
                            </div>

                            <p className="text-sm text-gray-200">
                              {
                                request.preferredLocation
                              }
                            </p>
                          </div>
                        )}

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
                          {/* ACCEPT */}
                          {request.status ===
                            'pending' && (
                            <>
                              <motion.button
                                whileHover={{
                                  scale: 1.02,
                                }}
                                whileTap={{
                                  scale: 0.98,
                                }}
                                onClick={() =>
                                  handleAcceptRequest(
                                    request.id
                                  )
                                }
                                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold"
                              >
                                Accept
                              </motion.button>

                              <motion.button
                                whileHover={{
                                  scale: 1.02,
                                }}
                                whileTap={{
                                  scale: 0.98,
                                }}
                                onClick={() =>
                                  handleRejectRequest(
                                    request.id
                                  )
                                }
                                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold"
                              >
                                Reject
                              </motion.button>
                            </>
                          )}

                         {/* BOOKING ACTIONS - USER B */}
{request.status === 'accepted' && !!meeting && (
  <div className="w-full">
    {/* PAYMENT INFORMATION - ONLY WHILE USER B STILL NEEDS TO PAY */}
    {meeting.payment_user_b !== true && (
      <div className="mb-3 p-3 rounded-xl bg-blue-500/10 border border-blue-400/30">
        <p className="text-sm text-blue-200">
          Request accepted. Complete your payment within 24 hours to book the meeting.
        </p>

        {meeting.payment_deadline && (
          <p className="text-xs text-blue-300 mt-1">
            Payment deadline:{' '}
            {new Date(
              meeting.payment_deadline
            ).toLocaleString('en-IN')}
          </p>
        )}
      </div>
    )}

    {/* USER B HAS NOT PAID YET */}
    {meeting.payment_user_b !== true && (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          onSelectPeer(request.peerId);
          setSelectedRequestId(request.id);
          onNavigate('p2p-peer-payment');
        }}
        className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/30"
      >
        Book Now
      </motion.button>
    )}

    {/* USER B HAS ALREADY PAID */}
    {meeting.payment_user_b === true && (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setSelectedMeetingId(meeting.id);
          setSelectedRequestId(request.id);
          onNavigate('p2p-meeting-confirmation');
        }}
        className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg"
      >
        View Booking Status
      </motion.button>
    )}
  </div>
)}

                          {/* MEETING DATE */}
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
                          {request.status ===
                            'rejected' && (
                            <button
                              disabled
                              className="flex-1 px-4 py-3 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-500 font-bold cursor-not-allowed"
                            >
                              Rejected
                            </button>
                          )}
                        </div>

                        {/* VIEW PROFILE */}
                        <div className="flex gap-2 mt-3">
                          <motion.button
                            whileHover={{
                              scale: 1.02,
                            }}
                            whileTap={{
                              scale: 0.98,
                            }}
                            onClick={() => {
                              onSelectPeer(
                                request.peerId
                              );

                              onNavigate(
                                'p2p-peer-profile'
                              );
                            }}
                            className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 text-gray-700 dark:text-gray-300 font-bold text-sm flex items-center justify-center gap-2"
                          >
                            View Profile

                            <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </div>
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