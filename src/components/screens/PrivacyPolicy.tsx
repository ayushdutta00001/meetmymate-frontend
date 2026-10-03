import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, LockKeyhole, Database, CreditCard, Bell } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const sections = [
  {
    title: '1. Who We Are',
    body: [
      'MeetMyMateIn ("MeetMyMate", "we", "us", or "our") operates the MeetMyMate platform at meetmymatein.com.',
      'This Privacy Policy explains how we collect, use, store, disclose, and protect personal data when you use our website, account, matching, booking, meeting, provider, payment, and notification services.'
    ]
  },
  {
    title: '2. Information We Collect',
    body: [
      'Account and profile information: name, email address, phone number, age, gender, city, profile photo, bio, interests, languages, and information you choose to include in your profile.',
      'P2P information: professional or collaboration information you provide for PartnerUp/P2P, including profile details, goals, preferences, matching activity, requests, acceptances, and meeting-related information.',
      'Blind Date information: booking details, age and gender preferences, availability, preferred locations, meeting information, booking status, and information required to arrange the meeting.',
      'Provider information: service selections, availability, profile information, verification information, identity documents such as Aadhaar or PAN documents when submitted for verification, and payout information such as bank or UPI details when required for provider payouts.',
      'Payment information: transaction details such as payment amount, payment status, order/payment identifiers, refund information, and other payment references needed to confirm or reconcile a transaction. Payment credentials are processed by our payment provider where applicable.',
      'Notifications and device information: push-notification tokens and information needed to deliver notifications, maintain notification preferences, and operate notification services.',
      'Location information: where a location-enabled feature is used and you give permission, the app may process device location or meeting-location information to help arrange or match a service. For location-based matching, coordinates may be sent to the OpenStreetMap Nominatim reverse-geocoding service to determine a city.',
      'Technical information: essential information generated when you use the service, such as session state and application activity needed to keep the platform secure and functioning. Third-party infrastructure providers may also process technical information as part of delivering their services.'
    ]
  },
  {
    title: '3. How We Use Personal Data',
    body: [
      'We use personal data to create and maintain accounts, provide profile and matching features, process bookings and payments, arrange meetings, send booking and account notifications, verify providers, process provider payouts, provide customer support, prevent fraud and misuse, maintain platform security, troubleshoot problems, and comply with applicable legal obligations.',
      'We may also use information to improve the reliability, safety, and user experience of the platform, using appropriate safeguards and only for purposes connected with operating or protecting the service.'
    ]
  },
  {
    title: '4. Matching, Profiles, and Meetings',
    body: [
      'Information you choose to include in a P2P/PartnerUp profile may be shown to eligible users according to the product flow so that matching can take place.',
      'For meeting-based services, we may share limited information with the person or provider involved in the meeting when that information is necessary to arrange, confirm, or conduct the meeting.',
      'For P2P/PartnerUp meetings, once a meeting is confirmed and contact exchange is required for coordination, we may share your phone number and email address with the matched participant. This contact information is shared only with the relevant matched participant for the meeting and is not made publicly visible through the platform.',
      'For Blind Date bookings, contact details may be disclosed to the matched participant at the stage required by the service flow for the meeting. We do not provide unrestricted access to all account information.'
    ]
  },
  {
    title: '5. Identity Verification and Aadhaar/PAN Documents',
    body: [
      'Providers may be required to submit identity documents such as Aadhaar or PAN for verification before providing certain services. These documents are used for provider verification, safety, fraud prevention, compliance, and related operational purposes.',
      'We restrict access to identity documents to authorized personnel and systems that require them for verification or compliance. We do not make provider identity documents publicly available.',
      'We retain identity documents only for as long as reasonably necessary for the verification, safety, compliance, dispute, or record-keeping purposes for which they were collected, subject to applicable legal requirements.'
    ]
  },
  {
    title: '6. Payments and Third-Party Services',
    body: [
      'Payments are processed through Razorpay or another payment service we may use. We may receive payment confirmation, transaction identifiers, amounts, statuses, and refund information needed to provide the service and reconcile payments.',
      'We use Supabase for services including authentication, database, storage, realtime functionality, and server-side functions; Firebase for push notifications; and Resend for transactional email delivery. These providers process information on our behalf or in connection with their services.',
      'Third-party providers may process information in India or other jurisdictions according to their own infrastructure, security practices, and legal requirements. Their processing is also governed by their applicable privacy policies.'
    ]
  },
  {
    title: '7. When We Share Information',
    body: [
      'We may disclose personal data to service providers that help us operate the platform, including hosting, authentication, database, storage, payment, email, notification, security, and infrastructure providers.',
      'We may disclose limited information to users, providers, or meeting participants when needed to provide a requested matching or meeting service. For confirmed P2P/PartnerUp meetings, this may include sharing the participants\' phone numbers and email addresses with each other when needed to coordinate the meeting.',
      'We may also disclose information when required by applicable law, lawful process, a valid governmental request, to protect the rights or safety of users or the platform, or to investigate fraud, security incidents, or misuse.'
    ]
  },
  {
    title: '8. Data Security',
    body: [
      'We use reasonable technical and organizational safeguards designed to protect personal data from unauthorized access, alteration, disclosure, loss, or misuse. These measures include authenticated access, database and storage access controls, application-level authorization, and restricted administrative access.',
      'No internet service can guarantee absolute security. You should use a strong password, keep your login credentials confidential, and notify us promptly if you believe your account has been compromised.'
    ]
  },
  {
    title: '9. Data Retention',
    body: [
      'We retain personal data for as long as reasonably necessary to provide the requested services, maintain account and booking records, complete payments and refunds, support provider verification, prevent fraud or abuse, resolve disputes, enforce our terms, and comply with legal, regulatory, tax, accounting, or security requirements.',
      'When personal data is no longer required for a relevant purpose, we may delete it, anonymize it, or otherwise securely dispose of it, subject to applicable retention requirements and legitimate operational needs.'
    ]
  },
  {
    title: '10. Your Privacy Choices and Rights',
    body: [
      'Depending on applicable law, you may have rights to request information about the personal data we process, request correction of inaccurate data, request deletion or erasure where permitted, and withdraw consent where processing is based on consent.',
      'Withdrawing consent does not affect processing that must continue for a lawful purpose or where retention is required by law or necessary for an ongoing transaction, dispute, security matter, or other legitimate purpose.',
      'To make a privacy request, contact MeetMyMate through the support/contact channel published on our website. We may request reasonable information to verify the identity of the requester before acting on a request.'
    ]
  },
  {
    title: '11. Complaints and Grievances',
    body: [
      'If you have a privacy concern, complaint, or request relating to your personal data, please contact us through the support/contact channel published on meetmymatein.com. We will review the request and respond in accordance with applicable law and our internal process.'
    ]
  },
  {
    title: '12. Adult Services',
    body: [
      'MeetMyMate is intended for adults. We do not knowingly permit minors to create or use accounts for our adult-oriented matching, meeting, or provider services.'
    ]
  },
  {
    title: '13. Browser Storage and Similar Technologies',
    body: [
      'The application may use essential browser storage, such as session storage, to maintain login flow, navigation state, onboarding state, and other functionality. These mechanisms are used to operate the application and are not described as advertising cookies.'
    ]
  },
  {
    title: '14. Changes to This Privacy Policy',
    body: [
      'We may update this Privacy Policy when our services, data practices, technology, or legal requirements change. The updated version will be published on this page with a revised "Last updated" date.'
    ]
  },
  {
    title: '15. Contact',
    body: [
      'For privacy questions, requests, or complaints, please use the support/contact details published on meetmymatein.com.'
    ]
  }
];

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] text-[#0B0B0C] dark:text-white">
      <div className="sticky top-0 z-40 border-b border-gray-200/70 dark:border-gray-800/70 bg-[#F2F4F7]/90 dark:bg-[#0A0F1F]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="w-11 h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">MeetMyMateIn</p>
            <h1 className="text-xl md:text-2xl font-semibold">Privacy Policy</h1>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="rounded-3xl border border-blue-200/60 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-950/20 p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold mb-2">Your privacy matters</h2>
                <p className="text-sm md:text-base leading-6 text-gray-700 dark:text-gray-300">
                  This policy explains what information we collect, why we use it, when we share it, and the choices available to you.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Last updated: 21 September 2026</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              [LockKeyhole, 'Secure access'],
              [Database, 'Protected storage'],
              [CreditCard, 'Payment partners'],
              [Bell, 'Notifications'],
            ].map(([Icon, label], index) => {
              const IconComponent = Icon as typeof LockKeyhole;
              return (
                <div key={index} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-4">
                  <IconComponent className="w-5 h-5 text-blue-500 mb-2" />
                  <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">{label as string}</p>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            {sections.map((section) => (
              <section key={section.title} className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-semibold mb-4">{section.title}</h2>
                <div className="space-y-3">
                  {section.body.map((paragraph, index) => (
                    <p key={index} className="text-sm md:text-base leading-7 text-gray-700 dark:text-gray-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

        </motion.div>
      </main>
    </div>
  );
}

export default PrivacyPolicy;
