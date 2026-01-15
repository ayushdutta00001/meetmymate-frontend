import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  GraduationCap,
  Shield,
  CheckCircle,
  Clock,
  X,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Upload,
  AlertCircle,
  User,
  Briefcase,
  DollarSign,
  BookOpen,
  Award,
  ArrowRight,
  PlayCircle,
  FileCheck,
  FileText,
  TrendingUp,
  File,
  CreditCard,
  Building,
  Hash
} from 'lucide-react';
import { ExpertDepositPaymentScreen } from './screens/ExpertDepositPaymentScreen';

type VerificationStatus = 'none' | 'pending' | 'approved' | 'rejected';
type OnboardingStep = 'eligibility' | 'credentials' | 'training' | 'deposit' | 'payment' | 'bank-details' | 'review' | 'complete';

interface ExpertSignupProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  onGoToDashboard: () => void;
  hasBusinessMeetupSubscription?: boolean;
}

export function ExpertSignup({ onBack, onNavigate, onGoToDashboard, hasBusinessMeetupSubscription = false }: ExpertSignupProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('eligibility');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form states
  const [verificationForm, setVerificationForm] = useState({
    fullName: '',
    expertise: '',
    yearsOfExperience: '',
    hourlyRate: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    portfolioUrl: '',
    company: '',
    jobTitle: ''
  });

  // Bank details state
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountType: 'savings' as 'savings' | 'current',
    branchName: ''
  });

  // Uploaded files state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Training module state
  const [trainingProgress, setTrainingProgress] = useState({
    module1: false,
    module2: false,
    module3: false,
    module4: false,
    module5: false
  });

  const [acceptedRules, setAcceptedRules] = useState(false);
  const [securityDepositPaid, setSecurityDepositPaid] = useState(false);

  const SECURITY_DEPOSIT = 5000; // ₹5000 refundable security deposit

  // Check if training is complete
  const isTrainingComplete = Object.values(trainingProgress).every(v => v) && acceptedRules;

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const totalSize = [...uploadedFiles, ...newFiles].reduce((sum, file) => sum + file.size, 0);
      
      if (totalSize > 10 * 1024 * 1024) { // 10MB limit
        alert('Total file size must not exceed 10MB');
        return;
      }
      
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  // Remove uploaded file
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  // Show payment screen
  if (currentStep === 'payment') {
    return (
      <ExpertDepositPaymentScreen
        onBack={() => setCurrentStep('deposit')}
        onPaymentComplete={() => {
          setSecurityDepositPaid(true);
          setCurrentStep('bank-details');
        }}
        depositAmount={SECURITY_DEPOSIT}
      />
    );
  }

  const renderEligibilityCheck = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="glass dark:glass-dark rounded-2xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="mb-1">Eligibility Requirements</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ensure you meet all criteria before proceeding</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl glass dark:glass-dark border border-blue-500/20 bg-blue-500/5">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm mb-1"><strong>Minimum 2-3 Years of Relevant Experience</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  You must have at least 2-3 years of professional experience in your field of expertise. 
                  Proof of experience will be required (employment letters, certificates, portfolio, etc.)
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl glass dark:glass-dark border border-purple-500/20 bg-purple-500/5">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm mb-1"><strong>Security Deposit: ₹{SECURITY_DEPOSIT.toLocaleString()}</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  A refundable security deposit is required to maintain platform quality and commitment. 
                  This amount will be refunded after 6 months of good standing or if you decide to leave the platform.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl glass dark:glass-dark border border-orange-500/20 bg-orange-500/5">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm mb-1"><strong>Complete Platform Training</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  You must complete a comprehensive training module covering platform rules, expectations, 
                  conduct guidelines, payment terms, and best practices for expert mentorship.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl glass dark:glass-dark border border-green-500/20 bg-green-500/5">
            <div className="flex items-start gap-3">
              <FileCheck className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm mb-1"><strong>Document Verification</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Submit valid proof of identity, professional credentials, and experience documentation. 
                  Our team will verify all submitted documents within 24-48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl glass dark:glass-dark bg-yellow-500/5 border border-yellow-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> All experts undergo a thorough verification process. 
                Only professionals who meet our quality standards and complete all requirements will be approved.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onBack} className="flex-1 py-4 rounded-xl glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button 
            onClick={() => setCurrentStep('credentials')}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <span>I Meet All Requirements</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderCredentialsForm = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="glass dark:glass-dark rounded-2xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="mb-1">Submit Your Credentials</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Provide accurate information and supporting documents</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Full Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={verificationForm.fullName}
                onChange={(e) => setVerificationForm({ ...verificationForm, fullName: e.target.value })}
                placeholder="Enter your full legal name"
                className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Email Address <span className="text-red-500">*</span></label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={verificationForm.email}
                onChange={(e) => setVerificationForm({ ...verificationForm, email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Phone Number <span className="text-red-500">*</span></label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={verificationForm.phone}
                onChange={(e) => setVerificationForm({ ...verificationForm, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Area of Expertise <span className="text-red-500">*</span></label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={verificationForm.expertise}
                onChange={(e) => setVerificationForm({ ...verificationForm, expertise: e.target.value })}
                className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              >
                <option value="">Select your expertise</option>
                <option value="Startup Strategy">Startup Strategy</option>
                <option value="Legal & Compliance">Legal & Compliance</option>
                <option value="Finance & Fundraising">Finance & Fundraising</option>
                <option value="Tech & Product">Tech & Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Years of Experience <span className="text-red-500">*</span></label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={verificationForm.yearsOfExperience}
                onChange={(e) => setVerificationForm({ ...verificationForm, yearsOfExperience: e.target.value })}
                placeholder="Minimum 2-3 years required"
                min="2"
                className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
            {verificationForm.yearsOfExperience && parseInt(verificationForm.yearsOfExperience) < 2 && (
              <p className="text-xs text-red-500 mt-1">⚠️ Minimum 2 years of experience required</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Current/Previous Company <span className="text-red-500">*</span></label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={verificationForm.company}
                onChange={(e) => setVerificationForm({ ...verificationForm, company: e.target.value })}
                placeholder="Company name"
                className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Job Title/Position <span className="text-red-500">*</span></label>
            <div className="relative">
              <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={verificationForm.jobTitle}
                onChange={(e) => setVerificationForm({ ...verificationForm, jobTitle: e.target.value })}
                placeholder="e.g., Senior Product Manager"
                className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Hourly Consulting Rate (₹) <span className="text-red-500">*</span></label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={verificationForm.hourlyRate}
                onChange={(e) => setVerificationForm({ ...verificationForm, hourlyRate: e.target.value })}
                placeholder="e.g., 5000"
                min="1000"
                step="500"
                className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Platform commission: 15% • You'll receive ₹{verificationForm.hourlyRate ? (parseInt(verificationForm.hourlyRate) * 0.85).toFixed(0) : '0'} per session
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">LinkedIn Profile URL</label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={verificationForm.linkedinUrl}
                onChange={(e) => setVerificationForm({ ...verificationForm, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Portfolio / Website (Optional)</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={verificationForm.portfolioUrl}
                onChange={(e) => setVerificationForm({ ...verificationForm, portfolioUrl: e.target.value })}
                placeholder="https://yourportfolio.com"
                className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
              Proof of Experience <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
              Upload employment letters, offer letters, experience certificates, or portfolio screenshots (2-3 years minimum)
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="glass dark:glass-dark rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-10 h-10 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload documents</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PDF, JPG, or PNG (max 10MB total)</p>
                </div>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl glass dark:glass-dark">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(index);
                      }}
                      className="w-6 h-6 rounded-full glass dark:glass-dark hover:bg-red-500/10 flex items-center justify-center transition-all"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={() => setCurrentStep('eligibility')} className="flex-1 py-4 rounded-xl glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5 transition-all">
            Back
          </button>
          <button
            onClick={() => {
              if (!verificationForm.fullName || !verificationForm.email || !verificationForm.phone || 
                  !verificationForm.expertise || !verificationForm.yearsOfExperience || 
                  parseInt(verificationForm.yearsOfExperience) < 2 || !verificationForm.company || 
                  !verificationForm.jobTitle || !verificationForm.hourlyRate || uploadedFiles.length === 0) {
                alert('Please fill all required fields, ensure you have minimum 2 years of experience, and upload proof of experience documents');
                return;
              }
              setCurrentStep('training');
            }}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Continue to Training</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderTrainingModule = () => {
    const modules = [
      { key: 'module1', title: 'Platform Code of Conduct', duration: '5 min', description: 'Professional behavior, communication standards, session etiquette, and anti-discrimination policies' },
      { key: 'module2', title: 'Booking & Session Management', duration: '7 min', description: 'How to manage availability, handle bookings, conduct sessions, and maintain scheduling commitments' },
      { key: 'module3', title: 'Payment Terms & Commission Structure', duration: '6 min', description: '15% platform commission, weekly payout schedule (Mondays), earnings tracking, and refund policies' },
      { key: 'module4', title: 'Client Confidentiality & Privacy', duration: '5 min', description: 'Data protection, NDA compliance, confidentiality agreements, and handling sensitive business information' },
      { key: 'module5', title: 'Quality Standards & Best Practices', duration: '8 min', description: 'Session preparation, actionable advice delivery, follow-up protocols, and maintaining high ratings' }
    ];

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
        <div className="glass dark:glass-dark rounded-2xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="mb-1">Platform Training & Guidelines</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Complete all modules to proceed</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {modules.map((module, index) => (
              <div
                key={module.key}
                className={`p-4 rounded-xl transition-all cursor-pointer ${
                  trainingProgress[module.key as keyof typeof trainingProgress]
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'glass dark:glass-dark border border-white/20 dark:border-gray-800/50 hover:border-green-500/20'
                }`}
                onClick={() => setTrainingProgress({ ...trainingProgress, [module.key]: !trainingProgress[module.key as keyof typeof trainingProgress] })}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    trainingProgress[module.key as keyof typeof trainingProgress] ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
                  }`}>
                    {trainingProgress[module.key as keyof typeof trainingProgress] && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm"><strong>Module {index + 1}: {module.title}</strong></p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">{module.duration}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{module.description}</p>
                    {!trainingProgress[module.key as keyof typeof trainingProgress] && (
                      <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                        <PlayCircle className="w-4 h-4" />
                        <span>Click to complete module</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl glass dark:glass-dark border border-purple-500/20 bg-purple-500/5 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedRules}
                onChange={(e) => setAcceptedRules(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 border-purple-500 text-purple-600 focus:ring-2 focus:ring-purple-500"
              />
              <div>
                <p className="text-sm mb-1"><strong>I have read and agree to all platform guidelines</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  By checking this box, I confirm that I have completed all training modules and agree to follow 
                  all platform rules, code of conduct, payment terms, and quality standards. I understand that 
                  violations may result in suspension or removal from the platform.
                </p>
              </div>
            </label>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setCurrentStep('credentials')} className="flex-1 py-4 rounded-xl glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5 transition-all">
              Back
            </button>
            <button
              onClick={() => {
                if (!isTrainingComplete) {
                  alert('Please complete all training modules and accept the platform guidelines');
                  return;
                }
                setCurrentStep('deposit');
              }}
              disabled={!isTrainingComplete}
              className={`flex-1 py-4 rounded-xl text-white hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
                isTrainingComplete ? 'bg-gradient-to-r from-green-500 to-teal-600' : 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
              }`}
            >
              <span>Proceed to Security Deposit</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSecurityDeposit = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="glass dark:glass-dark rounded-2xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="mb-1">Security Deposit Information</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Refundable deposit required</p>
          </div>
        </div>

        <div className="p-6 rounded-xl glass dark:glass-dark bg-blue-500/5 border border-blue-500/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Security Deposit Amount</p>
              <p className="text-3xl">₹{SECURITY_DEPOSIT.toLocaleString()}</p>
            </div>
            <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="h-px bg-white/20 dark:bg-gray-800/50 mb-4"></div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>100% Refundable after 6 months of good standing</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Refundable if you decide to leave the platform</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Ensures commitment to quality service</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Protects against fraudulent activities</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl glass dark:glass-dark bg-yellow-500/5 border border-yellow-500/20 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm mb-1"><strong>Refund Policy</strong></p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Deposit held for minimum 6 months from approval date</li>
                <li>• Full refund after 6 months if no violations occurred</li>
                <li>• Immediate refund if application is rejected</li>
                <li>• Refund processed within 7-10 business days</li>
                <li>• Deductions may apply for policy violations or no-shows</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setCurrentStep('training')} className="flex-1 py-4 rounded-xl glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5 transition-all">
            Back
          </button>
          <button
            onClick={() => setCurrentStep('payment')}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Payment</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderBankDetails = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="glass dark:glass-dark rounded-2xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="mb-1">Bank Account Details</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">For receiving your earnings</p>
          </div>
        </div>

        <div className="p-4 rounded-xl glass dark:glass-dark bg-blue-500/5 border border-blue-500/20 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Earnings will be transferred to this bank account every Monday. Please ensure all details are accurate to avoid payment delays.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Account Holder Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={bankDetails.accountHolderName}
                onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                placeholder="As per bank account"
                className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Bank Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                placeholder="e.g., State Bank of India"
                className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Account Number <span className="text-red-500">*</span></label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                placeholder="Enter your account number"
                className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Confirm Account Number <span className="text-red-500">*</span></label>
            <div className="relative">
              <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={bankDetails.confirmAccountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, confirmAccountNumber: e.target.value })}
                placeholder="Re-enter your account number"
                className={`w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm ${
                  bankDetails.confirmAccountNumber && bankDetails.accountNumber !== bankDetails.confirmAccountNumber
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-transparent focus:border-blue-500 dark:focus:border-blue-400'
                }`}
              />
            </div>
            {bankDetails.confirmAccountNumber && bankDetails.accountNumber !== bankDetails.confirmAccountNumber && (
              <p className="text-xs text-red-500 mt-1">⚠️ Account numbers do not match</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">IFSC Code <span className="text-red-500">*</span></label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                placeholder="e.g., SBIN0001234"
                maxLength={11}
                className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm uppercase"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">11-character alphanumeric code</p>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Account Type <span className="text-red-500">*</span></label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="accountType"
                  value="savings"
                  checked={bankDetails.accountType === 'savings'}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountType: e.target.value as 'savings' | 'current' })}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm">Savings</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="accountType"
                  value="current"
                  checked={bankDetails.accountType === 'current'}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountType: e.target.value as 'savings' | 'current' })}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm">Current</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Branch Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={bankDetails.branchName}
                onChange={(e) => setBankDetails({ ...bankDetails, branchName: e.target.value })}
                placeholder="e.g., Andheri West"
                className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl glass dark:glass-dark bg-yellow-500/5 border border-yellow-500/20 mt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm mb-1"><strong>Payment Schedule</strong></p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <li>✓ Earnings are transferred every Monday</li>
                <li>✓ 15% platform commission is deducted automatically</li>
                <li>✓ Minimum withdrawal amount: ₹500</li>
                <li>✓ Processing time: 2-3 business days</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={() => setCurrentStep('payment')} className="flex-1 py-4 rounded-xl glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5 transition-all">
            Back
          </button>
          <button
            onClick={() => {
              if (!bankDetails.accountHolderName || !bankDetails.bankName || 
                  !bankDetails.accountNumber || !bankDetails.confirmAccountNumber || 
                  !bankDetails.ifscCode || bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
                alert('Please fill all required fields and ensure account numbers match');
                return;
              }
              if (bankDetails.ifscCode.length !== 11) {
                alert('IFSC code must be exactly 11 characters');
                return;
              }
              setCurrentStep('review');
            }}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Continue to Review</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderReview = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="glass dark:glass-dark rounded-2xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <FileCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="mb-1">Review & Submit Application</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Verify all information before final submission</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-xl glass dark:glass-dark">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm">Personal Information</h4>
              <button onClick={() => setCurrentStep('credentials')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                <span>{verificationForm.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span>{verificationForm.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <span>{verificationForm.phone}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl glass dark:glass-dark">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm">Professional Details</h4>
              <button onClick={() => setCurrentStep('credentials')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Expertise:</span>
                <span>{verificationForm.expertise}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Experience:</span>
                <span>{verificationForm.yearsOfExperience} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Company:</span>
                <span>{verificationForm.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Job Title:</span>
                <span>{verificationForm.jobTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Hourly Rate:</span>
                <span>₹{parseInt(verificationForm.hourlyRate).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Documents:</span>
                <span>{uploadedFiles.length} file(s) uploaded</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl glass dark:glass-dark bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm"><strong>Training Completed</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">All 5 modules completed successfully</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl glass dark:glass-dark bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm"><strong>Security Deposit Paid</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">₹{SECURITY_DEPOSIT.toLocaleString()} (Refundable)</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl glass dark:glass-dark">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm">Bank Account Details</h4>
              <button onClick={() => setCurrentStep('bank-details')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Account Holder:</span>
                <span>{bankDetails.accountHolderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Bank Name:</span>
                <span>{bankDetails.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Account Number:</span>
                <span>****{bankDetails.accountNumber.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">IFSC Code:</span>
                <span>{bankDetails.ifscCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Account Type:</span>
                <span className="capitalize">{bankDetails.accountType}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl glass dark:glass-dark bg-blue-500/5 border border-blue-500/20 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm mb-1"><strong>What happens next?</strong></p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <li>✓ Our team will review your application and documents</li>
                <li>✓ Verification typically takes 24-48 hours</li>
                <li>✓ You'll receive email notification about approval status</li>
                <li>✓ Once approved, you can set availability and start accepting bookings</li>
                <li>✓ Your security deposit will be held for 6 months</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setCurrentStep('bank-details')} className="flex-1 py-4 rounded-xl glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5 transition-all">
            Back
          </button>
          <button
            onClick={() => {
              setVerificationStatus('pending');
              setCurrentStep('complete');
            }}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Submit Application</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

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

        <h3 className="mb-3">Application Submitted Successfully! 🎉</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Thank you for applying to become an expert on Meet my Mate. Your application is now under review.
        </p>

        <div className="glass dark:glass-dark rounded-xl p-6 mb-6 text-left">
          <h4 className="text-sm mb-4">Application Status Timeline</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm mb-1"><strong>Application Received</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Your application and documents have been submitted</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm mb-1"><strong>Under Review</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Our team is reviewing your credentials (24-48 hours)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm mb-1"><strong>Email Notification</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">You'll receive approval/rejection notification via email</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm mb-1"><strong>Start Earning</strong></p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Once approved, set availability and start accepting bookings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl glass dark:glass-dark bg-blue-500/5 border border-blue-500/20 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <p className="text-xs text-gray-600 dark:text-gray-400 text-left">
              <strong>Application Reference:</strong> EXP-{Date.now()}<br />
              <strong>Security Deposit:</strong> ₹{SECURITY_DEPOSIT.toLocaleString()} (Paid & Confirmed)<br />
              <strong>Submitted:</strong> {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl transition-all"
        >
          Return to Home
        </button>
      </div>

      <div className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-orange-500/20 bg-orange-500/5 text-center">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          <strong>For Demo Purposes:</strong> Simulate instant approval
        </p>
        <button
          onClick={onGoToDashboard}
          className="py-3 px-6 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 text-white hover:shadow-xl transition-all text-sm"
        >
          ✅ Approve & Go to Expert Dashboard
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2>Become an Expert</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentStep === 'eligibility' && 'Step 1: Eligibility Check'}
                  {currentStep === 'credentials' && 'Step 2: Credentials Submission'}
                  {currentStep === 'training' && 'Step 3: Platform Training'}
                  {currentStep === 'deposit' && 'Step 4: Security Deposit'}
                  {currentStep === 'payment' && 'Step 5: Payment'}
                  {currentStep === 'bank-details' && 'Step 6: Bank Account Details'}
                  {currentStep === 'review' && 'Step 7: Review & Submit'}
                  {currentStep === 'complete' && 'Application Complete'}
                </p>
              </div>
            </div>
          </div>

          {currentStep !== 'complete' && currentStep !== 'payment' && currentStep !== 'bank-details' && (
            <div className="mt-6 flex items-center gap-2">
              {['eligibility', 'credentials', 'training', 'deposit', 'review'].map((step, index) => (
                <div key={step} className={`flex-1 h-2 rounded-full transition-all ${
                  ['eligibility', 'credentials', 'training', 'deposit', 'payment', 'bank-details', 'review'].indexOf(currentStep) >= index
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 'eligibility' && renderEligibilityCheck()}
          {currentStep === 'credentials' && renderCredentialsForm()}
          {currentStep === 'training' && renderTrainingModule()}
          {currentStep === 'deposit' && renderSecurityDeposit()}
          {currentStep === 'bank-details' && renderBankDetails()}
          {currentStep === 'review' && renderReview()}
          {currentStep === 'complete' && renderComplete()}
        </AnimatePresence>
      </div>
    </div>
  );
}