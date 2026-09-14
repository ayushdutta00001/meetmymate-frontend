import { api } from '../../lib/api';
import { useEffect } from 'react';
import IncomingBookingModal from "../modals/IncomingBookingModal";
import { PayoutSetupModal } from "../modals/PayoutSetupModal";
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../Card';
import { useRef } from "react";
import { Button } from '../Button';
import { BackButton } from "../ui/BackButton";
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  Star,
  UserIcon,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Wallet,
  BarChart3,
  MapPin,
  Phone,
  Mail,
  Edit,
  Plus,
  Download,
  Bell,
} from 'lucide-react';
import { WithdrawalModal } from '../modals/WithdrawalModal';
import { ProfileEditModal } from '../modals/ProfileEditModal';
import { BankSetupModal } from ".././modals/BankSetupModal";
import { UpiSetupModal } from ".././modals/UpiSetupModal";
import { supabase } from '../../supabase';

interface ProviderDashboardScreenProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

interface Booking {
  user_id: any;
  id: string;
  customerName: string;
  customerImage: string;
  customerPhone: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  notes: string;
  amount: number;
 status:
  | 'pending'
  | 'upcoming'
  | 'en_route'
  | 'arrived'
  | 'in_progress'
  | "awaiting_confirmation"
  | 'completed'
  | 'cancelled';
  earnings: number;
}


export function ProviderDashboardScreen({
    onBack,
    onNavigate,
}: ProviderDashboardScreenProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);
useEffect(() => {

  if (!("Notification" in window)) {
    console.log("Browser does not support notifications");
    return;
  }

  if (Notification.permission === "default") {

    Notification.requestPermission()
      .then((permission) => {

        console.log(
          "Notification permission:",
          permission
        );

      });

  }

}, []);
 const [activeTab, setActiveTab] = useState<
  'overview' | 'bookings' | 'earnings' | 'services' | 'profile'
>('overview');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
const [withdrawals, setWithdrawals] = useState<any[]>([]);
const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);
const [realEarnings, setRealEarnings] = useState<any[]>([]);
const [totalEarnings, setTotalEarnings] =
  useState(0);

const [availableBalance, setAvailableBalance] =
  useState(0);
const [wallet, setWallet] = useState<any>(null);
const [completedBookings, setCompletedBookings] =
  useState<any[]>([]);
const [providerNotifications, setProviderNotifications] =
  useState<any[]>([]);

const [showNotifications, setShowNotifications] =
  useState(false);

const [providerData, setProviderData] = useState<any>(null);
const [loadingProfile, setLoadingProfile] = useState(true);
const [allBookings, setAllBookings] = useState<any[]>([]);
const [bookings, setBookings] = useState<Booking[]>([]);
const [loadingAllBookings, setLoadingAllBookings] = useState(false);
const [isOnline, setIsOnline] = useState(false);
const [verificationStatus, setVerificationStatus] =
  useState<
    "pending" |
    "approved" |
    "rejected" |
    "not_uploaded"
  >("pending");

const [rejectionReason, setRejectionReason] =
  useState("");
const [incomingBooking, setIncomingBooking] =
  useState<any>(null);
  const [acceptingBooking, setAcceptingBooking] =
  useState(false);
  const [showIncomingScreen, setShowIncomingScreen] =
  useState(false);
  const [showPayoutSetup, setShowPayoutSetup] =
  useState(false);
const [showBankSetup, setShowBankSetup] =
  useState(false);

const [showUpiSetup, setShowUpiSetup] =
  useState(false);

const [bankAccount, setBankAccount] =
  useState<any>(null);

const [upiAccount, setUpiAccount] =
  useState<any>(null);
const [payoutDetails, setPayoutDetails] =
  useState<any>(null);
 
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    pendingPayout: 0,
    availableForWithdrawal: 0,
    upcomingBookings: 0,
    completedThisMonth: 0,
    averageRating: 0,
    responseRate: 0,
  });
const hasActiveBooking = allBookings.some(
  (booking: any) =>
    [
      "pending_provider_acceptance",
      "confirmed",
      "provider_en_route",
      "provider_arrived",
      "in_progress",
      "awaiting_customer_confirmation"
    ].includes(booking.booking_status)
);
  
const loadProviderProfile = async () => {

  try {

    setLoadingProfile(true);

    const res = await api.post(
      "get_provider_profile"
    );

    console.log(
      "PROFILE RESPONSE:",
      res
    );

    // FAILED
    if (!res?.success) {

      console.error(res?.error);

      setProviderData(null);

      setSelectedServices([]);
console.log(
  "SELECTED SERVICES:",
  selectedServices
);
      return;
    }

    // PROFILE
    const profile: any =
      res?.profile || null;

    console.log(
      "FULL PROFILE:",
      profile
    );

    console.log(
      "PROFILE SERVICES:",
      profile?.services
    );

    // SAVE PROFILE
    setProviderData(profile);

   console.log(
  "PROFILE ID:",
  profile?.id
);

    // LOAD SERVICES
 // LOAD PROVIDER'S SAVED SERVICES

const savedServices =
  Array.isArray(profile?.services)
    ? profile.services
    : [];

setSelectedServices(savedServices);

  } catch (e) {

    console.error(
      "Failed to load provider profile",
      e
    );

    setProviderData(null);

    setSelectedServices([]);

  } finally {

    setLoadingProfile(false);
  }
};
const loadProviderNotifications = async () => {
  if (!providerData?.id) return;

  const { data, error } = await supabase
    .from("raf_notifications")
    .select("*")
    .eq("recipient_type", "provider")
    .eq("recipient_id", providerData.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return;
  }

  setProviderNotifications(data || []);
};
const loadVerificationStatus = async () => {
  try {
    const { data, error } =
      await supabase.functions.invoke(
        "get_provider_verification_status"
      );

    if (error) {
      console.error(error);
      return;
    }

    if (data?.success) {
      setVerificationStatus(data.status);

      setRejectionReason(
        data.rejectionReason || ""
      );
    }

  } catch (err) {
    console.error(err);
  }
};

const loadServiceSettings = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();

    const token = sessionData.session?.access_token;

    const response = await fetch(
      "https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_get_raf_services",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    console.log("SERVICE SETTINGS", result);

    if (result.success) {
      setServiceSettings(result.services);
    }

  } catch (err) {
    console.error(err);
  }
};

const loadAllBookings = async () => {
  try {

    setLoadingAllBookings(true);

    if (!providerData?.id) {
      setAllBookings([]);
      return;
    }

 const { data, error } = await supabase
  .from("rent_friend_bookings")
  .select(`
    *,
    users:user_id (
      id,
      name,
      profile_photo_url,
      phone
    )
  `)
  .eq("provider_id", providerData.id)
  .not("booking_status", "eq", "cancelled")
  .not("booking_status", "eq", "rejected")
  .order("created_at", {
    ascending: false,
  });
    if (error) {
      console.error(
        "Provider bookings error:",
        error
      );

      setAllBookings([]);
      return;
    }

    setAllBookings(data || []);
   

console.log("PROVIDER ID:", providerData?.id);
console.log("WALLET:", wallet);
  } catch (e) {

    console.error(
      "Failed to load bookings",
      e
    );

    setAllBookings([]);

  } finally {

    setLoadingAllBookings(false);
  }
};

  

