import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { useAuth } from './lib/auth-context';

/* =========================
   SCREENS – CORE FLOW
========================= */
import { OpeningScreen } from './components/screens/OpeningScreen';
import { TermsScreen } from './components/screens/TermsScreen';
import { TermsDetailScreen } from './components/screens/TermsDetailScreen';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { SignInScreen } from './components/screens/SignInScreen';
import { ForgotPasswordScreen } from './components/screens/ForgotPasswordScreen';
import { CreateAccountScreen } from './components/screens/CreateAccountScreen';
import { ProfileSetupScreen } from './components/screens/ProfileSetupScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { HomeScreen } from './components/screens/HomeScreen';

import { BusinessMeetupScreen } from './components/screens/BusinessMeetupScreen';
import { FindPartnerScreen } from './components/screens/FindPartnerScreen';
import { FindInvestorScreen } from './components/screens/FindInvestorScreen';
import { ProviderDashboardScreen } from './components/screens/ProviderDashboardScreen';
import { ExpertDashboardScreen } from './components/screens/ExpertDashboardScreen';
import { UserProfileScreen } from './components/screens/UserProfileScreen';
import { BookingScreen } from './components/screens/BookingScreen';
import { PaymentScreen } from './components/screens/PaymentScreen';
import { ChatScreen } from './components/screens/ChatScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { BookingConfirmationScreen } from './components/screens/BookingConfirmationScreen';
import { CategorySelectionScreen } from './components/screens/CategorySelectionScreen';
import { ServiceProviderListingScreen } from './components/screens/ServiceProviderListingScreen';
import { ProviderProfileScreen } from './components/screens/ProviderProfileScreen';
import { UserBookingDashboard } from './components/screens/UserBookingDashboard';
import { AdminAnalyticsDashboard } from './components/screens/AdminAnalyticsDashboard';
import { AdminProviderManagement } from './components/screens/admin/AdminProviderManagement';
import { AdminBookingManagement } from './components/screens/admin/AdminBookingManagement';
import { MyProfileScreen } from './components/screens/MyProfileScreen';

/* =========================
   P2P MATCHING
========================= */
import { P2PPeerListingScreen } from './components/screens/P2PPeerListingScreen';
import { P2PPeerProfileScreen } from './components/screens/P2PPeerProfileScreen';
import { P2PRequestMeetingScreen } from './components/screens/P2PRequestMeetingScreen';
import { P2PRequestStatusScreen } from './components/screens/P2PRequestStatusScreen';
import { P2PPeerPaymentScreen } from './components/screens/P2PPeerPaymentScreen';
import { P2PMeetingConfirmationScreen } from './components/screens/P2PMeetingConfirmationScreen';
import { P2PIncomingRequestsScreen } from './components/screens/P2PIncomingRequestsScreen';
// P2P Onboarding
import { P2PProfileEnable } from './components/screens/onboarding/P2PProfileEnable';
import { P2PRequestsHubScreen } from './components/screens/P2PRequestsHubScreen';
/* =========================
   BLIND DATE
========================= */
import { BlindDateScreen } from './components/screens/BlindDateScreen';
import { BlindDateLanding } from './components/screens/blinddate/BlindDateLanding';
import { BlindDateBooking } from './components/screens/blinddate/BlindDateBooking';
import { BlindDatePaymentNew } from './components/screens/blinddate/BlindDatePaymentNew';

import { BlindDateBookingStatus } from './components/screens/blinddate/BlindDateBookingStatus';


/* =========================
   ADMIN (DEMO + UI ONLY)
========================= */

/* =========================
   PROVIDER / EXPERT
========================= */




import { supabase } from './supabase';
import { startNotificationEmailListener } from "./services/notificationEmailListener";

