import React, { useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { AdminDashboardMain } from './AdminDashboardMain';
import { AdminUsersIdentityControl } from './AdminUsersIdentityControl';
import { AdminAuditLogs } from './AdminAuditLogs';

import { useAuth } from '../../../lib/auth-context';
import { isAdminUser } from '../../../lib/admin-auth';


// Rent-a-Friend
import { RentFriendOperations } from './modules/RentFriendOperations';
import { RentFriendPayments } from './modules/RentFriendPayments';
import { RentFriendDisputes } from './modules/RentFriendDisputes';
import { RentFriendSettings } from './modules/RentFriendSettings';

// Blind Date
import { BlindDateOperations } from './modules/BlindDateOperations';
import { BlindDatePayments } from './modules/BlindDatePayments';
import { BlindDateDisputes } from './modules/BlindDateDisputes';
import { BlindDateSettings } from './modules/BlindDateSettings';

// Business Meetup
import { BusinessMeetupOperations } from './modules/BusinessMeetupOperations';
import { BusinessMeetupPayments } from './modules/BusinessMeetupPayments';
import { BusinessMeetupDisputes } from './modules/BusinessMeetupDisputes';
import { BusinessMeetupSettings } from './modules/BusinessMeetupSettings';

// P2P
import { P2PMatchOperations } from './modules/P2PMatchOperations';
import { P2PMatchPayments } from './modules/P2PMatchPayments';
import { P2PMatchDisputes } from './modules/P2PMatchDisputes';
import { P2PMatchSettings } from './modules/P2PMatchSettings';

// Investor
import { FindInvestorOperations } from './modules/FindInvestorOperations';
import { FindInvestorPayments } from './modules/FindInvestorPayments';
import { FindInvestorDisputes } from './modules/FindInvestorDisputes';
import { FindInvestorSettings } from './modules/FindInvestorSettings';

// Experienced
import { FindExperiencedOperations } from './modules/FindExperiencedOperations';
import { FindExperiencedPayments } from './modules/FindExperiencedPayments';
import { FindExperiencedDisputes } from './modules/FindExperiencedDisputes';
import { FindExperiencedSettings } from './modules/FindExperiencedSettings';

// Communications
import { EmailLogs, Notifications, EmailTemplates, Automations } from './communications';

// Reviews
import { AllReviews, FlaggedReviews, ReviewAnalytics } from './reviews';

interface AdminPortalProps {
  onLogout: () => void;
}

export function AdminPortal({ onLogout }: AdminPortalProps) {
  const { user, loading } = useAuth();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [currentSubSection, setCurrentSubSection] = useState<string>();

  useEffect(() => {
    if (!loading && user) {
      isAdminUser(user.id).then(setAuthorized);
    }
    if (!loading && !user) {
      setAuthorized(false);
    }
  }, [user, loading]);

  if (authorized === null) {
    return <div className="p-6">Checking admin access…</div>;
  }

  if (authorized === false) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Access Denied</h2>
        <p>You are not authorized to access the Admin Portal.</p>
      </div>
    );
  }

  const handleNavigate = (module: string, sub?: string) => {
    setCurrentModule(module);
    setCurrentSubSection(sub);
  };

  const renderContent = () => {
    if (currentModule === 'dashboard') return <AdminDashboardMain />;
    if (currentModule === 'users') return <AdminUsersIdentityControl />;
    if (currentModule === 'audit-logs') return <AdminAuditLogs />;

    if (currentModule === 'rent-friend') {
      if (currentSubSection === 'payments') return <RentFriendPayments />;
      if (currentSubSection === 'disputes') return <RentFriendDisputes />;
      if (currentSubSection === 'settings') return <RentFriendSettings />;
      return <RentFriendOperations />;
    }

    if (currentModule === 'blind-date') {
      if (currentSubSection === 'payments') return <BlindDatePayments />;
      if (currentSubSection === 'disputes') return <BlindDateDisputes />;
      if (currentSubSection === 'settings') return <BlindDateSettings />;
      return <BlindDateOperations />;
    }

    if (currentModule === 'business-meetup') {
      if (currentSubSection === 'payments') return <BusinessMeetupPayments />;
      if (currentSubSection === 'disputes') return <BusinessMeetupDisputes />;
      if (currentSubSection === 'settings') return <BusinessMeetupSettings />;
      return <BusinessMeetupOperations />;
    }

    if (currentModule === 'p2p-match') {
      if (currentSubSection === 'payments') return <P2PMatchPayments />;
      if (currentSubSection === 'disputes') return <P2PMatchDisputes />;
      if (currentSubSection === 'settings') return <P2PMatchSettings />;
      return <P2PMatchOperations />;
    }

    if (currentModule === 'find-investor') {
      if (currentSubSection === 'payments') return <FindInvestorPayments />;
      if (currentSubSection === 'disputes') return <FindInvestorDisputes />;
      if (currentSubSection === 'settings') return <FindInvestorSettings />;
      return <FindInvestorOperations />;
    }

    if (currentModule === 'find-experienced') {
      if (currentSubSection === 'payments') return <FindExperiencedPayments />;
      if (currentSubSection === 'disputes') return <FindExperiencedDisputes />;
      if (currentSubSection === 'settings') return <FindExperiencedSettings />;
      return <FindExperiencedOperations />;
    }

    if (currentModule === 'communications') {
      if (currentSubSection === 'notifications') return <Notifications />;
      if (currentSubSection === 'email-templates') return <EmailTemplates />;
      if (currentSubSection === 'automations') return <Automations />;
      return <EmailLogs />;
    }

    if (currentModule === 'reviews') {
      if (currentSubSection === 'flagged') return <FlaggedReviews />;
      if (currentSubSection === 'analytics') return <ReviewAnalytics />;
      return <AllReviews />;
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