const loadWithdrawals = async () => {
  try {
    setLoadingWithdrawals(true);

    const res = await api.post('provider_list_withdrawals');

if (!res.success) {
  console.error(res.error);
  setWithdrawals([]);
  return;
}

setWithdrawals(res.withdrawals ?? []);
  } catch (e) {
    console.error('Failed to load withdrawals');
  } finally {
    setLoadingWithdrawals(false);
  }
};
const loadWallet = async () => {

  if (!providerData?.id) return;
console.log(
  "PROVIDER DATA ID:",
  providerData?.id
);

  const { data, error } = await supabase
    .from("provider_wallets")
    .select("*")
    .eq("provider_id", providerData.id)
    .maybeSingle()

console.log("WALLET QUERY RESULT:", data);
console.log("WALLET QUERY ERROR:", error);
  if (error) {
    console.error(error);
    return;
  }

  console.log("WALLET:", data);
console.log(
  "TOTAL EARNED:",
  data?.total_earned
);

console.log(
  "AVAILABLE BALANCE:",
  data?.available_balance
);

console.log(
  "PENDING BALANCE:",
  data?.pending_balance
);
  setWallet(data);
  console.log(
  "WALLET FROM DB",
  JSON.stringify(data, null, 2)
);

};

useEffect(() => {
  loadProviderProfile();
  loadServiceSettings();
  loadVerificationStatus();
}, []);

useEffect(() => {

  if (providerData?.is_online) {
    setIsOnline(true);
  } else {
    setIsOnline(false);
  }

}, [providerData]);
useEffect(() => {

  if (!providerData?.id) return;

  loadAllBookings();
  loadWallet();
  loadProviderNotifications();

}, [providerData?.id]);

useEffect(() => {

  if (!providerData?.id) return;

  const channel = supabase
    .channel("provider-wallet")

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "provider_wallets",
        filter: `provider_id=eq.${providerData.id}`,
      },

      (payload) => {

        console.log(
          "WALLET UPDATED:",
          payload
        );

        loadWallet();

      }
    )

    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };

}, [providerData?.id]);
const handleWithdrawClick = async () => {

  if (!providerData?.id) return;

  const { data: payoutData, error: payoutError } = await supabase
    .from("provider_payout_details")
    .select("*")
    .eq("provider_id", providerData.id)
    .maybeSingle();

  if (payoutError) {
    console.error(payoutError);
    return;
  }

  // first time setup
  if (!payoutData) {
  console.log("OPENING PAYOUT MODAL");
  setShowPayoutSetup(true);
  return;
}

  const { data: bank } = await supabase
    .from("provider_bank_accounts")
    .select("*")
    .eq("provider_id", providerData.id)
    .maybeSingle();

  if (!bank) {
    setShowBankSetup(true);
    return;
  }

  const { data: upi } = await supabase
    .from("provider_upi_accounts")
    .select("*")
    .eq("provider_id", providerData.id)
    .maybeSingle();

  if (!upi) {
    setShowUpiSetup(true);
    return;
  }

  setPayoutDetails(payoutData);
  setBankAccount(bank);
  setUpiAccount(upi);
  setShowWithdrawalModal(true);
};
useEffect(() => {
  if (!Array.isArray(allBookings)) return;

 const completed =(Array.isArray(allBookings) ? allBookings : []).filter (
  (b: any) => b.booking_status === 'completed'
);

  setRealEarnings(completed);

  if (allBookings.length > 0) {
    loadEarningsStats();
  }

}, [allBookings]);

useEffect(() => {
  if (activeTab === 'earnings') {
    loadWithdrawals();
    loadEarningsStats();
  }
}, [activeTab]);

useEffect(() => {
  if (!user) return;

  const channel = supabase
    .channel('provider-profile-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'providers',
        filter: `user_id=eq.${user.id}`,
      },
      (payload) => {
        console.log('REALTIME PROFILE UPDATE:', payload);

        const updated = payload.new;

        setProviderData((prev: any) => ({
          ...prev,
          full_name: updated.full_name,
          bio: updated.bio,
          interests: updated.interests || [],
          languages: updated.languages || [],
          city: updated.city,
        }));
        
      }
    );

  void channel.subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}, [user]);

useEffect(() => {
 if (!user || !providerData?.id) return;

  const channel = supabase
    .channel('provider-bookings')
    
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rent_friend_bookings',
        filter: `provider_id=eq.${providerData.id}`,
      },
      async (payload) => {
        const booking = payload.new as Record<string, any>;

console.log(
  "REALTIME:",
  payload.eventType,
  booking.provider_id,
  providerData.id,
  booking.booking_status,
  booking.provider_response
);


        console.log('BOOKING UPDATE:', payload);
await loadAllBookings();
    if (

  (
    payload.eventType === "INSERT" ||
    payload.eventType === "UPDATE"
  )

  &&

  booking.booking_status ===
    "pending_provider_acceptance"

  &&

  booking.provider_response ===
    "waiting"

  &&

  booking.provider_id ===
    providerData.id

) {

if (

  incomingBooking?.id === booking.id &&

  showIncomingScreen

) {
  return;
}
  const { data: customer } =
    await supabase
      .from("users")
      .select(`
        id,
        name,
        phone,
        profile_photo_url
      `)
      .eq("id", booking.user_id)
      .single();

audioRef.current =
  new Audio("/booking-alert.mp3");

audioRef.current.play().catch(() => {});
setIncomingBooking({
  ...booking,
  customer
});
setShowIncomingScreen(true);

}


      if (payload.eventType === 'UPDATE') {

  console.log(
    "BOOKING UPDATED:",
    payload.new
  );

 await Promise.all([
  loadAllBookings(),
  loadWallet()
]);

loadEarningsStats();

}
      }
    );

  void channel.subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}, [
  user,
  providerData?.id,
  incomingBooking,
  showIncomingScreen,
]);

useEffect(() => {
  if (!user || !providerData?.id) return;

  const channel = supabase
    .channel('withdrawals')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'provider_withdrawals',
        filter: `provider_id=eq.${providerData.id}`,
      },
      (payload) => {
        console.log('WITHDRAWAL UPDATE:', payload);

        setWithdrawals((prev: any[]) => {
         

          if (payload.eventType === 'UPDATE') {
            return prev.map((w) =>
              w.id === payload.new.id ? payload.new : w
            );
          }

          return prev;
        });
      }
    );

  void channel.subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}, [
  user,
  providerData?.id,
  incomingBooking,
  showIncomingScreen,
]);