// Rent Friend Flow
import { RentFriendEntry } from './components/screens/rentfriend/RentFriendEntry';
import { RentFriendServiceSelection } from './components/screens/rentfriend/RentFriendServiceSelection';
import { RentFriendPartnerListing } from './components/screens/rentfriend/RentFriendPartnerListing';
import { RentFriendBooking } from './components/screens/rentfriend/RentFriendBooking';
import { RentFriendPayment } from './components/screens/rentfriend/RentFriendPayment';
import { BecomeFriend } from './components/screens/rentfriend/BecomeFriend';
import { registerPushNotifications } from './lib/push';
import ResetPasswordScreen from './components/screens/ResetPasswordScreen';
import { FriendOnboarding } from './components/screens/FriendOnboarding';
import { RentFriendBookingDetails } from './components/screens/rentfriend/RentFriendBookingDetails';


/* =========================
   SCREEN UNION TYPE
========================= */
export type Screen =
  | 'opening'
  | 'terms'
  | 'terms-detail'
  | 'welcome'
  | 'signin'
  | 'forgot-password'
  | 'reset-password'
  | 'signup'
  | 'profile-setup'
  | 'onboarding'
  | 'home'
  | 'category-selection'
  | 'service-listing'
  | 'provider-profile'
  | 'rent-friend'
  | 'rent-friend-services'
  | 'rent-friend-partners'
  | 'rent-friend-booking'
  | 'rent-friend-payment'
  | 'rent-friend-booking-details'
  | 'become-friend'
  | 'friend-onboarding'
  | 'business-meetup'
  | 'find-partner'
  | 'find-investor'
  | 'user-profile'
  | 'booking'
  | 'booking-confirmation'
  | 'payment'
  | 'chat'
  | 'notifications'
  | 'bookings'
  | 'profile'
  | 'settings'
  | 'admin-dashboard'
  | 'admin-analytics'
  | 'admin-provider-management'
  | 'admin-booking-management'
  | 'p2p-profile-enable'
  | 'p2p-peer-listing'
  | 'p2p-peer-profile'
  | 'p2p-request-meeting'
  | 'p2p-request-status'
  | 'p2p-incoming-requests'
  | 'p2p-requests-hub'
  | 'p2p-peer-payment'
  | 'p2p-meeting-confirmation'
  | 'blind-date'
  | 'blind-date-landing'
  | 'blind-date-booking'
  | 'blind-date-payment-new'
  | 'blind-date-booking-status' 
  | "blind-date-match-found"
  | 'provider-dashboard'
  | 'expert-dashboard';

  const publicScreens: Screen[] = [
  'opening',
  'terms',
  'terms-detail',
  'welcome',
  'signin',
  'signup',
  'forgot-password',
  'reset-password',
];

/* =========================
   MAIN COMPONENT – STATE ONLY
========================= */
export default function UserApp() {
 const { user, isAuthenticated, isLoading, signOut } = useAuth();

 const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
  const savedScreen = sessionStorage.getItem('meetmymate_current_screen');

  return savedScreen ? (savedScreen as Screen) : 'opening';
});
 
  const [previousScreen, setPreviousScreen] = useState<Screen>('home');
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>([]);
 const [openingCompleted, setOpeningCompleted] = useState(() => {
  return sessionStorage.getItem('meetmymate_opening_completed') === 'true';
});
 const [isP2PProfileEnabled, setIsP2PProfileEnabled] = useState(false);
const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
// Selected Service for Rent Friend flow
const [selectedService, setSelectedService] = useState<string>('movie-buddy');
const [bookingData, setBookingData] = useState<string>('');
const [paymentData, setPaymentData] = useState<string>('');
const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [selectedBlindDateBookingId, setSelectedBlindDateBookingId] =
  useState<string>('');
const [profileStatus, setProfileStatus] = useState<
  'unknown' | 'none' | 'draft' | 'complete'
>('unknown');
const [isFinishingOnboarding, setIsFinishingOnboarding] = useState(false);

useEffect(() => {
  sessionStorage.setItem('meetmymate_current_screen', currentScreen);
}, [currentScreen]);

const handleOpeningComplete = () => {
  sessionStorage.setItem('meetmymate_opening_completed', 'true');
  setOpeningCompleted(true);
};



