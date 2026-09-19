import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../Button';
import { Logo } from '../Logo';
import {
  Shield,
  FileText,
  Lock,
  AlertTriangle,
} from 'lucide-react';

interface TermsScreenProps {
  onAccept: () => void;
  onNavigate: (page: string) => void;
}

export function TermsScreen({
  onAccept,
  onNavigate,
}: TermsScreenProps) {
  const [accepted, setAccepted] = useState(false);

  const terms = [
    {
      icon: Shield,
      title: 'Age Verification',
      content:
        'You must be 18 years or older to use this platform. All users must verify their identity.',
    },
    {
      icon: FileText,
      title: 'Code of Conduct',
      content:
        'Respectful behavior is mandatory. Harassment, discrimination, or inappropriate conduct will result in immediate account termination.',
    },
    {
      icon: Lock,
      title: 'Privacy & Safety',
      content:
        'Your personal information is protected. Never share financial information or passwords with other users.',
    },
    {
      icon: AlertTriangle,
      title: 'Meeting Safety',
      content:
        'Always meet in public places. Inform someone of your plans. Use in-app messaging initially.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] flex items-start justify-center md:items-center md:py-8">
      {/* Same overall size as the first version */}
      <div className="w-full md:max-w-sm h-screen md:h-[680px] flex flex-col md:rounded-3xl md:overflow-hidden md:shadow-2xl md:border md:border-white/10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 flex flex-col items-center pt-6 pb-4 px-5 text-center"
        >
          <Logo size="medium" />

          <h1 className="mt-4 text-center">
            Terms & Conditions
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-center mt-2 text-sm">
            Please read and accept our terms before continuing
          </p>
        </motion.div>

        {/* Scrollable content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 overflow-y-auto glass dark:glass-dark rounded-3xl p-6 md:p-8 mx-4 mb-4"
        >
          <div className="space-y-6">
            {terms.map((term, index) => {
              const Icon = term.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="mb-1">
                      {term.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {term.content}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Important Notice */}
          <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl">
            <h4 className="text-yellow-800 dark:text-yellow-400 mb-2">
              Important Notice
            </h4>

            <p className="text-yellow-700 dark:text-yellow-300 text-sm leading-relaxed">
              Meet my Mate in is a platform for social connections. We are
              not responsible for actions taken outside our platform.
              Always prioritize your safety and report any suspicious
              behavior immediately.
            </p>
          </div>

          {/* Data Protection */}
          <div className="mt-8 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
            <h4 className="text-blue-800 dark:text-blue-400 mb-2">
              Data Protection
            </h4>

            <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
              Meet my Mate in is not designed for collecting PII
              (Personally Identifiable Information) or securing sensitive
              data. Do not share financial information, passwords, or highly
              sensitive personal data through this platform.
            </p>
          </div>

          {/* Link to detailed terms */}
          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('terms-detail')}
              className="text-[#3C82F6] dark:text-[#3758FF] hover:underline text-sm inline-flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Read Complete Terms & Conditions
            </button>
          </div>
        </motion.div>

        {/* Fixed bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex-shrink-0 px-4 pb-5 space-y-4"
        >
          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex-shrink-0 mt-1">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-6 h-6 rounded-lg border-2 border-[#3C82F6] appearance-none checked:bg-gradient-to-r checked:from-[#3C82F6] checked:to-[#1F3C88] cursor-pointer transition-all"
              />

              {accepted && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              )}
            </div>

            <span className="text-sm text-[#0B0B0C] dark:text-white group-hover:text-[#3C82F6] dark:group-hover:text-[#3758FF] transition-colors leading-relaxed">
              I have read and agree to the Terms & Conditions, Privacy
              Policy, and Community Guidelines. I confirm that I am 18
              years or older and will use this platform responsibly.
            </span>
          </label>

          {/* Accept button */}
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={onAccept}
            disabled={!accepted}
          >
            Accept & Continue
          </Button>
        </motion.div>
      </div>
    </div>
  );
}