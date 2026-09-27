import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  FileText,
  Lock,
  Users,
  CreditCard,
  Ban,
  Scale,
} from 'lucide-react';
import { Logo } from '../Logo';

interface TermsDetailScreenProps {
  onBack: () => void;
}

export function TermsDetailScreen({ onBack }: TermsDetailScreenProps) {
  const sections = [
    {
      icon: FileText,
      title: '1. Acceptance of Terms',
      content:
        'By accessing or using Meet My Mate in ("the Platform"), you agree to these Terms & Conditions. If you do not agree with these terms, you should not use the Platform. We may update these terms from time to time, and the updated version will apply from the date it is posted or otherwise made available to users.',
    },

    {
      icon: Shield,
      title: '2. Age Requirements & Eligibility',
      content:
        'You must be at least 18 years old to use Meet My Mate in. By registering or using the Platform, you confirm that the information you provide is accurate and that you are legally eligible to use the service. We may require identity or age verification where necessary for safety, service access, or legal compliance.',
    },

    {
      icon: Users,
      title: '3. Our Current Services',
      content:
        'Meet My Mate in currently provides two services: (1) Blind Mate, which is an arranged offline meeting experience between participants, and (2) PartnerUp, which facilitates offline professional or collaborative meetings between participants. No other service is covered by these Terms unless expressly added to the Platform in the future.',
    },

    {
      icon: Users,
      title: '4. Blind Mate',
      content:
        'Blind Mate is an offline meeting arrangement service. A user provides the required preferences and booking information, completes the applicable payment, and waits for the service to arrange an appropriate meeting. When the service flow requires it, relevant contact details may be shared with the matched participant so the meeting can be coordinated or attended.',
    },

    {
      icon: Users,
      title: '5. PartnerUp',
      content:
        'PartnerUp is an offline professional and collaborative meeting service. Users may create a profile containing relevant professional or collaboration information. When participants connect and the applicable service conditions are completed, relevant profile information and contact details may be shared between participants as required to arrange the meeting.',
    },

    {
      icon: AlertTriangle,
      title: '6. No Guaranteed Match or Outcome',
      content:
        'Meet My Mate in does not guarantee that a user will be matched with a person they consider suitable, nor does it guarantee any particular outcome from a meeting. We do not guarantee friendship, dating, romance, compatibility, chemistry, business cooperation, partnership, co-founder relationships, mentorship, investment, employment, or any other personal or professional relationship or result. Our role is limited to providing the applicable meeting arrangement or facilitation service.',
    },

    {
      icon: Lock,
      title: '7. Information Sharing for Meeting Arrangements',
      content:
        'Because our services involve real-world meetings, certain information must be shared between participants to enable those meetings to take place. For Blind Mate, contact details may be shared with the matched participant when required by the service flow. For PartnerUp, relevant profile information and contact details may be shared with the other participant when required to arrange the meeting. Users should provide only accurate information that they are authorized to share.',
    },

    {
      icon: Shield,
      title: '8. User Safety',
      content:
        'Users are responsible for taking reasonable precautions before and during any offline meeting. Meet in appropriate public or agreed locations, remain aware of your surroundings, and seek help when necessary. You should not share passwords, payment credentials, financial account information, or other unnecessary sensitive information with another participant.',
    },

    {
      icon: Ban,
      title: '9. Prohibited Conduct',
      content:
        'Users must not use the Platform for harassment, threats, fraud, impersonation, discrimination, sexual misconduct, unlawful activity, malicious activity, spam, unauthorized data collection, or conduct that creates a safety risk for another person. We may restrict, suspend, or terminate accounts where we reasonably believe these terms have been violated.',
    },

    {
      icon: CreditCard,
      title: '10. Payment Terms',
      content:
        'Applicable service prices are displayed before payment. Payments are processed through our payment provider. You are responsible for providing accurate payment and booking information. Payment status, order information, transaction references, and refund information may be processed as necessary to operate the service.',
    },

    {
      icon: CreditCard,
      title: '11. Blind Mate Refund Condition',
      content:
        'For Blind Mate, the applicable booking flow provides for a full refund when the service does not arrange a match within the stated 24-hour matching period, subject to successful payment verification and the conditions shown in the applicable booking flow. The service fee and refund conditions displayed at the time of booking form part of the applicable service terms.',
    },

    {
      icon: Scale,
      title: '12. Offline Meetings & Responsibility',
      content:
        'Meet My Mate in arranges or facilitates the meeting but does not control what participants say, do, decide, or agree to during or after the meeting. Users remain responsible for their own conduct and decisions. We are not responsible for whether participants choose to date, become friends, continue communicating, work together, form a business relationship, or have any other relationship or outcome after meeting.',
    },

    {
      icon: Lock,
      title: '13. Privacy & Data Protection',
      content:
        'We collect and process information needed to create accounts, operate the Platform, arrange meetings, process payments, provide support, maintain safety, and comply with applicable requirements. Information may be shared with meeting participants when necessary under the applicable service flow. Additional details about personal-data handling are provided in our Privacy Policy.',
    },

    {
      icon: FileText,
      title: '14. User Information & Accuracy',
      content:
        'You are responsible for ensuring that the information you provide to Meet My Mate in is accurate, current, and not misleading. This includes account details, profile information, preferences, contact information, and meeting-related information. Providing false or deceptive information may result in service restrictions or account termination.',
    },

    {
      icon: Ban,
      title: '15. Account Suspension or Termination',
      content:
        'We may suspend or terminate access to an account where required for safety, fraud prevention, policy enforcement, unlawful activity, misuse of the Platform, or violation of these Terms. Users may stop using the Platform at any time, subject to any transaction or service obligations that have already arisen.',
    },

    {
      icon: Scale,
      title: '16. Liability & Disclaimers',
      content:
        'Meet My Mate in provides a meeting arrangement and facilitation service. To the extent permitted by applicable law, we do not guarantee that a meeting will result in a particular personal or professional outcome. We are not responsible for the independent acts, statements, decisions, conduct, or relationships of users outside the specific service operations we control. Users are responsible for exercising their own judgment and taking appropriate safety precautions.',
    },

    {
      icon: FileText,
      title: '17. Changes to Services or Terms',
      content:
        'We may modify, suspend, discontinue, or update features, service flows, pricing, or these Terms when necessary for operational, legal, security, or business reasons. The applicable terms presented to you at the time of a transaction may govern that transaction where required.',
    },

    {
      icon: Scale,
      title: '18. Governing Terms & Contact',
      content:
        'Questions, concerns, or complaints regarding these Terms or a service should be directed to Meet My Mate in through the support contact provided on the Platform. Any applicable legal rights, remedies, and dispute procedures will be governed by applicable law.',
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

          <h1 className="text-center mb-2">
            Complete Terms & Conditions
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-center">
            Last Updated: September 27, 2026
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
                Important Notice
              </h3>

              <p className="text-yellow-700 dark:text-yellow-400 text-sm leading-relaxed">
                Meet My Mate in arranges real-world offline meetings.
                We do not guarantee compatibility or any personal or
                professional relationship or outcome between participants.
                Users are responsible for their own conduct, decisions,
                communications, and safety during and after meetings.
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
                    <h3 className="mb-3">
                      {section.title}
                    </h3>

                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {section.content}
                    </p>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-4"
        >
          <div className="glass dark:glass-dark rounded-3xl p-6">
            <h3 className="mb-3">
              Contact Information
            </h3>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              For questions regarding these Terms & Conditions, please contact
              Meet My Mate in through the support contact details provided on
              the Platform.
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
            © {new Date().getFullYear()} Meet My Mate in. All rights reserved.
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

export default TermsDetailScreen;