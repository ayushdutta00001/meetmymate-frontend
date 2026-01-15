import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, ArrowLeft, Check, Upload } from 'lucide-react';

interface BlindDateVerifySelfieProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDateVerifySelfie({ onNavigate, onBack }: BlindDateVerifySelfieProps) {
  const [uploaded, setUploaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleUpload = () => {
    setUploaded(true);
    setProcessing(true);
    
    setTimeout(() => {
      setProcessing(false);
      setVerified(true);
      
      setTimeout(() => {
        onNavigate('blind-date-profile-setup');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2>Selfie Verification</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Step 4 of 4</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-md mx-auto px-6 py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
        >
          {verified ? (
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
          ) : (
            <Camera className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          )}
        </motion.div>

        {verified ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <h3 className="mb-2 text-green-600 dark:text-green-400">Identity Verified</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">All verifications complete. Proceeding...</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h3 className="mb-2">Upload a Clear Selfie</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {processing 
                  ? 'Processing your selfie...' 
                  : 'This helps us verify your identity and ensure safety'}
              </p>
            </motion.div>

            {/* Guidelines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30"
            >
              <h4 className="mb-4 text-blue-900 dark:text-blue-400">Photo Guidelines</h4>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>Face clearly visible and well-lit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>No sunglasses or face coverings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>You should be the only person in the photo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">✓</span>
                  <span>Recent photo (taken within last 30 days)</span>
                </li>
              </ul>
            </motion.div>

            {/* Upload Area */}
            {!uploaded ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={handleUpload}
                  className="w-full py-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <p className="mb-1 text-gray-700 dark:text-gray-300">Click to upload selfie</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">JPG, PNG up to 10MB</p>
                </button>
              </motion.div>
            ) : processing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full"
                />
                <p className="text-gray-600 dark:text-gray-400">Verifying your identity...</p>
              </motion.div>
            ) : null}

            {/* Privacy Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
            >
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Privacy:</strong> Your selfie is used only for identity verification and will not be shown 
                to other users. It is securely stored and not shared with anyone you meet.
              </p>
            </motion.div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-blue-600 dark:bg-blue-700"></div>
            <div className="flex-1 h-2 rounded-full bg-blue-600 dark:bg-blue-700"></div>
            <div className="flex-1 h-2 rounded-full bg-blue-600 dark:bg-blue-700"></div>
            <div className="flex-1 h-2 rounded-full bg-blue-600 dark:bg-blue-700"></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
            Identity verification
          </p>
        </motion.div>
      </div>
    </div>
  );
}
