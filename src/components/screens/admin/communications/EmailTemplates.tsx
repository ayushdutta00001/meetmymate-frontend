import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit, X, Eye, Save } from 'lucide-react';

interface EmailTemplate {
  id: string;
  templateKey: string;
  subject: string;
  htmlBody: string;
  lastUpdated: string;
}

export function EmailTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editHtmlBody, setEditHtmlBody] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Mock data
  const templates: EmailTemplate[] = [
    {
      id: 'TPL-001',
      templateKey: 'booking_confirmation',
      subject: 'Your Booking is Confirmed - Meet my Mate',
      htmlBody: `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3B82F6;">Booking Confirmed!</h1>
            <p>Hi {{name}},</p>
            <p>Your booking has been confirmed for {{meeting_time}}.</p>
            <p>Meeting details:</p>
            <ul>
              <li>Provider: {{provider_name}}</li>
              <li>Date: {{meeting_date}}</li>
              <li>Location: {{meeting_location}}</li>
            </ul>
            <p>Thank you for using Meet my Mate!</p>
          </body>
        </html>
      `,
      lastUpdated: '2026-01-05'
    },
    {
      id: 'TPL-002',
      templateKey: 'welcome_email',
      subject: 'Welcome to Meet my Mate!',
      htmlBody: `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3B82F6;">Welcome, {{name}}!</h1>
            <p>Thanks for joining Meet my Mate.</p>
            <p>We're excited to have you in our community.</p>
            <p>Get started by exploring our services and finding the perfect match for your needs.</p>
          </body>
        </html>
      `,
      lastUpdated: '2026-01-04'
    },
    {
      id: 'TPL-003',
      templateKey: 'payment_receipt',
      subject: 'Payment Receipt - Order {{order_id}}',
      htmlBody: `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3B82F6;">Payment Received</h1>
            <p>Hi {{name}},</p>
            <p>We've received your payment of {{amount}}.</p>
            <p>Order ID: {{order_id}}</p>
            <p>Transaction ID: {{transaction_id}}</p>
            <p>Thank you for your payment!</p>
          </body>
        </html>
      `,
      lastUpdated: '2026-01-03'
    },
    {
      id: 'TPL-004',
      templateKey: 'booking_reminder',
      subject: 'Reminder: Your Meeting is Tomorrow',
      htmlBody: `
        <html>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3B82F6;">Meeting Reminder</h1>
            <p>Hi {{name}},</p>
            <p>This is a friendly reminder about your upcoming meeting:</p>
            <p><strong>Tomorrow at {{meeting_time}}</strong></p>
            <p>Location: {{meeting_location}}</p>
            <p>See you there!</p>
          </body>
        </html>
      `,
      lastUpdated: '2026-01-02'
    },
  ];

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditSubject(template.subject);
    setEditHtmlBody(template.htmlBody);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving template:', {
      templateKey: selectedTemplate?.templateKey,
      subject: editSubject,
      htmlBody: editHtmlBody
    });
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const handleClose = () => {
    setIsEditing(false);
    setSelectedTemplate(null);
    setShowPreview(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 dark:text-white mb-2">Email Templates</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage transactional email content</p>
      </div>

      {/* Main Data Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Template Key
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {templates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300">
                      {template.templateKey}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {template.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {template.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(template)}
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && selectedTemplate && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#1A1F2E] rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                  <div>
                    <h3 className="text-xl text-gray-900 dark:text-white mb-1">Edit Email Template</h3>
                    <code className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedTemplate.templateKey}
                    </code>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Subject Input */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      placeholder="Email subject line"
                    />
                  </div>

                  {/* HTML Body Editor */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      HTML Body
                    </label>
                    <textarea
                      value={editHtmlBody}
                      onChange={(e) => setEditHtmlBody(e.target.value)}
                      rows={12}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-mono resize-none"
                      placeholder="<html>...</html>"
                    />
                  </div>

                  {/* Helper Note */}
                  <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>💡 Tip:</strong> Variables like <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-500/20 rounded text-xs">{'{{name}}'}</code> and <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-500/20 rounded text-xs">{'{{meeting_time}}'}</code> will auto-fill in emails.
                    </p>
                  </div>

                  {/* Preview */}
                  {showPreview && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Preview
                      </label>
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-[#0A0F1F]">
                        <div
                          className="prose prose-sm dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: editHtmlBody }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex items-center gap-3">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Template
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
