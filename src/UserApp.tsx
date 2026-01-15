import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from './components/ThemeToggle';
import { Navigation } from './components/Navigation';
import { Logo } from './components/Logo';

// Screens
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
import { RentFriendScreen } from './components/screens/RentFriendScreen';
import { AdminDashboard } from './components/screens/AdminDashboard';

// Additional placeholder screens
import { BusinessMeetupScreen } from './components/screens/BusinessMeetupScreen';
import { FindPartnerScreen } from './components/screens/FindPartnerScreen';
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

// Peer-to-Peer Business Matching screens
import { P2PPeerListingScreen } from './components/screens/P2PPeerListingScreen';
import { P2PPeerProfileScreen } from './components/screens/P2PPeerProfileScreen';
import { P2PRequestMeetingScreen } from './components/screens/P2PRequestMeetingScreen';
import { P2PRequestStatusScreen } from './components/screens/P2PRequestStatusScreen';
import { P2PPeerPaymentScreen } from './components/screens/P2PPeerPaymentScreen';
import { P2PMeetingConfirmationScreen } from './components/screens/P2PMeetingConfirmationScreen';

// Rent-a-Friend Onboarding
import { FriendOnboarding } from './components/screens/FriendOnboarding';

// Blind Date Screens
import { BlindDateScreen } from './components/screens/BlindDateScreen';
import { BlindDateLanding } from './components/screens/blinddate/BlindDateLanding';
import { BlindDateEligibility } from './components/screens/blinddate/BlindDateEligibility';
import { BlindDateVerifyPhone } from './components/screens/blinddate/BlindDateVerifyPhone';
import { BlindDateVerifyEmail } from './components/screens/blinddate/BlindDateVerifyEmail';
import { BlindDateVerifyAge } from './components/screens/blinddate/BlindDateVerifyAge';
import { BlindDateVerifySelfie } from './components/screens/blinddate/BlindDateVerifySelfie';
import { BlindDateProfileSetup } from './components/screens/blinddate/BlindDateProfileSetup';
import { BlindDateAvailabilitySetup } from './components/screens/blinddate/BlindDateAvailabilitySetup';
import { BlindDatePayment } from './components/screens/blinddate/BlindDatePayment';
import { BlindDateDashboard } from './components/screens/blinddate/BlindDateDashboard';
import { BlindDateHowItWorks } from './components/screens/blinddate/BlindDateHowItWorks';
import { BlindDatePaymentHistory } from './components/screens/blinddate/BlindDatePaymentHistory';
import { BlindDateMatchFound } from './components/screens/blinddate/BlindDateMatchFound';
import { BlindDateMeetingScheduled } from './components/screens/blinddate/BlindDateMeetingScheduled';

// Provider & Expert Dashboards
import { ProviderDashboardScreen } from './components/screens/ProviderDashboardScreen';
import { ExpertDashboardScreen } from './components/screens/ExpertDashboardScreen';
import { FindExperiencedScreen } from './components/screens/FindExperiencedScreen';
import { FindInvestorScreen } from './components/screens/FindInvestorScreen';

export type Screen =
  | 'opening'
  | 'terms'
  | 'terms-detail'
  | 'welcome'
  | 'signin'
  | 'forgot-password'
  | 'signup'
  | 'profile-setup'
  | 'onboarding'
  | 'home'
  | 'category-selection'
  | 'service-listing'
  | 'provider-profile'
  | 'rent-friend'
  | 'friend-onboarding'
  | 'business-meetup'
  | 'find-partner'
  | 'find-investor'
  | 'find-experienced'
  | 'user-profile'
  | 'booking'
  | 'booking-confirmation'
  | 'payment'
  | 'chat'
  | 'notifications'
  | 'explore'
  | 'bookings'
  | 'profile'
  | 'settings'
  | 'admin-dashboard'
  | 'admin-analytics'
  | 'admin-users'
  | 'admin-verification'
  | 'admin-payments'
  | 'admin-settings'
  | 'admin-provider-management'
  | 'admin-booking-management'
  | 'p2p-peer-listing'
  | 'p2p-peer-profile'
  | 'p2p-request-meeting'
  | 'p2p-request-status'
  | 'p2p-peer-payment'
  | 'p2p-meeting-confirmation'
  | 'blind-date'
  | 'blind-date-landing'
  | 'blind-date-eligibility'
  | 'blind-date-verify-phone'
  | 'blind-date-verify-email'
  | 'blind-date-verify-age'
  | 'blind-date-verify-selfie'
  | 'blind-date-profile-setup'
  | 'blind-date-availability-setup'
  | 'blind-date-payment'
  | 'blind-date-dashboard'
  | 'blind-date-how-it-works'
  | 'blind-date-payment-history'
  | 'blind-date-match-found'
  | 'blind-date-meeting-scheduled'
  | 'provider-dashboard'
  | 'expert-dashboard';

