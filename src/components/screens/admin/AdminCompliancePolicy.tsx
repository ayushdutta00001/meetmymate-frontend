import React from 'react';
import { Shield, Lock, AlertTriangle, FileText, Calendar } from 'lucide-react';

export function AdminCompliancePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
          <h1 className="text-2xl text-gray-900 dark:text-white">Internal Legal & Operations Policies</h1>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Compliance documentation and operational guidelines</p>
        
        {/* Internal Use Notice */}
        <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg">
          <Lock className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-900 dark:text-white mb-1">
              <strong>INTERNAL USE ONLY</strong>
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300">
              This documentation is strictly confidential and for authorized administrators only. Unauthorized access, distribution, or disclosure is prohibited.
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Current Version */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-900 dark:text-white">Current Policy Version</h2>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-sm border border-green-300 dark:border-green-500/30">
              v3.2.1 (Active)
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Last Updated</p>
              <p className="text-sm text-gray-900 dark:text-white">December 15, 2024</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Updated By</p>
              <p className="text-sm text-gray-900 dark:text-white">Legal Compliance Team</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Next Review</p>
              <p className="text-sm text-gray-900 dark:text-white">March 15, 2025</p>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg text-gray-900 dark:text-white">Policy Documentation</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            <PolicySection
              title="Data Protection & Privacy Compliance"
              description="GDPR, CCPA, and local data protection regulations"
              status="Current"
              lastReview="Dec 15, 2024"
            />
            <PolicySection
              title="User Safety & Verification Standards"
              description="ID verification, background checks, and safety protocols"
              status="Current"
              lastReview="Dec 10, 2024"
            />
            <PolicySection
              title="Financial Operations & Anti-Money Laundering"
              description="Payment processing, payout policies, and AML compliance"
              status="Current"
              lastReview="Dec 1, 2024"
            />
            <PolicySection
              title="Dispute Resolution Procedures"
              description="Internal escalation paths and resolution guidelines"
              status="Current"
              lastReview="Nov 25, 2024"
            />
            <PolicySection
              title="Content Moderation & Community Standards"
              description="User-generated content policies and enforcement"
              status="Current"
              lastReview="Nov 20, 2024"
            />
            <PolicySection
              title="Admin Access Control & Audit Requirements"
              description="Role-based access, logging, and security standards"
              status="Current"
              lastReview="Dec 5, 2024"
            />
          </div>
        </div>

        {/* Version History */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg text-gray-900 dark:text-white">Version History</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <VersionEntry
                version="v3.2.1"
                date="Dec 15, 2024"
                changes="Updated GDPR compliance requirements, enhanced verification standards"
                status="Current"
              />
              <VersionEntry
                version="v3.2.0"
                date="Nov 1, 2024"
                changes="Added new dispute resolution procedures, updated AML policies"
                status="Archived"
              />
              <VersionEntry
                version="v3.1.5"
                date="Oct 15, 2024"
                changes="Enhanced data protection measures, updated content moderation guidelines"
                status="Archived"
              />
            </div>
          </div>
        </div>

        {/* Access Restrictions */}
        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-300 dark:border-orange-500/30 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-900 dark:text-white mb-2">
                <strong>Access Restrictions</strong>
              </p>
              <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                <li>✓ Access limited to verified administrators with appropriate clearance levels</li>
                <li>✓ All document views are logged in the audit trail</li>
                <li>✓ Downloads require additional authentication</li>
                <li>✓ Sharing external to the organization is strictly prohibited</li>
                <li>✓ Physical and digital copies must be stored in secure environments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PolicySection({ title, description, status, lastReview }: {
  title: string;
  description: string;
  status: string;
  lastReview: string;
}) {
  return (
    <div className="p-6 hover:bg-gray-50 dark:hover:bg-[#0A0F1F] transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm text-gray-900 dark:text-white">{title}</h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 ml-8">{description}</p>
          <div className="flex items-center gap-3 ml-8 mt-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>Last reviewed: {lastReview}</span>
            </div>
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded text-xs">
              {status}
            </span>
          </div>
        </div>
        <button className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-500/20">
          View Document
        </button>
      </div>
    </div>
  );
}

function VersionEntry({ version, date, changes, status }: {
  version: string;
  date: string;
  changes: string;
  status: string;
}) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-800 last:border-0">
      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm text-gray-900 dark:text-white">{version}</span>
          <span className="text-xs text-gray-500">{date}</span>
          {status === 'Current' && (
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded text-xs">
              Current
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{changes}</p>
      </div>
    </div>
  );
}