useEffect(() => {
  if (!user) return;

  const channel = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      },
      (payload) => {
        console.log('NEW NOTIFICATION:', payload);

        const notificationData = payload.new as { title?: string; message?: string };
if (Notification.permission === "granted") {

  const notification =
    new Notification(
      notificationData.title || "New Notification",
      {
        body:
          notificationData.message || ""
      }
    );

  notification.onclick = () => {
    window.focus();
  };

}
      }
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}, [user]);





useEffect(() => {

  if (!providerData?.id) return;

  if (!isOnline) return;

  const interval = setInterval(async () => {

    try {

      const position =
        await new Promise<GeolocationPosition>(
          (resolve, reject) =>
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy: true,
                timeout: 10000,
              }
            )
        );

      await supabase
        .from("providers")
        .update({

          last_seen: new Date().toISOString(),

          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,

        })
        .eq("id", providerData.id);

    } catch (err) {

      console.error(
        "Location update failed",
        err
      );

    }

  }, 30000);

  return () => clearInterval(interval);

}, [
  providerData?.id,
  isOnline,
]);

useEffect(() => {
  if (!wallet) return;

  setStats((prev) => ({
    ...prev,
    totalEarnings: Number(wallet.total_earned || 0),
    availableForWithdrawal: Number(
      wallet.available_balance || 0
    ),
    pendingPayout: Number(
      wallet.pending_balance || 0
    ),
  }));
}, [wallet]);