useEffect(() => {
  const channel = startNotificationEmailListener();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

 /* =========================
   AUTH PERSISTENCE (SAFE)
========================= */

useEffect(() => {
  if (!user) return;

  const fetchUnread = async () => {
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false) 

    setUnreadNotificationCount(count || 0);
  };

  fetchUnread();

  const channel = supabase
    .channel("app-notifications")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${user.id}`,
      },
      () => {
        fetchUnread();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user]);

useEffect(() => {
  if (!user) return;

  // Wait until app initialization settles
  const timer = setTimeout(() => {
    registerPushNotifications();
  }, 2000);

  return () => clearTimeout(timer);
}, [user]);
useEffect(() => {
  if (isLoading) return;
  // 🔐 PASSWORD RECOVERY MODE
if (user && window.location.hash.includes("type=recovery")) {
  setCurrentScreen("reset-password");
}

if (
  profileStatus === 'draft' &&
  !['profile-setup', 'onboarding'].includes(currentScreen)
) {
  setCurrentScreen('profile-setup');
}

  // ----------------------------------
  // NOT AUTHENTICATED
  // ----------------------------------
 // 🚫 DO NOTHING until auth state is stable
if (isLoading) return;

// 🚫 DO NOTHING if just signed up or logging in
if (!user && isAuthenticated === false) {
  if (currentScreen === 'opening') {
    if (openingCompleted) {
      setCurrentScreen('terms');
    }
    return;
  }

  if (!publicScreens.includes(currentScreen)) {
    setCurrentScreen('welcome');
  }

  return;
}


  // ----------------------------------
  // AUTHENTICATED BUT PROFILE NOT DONE
  // ----------------------------------
 if (profileStatus === 'unknown') {
  return; // ⛔ WAIT — DO NOT REDIRECT
}

if (profileStatus === 'draft') {
  if (!['profile-setup', 'onboarding'].includes(currentScreen)) {
    setCurrentScreen('profile-setup');
  }
  return;
}


  // ----------------------------------
  // FULLY REGISTERED USER
  // ----------------------------------
  if (profileStatus === 'complete') {
  if (currentScreen === 'opening' && openingCompleted) {
    setCurrentScreen('home');
  }
}
}, [isLoading, user, profileStatus, currentScreen, openingCompleted]);


useEffect(() => {
  if (!user) {
    setProfileStatus('none');
    return;
  }


async function checkProfile() {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    setProfileStatus('none');
    setCurrentScreen('welcome');
    return;
  }

  // 1️⃣ Check FINAL users table
  const { data: userRow } = await supabase
    .from('users')
    .select('id')
    .eq('id', authUser.id)
    .maybeSingle();

  if (userRow) {
    setProfileStatus('complete');
    return;
  }

  // 2️⃣ Check DRAFT table
  const { data: draftRow } = await supabase
    .from('user_drafts')
    .select('id')
    .eq('id', authUser.id)
    .maybeSingle();

  if (draftRow) {
    setProfileStatus('draft');
    return;
  }

  // 3️⃣ Invalid session (auth user exists but no DB rows)
  await supabase.auth.signOut();
  setProfileStatus('none');
  setCurrentScreen('welcome');
}



  checkProfile();

  return () => {
  };
}, [user]);


  /* =========================
     NAVIGATION (FIXED & SAFE)
  ========================= */
 const navigate = (screen: Screen, param?: string | number) => {
  setNavigationHistory((prev) => [...prev, currentScreen]);
  
  // ✅ P2P profile gating
  if (screen === 'p2p-peer-listing' && !isP2PProfileEnabled) {
    setNavigationHistory(prev => [...prev, currentScreen]);
    openP2PFlow();
    return;
  }
  
  // ✅ Store selected service for Rent Friend flow
  
   if (screen === 'rent-friend-partners' && param) {
  setSelectedService(param as string);
}

if (screen === 'rent-friend-booking' && param) {
  setBookingData(param as string);
}

if (screen === 'rent-friend-payment' && param) {
  setPaymentData(param as string);
}
if (
  screen === 'rent-friend-booking-details' &&
  param
) {
  setSelectedBookingId(param as string);
}
if (
  screen === 'blind-date-booking-status' &&
  param
) {
  setSelectedBlindDateBookingId(param as string);
}
  // Preserve previous screen for profile back-flow
  if (
    ['rent-friend', 'blind-date', 'business-meetup'].includes(currentScreen) &&
    screen === 'user-profile'
  ) {
    setPreviousScreen(currentScreen);
  }

 if (screen === 'p2p-request-meeting' && param) {
  setSelectedPeerId(param as string);
}

setCurrentScreen(screen);
};
const openP2PFlow = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("p2p_profiles")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error("P2P check failed:", error);
      return;
    }

    if (data) {
      // ✅ USER ALREADY LISTED → skip enable screen
      setCurrentScreen("p2p-peer-listing");
    } else {
      // ✅ NEW USER OR UNLISTED
      setCurrentScreen("p2p-profile-enable");
    }
  } catch (err) {
    console.error(err);
  }
};
  /* =========================
     BACK NAVIGATION (FIXED)
  ========================= */
  const handleBack = () => {
    // Use navigation history FIRST
    setNavigationHistory((prev) => {
      if (prev.length === 0) {
        return prev;
      }

      const history = [...prev];
      const last = history.pop();

      if (last) {
        setCurrentScreen(last);
      }

      return history;
    });
  };


  /* =========================
     AUTH FLOW HANDLERS
  ========================= */
  const handleSignIn = () => {
    setCurrentScreen('home');
  };

  const handleSignUp = () => {
    setCurrentScreen('profile-setup');
  };

  const handleProfileSetupComplete = () => {
    setCurrentScreen('onboarding');
  };
const handleOnboardingComplete = async () => {

  // Prevent double execution
  if (isFinishingOnboarding) return;

  setIsFinishingOnboarding(true);

  try {

    if (!user) return;

    // 1️⃣ Read draft
    const { data: draft, error: draftError } = await supabase
      .from('user_drafts')
      .select('*')
      .eq('id', user.id)
      .single();
      

    if (draftError || !draft) {
      alert('Profile draft missing. Please try again.');
      return;
    }

   
    // 2️⃣ Create/update users table
    const { error: userError } = await supabase
      .from('users')
      
      .upsert(
        {
          id: user.id,
          email: user.email,

          name: draft.name,
          phone: draft.phone,

          age: draft.age,
          gender: draft.gender,

          interests: draft.interests,
          bio: draft.bio,

          city: draft.city,

          profile_photo_url: draft.profile_photo_url,

          id_document_uploaded: draft.id_document_uploaded,

          languages: draft.languages,

          onboarding_completed: true,
        },
        {
          onConflict: 'id',
        }
      );

    if (userError) {
      alert(userError.message);
      return;
    }

    // 3️⃣ Cleanup draft
    await supabase
      .from('user_drafts')
      .delete()
      .eq('id', user.id);

    // 4️⃣ Finish
   setProfileStatus('complete');
setCurrentScreen('home');

// 🔥 NOW users row exists → save FCM token correctly
await registerPushNotifications();

  } finally {

    // Always unlock function
    setIsFinishingOnboarding(false);
  }
};



const handleLogout = async () => {
  await signOut();
  setCurrentScreen('welcome');
};

  /* =========================
     NAV VISIBILITY (RESTORED)
  ========================= */
  const showNavigation =
    isAuthenticated &&
    ![
      'opening',
      'terms',
      'welcome',
      'signin',
      'signup',
      'profile-setup',
      'onboarding',
    ].includes(currentScreen);

    const footerScreens: Screen[] = [
  'home',
  'rent-friend',
  'rent-friend-services',
  'rent-friend-partners',
  'business-meetup',
  'find-partner',
  'find-investor',
  'blind-date',
  'blind-date-landing',
  'p2p-peer-listing',
  'service-listing',
  'provider-profile',
  'user-profile',
  'bookings',
];

const showFooter =
  isAuthenticated && footerScreens.includes(currentScreen);
    
  /* =========================
     LOADING STATE
  ========================= */





    return (
  <div className="w-full min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] text-[#0B0B0C] dark:text-white transition-colors duration-300">


      {/* Navigation */}
      {showNavigation && (
        <Navigation
  active={currentScreen}
  onNavigate={(page) => navigate(page as Screen)}
  isAdmin={false}
  notificationCount={unreadNotificationCount}
  userProfileImage="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
  userName="User"
/>

      )}

      {/* Screen Transitions */}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          className={`w-full ${showNavigation ? 'md:pr-20' : ''}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >

          {/* -------- AUTH FLOW -------- */}
        {currentScreen === 'opening' && (
  <OpeningScreen onComplete={handleOpeningComplete} />
)}
          {currentScreen === 'terms' && (
            <TermsScreen onAccept={() => navigate('welcome')} onNavigate={navigate} />
          )}

          {currentScreen === 'terms-detail' && (
            <TermsDetailScreen onBack={handleBack} />
          )}

          {currentScreen === 'welcome' && (
            <WelcomeScreen
              onSignIn={() => navigate('signin')}
              onSignUp={() => navigate('signup')}
            />
          )}

          {currentScreen === 'signin' && (
            <SignInScreen
              onSignIn={handleSignIn}
              onBack={handleBack}
              onForgotPassword={() => navigate('forgot-password')}
            />
          )}

          {currentScreen === 'forgot-password' && (
            <ForgotPasswordScreen
              onBack={handleBack}
              onSuccess={() => navigate('signin')}
            />
          )}
          {currentScreen === 'reset-password' && (
  <ResetPasswordScreen
    onSuccess={() => navigate('signin')}
  />
)}


          {currentScreen === 'signup' && (
            <CreateAccountScreen
              onCreateAccount={handleSignUp}
              onBack={handleBack}
            />
          )}

          {currentScreen === 'profile-setup' && (
            <ProfileSetupScreen onComplete={handleProfileSetupComplete} />
          )}

          {currentScreen === 'onboarding' && (
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          )}

          {/* -------- MAIN USER FLOW -------- */}
          {currentScreen === 'home' && (
            <HomeScreen onNavigate={(screen) => navigate(screen as Screen)} />
          )}

         {currentScreen === 'rent-friend' && (
            <RentFriendEntry onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'rent-friend-services' && (
            <RentFriendServiceSelection onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'rent-friend-partners' && (
            <RentFriendPartnerListing onNavigate={navigate} onBack={handleBack} selectedService={selectedService} />
          )}
          {currentScreen === 'rent-friend-booking' && (
          <RentFriendBooking
  onNavigate={navigate}
  onBack={handleBack}
  bookingData={bookingData}
/>
          )}
          {currentScreen === 'rent-friend-payment' && (
           <RentFriendPayment
  onNavigate={navigate}
  onBack={handleBack}
  paymentData={paymentData}
/>
          )}
          {currentScreen === 'rent-friend-booking-details' && (
  <RentFriendBookingDetails
    bookingId={selectedBookingId}
    onBack={handleBack}
  />
)}
           {currentScreen === 'become-friend' && (
            <BecomeFriend onNavigate={navigate} onBack={handleBack} />
          )}

          {currentScreen === 'friend-onboarding' && (
            <FriendOnboarding onNavigate={navigate} onBack={handleBack} />
          )}

          {currentScreen === 'business-meetup' && (
            <BusinessMeetupScreen onNavigate={navigate} onBack={handleBack} />
          )}

          {currentScreen === 'find-partner' && (
            <FindPartnerScreen onNavigate={navigate} onBack={handleBack} />
          )}

          {currentScreen === 'find-investor' && (
            <FindInvestorScreen onNavigate={navigate} onBack={handleBack} />
          )}

          
          {currentScreen === 'user-profile' && (
            <UserProfileScreen onNavigate={navigate} onBack={handleBack} />
          )}

          {currentScreen === 'booking' && (
            <BookingScreen onNavigate={navigate} onBack={handleBack} />
          )}

          {currentScreen === 'payment' && (
            <PaymentScreen onNavigate={navigate} onBack={handleBack} />
          )}

          {currentScreen === 'booking-confirmation' && (
            <BookingConfirmationScreen onNavigate={navigate} />
          )}

          {currentScreen === 'chat' && (
            <ChatScreen onBack={handleBack} />
          )}

         {currentScreen === 'notifications' && (
  <NotificationsScreen
    onNavigate={navigate}
    onBack={handleBack}
    setSelectedMeetingId={setSelectedMeetingId} // ✅ ADD THIS
  />
)}

         {currentScreen === 'settings' && (
  <SettingsScreen
    onBack={handleBack}
    onLogout={handleLogout}
  />
)}



          {currentScreen === 'profile' && (
            <MyProfileScreen onNavigate={navigate} />
          )}

         {currentScreen === 'bookings' && (
  <UserBookingDashboard
    onNavigate={navigate}
    setSelectedMeetingId={setSelectedMeetingId}
  />
)}
{currentScreen === 'service-listing' && (
            <ServiceProviderListingScreen onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'provider-profile' && (
            <ProviderProfileScreen onNavigate={navigate} onBack={handleBack} />
          )}
           {currentScreen === 'provider-dashboard' && (
            <ProviderDashboardScreen onNavigate={navigate} onBack={handleBack} />
          )}

          {/* -------- P2P MATCHING -------- */}
          {currentScreen === 'p2p-profile-enable' && (
            <P2PProfileEnable 
              onNavigate={navigate} 
              onBack={handleBack}
              onProfileEnabled={() => {
                setIsP2PProfileEnabled(true);
                navigate('p2p-peer-listing');
              }}
            />
          )}
          {currentScreen === 'p2p-peer-listing' && (
            <P2PPeerListingScreen 
              onNavigate={navigate} 
              onBack={handleBack}
              onSelectPeer={(peerId) => setSelectedPeerId(peerId)}
            />
          )}
          {currentScreen === 'p2p-peer-profile' && (
            <P2PPeerProfileScreen 
              onNavigate={navigate} 
              onBack={handleBack}
              peerId={selectedPeerId}
            />
          )}
         {currentScreen === 'p2p-request-meeting' && (
  <P2PRequestMeetingScreen
    onNavigate={navigate}
    onBack={handleBack}
    peerId={selectedPeerId}   // ✅ THIS IS THE ONLY REQUIRED CHANGE
  />
)}
          {currentScreen === 'p2p-request-status' && (
           <P2PRequestStatusScreen
  onNavigate={navigate}
  onBack={handleBack}
  peerId={selectedPeerId}
/>
          )}
          {currentScreen === 'p2p-incoming-requests' && (
  <P2PIncomingRequestsScreen
    onNavigate={navigate}
    onBack={handleBack}
  />
)}
{currentScreen === 'p2p-requests-hub' && (
  <P2PRequestsHubScreen
    onNavigate={navigate}
    onBack={handleBack}
    defaultTab="incoming"
    onSelectPeer={(peerId) => setSelectedPeerId(peerId)}
    setSelectedMeetingId={setSelectedMeetingId}
    setSelectedRequestId={setSelectedRequestId}
  />
)}
          {currentScreen === 'p2p-peer-payment' && (
  <P2PPeerPaymentScreen
    peerId={selectedPeerId}
    requestId={selectedRequestId}
    onBack={() => setCurrentScreen('p2p-requests-hub')}
    onNavigate={(page) => {
      if (page === 'p2p-meeting-confirmation') {
        setCurrentScreen('p2p-meeting-confirmation');
      } else {
        setCurrentScreen(page);
      }
    }}
    setSelectedMeetingId={setSelectedMeetingId}
  />
)}
         {currentScreen === "p2p-meeting-confirmation" && (
  <P2PMeetingConfirmationScreen
    meetingId={selectedMeetingId}
    onNavigate={setCurrentScreen}
  />
)}
          

          {/* -------- BLIND DATE -------- */}
          {currentScreen === 'blind-date' && (
            <BlindDateScreen onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-landing' && (
            <BlindDateLanding onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-booking' && (
            <BlindDateBooking onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-payment-new' && (
            <BlindDatePaymentNew onNavigate={navigate} onBack={handleBack} />
          )}
          
           {currentScreen === 'blind-date-booking-status' && (
  <BlindDateBookingStatus
    bookingId={selectedBlindDateBookingId}
    onNavigate={navigate}
    onBack={handleBack}
  />
)}
        </motion.div>
           </AnimatePresence>

      {showFooter && (
        <Footer
          onNavigate={(page) => navigate(page as Screen)}
        />
      )}
    </div>
  );
}

