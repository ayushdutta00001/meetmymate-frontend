import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, AlertTriangle, FileText, Lock, Users, CreditCard, Ban, Scale, Globe } from 'lucide-react';
import { Logo } from '../Logo';

interface TermsDetailScreenProps {
  onBack: () => void;
}

export function TermsDetailScreen({ onBack }: TermsDetailScreenProps) {
  const sections = [
    {
      icon: FileText,
      title: '1. Acceptance of Terms',
      content: `By accessing and using Meet My Mate ("the Platform"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Platform. We reserve the right to modify these terms at any time, and your continued use of the Platform constitutes acceptance of any modifications.`
    },
    {
      icon: Shield,
      title: '2. Age Requirements & User Eligibility',
      content: `You must be at least 18 years of age to use this Platform. By registering, you represent and warrant that you are of legal age. All users must complete identity verification before accessing premium features. False information provided during registration will result in immediate account termination.`
    },
    {
      icon: Users,
      title: '3. User Conduct & Community Guidelines',
      content: `Users must maintain respectful and appropriate conduct at all times. Prohibited behaviors include: harassment, discrimination, hate speech, sexual misconduct, solicitation for illegal activities, impersonation, spamming, and sharing of explicit content. Violations will result in warnings, temporary suspension, or permanent account termination depending on severity.`
    },
    {
      icon: Lock,
      title: '4. Privacy & Data Protection',
      content: `We take your privacy seriously. Personal information is collected, stored, and processed in accordance with applicable data protection laws. We will never share your personal information with third parties without your explicit consent, except as required by law. Users are responsible for maintaining the confidentiality of their account credentials.`
    },
    {
      icon: AlertTriangle,
      title: '5. Safety Guidelines',
      content: `Always meet in public places for first meetings. Inform a friend or family member of your plans. Never share financial information, passwords, or sensitive personal data with other users. Use in-app messaging initially before sharing personal contact information. Report any suspicious behavior immediately through our reporting system.`
    },
    {
      icon: CreditCard,
      title: '6. Payment Terms',
      content: `Fees for services are clearly stated before purchase. All payments are processed securely through our approved payment processors. Refunds are available within 24 hours of booking cancellation, subject to our cancellation policy. Users agree to pay all fees associated with their account. Failure to pay may result in service suspension.`
    },
    {
      icon: Ban,
      title: '7. Prohibited Activities',
      content: `The following activities are strictly prohibited: commercial solicitation without authorization, promotion of illegal activities, creation of fake accounts or bot activity, scraping or unauthorized data collection, circumvention of security measures, resale of accounts or services, and use of the Platform for any unlawful purpose.`
    },
    {
      icon: Scale,
      title: '8. Liability & Disclaimers',
      content: `Meet My Mate is a platform connecting individuals for social purposes. We are not responsible for interactions, meetings, or transactions that occur off-platform. Users assume all risks associated with in-person meetings. The Platform is provided "as is" without warranties of any kind. We are not liable for any damages arising from use of the Platform.`
    },
    {
      icon: Users,
      title: '9. User-Generated Content',
      content: `Users retain ownership of their profile content but grant Meet My Mate a license to use, display, and distribute such content on the Platform. You represent that you have all necessary rights to the content you post. We reserve the right to remove any content that violates these terms or is otherwise objectionable.`
    },
    {
      icon: Globe,
      title: '10. Intellectual Property',
      content: `All Platform content, including logos, designs, text, graphics, and software, is the property of Meet My Mate or its licensors. Users may not copy, modify, distribute, or create derivative works without explicit written permission. Unauthorized use may result in legal action.`
    },
    {
      icon: AlertTriangle,
      title: '11. Account Termination',
      content: `We reserve the right to suspend or terminate accounts at our discretion for violations of these terms, suspicious activity, or fraudulent behavior. Users may terminate their accounts at any time through account settings. Upon termination, access to the Platform will be revoked immediately.`
    },
    {
      icon: Scale,
      title: '12. Dispute Resolution',
      content: `Any disputes arising from use of the Platform shall be resolved through binding arbitration. Users agree to first attempt resolution through our customer support before pursuing legal action. The laws of the jurisdiction where Meet My Mate is registered shall govern these terms.`
    },
    {
      icon: Shield,
      title: '13. Verification & Background Checks',
      content: `While we implement verification procedures, we do not conduct comprehensive background checks. Users are responsible for their own safety and due diligence. Verification badges indicate identity confirmation only and do not guarantee trustworthiness or safety.`
    },
    {
      icon: FileText,
      title: '14. Booking & Cancellation Policy',
      content: `Bookings are confirmed upon payment. Cancellations made 24+ hours before the scheduled meeting are eligible for full refund. Cancellations within 24 hours may incur fees. No-shows without notice will result in no refund. Repeated cancellations may lead to account restrictions.`
    },
    {
      icon: Lock,
      title: '15. Data Security Notice',
      content: `Meet My Mate is NOT designed for collecting highly sensitive PII (Personally Identifiable Information) or securing sensitive data. Do not share financial account details, social security numbers, passwords, or other highly confidential information through this Platform. We cannot guarantee absolute security of transmitted data.`
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#3C82F6] dark:text-[#3758FF] hover:underline mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex flex-col items-center mb-6">
            <Logo size="medium" />
          </div>
          
          <h1 className="text-center mb-2">Complete Terms & Conditions</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Last Updated: December 9, 2025
          </p>
        </motion.div>

        {/* Important Notice Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-3xl border-2 border-yellow-500 dark:border-yellow-600"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-700 dark:text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-yellow-800 dark:text-yellow-300 mb-2">
                Legal Agreement - Please Read Carefully
              </h3>
              <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                These Terms and Conditions constitute a legally binding agreement between you and Meet My Mate. 
                By using our Platform, you acknowledge that you have read, understood, and agree to be bound by all terms outlined below.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass dark:glass-dark rounded-3xl p-6 md:p-8"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-3">{section.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Legal Notices */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-4"
        >
          <div className="glass dark:glass-dark rounded-3xl p-6">
            <h3 className="mb-3">16. Contact Information</h3>
            <p className="text-gray-700 dark:text-gray-300">
              For questions regarding these Terms and Conditions, please contact us at:
              <br />
              Email: legal@meetmymate.com
              <br />
              Support: support@meetmymate.com
            </p>
          </div>

          <div className="glass dark:glass-dark rounded-3xl p-6">
            <h3 className="mb-3">17. Severability</h3>
            <p className="text-gray-700 dark:text-gray-300">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited 
              or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
            </p>
          </div>

          <div className="glass dark:glass-dark rounded-3xl p-6">
            <h3 className="mb-3">18. Entire Agreement</h3>
            <p className="text-gray-700 dark:text-gray-300">
              These Terms and Conditions, along with our Privacy Policy and Community Guidelines, constitute the entire 
              agreement between you and Meet My Mate regarding the use of the Platform.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center pb-8"
        >
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">
            © 2025 Meet My Mate. All rights reserved.
          </p>
          <button
            onClick={onBack}
            className="text-[#3C82F6] dark:text-[#3758FF] hover:underline"
          >
            Return to Previous Page
          </button>
        </motion.div>
      </div>
    </div>
  );
}
