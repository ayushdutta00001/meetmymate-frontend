import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Shield,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  Lock,
  User,
  Coffee,
  MessageCircle,
  Clock,
  X,
  File,
  CreditCard,
  Building2,
  Landmark
} from 'lucide-react';
import { FriendDepositPaymentScreen } from './FriendDepositPaymentScreen';

type OnboardingStep = 'opt-in' | 'verification' | 'deposit' | 'orientation' | 'bank-details' | 'confirmation' | 'complete';

interface FriendOnboardingProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  userName?: string;
}

export function FriendOnboarding({ onBack, onNavigate, userName = 'User' }: FriendOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('opt-in');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<'aadhaar' | 'pan' | ''>('');
  const [depositPaid, setDepositPaid] = useState(false);
  const [understoodGuidelines, setUnderstoodGuidelines] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bank details state
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountType: '' as 'savings' | 'current' | ''
  });

  const SECURITY_DEPOSIT = 2000; // ₹2000 refundable security deposit

  const stepOrder: OnboardingStep[] = ['opt-in', 'verification', 'deposit', 'orientation', 'bank-details', 'confirmation'];

  // Get current step index
  const currentStepIndex = stepOrder.indexOf(currentStep);

  // Handle file upload
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must not exceed 5MB');
        return;
      }
      setUploadedDocument(file);
    }
  };

  // Remove uploaded document
  const handleRemoveDocument = () => {
    setUploadedDocument(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Show payment screen
  if (currentStep === 'deposit' && !depositPaid) {
    return (
      <FriendDepositPaymentScreen
        onBack={() => setCurrentStep('verification')}
        onPaymentComplete={() => {
          setDepositPaid(true);
          setCurrentStep('orientation');
        }}
        depositAmount={SECURITY_DEPOSIT}
      />
    );
  }

  // Step 1: Opt-In & Role Clarity
  const renderOptIn = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="glass dark:glass-dark rounded-2xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="mb-1">Become a Rent-a-Friend Companion</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Help others by offering genuine companionship
            </p>
          </div>
        </div>

        {/* What is Rent-a-Friend */}
        <div className="mb-6">
          <h4 className="text-sm mb-3">What is Rent-a-Friend?</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Rent-a-Friend is a platform where people can find companions for various activities like:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl glass dark:glass-dark">
              <Coffee className="w-5 h-5 text-orange-500" />
              <span className="text-sm">Coffee meetups</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl glass dark:glass-dark">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Casual conversations</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl glass dark:glass-dark">
              <User className="w-5 h-5 text-green-500" />
              <span className="text-sm">Social events</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl glass dark:glass-dark">
              <Clock className="w-5 h-5 text-purple-500" />
              <span className="text-sm">Hanging out</span>
            </div>
          </div>
        </div>

        {/* Boundaries & Rules */}
        <div className="p-4 rounded-xl glass dark:glass-dark bg-blue-500/5 border border-blue-500/20 mb-6">
          <h4 className="text-sm mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Important Boundaries</span>
          </h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span><strong>Companionship Only:</strong> This is strictly for platonic friendship and social activities</span>
            </li>
            <li className="flex items-start gap-2">
              <X className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <span><strong>No Dating:</strong> This is not a dating or romantic relationship platform</span>
            </li>
            <li className="flex items-start gap-2">
              <X className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <span><strong>No Adult Services:</strong> Any form of adult, intimate, or inappropriate services are strictly prohibited</span>
            </li>
            <li className="flex items-start gap-2">
              <X className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <span><strong>No Illegal Activities:</strong> Any illegal activities will result in immediate ban and legal action</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span><strong>Safe Meetings:</strong> Always meet in public places and maintain professional behavior</span>
            </li>
          </ul>
        </div>

        {/* Platform Rules */}
        <div className="p-4 rounded-xl glass dark:glass-dark bg-yellow-500/5 border border-yellow-500/20 mb-6">
          <h4 className="text-sm mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span>Platform Rules</span>
          </h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• You must be 18 years or older</li>
            <li>• Identity verification is mandatory</li>
            <li>• A refundable security deposit is required</li>
            <li>• You earn ₹500-₹1500 per hour based on your profile</li>
            <li>• Platform takes 20% commission on all bookings</li>
            <li>• Payments are released weekly every Monday</li>
            <li>• Maintain a minimum 4-star rating to stay active</li>
            <li>• Any violations result in account suspension and deposit forfeiture</li>
          </ul>
        </div>

        {/* Agreement Checkbox */}
        <div className="p-4 rounded-xl glass dark:glass-dark border border-pink-500/20 bg-pink-500/5 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-2 border-pink-500 text-pink-600 focus:ring-2 focus:ring-pink-500"
            />
            <div>
              <p className="text-sm mb-1">
                <strong>I understand and agree to all the above terms</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                I confirm that I am 18+ years old, understand the boundaries of companionship services, 
                and agree to follow all platform rules. I understand that violations will result in 
                account termination and legal consequences.
              </p>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-4 rounded-xl glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!agreedToTerms) {
                alert('Please read and agree to the terms to continue');
                return;
              }
              setCurrentStep('verification');
            }}
            disabled={!agreedToTerms}
            className={`flex-1 py-4 rounded-xl text-white hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
              agreedToTerms
                ? 'bg-gradient-to-r from-pink-500 to-rose-600'
                : 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
            }`}
          >
            <span>I Agree, Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Step 2: Identity Verification
  const renderVerification = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="glass dark:glass-dark rounded-2xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="mb-1">Identity Verification</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload a valid government ID for verification
            </p>
          </div>
        </div>

        {/* Document Type Selection */}
        <div className="mb-6">
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-3 block">
            Select Document Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDocumentType('aadhaar')}
              className={`p-4 rounded-xl border-2 transition-all ${
                documentType === 'aadhaar'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/20 dark:border-gray-800/50 glass dark:glass-dark hover:border-blue-500/50'
              }`}
            >
              <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <p className="text-sm">Aadhaar Card</p>
              {documentType === 'aadhaar' && (
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mt-2" />
              )}
            </button>
            <button
              onClick={() => setDocumentType('pan')}
              className={`p-4 rounded-xl border-2 transition-all ${
                documentType === 'pan'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/20 dark:border-gray-800/50 glass dark:glass-dark hover:border-blue-500/50'
              }`}
            >
              <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <p className="text-sm">PAN Card</p>
              {documentType === 'pan' && (
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mt-2" />
              )}
            </button>
          </div>
        </div>

        {/* Document Upload */}
        {documentType && (
          <div className="mb-6">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-3 block">
              Upload {documentType === 'aadhaar' ? 'Aadhaar' : 'PAN'} Card <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
              Please ensure the document is clear and all details are visible. Accepted formats: JPG, PNG, PDF (max 5MB)
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleDocumentUpload}
              className="hidden"
            />

            {!uploadedDocument ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="glass dark:glass-dark rounded-xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click to upload {documentType === 'aadhaar' ? 'Aadhaar' : 'PAN'} card
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      JPG, PNG, or PDF (max 5MB)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl glass dark:glass-dark bg-green-500/5 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <File className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm">{uploadedDocument.name}</p>
                      <p className="text-xs text-gray-500">
                        {(uploadedDocument.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveDocument}
                    className="w-8 h-8 rounded-full glass dark:glass-dark hover:bg-red-500/10 flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Important Notice */}
        <div className="p-4 rounded-xl glass dark:glass-dark bg-yellow-500/5 border border-yellow-500/20 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm mb-1"><strong>Why we need this</strong></p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Identity verification ensures the safety and security of all platform users. 
                Your document will be encrypted and stored securely. We verify your identity 
                within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep('opt-in')}
            className="flex-1 py-4 rounded-xl glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5 transition-all"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (!documentType || !uploadedDocument) {
                alert('Please select document type and upload your document');
                return;
              }
              setCurrentStep('deposit');
            }}
            disabled={!documentType || !uploadedDocument}
            className={`flex-1 py-4 rounded-xl text-white hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
              documentType && uploadedDocument
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                : 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
            }`}
          >
            <span>Continue to Payment</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Step 4: Orientation / Guidelines
  const renderOrientation = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="glass dark:glass-dark rounded-2xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="mb-1">Orientation & Guidelines</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Important rules and best practices
            </p>
          </div>
        </div>

        {/* DO's */}
        <div className="mb-6">
          <h4 className="text-sm mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span>DO's - What You Should Do</span>
          </h4>
          <div className="space-y-2">
            {[
              'Always meet clients in public, safe locations',
              'Be punctual and respect scheduled time',
              'Maintain professional and friendly behavior',
              'Listen actively and engage in meaningful conversation',
              'Respect client boundaries and personal space',
              'Report any inappropriate behavior to the platform',
              'Keep conversations appropriate and platonic',
              'End the session if you feel uncomfortable'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-2 p-3 rounded-xl glass dark:glass-dark">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DON'Ts */}
        <div className="mb-6">
          <h4 className="text-sm mb-3 flex items-center gap-2">
            <X className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span>DON'Ts - What You Must Avoid</span>
          </h4>
          <div className="space-y-2">
            {[
              'Never engage in dating or romantic activities',
              'Do not provide or accept any adult services',
              'Never meet in private or isolated locations',
              'Do not share personal contact information outside the platform',
              'Avoid discussing or engaging in illegal activities',
              'Do not accept cash payments outside the platform',
              'Never pressure clients for tips or extra money',
              'Do not consume alcohol or drugs during sessions'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-2 p-3 rounded-xl glass dark:glass-dark bg-red-500/5 border border-red-500/10">
                <X className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="p-4 rounded-xl glass dark:glass-dark bg-blue-500/5 border border-blue-500/20 mb-6">
          <h4 className="text-sm mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Safety & Best Practices</span>
          </h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Always inform someone about your meetup location and time</li>
            <li>• Keep emergency contacts readily available</li>
            <li>• Use the platform's in-app messaging for all communication</li>
            <li>• Rate clients honestly after each session</li>
            <li>• Block and report users who violate platform rules</li>
            <li>• Trust your instincts - if something feels wrong, leave immediately</li>
          </ul>
        </div>

        {/* Confirmation Checkbox */}
        <div className="p-4 rounded-xl glass dark:glass-dark border border-green-500/20 bg-green-500/5 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={understoodGuidelines}
              onChange={(e) => setUnderstoodGuidelines(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-2 border-green-500 text-green-600 focus:ring-2 focus:ring-green-500"
            />
            <div>
              <p className="text-sm mb-1">
                <strong>I have read and understood all guidelines</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                I confirm that I will follow all DO's and DON'Ts, maintain safety protocols, 
                and uphold the platform's standards. I understand that violations will result 
                in immediate account suspension and security deposit forfeiture.
              </p>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep('deposit')}
            className="flex-1 py-4 rounded-xl glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5 transition-all"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (!understoodGuidelines) {
                alert('Please confirm that you have read and understood all guidelines');
                return;
              }
              setCurrentStep('bank-details');
            }}
            disabled={!understoodGuidelines}
            className={`flex-1 py-4 rounded-xl text-white hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
              understoodGuidelines
                ? 'bg-gradient-to-r from-green-500 to-teal-600'
                : 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
            }`}
          >
            <span>Continue to Bank Details</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Step 5: Bank Details
  const renderBankDetails = () => {
    const isBankDetailsComplete = 
      bankDetails.accountHolderName &&
      bankDetails.accountNumber &&
      bankDetails.confirmAccountNumber &&
      bankDetails.accountNumber === bankDetails.confirmAccountNumber &&
      bankDetails.ifscCode &&
      bankDetails.bankName &&
      bankDetails.accountType;

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
        <div className="glass dark:glass-dark rounded-2xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Landmark className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="mb-1">Bank Account Details</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Required for receiving your earnings
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="p-4 rounded-xl glass dark:glass-dark bg-blue-500/5 border border-blue-500/20 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm mb-1"><strong>Why we need this</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Your earnings will be transferred directly to this bank account every Monday. 
                  Please ensure all details are accurate to avoid payment delays.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Account Holder Name */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                Account Holder Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                  placeholder="Enter name as per bank account"
                  className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Must match the name on your bank account
              </p>
            </div>

            {/* Account Number */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                Bank Account Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value.replace(/\D/g, '') })}
                  placeholder="Enter account number"
                  className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Confirm Account Number */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                Confirm Account Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={bankDetails.confirmAccountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, confirmAccountNumber: e.target.value.replace(/\D/g, '') })}
                  placeholder="Re-enter account number"
                  className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                />
              </div>
              {bankDetails.confirmAccountNumber && bankDetails.accountNumber !== bankDetails.confirmAccountNumber && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  Account numbers do not match
                </p>
              )}
              {bankDetails.confirmAccountNumber && bankDetails.accountNumber === bankDetails.confirmAccountNumber && (
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Account numbers match
                </p>
              )}
            </div>

            {/* IFSC Code */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                  placeholder="e.g., SBIN0001234"
                  maxLength={11}
                  className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm uppercase"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                11-character IFSC code (e.g., SBIN0001234)
              </p>
            </div>

            {/* Bank Name */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                  placeholder="e.g., State Bank of India"
                  className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Branch Name (Optional) */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                Branch Name (Optional)
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={bankDetails.branchName}
                  onChange={(e) => setBankDetails({ ...bankDetails, branchName: e.target.value })}
                  placeholder="e.g., Mumbai Main Branch"
                  className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Account Type */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-3 block">
                Account Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setBankDetails({ ...bankDetails, accountType: 'savings' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    bankDetails.accountType === 'savings'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/20 dark:border-gray-800/50 glass dark:glass-dark hover:border-blue-500/50'
                  }`}
                >
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm">Savings Account</p>
                  {bankDetails.accountType === 'savings' && (
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mt-2" />
                  )}
                </button>
                <button
                  onClick={() => setBankDetails({ ...bankDetails, accountType: 'current' })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    bankDetails.accountType === 'current'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/20 dark:border-gray-800/50 glass dark:glass-dark hover:border-blue-500/50'
                  }`}
                >
                  <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm">Current Account</p>
                  {bankDetails.accountType === 'current' && (
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mt-2" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-4 rounded-xl glass dark:glass-dark bg-green-500/5 border border-green-500/20 mt-6">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="text-sm mb-1"><strong>Secure & Encrypted</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Your bank details are encrypted and stored securely. We never share your banking 
                  information with third parties. Payments are processed through secure banking channels.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setCurrentStep('orientation')}
              className="flex-1 py-4 rounded-xl glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5 transition-all"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (!isBankDetailsComplete) {
                  alert('Please fill in all required bank details');
                  return;
                }
                setCurrentStep('confirmation');
              }}
              disabled={!isBankDetailsComplete}
              className={`flex-1 py-4 rounded-xl text-white hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
                isBankDetailsComplete
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600'
                  : 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
              }`}
            >
              <span>Continue to Review</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Step 6: Confirmation & Submission
  const renderConfirmation = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="glass dark:glass-dark rounded-2xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="mb-1">Review & Submit</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verify your application details
            </p>
          </div>
        </div>

        {/* Application Summary */}
        <div className="space-y-4 mb-6">
          {/* Agreement Status */}
          <div className="p-4 rounded-xl glass dark:glass-dark bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm"><strong>Terms & Conditions Accepted</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  You have agreed to all platform rules and boundaries
                </p>
              </div>
            </div>
          </div>

          {/* Document Verification Status */}
          <div className="p-4 rounded-xl glass dark:glass-dark">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm"><strong>Identity Document</strong></p>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                Uploaded
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm">{documentType === 'aadhaar' ? 'Aadhaar Card' : 'PAN Card'}</p>
                <p className="text-xs text-gray-500">{uploadedDocument?.name}</p>
              </div>
            </div>
          </div>

          {/* Deposit Status */}
          <div className="p-4 rounded-xl glass dark:glass-dark bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm"><strong>Security Deposit Paid</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ₹{SECURITY_DEPOSIT.toLocaleString()} (Refundable)
                </p>
              </div>
            </div>
          </div>

          {/* Guidelines Status */}
          <div className="p-4 rounded-xl glass dark:glass-dark bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm"><strong>Guidelines Acknowledged</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  You have read and understood all DO's and DON'Ts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="p-4 rounded-xl glass dark:glass-dark bg-blue-500/5 border border-blue-500/20 mb-6">
          <h4 className="text-sm mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>What Happens Next?</span>
          </h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">1.</span>
              <span>Your application will be reviewed by our team within 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">2.</span>
              <span>We'll verify your identity document for authenticity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">3.</span>
              <span>You'll receive an email notification about your approval status</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">4.</span>
              <span>Once approved, your profile will be visible to customers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">5.</span>
              <span>You can start accepting bookings and earning immediately</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentStep('orientation')}
            className="flex-1 py-4 rounded-xl glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5 transition-all"
          >
            Back
          </button>
          <button
            onClick={() => setCurrentStep('complete')}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Submit Application</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Step 7: Complete
  const renderComplete = () => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
      <div className="glass dark:glass-dark rounded-2xl p-8 backdrop-blur-xl border border-green-500/20 bg-green-500/5 mb-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        <h3 className="mb-3">Application Submitted! 🎉</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Congratulations {userName}! Your Rent-a-Friend companion application has been successfully submitted.
        </p>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass dark:glass-dark bg-yellow-500/10 border border-yellow-500/20 mb-6">
          <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm text-yellow-600 dark:text-yellow-400">Under Review</span>
        </div>

        {/* Application Details */}
        <div className="glass dark:glass-dark rounded-xl p-6 mb-6 text-left">
          <h4 className="text-sm mb-4">Application Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Application ID:</span>
              <span className="font-mono">RAF-{Date.now()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Submitted:</span>
              <span>{new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Document:</span>
              <span>{documentType === 'aadhaar' ? 'Aadhaar Card' : 'PAN Card'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Security Deposit:</span>
              <span className="text-green-600 dark:text-green-400">₹{SECURITY_DEPOSIT.toLocaleString()} (Paid)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Expected Review Time:</span>
              <span>24 hours</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="p-4 rounded-xl glass dark:glass-dark bg-blue-500/5 border border-blue-500/20 mb-6 text-left">
          <h4 className="text-sm mb-3">What to Expect</h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <span>We'll verify your document within 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <span>You'll receive an email notification once reviewed</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <span>If approved, your profile becomes active immediately</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <span>Start accepting bookings and earning within minutes</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onBack}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:shadow-xl transition-all"
        >
          Back to Home
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass dark:glass-dark border-b border-white/20 dark:border-gray-800/50 backdrop-blur-xl"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2>Become a Friend</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentStep === 'opt-in' && 'Step 1: Opt-In & Role Clarity'}
                  {currentStep === 'verification' && 'Step 2: Identity Verification'}
                  {currentStep === 'deposit' && 'Step 3: Security Deposit'}
                  {currentStep === 'orientation' && 'Step 4: Orientation & Guidelines'}
                  {currentStep === 'bank-details' && 'Step 5: Bank Details'}
                  {currentStep === 'confirmation' && 'Step 6: Review & Submit'}
                  {currentStep === 'complete' && 'Application Complete'}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          {currentStep !== 'complete' && (
            <div className="mt-6 flex items-center gap-2">
              {stepOrder.map((step, index) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    currentStepIndex >= index
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 'opt-in' && renderOptIn()}
          {currentStep === 'verification' && renderVerification()}
          {currentStep === 'orientation' && renderOrientation()}
          {currentStep === 'bank-details' && renderBankDetails()}
          {currentStep === 'confirmation' && renderConfirmation()}
          {currentStep === 'complete' && renderComplete()}
        </AnimatePresence>
      </div>
    </div>
  );
}