import React, { useState, useEffect } from 'react';
import { NotificationProvider, useNotifications } from './NotificationContext';
import { AdminLayout } from './AdminLayout';
import { AdminDashboardMain } from './AdminDashboardMain';
import { AdminUsersIdentityControl } from './AdminUsersIdentityControl';
import { AdminAuditLogs } from './AdminAuditLogs';

// Provider Management Module
import { ProviderMgmtOverview } from './modules/ProviderMgmtOverview';
import { ProviderMgmtProviders } from './modules/ProviderMgmtProviders';
import { ProviderMgmtEarnings } from './modules/ProviderMgmtEarnings';
import { ProviderMgmtWithdrawals } from './modules/ProviderMgmtWithdrawals';
import { ProviderMgmtVerification } from './modules/ProviderMgmtVerification';

// RAF Operations Module
import { RafOverview } from './modules/RafOverview';
import { RafBookings } from './modules/RafBookings';
import { RafLiveBookings } from './modules/RafLiveBookings';
import { RafPayments } from './modules/RafPayments';
import { RafRefunds } from './modules/RafRefunds';
import { RafServices } from './modules/RafServices';
import { RafReports } from './modules/RafReports';
import { RafSettings } from './modules/RafSettings';



// Blind Date Module
import { BlindDateOperations } from './modules/BlindDateOperations';

import { BlindDateDisputes } from './modules/BlindDateDisputes';
import { BlindDateSettings } from './modules/BlindDateSettings';
import { BlindDateMatchArrange } from './modules/BlindDateMatchArrange';

// Business Meetup Module
import { BusinessMeetupOperations } from './modules/BusinessMeetupOperations';
import { BusinessMeetupPayments } from './modules/BusinessMeetupPayments';
import { BusinessMeetupDisputes } from './modules/BusinessMeetupDisputes';
import { BusinessMeetupSettings } from './modules/BusinessMeetupSettings';
import { BlindDateRefunds } from './modules/BlindDateRefunds';
// Internal Legal
import { AdminInternalLegal } from './AdminInternalLegal';

// P2P Matching Module
import { P2POverview } from './modules/P2POverview';
import { P2PRequests } from './modules/P2PRequests';
import { P2PMeetingScheduling } from './modules/P2PMeetingScheduling';
import { P2PMeetings } from './modules/P2PMeetings';
import { P2PPayments } from './modules/P2PPayments';
import { P2PRefunds } from './modules/P2PRefunds';
import { P2PSettings } from './modules/P2PSettings';

// Find Investor Module
import { FindInvestorOperations } from './modules/FindInvestorOperations';
import { FindInvestorPayments } from './modules/FindInvestorPayments';
import { FindInvestorDisputes } from './modules/FindInvestorDisputes';
import { FindInvestorSettings } from './modules/FindInvestorSettings';

// Communications Module
import { EmailLogs, Notifications, EmailTemplates, Automations } from './communications';

// Reviews & Ratings Module
import { AllReviews, FlaggedReviews, ReviewAnalytics } from './reviews';


interface AdminPortalProps {
  onLogout: () => void;
}

export function AdminPortal({ onLogout }: AdminPortalProps) {
  return (
    <NotificationProvider>
      <AdminPortalContent onLogout={onLogout} />
    </NotificationProvider>
  );
}