export default function UserApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('opening');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [previousScreen, setPreviousScreen] = useState<Screen>('home');
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(3);
  
  // Navigation history stack for proper back navigation
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>([]);

  // Demo: Switch to admin view
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Toggle admin mode
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsAdmin(!isAdmin);
        if (!isAdmin) {
          setCurrentScreen('admin-dashboard');
          setIsAuthenticated(true);
        } else {
          setCurrentScreen('home');
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAdmin]);

  const navigate = (screen: Screen, data?: any) => {
    // Track previous screen for proper back navigation
    if (['rent-friend', 'blind-date', 'business-meetup'].includes(currentScreen) && screen === 'user-profile') {
      setPreviousScreen(currentScreen);
    }
    setCurrentScreen(screen);
    setNavigationHistory([...navigationHistory, currentScreen]);
  };

  const handleSignIn = () => {
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };

  const handleSignUp = () => {
    setCurrentScreen('profile-setup');
  };

  const handleProfileSetupComplete = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };

  const handleBack = () => {
    // First, try to use navigation history stack
    if (navigationHistory.length > 0) {
      const history = [...navigationHistory];
      const previousScreen = history.pop();
      setNavigationHistory(history);
      if (previousScreen) {
        setCurrentScreen(previousScreen);
        return;
      }
    }
    
    // Fallback to predefined back map for specific flows
    const backMap: Record<Screen, Screen> = {
      signin: 'welcome',
      signup: 'welcome',
      'terms-detail': 'terms',
      'category-selection': 'home',
      'service-listing': 'category-selection',
      'provider-profile': 'service-listing',
      'rent-friend': 'home',
      'friend-onboarding': 'rent-friend',
      'business-meetup': 'home',
      'find-partner': 'business-meetup',
      'find-investor': 'business-meetup',
      'find-experienced': 'business-meetup',
      'user-profile': previousScreen,
      'booking': 'provider-profile',
      'booking-confirmation': 'home',
      payment: 'booking',
      settings: 'home',
      chat: 'home',
      'p2p-peer-listing': 'business-meetup',
      'p2p-peer-profile': 'p2p-peer-listing',
      'p2p-request-meeting': 'p2p-peer-profile',
      'p2p-request-status': 'p2p-request-meeting',
      'p2p-peer-payment': 'p2p-request-status',
      'p2p-meeting-confirmation': 'home',
      'admin-dashboard': 'home',
      'admin-analytics': 'admin-dashboard',
      'admin-users': 'admin-dashboard',
      'admin-verification': 'admin-dashboard',
      'admin-payments': 'admin-dashboard',
      'admin-settings': 'admin-dashboard',
      'admin-provider-management': 'admin-dashboard',
      'admin-booking-management': 'admin-dashboard',
      'blind-date': 'home',
      'blind-date-landing': 'home',
      'blind-date-eligibility': 'blind-date-landing',
      'blind-date-verify-phone': 'blind-date-eligibility',
      'blind-date-verify-email': 'blind-date-verify-phone',
      'blind-date-verify-age': 'blind-date-verify-email',
      'blind-date-verify-selfie': 'blind-date-verify-age',
      'blind-date-profile-setup': 'blind-date-verify-selfie',
      'blind-date-availability-setup': 'blind-date-profile-setup',
      'blind-date-payment': 'blind-date-availability-setup',
      'blind-date-dashboard': 'blind-date-payment',
      'blind-date-how-it-works': 'blind-date-dashboard',
      'blind-date-payment-history': 'blind-date-dashboard',
      'blind-date-match-found': 'blind-date-dashboard',
      'blind-date-meeting-scheduled': 'blind-date-dashboard',
      'provider-dashboard': 'home',
      'expert-dashboard': 'home'
    } as Record<Screen, Screen>;

    const fallbackScreen = backMap[currentScreen];
    if (fallbackScreen) {
      setCurrentScreen(fallbackScreen);
    }
  };

  const showNavigation = isAuthenticated && !['opening', 'terms', 'welcome', 'signin', 'signup', 'profile-setup', 'onboarding'].includes(currentScreen);

  return (
    <div className="relative min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] text-[#0B0B0C] dark:text-white transition-colors duration-300">
      {/* Admin indicator */}
      {isAdmin && isAuthenticated && (
        <div className="fixed top-4 left-4 z-50 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm shadow-lg">
          Admin Mode (Ctrl+Shift+A to toggle)
        </div>
      )}

      {/* Navigation */}
      {showNavigation && (
        <Navigation
          active={currentScreen}
          onNavigate={(page) => navigate(page as Screen)}
          isAdmin={isAdmin}
          notificationCount={unreadNotificationCount}
          userProfileImage="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
          userName="Alex"
        />
      )}

      {/* Screen Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentScreen === 'opening' && (
            <OpeningScreen onComplete={() => navigate('terms')} />
          )}
          {currentScreen === 'terms' && (
            <TermsScreen onAccept={() => navigate('welcome')} onNavigate={navigate} />
          )}
          {currentScreen === 'terms-detail' && (
            <TermsDetailScreen onBack={() => navigate('terms')} />
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
          {currentScreen === 'home' && (
            <HomeScreen onNavigate={navigate} userName="Alex" />
          )}
          {currentScreen === 'rent-friend' && (
            <RentFriendScreen onNavigate={navigate} onBack={handleBack} />
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
          {currentScreen === 'find-experienced' && (
            <FindExperiencedScreen onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'user-profile' && (
            <UserProfileScreen onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'booking' && (
            <BookingScreen onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'booking-confirmation' && (
            <BookingConfirmationScreen onNavigate={navigate} />
          )}
          {currentScreen === 'payment' && (
            <PaymentScreen onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'chat' && (
            <ChatScreen onBack={() => navigate('home')} />
          )}
          {currentScreen === 'notifications' && (
            <NotificationsScreen onNavigate={navigate} onBack={() => navigate('home')} />
          )}
          {currentScreen === 'explore' && (
            <ExploreScreen onNavigate={navigate} />
          )}
          {currentScreen === 'bookings' && (
            <UserBookingDashboard onNavigate={navigate} />
          )}
          {currentScreen === 'profile' && (
            <MyProfileScreen onNavigate={navigate} />
          )}
          {currentScreen === 'settings' && (
            <SettingsScreen onBack={handleBack} onNavigate={navigate} />
          )}
          {currentScreen === 'admin-dashboard' && (
            <AdminDashboard onNavigate={navigate} />
          )}
          {currentScreen === 'admin-analytics' && (
            <AdminAnalyticsDashboard onNavigate={navigate} />
          )}
          {currentScreen === 'admin-users' && (
            <AdminUsersScreen onNavigate={navigate} onBack={() => navigate('admin-dashboard')} />
          )}
          {currentScreen === 'admin-verification' && (
            <AdminVerificationScreen onNavigate={navigate} onBack={() => navigate('admin-dashboard')} />
          )}
          {currentScreen === 'admin-payments' && (
            <AdminPaymentsScreen onNavigate={navigate} onBack={() => navigate('admin-dashboard')} />
          )}
          {currentScreen === 'admin-settings' && (
            <AdminSettingsScreen onNavigate={navigate} onBack={() => navigate('admin-dashboard')} />
          )}
          {currentScreen === 'admin-provider-management' && (
            <AdminProviderManagement onNavigate={navigate} onBack={() => navigate('admin-dashboard')} />
          )}
          {currentScreen === 'admin-booking-management' && (
            <AdminBookingManagement onNavigate={navigate} onBack={() => navigate('admin-dashboard')} />
          )}
          {currentScreen === 'category-selection' && (
            <CategorySelectionScreen onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'service-listing' && (
            <ServiceProviderListingScreen onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'provider-profile' && (
            <ProviderProfileScreen onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'p2p-peer-listing' && (
            <P2PPeerListingScreen 
              onNavigate={navigate} 
              onBack={handleBack}
            />
          )}
          {currentScreen === 'p2p-peer-profile' && (
            <P2PPeerProfileScreen 
              onNavigate={navigate} 
              onBack={handleBack}
            />
          )}
          {currentScreen === 'p2p-request-meeting' && (
            <P2PRequestMeetingScreen onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'p2p-request-status' && (
            <P2PRequestStatusScreen onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'p2p-peer-payment' && (
            <P2PPeerPaymentScreen onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'p2p-meeting-confirmation' && (
            <P2PMeetingConfirmationScreen onNavigate={navigate} />
          )}
          {currentScreen === 'blind-date' && (
            <BlindDateScreen onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-landing' && (
            <BlindDateLanding onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-eligibility' && (
            <BlindDateEligibility onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-verify-phone' && (
            <BlindDateVerifyPhone onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-verify-email' && (
            <BlindDateVerifyEmail onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-verify-age' && (
            <BlindDateVerifyAge onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-verify-selfie' && (
            <BlindDateVerifySelfie onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-profile-setup' && (
            <BlindDateProfileSetup onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-availability-setup' && (
            <BlindDateAvailabilitySetup onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-payment' && (
            <BlindDatePayment onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-dashboard' && (
            <BlindDateDashboard onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-how-it-works' && (
            <BlindDateHowItWorks onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-payment-history' && (
            <BlindDatePaymentHistory onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-match-found' && (
            <BlindDateMatchFound onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'blind-date-meeting-scheduled' && (
            <BlindDateMeetingScheduled onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'provider-dashboard' && (
            <ProviderDashboardScreen onNavigate={navigate} onBack={handleBack} />
          )}
          {currentScreen === 'expert-dashboard' && (
            <ExpertDashboardScreen onNavigate={navigate} onBack={handleBack} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Placeholder components for remaining screens
function ExploreScreen({ onNavigate }: { onNavigate: (page: Screen) => void }) {
  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] p-8 pb-24 md:pb-8 md:pr-24">
      <h2 className="mb-4">Explore</h2>
      <p className="text-gray-600 dark:text-gray-400">Discover new people and connections</p>
    </div>
  );
}

function BookingsScreen({ onNavigate }: { onNavigate: (page: Screen) => void }) {
  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] p-8 pb-24 md:pb-8 md:pr-24">
      <h2 className="mb-4">My Bookings</h2>
      <p className="text-gray-600 dark:text-gray-400">View your upcoming and past bookings</p>
    </div>
  );
}

function AdminUsersScreen({ onNavigate, onBack }: { onNavigate: (page: Screen) => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] p-8 pb-24 md:pb-8 md:pr-24">
      <button onClick={onBack} className="mb-4 text-[#3C82F6] dark:text-[#3758FF] hover:underline">
        ← Back to Dashboard
      </button>
      <h2 className="mb-4">User Management</h2>
      <p className="text-gray-600 dark:text-gray-400">Manage all platform users</p>
    </div>
  );
}

function AdminVerificationScreen({ onNavigate, onBack }: { onNavigate: (page: Screen) => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] p-8 pb-24 md:pb-8 md:pr-24">
      <button onClick={onBack} className="mb-4 text-[#3C82F6] dark:text-[#3758FF] hover:underline">
        ← Back to Dashboard
      </button>
      <h2 className="mb-4">Verification Requests</h2>
      <p className="text-gray-600 dark:text-gray-400">Review and approve user verifications</p>
    </div>
  );
}

function AdminPaymentsScreen({ onNavigate, onBack }: { onNavigate: (page: Screen) => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] p-8 pb-24 md:pb-8 md:pr-24">
      <button onClick={onBack} className="mb-4 text-[#3C82F6] dark:text-[#3758FF] hover:underline">
        ← Back to Dashboard
      </button>
      <h2 className="mb-4">Payment Management</h2>
      <p className="text-gray-600 dark:text-gray-400">View all transactions and payments</p>
    </div>
  );
}

function AdminSettingsScreen({ onNavigate, onBack }: { onNavigate: (page: Screen) => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] p-8 pb-24 md:pb-8 md:pr-24">
      <button onClick={onBack} className="mb-4 text-[#3C82F6] dark:text-[#3758FF] hover:underline">
        ← Back to Dashboard
      </button>
      <h2 className="mb-4">Admin Settings</h2>
      <p className="text-gray-600 dark:text-gray-400">Configure platform settings</p>
    </div>
  );
}