useEffect(() => {

  if (!wallet) return;

  console.log("WALLET CHANGED", wallet);

  loadEarningsStats();

}, [wallet]);

 const loadEarningsStats = () => {
  try {
    const completed = allBookings.filter(
      (b: any) => b.booking_status === "completed"
    );

  const upcoming = allBookings.filter(
  (b: any) =>
    [
      "confirmed",
      "provider_en_route",
      "provider_arrived",
      "in_progress",
      "awaiting_customer_confirmation"
    ].includes(b.booking_status)
);

  

    const now = new Date();

   

    const thisMonthEarnings = completed
  .filter((b: any) => {
        const d = new Date(
          b.completed_at ||
          b.updated_at ||
          b.created_at
        );

        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
  .reduce(
    (sum: number, b: any) =>
      sum + Number(b.total_amount || 0) * 0.8,
    0
  );
    
   

 
setStats((prev) => ({
  ...prev,
   
  thisMonth: thisMonthEarnings,
  upcomingBookings: upcoming.length,
  completedThisMonth: completed.length,
}));
  } catch (e) {
    console.error(e);
  }
};
console.log("RAW BOOKINGS", allBookings);
useEffect(() => {
const formatted: Booking[] = allBookings

  .filter(
    (b: any) =>
      b.booking_status !== "cancelled" &&
      b.booking_status !== "rejected" &&
      b.provider_response !== "rejected"
  )

  .map((b: any) => ({
    id: b.id,
    user_id: b.user_id,

    service:
      b.service_type || "Unknown Service",

    customerName:
      b.users?.name || "Customer",

    customerImage:
      b.users?.profile_photo_url ||
      "/default-avatar.png",

    customerPhone:
      b.users?.phone || "No phone",

    date: b.booking_date,

    time: b.booking_time,

    duration:
      b.duration_hours || 1,

    location:
      b.meetup_location || "TBD",

    notes:
      b.special_request || "",

    amount:
      Number(b.total_amount || 0),

    earnings:
      Math.round(
        Number(b.total_amount || 0) * 0.8
        
      ),

   status:
  b.booking_status ===
  "pending_provider_acceptance"

    ? "pending"

    : b.booking_status ===
      "confirmed"

    ? "upcoming"

    : b.booking_status ===
      "provider_en_route"

    ? "en_route"

    : b.booking_status ===
      "provider_arrived"

    ? "arrived"

    : b.booking_status ===
      "in_progress"

    ? "in_progress"
    : b.booking_status ===
  "awaiting_customer_confirmation"

? "awaiting_confirmation"
    : b.booking_status ===
      "completed"

    ? "completed"

    : "cancelled",
    
  }));

  console.log("BOOKING STATUS DEBUG:", allBookings.map((b: any) => b.booking_status));

  setBookings(formatted);
}, [allBookings]);


const ALL_SERVICES = [
  {
    id: "movie-buddy",
    label: "Movie Buddy",
    
  },
  {
    id: "dining-partner",
    label: "Dining Partner",
    
  },
  {
    id: "party-companion",
    label: "Party Companion",
    
  },
  {
    id: "explore-city",
    label: "Explore City",
    
  },
  {
    id: "emotional-support",
    label: "Emotional Support",
  
  },
  {
    id: "study-partner",
    label: "Study Partner",
    
  },
  {
    id: "coffee-chat",
    label: "Coffee Chat",
    
  },
  {
    id: "gaming-buddy",
    label: "Gaming Buddy",
  },
  {
    id: "shopping-companion",
    label: "Shopping Companion",
  },
  {
    id: "photo-walk",
    label: "Photo Walk",
  },
  {
    id: "concert-buddy",
    label: "Concert Buddy",
  },
  {
    id: "workout-partner",
    label: "Workout Partner",
  },
];
const [selectedServices, setSelectedServices] =
  useState<string[]>([]);

const [serviceSettings, setServiceSettings] =
  useState<any[]>([]);

  const availableServices = ALL_SERVICES
  .map((service) => {
    const dbService = serviceSettings.find(
      (s) => s.service_slug === service.id
    );

    if (!dbService || !dbService.enabled) {
      return null;
    }

    return {
      ...service,
      price: dbService.price_per_hour,
    };
  })
  .filter(Boolean);
 
  const handleWithdrawal = (amount: number, method: string) => {
    console.log(`Withdrawing ₹${amount} via ${method}`);
    setStats(prev => ({
  ...prev,
  availableForWithdrawal:
    prev.availableForWithdrawal - amount
}));
  };
const goOnline = async () => {

  try {

    if (!providerData?.id) return;
if (verificationStatus !== "approved") {

  alert(
    "Your identity verification has not been approved yet."
  );

  return;

}
let latitude: number | null = null;
let longitude: number | null = null;

try {
  const position = await new Promise<GeolocationPosition>(
    (resolve, reject) =>
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      )
  );

  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

} catch (err) {
  alert(
    "Please enable location services before going online."
  );
  return;
}

if (hasActiveBooking) {
  alert(
    "You already have an active booking. Complete it before going online again."
  );
  return;
}




    const { error } = await supabase
      .from("providers")
      .update({
  is_online: true,
  last_seen: new Date().toISOString(),
  went_online_at: new Date().toISOString(),
  latitude,
  longitude,
})
      .eq("id", providerData.id);

    if (error) {
      console.error(error);
      return;
    }

    setIsOnline(true);

    setProviderData((prev: any) => ({
      ...prev,
      is_online: true
    }));

  } catch (e) {
    console.error(e);
  }
};

const goOffline = async () => {

  try {

    if (!providerData?.id) return;

    const { error } = await supabase
      .from("providers")
      .update({
        is_online: false,
        current_booking_id: null
      })
      .eq("id", providerData.id);

    if (error) {
      console.error(error);
      return;
    }

    setIsOnline(false);

    setProviderData((prev: any) => ({
      ...prev,
      is_online: false
    }));

  } catch (e) {
    console.error(e);
  }
};
const startNavigation = (
  destination: string
) => {

  if (!navigator.geolocation) {

    alert("Location not supported");
    return;

  }

  navigator.geolocation.getCurrentPosition(
    (position) => {

      const lat =
        position.coords.latitude;

      const lng =
        position.coords.longitude;

      window.open(

`https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${encodeURIComponent(destination)}&travelmode=driving`,

        "_blank"
      );

    },

    () => {

      alert(
        "Unable to get your location"
      );

    }
  );
};
  
const saveServices = async () => {
  try {

    if (!providerData?.id) {
      console.error(
        "Cannot save services: provider ID missing"
      );
      return;
    }

    console.log(
      "SAVING PROVIDER SERVICES:",
      {
        providerId: providerData.id,
        services: selectedServices,
      }
    );

    const {
      data,
      error,
    } = await supabase
      .from("providers")
      .update({
        services: selectedServices,
      })
      .eq(
        "id",
        providerData.id
      )
      .select("id, services")
      .single();

    if (error) {
      console.error(
        "SAVE SERVICES ERROR:",
        error
      );

      alert(
        "Unable to save services."
      );

      return;
    }

    console.log(
      "SERVICES SAVED TO DATABASE:",
      data
    );

    setProviderData((prev: any) => ({
      ...prev,
      services:
        data?.services ||
        selectedServices,
    }));

    setSelectedServices(
      data?.services ||
      selectedServices
    );

    alert(
      "Services updated successfully!"
    );

  } catch (e) {

    console.error(
      "SAVE SERVICES EXCEPTION:",
      e
    );

    alert(
      "Unable to save services."
    );
  }
};

 const getStatusColor = (
  status: string
) => {

  switch (status) {

    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "upcoming":
      return "bg-blue-100 text-blue-700";

    case "en_route":
      return "bg-cyan-100 text-cyan-700";

    case "arrived":
      return "bg-orange-100 text-orange-700";

    case "in_progress":
      return "bg-purple-100 text-purple-700";

    case "awaiting_confirmation":
      return "bg-pink-100 text-pink-700";

    case "completed":
      return "bg-green-100 text-green-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";

  }

};



 console.log("PROFILE RESPONSE:", providerData); // 🔍 DEBUG

if (showIncomingScreen && incomingBooking) {
  
  return (
    <IncomingBookingModal
      incomingBooking={incomingBooking}
      acceptingBooking={acceptingBooking}
      onAccept={async () => {
          
        try {
          setAcceptingBooking(true);

          const { error } = await supabase
            .from("rent_friend_bookings")
            .update({
              booking_status: "confirmed",
              provider_response: "accepted",
              provider_id: providerData.id,
              accepted_at: new Date().toISOString(),
            })
            .eq("id", incomingBooking.id);

          if (error) {
            alert(error.message);
            return;
          }
// Notify customer
const { error: notificationError } = await supabase
  .from("raf_notifications")
  .insert({
    recipient_type: "user",
    recipient_id: incomingBooking.user_id,
    booking_id: incomingBooking.id,
    title: "Booking Accepted",
    message: "Your provider has accepted your booking.",
    notification_type: "booking_accepted",
    is_read: false,
    data: {
      booking_id: incomingBooking.id,
      provider_id: providerData.id,
    },
  });

if (notificationError) {
  console.error("Notification Error:", notificationError);
} else {
  console.log("Booking accepted notification sent.");
}
          await loadAllBookings();

          setIncomingBooking(null);
          setShowIncomingScreen(false);

        } finally {
          setAcceptingBooking(false);
        }
      }}
      onReject={async () => {
  try {
audioRef.current?.pause();
audioRef.current = null;


setIncomingBooking(null);
setShowIncomingScreen(false);

audioRef.current?.pause();
audioRef.current = null;

    const { data, error } =
      await supabase.functions.invoke(
        "reassign-rent-friend-booking",
        {
          body: {
            bookingId: incomingBooking.id
          }
        }
      );

    console.log(
      "EDGE FUNCTION RESPONSE:",
      data
    );

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setIncomingBooking(null);
    setShowIncomingScreen(false);
   
    await Promise.all([
  loadAllBookings(),
  loadWallet()
]);

loadEarningsStats();
audioRef.current = null;
  } catch (err) {

    console.error(err);

  }
}}
    />
  );
}
console.log("showPayoutSetup", showPayoutSetup);
console.log("showBankSetup", showBankSetup);
console.log("showUpiSetup", showUpiSetup);
return (
  <div className="min-h-screen bg-light-gray dark:bg-[#130f6b] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
             <BackButton onClick={onBack} />
              <div>
                <h2 className="mb-1">Provider Dashboard</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your Rent-a-Friend services</p>
              </div>
            </div>
           <div className="relative">

  <button
    onClick={() => onNavigate("notifications")}
    className="
      relative
      p-2
      rounded-xl
      hover:bg-white/10
      transition-all
    "
  >
    <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />

    {providerNotifications.filter(n => !n.is_read).length > 0 && (
      <span
        className="
          absolute
          -top-1
          -right-1
          bg-gradient-to-br
          from-red-500
          to-pink-500
          text-white
          text-xs
          rounded-full
          w-5
          h-5
          flex
          items-center
          justify-center
          shadow-lg
        "
      >
        {providerNotifications.filter(n => !n.is_read).length > 9
          ? "9+"
          : providerNotifications.filter(n => !n.is_read).length}
      </span>
    )}
  </button>

</div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 p-1 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl overflow-x-auto">
            {(['overview', 'bookings', 'earnings', 'services', 'profile'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 rounded-lg transition-all text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                style={{ fontWeight: activeTab === tab ? 600 : 500 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >

            {verificationStatus === "pending" && (

<div className="rounded-2xl bg-yellow-50 border border-yellow-300 p-5 mb-6">

<h3 className="text-lg font-semibold text-yellow-700">
Identity Verification Pending
</h3>

<p className="mt-2 text-sm text-yellow-600">
Your Aadhaar/PAN has been submitted successfully.

Our admin team is reviewing it.

You cannot go online until approval.
</p>

</div>

)}

{verificationStatus === "approved" && (

<div className="rounded-2xl bg-green-50 border border-green-300 p-5 mb-6">

<h3 className="text-lg font-semibold text-green-700">
✅ Identity Verified
</h3>

<p className="mt-2 text-sm text-green-600">
Your account has been verified.

You can now receive bookings.
</p>

</div>

)}

{verificationStatus === "rejected" && (

<div className="rounded-2xl bg-red-50 border border-red-300 p-5 mb-6">

<h3 className="text-lg font-semibold text-red-700">
Verification Rejected
</h3>

<p className="mt-2 text-sm text-red-600">
Reason:
{rejectionReason}
</p>

</div>

)}
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card variant="glass" hover={false}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-2xl mb-1">₹{wallet?.total_earned ?? 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
              </Card>

              <Card variant="glass" hover={false}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                    This Month
                  </span>
                </div>
                <p className="text-2xl mb-1">₹{stats.thisMonth.toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Month Earnings</p>
              </Card>

              <Card variant="glass" hover={false}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-2xl mb-1">₹{wallet?.pending_balance ?? 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payout</p>
              </Card>

              <Card variant="glass" hover={false}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    {stats.responseRate}%
                  </span>
                </div>
                <p className="text-2xl mb-1">{stats.averageRating}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card variant="glass" hover={false}>
              <h3 className="mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

              <button
  onClick={() => {
    if (isOnline) {
      goOffline();
    } else {
      goOnline();
    }
  }}
  className={`
    p-4 rounded-xl border transition-all text-left

    ${isOnline
      ? 'bg-green-500/20 border-green-500/30'
      : 'bg-red-500/10 border-red-500/20'
    }
  `}
>

  <div className="flex items-center justify-between">

    <div>

      <p className="text-sm mb-1">
        {isOnline ? 'You are Online' : 'You are Offline'}
      </p>

      <p className="text-xs text-gray-400">
        {isOnline
          ? 'Receiving bookings'
          : 'Not receiving bookings'}
      </p>

    </div>

    <div
      className={`
        w-4 h-4 rounded-full

        ${isOnline
          ? 'bg-green-400'
          : 'bg-red-400'}
      `}
    />

  </div>

</button>
                <button
                  onClick={() => setActiveTab('earnings')}
                  className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 hover:shadow-lg transition-all text-left"
                >
                  <Wallet className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                  <p className="text-sm mb-1">Withdraw Earnings</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">₹{wallet?.available_balance ?? 0} available</p>
                </button>

                <button
                 onClick={() => setActiveTab('services')}
                  className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all text-left"
                >
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-sm mb-1">Update Services</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Manage your service offerings</p>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all text-left"
                >
                  <Edit className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                  <p className="text-sm mb-1">Edit Profile</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Update your information</p>
                </button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card variant="glass" hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3>Recent Bookings</h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {bookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={booking.customerImage}
                        alt={booking.customerName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm mb-1">{booking.customerName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {booking.date} • {booking.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm mb-1">₹{booking.earnings}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

       
       {/* Bookings Tab */}
{activeTab === 'bookings' && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >

    {/* LOADING */}
    {loadingAllBookings && (
      <Card variant="glass" hover={false}>
        <p className="text-center text-gray-400">
          Loading bookings...
        </p>
      </Card>
    )}

    {/* EMPTY */}
    {!loadingAllBookings &&
      bookings.length === 0 && (
        <Card variant="glass" hover={false}>
          <div className="py-16 text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-500 mb-4" />

            <h3 className="mb-2">
              No bookings yet
            </h3>

            <p className="text-gray-400">
              Your upcoming bookings will appear here
            </p>
          </div>
        </Card>
      )}

    {/* BOOKINGS */}
    {!loadingAllBookings && 
    bookings.map((booking) => (

        <motion.div
          key={booking.id}
          whileHover={{ y: -4 }}
          className="
  relative overflow-hidden
  rounded-[32px]
  border border-white/10
  bg-[#0F172A]/90
  backdrop-blur-2xl
  p-6 md:p-8
  shadow-2xl
"
        >

          {/* GLOW */}
          

          <div className="relative space-y-8">

            {/* TOP */}
           <div className="
  flex flex-col xl:flex-row
  xl:items-center
  xl:justify-between
  gap-8
">

              {/* CUSTOMER */}
              <div className="
  flex items-center gap-5
  min-w-0
"
>

                <div className="
                  w-20 h-20 min-w-[80px] rounded-[24px]
                  overflow-hidden
                  border border-white/10
                  bg-[#1F2937]
                ">
                 <img
  src={booking.customerImage}
  onError={(e) => {
    e.currentTarget.src =
      "/default-avatar.png";
  }}
  className="
    w-full h-full object-cover
  "
/>
                </div>

                <div>

                  <p className="
                    text-xs uppercase tracking-[0.2em]
                    text-blue-300 mb-2
                  ">
                    New Booking
                  </p>

                  <h3 className="text-2xl md:text-3xl font-bold
break-words">
                    {booking.customerName}
                  </h3>

                  <p className="text-gray-400 mt-1 break-all">
                    Booking ID: {booking.id}
                  </p>
                  <p className="
  text-sm text-emerald-300 mt-2
">
  📞 {booking.customerPhone}
</p>
                  <div className="
                    flex flex-wrap gap-3 mt-4
                  ">
<div className="
  px-4 py-2 rounded-2xl
  bg-blue-500/10
  border border-blue-500/20
  text-blue-300
  capitalize
">
  {booking.service.replace("-", " ")}
</div>
                    <div className="
                      px-4 py-2 rounded-2xl
                      bg-[#1F2937] border border-white/10
                    ">
                      {booking.duration} Hours
                    </div>

                    <div className="
                      px-4 py-2 rounded-2xl
                      bg-emerald-500/10
                      border border-emerald-500/20
                      text-emerald-300
                    ">
                      ₹{booking.earnings}
                    </div>

                  </div>
                </div>
              </div>

              {/* STATUS */}
              <div className="
               flex flex-row xl:flex-col
items-start xl:items-end
gap-3
shrink-0
                gap-3
              ">

                <div className={`
                  px-5 py-2 rounded-full
                  text-sm font-semibold capitalize

                 ${getStatusColor(booking.status)}
                `}>
                  {booking.status}
                </div>

                <div className="
                  px-4 py-2 rounded-2xl
                  bg-emerald-500/10
                  border border-emerald-500/20
                  text-sm text-emerald-300
                ">
                  Paid
                </div>

              </div>
            </div>

            {/* DETAILS */}
            <div className="
              grid grid-cols-1 lg:grid-cols-3
              gap-5 mt-8
            ">

              {/* DATE */}
              <div className="
                rounded-2xl
bg-white/[0.03]
border border-blue-600
p-5
min-h-[140px]
flex flex-col justify-between
              ">
                <p className="
                  text-sm text-blue-400 mb-2
                ">
                  Date & Time
                </p>

                <p className="
                  text-blue-500 font-semibold
                ">
                  {booking.date}
                </p>

                <p className="
                  text-blue-300 mt-1
                ">
                  {booking.time}
                </p>
              </div>

              {/* LOCATION */}
              <div className="
                rounded-3xl
                bg-pink-100/10
                border border-pink-600
                p-5
                min-h-[140px]
                flex flex-col justify-between
              ">
                
                <p className="
                  text-sm text-pink-600 mb-2
                ">
                  Meetup Location
                </p>
<div
                      className="
                        p-3 rounded-2xl
                        bg-teal-700/5
                      "
                    >
                <p className="
                  text-lg font-semibold
                  break-words
                ">
                  
                      <MapPin className="w-5 h-5 text-orange-500" />
                    
                  {booking.location}
                </p>
                </div>
                <button
  onClick={() =>
    startNavigation(
      booking.location
    )
  }
  className="
    px-6 py-3 rounded-2xl
    bg-green-500/10
    text-green-300
    border border-green-500/20
  "
>
  Track Route
</button>
                {booking.notes && (
  <div className="mt-4 border-t border-teal-700 pt-3">
    <p className="text-xs text-pink-600 mb-1">
      Additional Notes
    </p>

    <p className="text-sm text-orange-500 break-words">
      {booking.notes}
    </p>
  </div>
)}
              </div>

              {/* EARNINGS */}
              <div className="
                rounded-3xl
                bg-linear-to-br
                from-emerald-500/10
                to-green-500/5
                border border-yellow-500
                p-5
              ">
                <p className="
                  text-sm text-red-600 mb-2
                ">
                  Your Earnings
                </p>

                <p className="
                  text-3xl font-bold
                  text-yellow-500
                ">
                  ₹{booking.earnings}
                </p>

                <p className="
                  text-sm text-gray-400 mt-2
                ">
                  Platform fee deducted
                </p>
              </div>

            </div>

            {/* ACTIONS */}
            <div className="
              flex flex-wrap items-center
gap-4 mt-8
              pt-6 border-t border-white/10
            ">

             <div className="
  flex flex-wrap gap-4 mt-8
  pt-6 border-t border-white/10
">

  {booking.status === "pending" && (

<button

  onClick={async () => {

    console.log(
      "ACCEPT BUTTON CLICKED"
    );

    console.log(
      "BOOKING ID:",
      booking.id
    );

    const { data, error } =
      await supabase
        .from("rent_friend_bookings")
        
        .update({

          booking_status:
            "confirmed",

          provider_response:
            "accepted",

          accepted_at:
            new Date().toISOString()

        })
        .eq("id", booking.id)
        .select();

    console.log(
      "UPDATE DATA:",
      data
    );

    console.log(
      "UPDATE ERROR:",
      error
    );

    if (error) {

      alert(error.message);

      return;
    }
// Notify customer
const { error: notificationError } = await supabase
  .from("raf_notifications")
  .insert({
    recipient_type: "user",
    recipient_id: booking.user_id,
    booking_id: booking.id,
    title: "Booking Accepted",
    message: "Your provider has accepted your booking.",
    notification_type: "booking_accepted",
    is_read: false,
    data: {
      booking_id: booking.id,
    },
  });

if (notificationError) {
  console.error("Notification Error:", notificationError);
}
    alert("BOOKING ACCEPTED");

    await loadAllBookings();

  }}

  className="
    px-6 py-3 rounded-2xl
    bg-green-500
    hover:bg-green-600
    text-white
    font-semibold
  "
>
  Accept Booking
</button>

)}
{booking.status === "upcoming" && (

<button
  onClick={async () => {

   const { error } = await supabase
  .from("rent_friend_bookings")
  .update({
    booking_status: "provider_en_route",
    journey_started_at: new Date().toISOString()
  })
  .eq("id", booking.id);

if (error) {
  alert(error.message);
  return;
}

// Notify customer
const { error: notificationError } = await supabase
  .from("raf_notifications")
  .insert({
    recipient_type: "user",
    recipient_id: booking.user_id,
    booking_id: booking.id,
    title: "Provider is on the way",
    message: "Your provider has started the journey and is heading to your location.",
    notification_type: "provider_en_route",
    is_read: false,
    data: {
      booking_id: booking.id,
    },
  });

if (notificationError) {
  console.error("Notification Error:", notificationError);
} else {
  console.log("Journey notification sent.");
}

await loadAllBookings();

  }}
  className="
    px-6 py-3
    rounded-2xl
    bg-cyan-500
    text-white
  "
>
  Start Journey
</button>

)}
{booking.status === "en_route" && (

<button
  onClick={async () => {

   const { error } = await supabase
  .from("rent_friend_bookings")
  .update({
    booking_status: "provider_arrived",
    arrived_at: new Date().toISOString()
  })
  .eq("id", booking.id);

if (error) {
  alert(error.message);
  return;
}

// Notify customer
const { error: notificationError } = await supabase
  .from("raf_notifications")
  .insert({
    recipient_type: "user",
    recipient_id: booking.user_id,
    booking_id: booking.id,
    title: "Provider has arrived",
    message: "Your provider has arrived at the meeting location.",
    notification_type: "provider_arrived",
    is_read: false,
    data: {
      booking_id: booking.id,
    },
  });

if (notificationError) {
  console.error("Notification Error:", notificationError);
} else {
  console.log("Arrival notification sent.");
}

await loadAllBookings();

  }}
  className="
    px-6 py-3
    rounded-2xl
    bg-yellow-500
    text-black
  "
>
  I've Arrived
</button>

)}
{booking.status === "arrived" && (

<button
  onClick={async () => {

  const { data, error } = await supabase
  .from("rent_friend_bookings")
  .update({
    booking_status: "in_progress",
    session_started_at: new Date().toISOString(),
  })
  .eq("id", booking.id)
  .select();

console.log("DATA:", data);
console.log("ERROR:", error);

if (error) {
  console.error(error);
  alert(error.message);
  return;
}

// Notify customer
const { error: notificationError } = await supabase
  .from("raf_notifications")
  .insert({
    recipient_type: "user",
    recipient_id: booking.user_id,
    booking_id: booking.id,
    title: "Booking Started",
    message: "Your Rent-a-Friend session has started. Enjoy your time together!",
    notification_type: "booking_started",
    is_read: false,
    data: {
      booking_id: booking.id,
    },
  });

if (notificationError) {
  console.error("Notification Error:", notificationError);
} else {
  console.log("Booking started notification sent.");
}

await loadAllBookings();
  }}

  className="
    px-6 py-3
    rounded-2xl
    bg-purple-500
    text-white
    font-semibold
  "
>
  Start Session
</button>

)}

{booking.status === "in_progress" && (

<button
  onClick={async () => {

    const { error } =
      await supabase
        .from("rent_friend_bookings")
        .update({
  booking_status: "awaiting_customer_confirmation",
  session_ended_at: new Date().toISOString(),
  completed_at: new Date().toISOString(),
})
        .eq("id", booking.id);

    if (error) {
      alert(error.message);
      return;
    }
// Notify customer
const { error: notificationError } = await supabase
  .from("raf_notifications")
  .insert({
    recipient_type: "user",
    recipient_id: booking.user_id,
    booking_id: booking.id,
    title: "Session Completed",
    message:
      "Your provider has completed the session. Please confirm completion to release the payment.",
    notification_type: "awaiting_customer_confirmation",
    is_read: false,
    data: {
      booking_id: booking.id,
    },
  });

if (notificationError) {
  console.error("Notification Error:", notificationError);
} else {
  console.log("Completion notification sent.");
}
    await loadAllBookings();

  }}

  className="
    px-6 py-3
    rounded-2xl
    bg-orange-500
    text-white
    font-semibold
  "
>
  End Session
</button>

)}
  {/* VIEW */}
  <button
    onClick={() => {
      setSelectedBooking(booking);
      setShowBookingDetails(true);
    }}
    className="
      px-6 py-3 rounded-2xl
      bg-blue-500 hover:bg-blue-600
      transition-colors
      font-semibold
    "
  >
    View Details
  </button>
  <button
  onClick={() => {

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        booking.location
      )}`,
      "_blank"
    );

  }}
  className="
    px-6 py-3 rounded-2xl
    bg-cyan-500/10
    text-cyan-300
    border border-cyan-500/20
  "
>
  Open Maps
</button>

<div
  onClick={() => {
    if (!booking.customerPhone) return;

    navigator.clipboard.writeText(
      booking.customerPhone
    );

    alert("Phone number copied.");
  }}
  className="
    cursor-pointer
    px-6 py-3
    rounded-2xl
    bg-blue-500/10
    border border-blue-500
    text-blue-500
    font-semibold
    hover:bg-blue-500/20
    transition-colors
    select-all
  "
>
  📞 {booking.customerPhone}
</div>


  {/* WHATSAPP */}
  <button
    onClick={() => {

      const cleanedPhone =
        booking.customerPhone.replace(/\D/g, "");

      window.open(
        `https://wa.me/91${cleanedPhone}`,
        "_blank"
      );
    }}
    className="
      px-6 py-3 rounded-2xl
      bg-green-400 hover:bg-emerald-600
      text-green-500 hover:text-white
      transition-colors
      font-semibold
      border border-green-500
    "
  >
    WhatsApp Customer
  </button>

</div>

            </div>

          </div>
        </motion.div>
      ))}
  </motion.div>
)}
       {} {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card variant="glass" hover={false}>
  <h3 className="mb-4">Withdrawal History</h3>

  {loadingWithdrawals && (
    <p className="text-sm text-gray-500">Loading withdrawals...</p>
  )}

  {!loadingWithdrawals && withdrawals.length === 0 && (
    <p className="text-sm text-gray-500">No withdrawals yet</p>
  )}

  {!loadingWithdrawals && withdrawals.length > 0 && (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-2 text-xs">Date</th>
            <th className="text-right py-3 px-2 text-xs">Amount</th>
            <th className="text-center py-3 px-2 text-xs">Method</th>
            <th className="text-center py-3 px-2 text-xs">Status</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((w) => (
            <tr key={w.id} className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 px-2 text-sm">
                {new Date(w.created_at).toLocaleDateString()}
              </td>
              <td className="py-3 px-2 text-sm text-right">
                ₹{w.amount}
              </td>
              <td className="py-3 px-2 text-sm text-center uppercase">
                {w.method}
              </td>
              <td className="py-3 px-2 text-sm text-center">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  w.status === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : w.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {w.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</Card>

            {/* Withdrawal Card */}
            <Card variant="glass" hover={false}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="mb-2">₹{wallet?.available_balance ?? 0}</h3>
                  <p className="text-3xl text-green-600 dark:text-green-400">₹{wallet?.available_balance ?? 0}</p>
                </div>
                <button 
                  onClick={handleWithdrawClick}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Wallet className="w-5 h-5" />
                  Withdraw Now
                </button>
              </div>
              {wallet?.available_balance > 0 && (
  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
    <p className="text-sm text-green-700 dark:text-green-300">
      ₹{wallet.available_balance} is available for withdrawal.
    </p>
  </div>
)}
            </Card>

            {/* Earnings Breakdown */}
            <Card variant="glass" hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3>Earnings History</h3>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Date</th>
                      <th className="text-left py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Booking ID</th>
                      <th className="text-left py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Customer</th>
                      <th className="text-right py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Amount</th>
                      <th className="text-right py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Commission</th>
                      <th className="text-right py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Net Earnings</th>
                      <th className="text-center py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {realEarnings.map((earning) => (

                      <tr key={earning.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-2 text-sm">
  {earning.created_at?.slice(0, 10)}
</td>

<td className="py-3 px-2 text-sm font-mono">
  {earning.id}
</td>

<td className="py-3 px-2 text-sm">
   {earning.users?.name ?? "Customer"}
</td>

<td className="py-3 px-2 text-sm text-right">
  ₹{earning.total_amount}
</td>

<td className="py-3 px-2 text-sm text-right text-red-600">
  -₹{Math.round(earning.total_amount * 0.2)}
</td>

<td className="py-3 px-2 text-sm text-right text-green-600">
  ₹{Math.round(earning.total_amount * 0.8)}
</td>

<td className="py-3 px-2 text-center">
  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
    paid
  </span>
</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Commission Info */}
            <Card variant="glass" hover={false}>
              <h3 className="mb-4">Commission Structure</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-sm">Platform Commission</span>
                  <span className="text-sm">20%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-sm">Your Earnings</span>
                  <span className="text-sm text-green-600 dark:text-green-400">80%</span>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    For every ₹1,000 booking, you earn ₹800 after 20% platform commission.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

      {/* Services Tab */}
{activeTab === 'services' && (

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >

   <Card
  variant="glass"
  hover={false}
  className="max-h-[80vh] overflow-y-auto"
>

      {/* HEADER */}
      <div className="mb-8">

        <div className="
          flex flex-col lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
        ">

          <div>

            <h2 className="
              text-3xl font-bold mb-2
            ">
              Manage Services
            </h2>

            <p className="
              text-gray-400
            ">
              Choose which services customers
              can book you for.
            </p>

          </div>

          <div className="
            px-5 py-3 rounded-2xl
            bg-blue-500/10
            border border-blue-500/20
          ">

            <p className="
              text-sm text-blue-300
            ">
              Active Services
            </p>

            <p className="
              text-2xl font-bold
            ">
           {
  ALL_SERVICES.filter((service) =>
    selectedServices.includes(service.id)
  ).length
}
            </p>

          </div>

        </div>

      </div>

     {/* SERVICES GRID */}
<div
  className="
    max-h-[600px]
    overflow-y-auto
    pr-2
  "
>
  <div
    className="
      grid grid-cols-1 md:grid-cols-2
      gap-5
    "
  >

        {availableServices.map((service) => {

          const active =
  selectedServices.includes(service.id);

          

          return (

            <button
             key={service.id}
              onClick={() => {
if (active) {

  setSelectedServices(
    selectedServices.filter(
      (s) => s !== service.id
    )
  );

} else {

  setSelectedServices([
    ...selectedServices,
    service.id,
  ]);
}
              }}
              className={`
                relative overflow-hidden
                p-6 rounded-[28px]
                border transition-all
                text-left

                ${active
                  ? `
                    bg-gradient-to-br
                    from-blue-500/20
                    to-indigo-500/10
                    border-blue-500/30
                    shadow-[0_0_40px_rgba(59,130,246,0.15)]
                  `
                  : `
                    bg-white/[0.03]
                    border-white/10
                    hover:bg-white/[0.06]
                  `
                }
              `}
            >

              {/* ACTIVE GLOW */}
              {active && (
                <div className="
                  absolute top-0 right-0
                  w-40 h-40
                  bg-blue-500/10
                  blur-[90px]
                  rounded-full
                " />
              )}

              <div className="relative">

                {/* TOP */}
                <div className="
                  flex items-start
                  justify-between
                  gap-4
                ">

                  <div>

                    {/* TITLE */}
                    <div className="
                      flex items-center gap-2
                      mb-2
                    ">

                      <h3 className="
                        text-xl font-bold capitalize
                      ">
                        {service.label}
                      </h3>

                      {active && (
                        <span className="
                          px-2 py-1 rounded-full
                          text-[10px]
                          bg-emerald-500/20
                          text-emerald-300
                          border border-emerald-500/20
                          tracking-wide
                        ">
                          ACTIVE
                        </span>
                      )}

                    </div>

                    {/* DESCRIPTION */}
                    <p className={`
                      text-sm

                      ${active
                        ? 'text-blue-100/80'
                        : 'text-gray-400'
                      }
                    `}>
                      {active
                        ? 'Customers can currently book you for this service.'
                        : 'Enable this service to start receiving bookings.'
                      }
                    </p>

                  </div>

                  {/* CHECK ICON */}
                  <div className={`
                    w-8 h-8 rounded-full
                    border-2 flex
                    items-center justify-center
                    shrink-0

                    ${active
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-white/20'
                    }
                  `}>

                    {active && (
                      <CheckCircle className="
                        w-5 h-5 text-white
                      " />
                    )}

                  </div>

                </div>

                {/* PRICE */}
                <div className="
                  mt-6 pt-5
                  border-t border-white/10
                ">

                  <p className="
                    text-sm text-gray-400 mb-1
                  ">
                    Starting Price
                  </p>

                  <div className="
                    flex items-end gap-2
                  ">

                    <p className="
                      text-3xl font-bold
                    ">
                      ₹{service.price}
                    </p>

                    <span className="
                      text-gray-400 mb-1
                    ">
                      / session
                    </span>

                  </div>

                </div>

              </div>

            </button>
          );
        })}
      </div>
  </div>

      {/* SAVE BUTTON */}
      <button
        onClick={saveServices}
        className="
          mt-8 w-full md:w-auto
          px-8 py-4 rounded-2xl
          bg-gradient-to-r
          from-blue-500 to-indigo-600
          hover:opacity-90
          transition-all
          text-white font-semibold
          shadow-lg
        "
      >
        Save Services
      </button>

    </Card>

  </motion.div>
)}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card variant="glass" hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3>Profile Information</h3>
                <Button 
                  variant="primary" 
                  size="small" 
                  icon={<Edit className="w-4 h-4" />}
                  onClick={() => setShowProfileEditModal(true)}
                >
                  Edit Profile
                </Button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                
                <img
  src={providerData?.profile_photo_url || "/default-avatar.png"}
  onError={(e) => {
    e.currentTarget.src = "/default-avatar.png";
  }}
  className="w-24 h-24 rounded-full object-cover"
/>

                
                <div>
                  <h4 className="mb-1">{providerData?.full_name || "Loading..."}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{providerData?.city || "Loading..."}</p>
                  <Button variant="outline" size="small" icon={<Edit className="w-4 h-4" />}>
                    Change Photo
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                
                <div>
                  <label className="block text-sm mb-2">Bio</label>
                  <textarea
                    value={providerData?.bio || ""}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all resize-none"
                    rows={3}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {providerData?.interests?.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Languages</label>
                  <div className="flex flex-wrap gap-2">
                   {providerData?.languages?.map((language, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Phone</label>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{providerData?.phone || "—"}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Email</label>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{providerData?.email || "—"}</span>
                    </div>
                  </div>
                </div>

                <Button variant="primary" fullWidth>
                  Save Changes
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showBookingDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#0A0F1F] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="mb-2">Booking Details</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <img
                  src={selectedBooking.customerImage}
                  alt={selectedBooking.customerName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="mb-1">{selectedBooking.customerName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                  <p className="
  text-sm text-emerald-400 mt-1
">
  📞 {selectedBooking.customerPhone}
</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Date</p>
                  <p className="text-sm">{selectedBooking.date}</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Time</p>
                  <p className="text-sm">{selectedBooking.time}</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                  <p className="text-sm">{selectedBooking.duration} hours</p>
                </div>
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Your Earnings</p>
                  <p className="text-sm text-green-600 dark:text-green-400">₹{selectedBooking.earnings}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Location</p>
                <p className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {selectedBooking.location}
                </p>
              </div>
<div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
    Additional Notes
  </p>

  <p className="text-sm">
    {selectedBooking.notes || "No notes provided"}
  </p>
</div>

<div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
    Service
  </p>

  <p className="text-sm capitalize">
    {selectedBooking.service.replace("-", " ")}
  </p>
</div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Financial Breakdown</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <span>₹{selectedBooking.amount}</span>
                  </div>
                  <div className="flex justify-between text-red-600 dark:text-red-400">
                    <span>Platform Commission (20%)</span>
                    <span>-₹{selectedBooking.amount - selectedBooking.earnings}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-amber-200 dark:border-amber-800 text-green-600 dark:text-green-400">
                    <span>Your Earnings</span>
                    <span>₹{selectedBooking.earnings}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowBookingDetails(false)}
              >
                Close
              </Button>
              {selectedBooking.status === 'upcoming' && (
                <Button variant="primary" fullWidth>
                  Contact Customer
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
       <WithdrawalModal
  isOpen={showWithdrawalModal}
  onClose={() => setShowWithdrawalModal(false)}
  availableAmount={wallet?.available_balance ?? 0}
  onWithdraw={handleWithdrawal}
  bankAccount={bankAccount}
  upiAccount={upiAccount}
/>
      )}

     
     

      {/* Profile Edit Modal */}
      {showProfileEditModal && (
        <ProfileEditModal
          isOpen={showProfileEditModal}
          onClose={() => setShowProfileEditModal(false)}
          initialProfile={providerData}
          onSave={(updatedProfile) => {
    setProviderData(updatedProfile);
    
          }}
        />
        
      )}
      {showPayoutSetup && (
  <PayoutSetupModal
    isOpen={true}
    onClose={() => setShowPayoutSetup(false)}
    onSelectBank={() => {
      setShowPayoutSetup(false);
      setShowBankSetup(true);
    }}
    onSelectUpi={() => {
      setShowPayoutSetup(false);
      setShowUpiSetup(true);
    }}
  />
)}
{showBankSetup && (
  <BankSetupModal
    isOpen={showBankSetup}
    onClose={() => setShowBankSetup(false)}
    providerId={providerData?.id}
    onSaved={() => {
      setShowBankSetup(false);
    }}
  />
)}
{showUpiSetup && (
  <UpiSetupModal
    isOpen={showUpiSetup}
    onClose={() => setShowUpiSetup(false)}
    providerId={providerData?.id}
    onSaved={() => {
      setShowUpiSetup(false);
    }}
  />
)}
    
    </div>



  );
}



