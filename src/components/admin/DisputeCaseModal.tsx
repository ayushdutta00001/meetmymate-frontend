import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';

interface DisputeCase {
  id: string;
  bookingId: string;
  user1: { id: string; name: string };
  user2: { id: string; name: string };
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: string;
  createdDate: string;
  assignedTo: string;
  description: string;
}

interface DisputeCaseModalProps {
  disputeCase: DisputeCase;
  onClose: () => void;
}

export function DisputeCaseModal({ disputeCase, onClose }: DisputeCaseModalProps) {
  const [adminNotes, setAdminNotes] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [resolution, setResolution] = useState('');

  const handleResolve = () => {
    console.log('Case resolved:', disputeCase.id, 'Resolution:', resolution);
    setShowResolveModal(false);
    onClose();
  };

  const handleEscalate = () => {
    console.log('Case escalated:', disputeCase.id);
    setShowEscalateModal(false);
    onClose();
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      Low: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300',
      Medium: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-300',
      High: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300',
      Critical: 'bg-red-600 text-white border border-red-700',
    };
    return colors[severity as keyof typeof colors];
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#1A1F2E] z-10">
            <div>
              <h2 className="text-lg text-gray-900 dark:text-white">Dispute Investigation: {disputeCase.id}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{disputeCase.category}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Case Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Booking ID</p>
                <p className="text-sm font-mono text-gray-900 dark:text-white">{disputeCase.bookingId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Created Date</p>
                <p className="text-sm text-gray-900 dark:text-white">{disputeCase.createdDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Severity</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getSeverityColor(disputeCase.severity)}`}>
                  {disputeCase.severity}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Assigned To</p>
                <p className="text-sm text-gray-900 dark:text-white">{disputeCase.assignedTo}</p>
              </div>
            </div>

            {/* Parties Involved */}
            <div>
              <h3 className="text-sm text-gray-900 dark:text-white mb-3">Parties Involved</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">User 1</p>
                  <p className="text-sm text-gray-900 dark:text-white">{disputeCase.user1.name}</p>
                  <p className="text-xs text-gray-500">{disputeCase.user1.id}</p>
                  <button className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    View Profile
                  </button>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">User 2</p>
                  <p className="text-sm text-gray-900 dark:text-white">{disputeCase.user2.name}</p>
                  <p className="text-xs text-gray-500">{disputeCase.user2.id}</p>
                  <button className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    View Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm text-gray-900 dark:text-white mb-2">Case Description</h3>
              <div className="p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg border border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-700 dark:text-gray-300">{disputeCase.description}</p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-sm text-gray-900 dark:text-white mb-3">Investigation Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-800">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">Case opened by user</p>
                    <p className="text-xs text-gray-500">{disputeCase.createdDate} • 10:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-800">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">Assigned to {disputeCase.assignedTo}</p>
                    <p className="text-xs text-gray-500">{disputeCase.createdDate} • 11:15 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence Section */}
            <div>
              <h3 className="text-sm text-gray-900 dark:text-white mb-3">Evidence & Logs</h3>
              <div className="p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>• Booking confirmation timestamp: 2024-12-20 14:30</p>
                  <p>• Scheduled date/time: 2024-12-27 19:00</p>
                  <p>• GPS check-in: User 1 arrived at 18:55</p>
                  <p>• GPS check-in: User 2 - No record</p>
                  <p>• User 1 reported issue at: 19:45</p>
                </div>
              </div>
            </div>

            {/* Resolution Field */}
            <div>
              <h3 className="text-sm text-gray-900 dark:text-white mb-2">Resolution Decision</h3>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm mb-2"
              >
                <option value="">Select resolution...</option>
                <option value="refund_user1">Full refund to User 1</option>
                <option value="refund_partial">Partial refund to User 1</option>
                <option value="warning_user2">Warning to User 2</option>
                <option value="suspend_user2">Suspend User 2 account</option>
                <option value="no_action">No action required</option>
              </select>
            </div>

            {/* Admin Notes */}
            <div>
              <h3 className="text-sm text-gray-900 dark:text-white mb-2">Admin Notes (Internal)</h3>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm resize-none"
                rows={4}
                placeholder="Document investigation findings, evidence review, and decision rationale..."
              ></textarea>
            </div>

            {/* Warning */}
            <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-300 dark:border-orange-500/30 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  All decisions are logged in the audit trail and will be visible to compliance reviewers.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowResolveModal(true)}
                disabled={!resolution}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Resolved
              </button>
              <button
                onClick={() => setShowEscalateModal(true)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Escalate Case
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Save & Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {showResolveModal && (
        <ConfirmationModal
          title="Resolve Dispute Case"
          message={`Are you sure you want to mark case ${disputeCase.id} as resolved with decision: ${resolution}?`}
          consequence="This decision will be final and logged in the audit trail. The affected parties will be notified."
          confirmText="Confirm Resolution"
          confirmStyle="success"
          onConfirm={handleResolve}
          onCancel={() => setShowResolveModal(false)}
        />
      )}

      {showEscalateModal && (
        <ConfirmationModal
          title="Escalate Case"
          message={`Are you sure you want to escalate case ${disputeCase.id}?`}
          consequence="This case will be flagged as critical and assigned to senior management for review."
          confirmText="Escalate Case"
          confirmStyle="danger"
          onConfirm={handleEscalate}
          onCancel={() => setShowEscalateModal(false)}
        />
      )}
    </AnimatePresence>
  );
}
