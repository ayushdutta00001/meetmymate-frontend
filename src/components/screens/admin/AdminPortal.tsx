import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { AdminDashboardMain } from './AdminDashboardMain';
import { AdminUsersIdentityControl } from './AdminUsersIdentityControl';
import { AdminAuditLogs } from './AdminAuditLogs';

// Rent-a-Friend Module
import { RentFriendOperations } from './modules/RentFriendOperations';
import { RentFriendPayments } from './modules/RentFriendPayments';
import { RentFriendDisputes } from './modules/RentFriendDisputes';
import { RentFriendSettings } from './modules/RentFriendSettings';

// Blind Date Module
import { BlindDateOperations } from './modules/BlindDateOperations';
import { BlindDatePayments } from './modules/BlindDatePayments';
import { BlindDateDisputes } from './modules/BlindDateDisputes';
import { BlindDateSettings } from './modules/BlindDateSettings';

// Business Meetup Module
import { BusinessMeetupOperations } from './modules/BusinessMeetupOperations';
import { BusinessMeetupPayments } from './modules/BusinessMeetupPayments';
import { BusinessMeetupDisputes } from './modules/BusinessMeetupDisputes';
import { BusinessMeetupSettings } from './modules/BusinessMeetupSettings';

// Internal Legal
import { AdminInternalLegal } from './AdminInternalLegal';

// P2P Match Module
import { P2PMatchOperations } from './modules/P2PMatchOperations';
import { P2PMatchPayments } from './modules/P2PMatchPayments';
import { P2PMatchDisputes } from './modules/P2PMatchDisputes';
import { P2PMatchSettings } from './modules/P2PMatchSettings';

// Find Investor Module
import { FindInvestorOperations } from './modules/FindInvestorOperations';
import { FindInvestorPayments } from './modules/FindInvestorPayments';
import { FindInvestorDisputes } from './modules/FindInvestorDisputes';
import { FindInvestorSettings } from './modules/FindInvestorSettings';

// Find Experienced People Module
import { FindExperiencedOperations } from './modules/FindExperiencedOperations';
import { FindExperiencedPayments } from './modules/FindExperiencedPayments';
import { FindExperiencedDisputes } from './modules/FindExperiencedDisputes';
import { FindExperiencedSettings } from './modules/FindExperiencedSettings';

// Communications Module
import { EmailLogs, Notifications, EmailTemplates, Automations } from './communications';

// Reviews & Ratings Module
import { AllReviews, FlaggedReviews, ReviewAnalytics } from './reviews';

interface AdminPortalProps {
  onLogout: () => void;
}

export function AdminPortal({ onLogout }: AdminPortalProps) {
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [currentSubSection, setCurrentSubSection] = useState<string | undefined>(undefined);

  const handleNavigate = (module: string, subSection?: string) => {
    setCurrentModule(module);
    setCurrentSubSection(subSection);
  };

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

    // Rent-a-Friend Module
    if (currentModule === 'rent-friend') {
      if (currentSubSection === 'operations') return <RentFriendOperations />;
      if (currentSubSection === 'payments') return <RentFriendPayments />;
      if (currentSubSection === 'disputes') return <RentFriendDisputes />;
      if (currentSubSection === 'settings') return <RentFriendSettings />;
      return <RentFriendOperations />; // Default
    }

    // Blind Date Module (reusing Rent-a-Friend structure with different data)
    if (currentModule === 'blind-date') {
      if (currentSubSection === 'operations') return <BlindDateOperations />;
      if (currentSubSection === 'payments') return <BlindDatePayments />;
      if (currentSubSection === 'disputes') return <BlindDateDisputes />;
      if (currentSubSection === 'settings') return <BlindDateSettings />;
      return <BlindDateOperations />; // Default
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

    // P2P Match Module
    if (currentModule === 'p2p-match') {
      if (currentSubSection === 'operations') return <P2PMatchOperations />;
      if (currentSubSection === 'payments') return <P2PMatchPayments />;
      if (currentSubSection === 'disputes') return <P2PMatchDisputes />;
      if (currentSubSection === 'settings') return <P2PMatchSettings />;
      return <P2PMatchOperations />; // Default
    }

    // Find Investor Module
    if (currentModule === 'find-investor') {
      if (currentSubSection === 'operations') return <FindInvestorOperations />;
      if (currentSubSection === 'payments') return <FindInvestorPayments />;
      if (currentSubSection === 'disputes') return <FindInvestorDisputes />;
      if (currentSubSection === 'settings') return <FindInvestorSettings />;
      return <FindInvestorOperations />; // Default
    }

    // Find Experienced People Module
    if (currentModule === 'find-experienced') {
      if (currentSubSection === 'operations') return <FindExperiencedOperations />;
      if (currentSubSection === 'payments') return <FindExperiencedPayments />;
      if (currentSubSection === 'disputes') return <FindExperiencedDisputes />;
      if (currentSubSection === 'settings') return <FindExperiencedSettings />;
      return <FindExperiencedOperations />; // Default
    }

    // Communications Module
    if (currentModule === 'communications') {
      if (currentSubSection === 'email-logs') return <EmailLogs />;
      if (currentSubSection === 'notifications') return <Notifications />;
      if (currentSubSection === 'email-templates') return <EmailTemplates />;
      if (currentSubSection === 'automations') return <Automations />;
      return <EmailLogs />; // Default
    }

    // Reviews & Ratings Module
    if (currentModule === 'reviews') {
      if (currentSubSection === 'all-reviews') return <AllReviews />;
      if (currentSubSection === 'flagged-reviews') return <FlaggedReviews />;
      if (currentSubSection === 'analytics') return <ReviewAnalytics />;
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