function AdminPortalContent({ onLogout }: AdminPortalProps) {
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [currentSubSection, setCurrentSubSection] = useState<string | undefined>(undefined);
const { selectedNotification } = useNotifications();
  const handleNavigate = (module: string, subSection?: string) => {
    setCurrentModule(module);
    setCurrentSubSection(subSection);
  };
useEffect(() => {
  if (!selectedNotification) return;

  switch (selectedNotification.section) {
    case "provider":
      handleNavigate("provider-management", "pm-verification");
      break;

    case "rent_friend":
      handleNavigate("raf-operations", "raf-bookings");
      break;

    case "blind_date":
      handleNavigate("blind-date", "match-arrange");
      break;

    case "p2p":
  if (selectedNotification.eventType === "p2p_meeting_ready") {
    handleNavigate("p2p-matching", "meeting-scheduling");
  } else {
    handleNavigate("p2p-matching", "overview");
  }
  break;

    default:
      break;
  }
}, [selectedNotification]);
  const renderContent = () => {
    // Dashboard
    if (currentModule === 'dashboard') {
      return <AdminDashboardMain />;
    }

    // Users & Identity Control
    if (currentModule === 'users') {
      return <AdminUsersIdentityControl />;
    }

    // Audit Logs
    if (currentModule === 'audit-logs') {
      return <AdminAuditLogs />;
    }

    // RAF Operations Module
    if (currentModule === 'raf-operations') {
      if (currentSubSection === 'raf-overview') return <RafOverview />;
      if (currentSubSection === 'raf-bookings') return <RafBookings />;
      if (currentSubSection === 'raf-live') return <RafLiveBookings />;
      if (currentSubSection === 'raf-payments') return <RafPayments />;
      if (currentSubSection === 'raf-refunds') return <RafRefunds />;
      if (currentSubSection === 'raf-services') return <RafServices />;
      if (currentSubSection === 'raf-reports') return <RafReports />;
      if (currentSubSection === 'raf-settings') return <RafSettings />;
      return <RafOverview />; // Default
    }

    // Provider Management Module
    if (currentModule === 'provider-management') {
      if (currentSubSection === 'pm-overview') return <ProviderMgmtOverview />;
      if (currentSubSection === 'pm-providers') return <ProviderMgmtProviders />;
      if (currentSubSection === 'pm-earnings') return <ProviderMgmtEarnings />;
      if (currentSubSection === 'pm-withdrawals') return <ProviderMgmtWithdrawals />;
      if (currentSubSection === 'pm-verification') return <ProviderMgmtVerification />;
      return <ProviderMgmtOverview />;
    }

    

    // Blind Date Module
   if (currentModule === 'blind-date') {
  if (currentSubSection === 'match-arrange') return <BlindDateMatchArrange />;
  if (currentSubSection === 'operations') return <BlindDateOperations />;
 
  if (currentSubSection === 'refunds') return <BlindDateRefunds />;
  if (currentSubSection === 'disputes') return <BlindDateDisputes />;
  if (currentSubSection === 'settings') return <BlindDateSettings />;

  return <BlindDateMatchArrange />;
}

    // Business Meetup Module
    if (currentModule === 'business-meetup') {
      if (currentSubSection === 'operations') return <BusinessMeetupOperations />;
      if (currentSubSection === 'payments') return <BusinessMeetupPayments />;
      if (currentSubSection === 'disputes') return <BusinessMeetupDisputes />;
      if (currentSubSection === 'settings') return <BusinessMeetupSettings />;
      return <BusinessMeetupOperations />; // Default
    }

    // Internal Legal
    if (currentModule === 'internal-legal') {
      return <AdminInternalLegal />;
    }

    // P2P Matching Module
    if (currentModule === 'p2p-matching') {
  if (currentSubSection === 'overview') return <P2POverview />;
  if (currentSubSection === 'requests') return <P2PRequests />;
  if (currentSubSection === 'meeting-scheduling') return <P2PMeetingScheduling />;
  if (currentSubSection === 'meetings') return <P2PMeetings />;
  if (currentSubSection === 'payments') return <P2PPayments />;
  if (currentSubSection === 'refunds') return <P2PRefunds />;
  if (currentSubSection === 'settings') return <P2PSettings />;
  return <P2POverview />;
}

    // Find Investor Module
    if (currentModule === 'find-investor') {
      if (currentSubSection === 'operations') return <FindInvestorOperations />;
      if (currentSubSection === 'payments') return <FindInvestorPayments />;
      if (currentSubSection === 'disputes') return <FindInvestorDisputes />;
      if (currentSubSection === 'settings') return <FindInvestorSettings />;
      return <FindInvestorOperations />; // Default
    }

    // Communications Module
    if (currentModule === 'communications') {
      if (currentSubSection === 'email-logs') return <EmailLogs />;
      if (currentSubSection === 'notifications') return <Notifications onNavigate={function (screen: any): void {
        throw new Error('Function not implemented.');
      } } />;
      if (currentSubSection === 'email-templates') return <EmailTemplates />;
      if (currentSubSection === 'automations') return <Automations />;
      return <EmailLogs />; // Default
    }

    // Reviews & Ratings Module
    if (currentModule === 'reviews') {
      if (currentSubSection === 'all-reviews') return <AllReviews />;
      if (currentSubSection === 'flagged-reviews') return <FlaggedReviews />;
      if (currentSubSection === 'review-analytics') return <ReviewAnalytics />;
      return <AllReviews />; // Default
    }

    return <AdminDashboardMain />;
  };

return (
  <AdminLayout
    currentModule={currentModule}
    currentSubSection={currentSubSection}
    onNavigate={handleNavigate}
    onLogout={onLogout}
  >
    {renderContent()}
  </AdminLayout>
);
}
