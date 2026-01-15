import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  UserPlus, 
  Crown, 
  CheckCircle, 
  Building2,
  Users,
  Lock,
  Shield,
  AlertCircle,
  Clock,
  MapPin,
  Briefcase,
  DollarSign,
  Target,
  Send,
  Calendar,
  FileText,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Check,
  X,
  Bell,
  Video,
  MapPinned,
  Timer,
  TrendingDown,
  Award,
  Zap,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { InvestorDashboard } from '../InvestorDashboard';
import { BackButton } from '../ui/BackButton';
import { FilterButton } from '../ui/FilterButton';

interface FindInvestorScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
  hasBusinessMeetupSubscription?: boolean;
}

type ViewMode = 'entry' | 'seeker-discovery' | 'investor-verification' | 'investor-dashboard';
type SubscriptionTier = 'free' | 'gold' | 'platinum' | 'diamond';

interface InvestorProfile {
  id: number;
  name: string;
  firmName: string;
  investorType: string;
  focusIndustries: string[];
  ticketSize: string;
  location: string;
  meetingMode: string[];
  bio: string;
  image: string;
  verified: boolean;
  requestSent?: boolean;
  requestAccepted?: boolean;
}

interface InvestorRequest {
  id: number;
  founderName: string;
  startupName: string;
  industry: string;
  stage: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'ignored';
  date: string;
  slaExpiry?: string;
}

interface MeetingNotification {
  id: number;
  type: 'new_meeting' | 'reminder';
  founderName: string;
  startupName: string;
  dateTime: string;
  meetingMode: 'Online' | 'Offline';
  purpose: string;
  read: boolean;
  timestamp: string;
}

interface UpcomingMeeting {
  id: number;
  founderName: string;
  startupName: string;
  purpose: string;
  dateTime: string;
  duration: string;
  meetingMode: 'Online' | 'Offline';
  location?: string;
  paymentStatus: 'Confirmed';
  remindersSent: string[];
}

export function FindInvestorScreen({ onNavigate, onBack, hasBusinessMeetupSubscription = false }: FindInvestorScreenProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('entry');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedTicketSize, setSelectedTicketSize] = useState('all');
  const [selectedInvestorType, setSelectedInvestorType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedMeetingMode, setSelectedMeetingMode] = useState('all');

  // Subscription tier simulation (Diamond plan active)
  const subscriptionTier: SubscriptionTier = 'diamond';
  const requestsRemaining = subscriptionTier === 'diamond' ? 'unlimited' : 5;

  // Investor verification state - Set to 'verified' to show dashboard
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'pending' | 'verified' | 'rejected'>('verified');
  const [verificationForm, setVerificationForm] = useState({
    fullName: '',
    firmName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    websiteUrl: ''
  });

  // Mock investor data - Set some as accepted to show "Book Meeting" button
  const [investors, setInvestors] = useState<InvestorProfile[]>([
    {
      id: 1,
      name: 'Rajesh Mehta',
      firmName: 'Venture Capital Partners',
      investorType: 'VC Partner',
      focusIndustries: ['Fintech', 'SaaS', 'AI'],
      ticketSize: '₹50L - ₹2Cr',
      location: 'Mumbai',
      meetingMode: ['Online', 'Offline'],
      bio: 'Leading VC with 15+ years experience. Portfolio of 50+ startups across India.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      verified: true,
      requestSent: false,
      requestAccepted: true // DEMO: Show accepted request with "Book Meeting" button
    },
    {
      id: 2,
      name: 'Priya Sharma',
      firmName: 'Angel Syndicate India',
      investorType: 'Angel Investor',
      focusIndustries: ['Healthcare', 'EdTech', 'D2C'],
      ticketSize: '₹10L - ₹50L',
      location: 'Bangalore',
      meetingMode: ['Online'],
      bio: 'Angel investor focused on women-led startups and impact ventures.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      verified: true,
      requestSent: true, // DEMO: Show pending request
      requestAccepted: false
    },
    {
      id: 3,
      name: 'Amit Gupta',
      firmName: 'NextGen Ventures',
      investorType: 'Syndicate Lead',
      focusIndustries: ['Blockchain', 'Web3', 'Crypto'],
      ticketSize: '₹25L - ₹1Cr',
      location: 'Delhi',
      meetingMode: ['Online', 'Offline'],
      bio: 'Early-stage investor specializing in blockchain and decentralized technologies.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      verified: true,
      requestSent: false,
      requestAccepted: false
    },
    {
      id: 4,
      name: 'Neha Kapoor',
      firmName: 'Growth Equity Fund',
      investorType: 'VC Partner',
      focusIndustries: ['E-commerce', 'Retail Tech', 'Logistics'],
      ticketSize: '₹1Cr - ₹5Cr',
      location: 'Mumbai',
      meetingMode: ['Offline'],
      bio: 'Growth-stage investor with expertise in scaling D2C and marketplace businesses.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      verified: true,
      requestSent: false,
      requestAccepted: false
    }
  ]);

  // Mock incoming requests (for investor dashboard)
  const [incomingRequests, setIncomingRequests] = useState<InvestorRequest[]>([
    {
      id: 1,
      founderName: 'Arjun Patel',
      startupName: 'HealthTech Solutions',
      industry: 'Healthcare',
      stage: 'Seed',
      message: 'Looking for seed funding for our AI-powered diagnostic platform.',
      status: 'pending',
      date: '2024-12-18'
    },
    {
      id: 2,
      founderName: 'Sneha Reddy',
      startupName: 'EduLearn Pro',
      industry: 'EdTech',
      stage: 'MVP',
      message: 'Seeking investment to scale our personalized learning platform.',
      status: 'pending',
      date: '2024-12-19'
    }
  ]);

  const handleSendRequest = (investorId: number) => {
    if (subscriptionTier === 'free') {
      // Show subscription required message
      return;
    }
    
    setInvestors(investors.map(inv => 
      inv.id === investorId ? { ...inv, requestSent: true } : inv
    ));
  };

  const handleAcceptRequest = (requestId: number) => {
    setIncomingRequests(incomingRequests.map(req =>
      req.id === requestId ? { ...req, status: 'accepted' } : req
    ));
  };

  const handleRejectRequest = (requestId: number) => {
    setIncomingRequests(incomingRequests.map(req =>
      req.id === requestId ? { ...req, status: 'rejected' } : req
    ));
  };

  const handleSubmitVerification = () => {
    if (!verificationForm.fullName || !verificationForm.firmName || !verificationForm.email || !verificationForm.phone) {
      alert('Please fill all required fields');
      return;
    }
    setVerificationStatus('pending');
  };

  // Entry Screen
  const renderEntryScreen = () => (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header with Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass dark:glass-dark border-b border-white/20 dark:border-gray-800/50 backdrop-blur-xl"
      >
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <BackButton
              onClick={onBack}
              className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center"
            />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2>Find Investors</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connect with verified investors
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two Cards */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Looking for Investors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="glass dark:glass-dark rounded-3xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 cursor-pointer"
            onClick={() => setViewMode('seeker-discovery')}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-3">I Am Looking for Investors</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Find and request meetings with verified investors who match your startup stage and industry.
            </p>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl transition-all">
              Enter
            </button>
          </motion.div>

          {/* Card 2: I Am an Investor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="glass dark:glass-dark rounded-3xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 cursor-pointer"
            onClick={() => setViewMode('investor-verification')}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-3">I Am an Investor</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Create a verified investor profile and receive requests from serious founders.
            </p>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-xl transition-all">
              Continue as Investor
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );

  // Seeker Discovery Screen
  const renderSeekerDiscoveryScreen = () => {
    const filteredInvestors = investors.filter(inv => {
      if (searchQuery && !inv.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !inv.firmName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedIndustry !== 'all' && !inv.focusIndustries.includes(selectedIndustry)) {
        return false;
      }
      if (selectedLocation !== 'all' && inv.location !== selectedLocation) {
        return false;
      }
      if (selectedInvestorType !== 'all' && inv.investorType !== selectedInvestorType) {
        return false;
      }
      return true;
    });

    return (
      <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 glass dark:glass-dark border-b border-white/20 dark:border-gray-800/50 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4 mb-4">
              <BackButton onClick={() => setViewMode('entry')} />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2>Find Investors</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Browse verified investors
                  </p>
                </div>
              </div>
              
              {/* Subscription Status */}
              <div className="ml-auto">
                <button
                  onClick={() => onNavigate('business-meetup-subscription')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all"
                >
                  <Crown className="w-4 h-4" />
                  <span className="text-sm">
                    {subscriptionTier === 'diamond' ? 'Diamond Plan' : 'Manage Subscription'}
                  </span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by investor name, firm, industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm backdrop-blur-xl"
              />
              <FilterButton
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  showFilters ? 'bg-blue-500 text-white' : 'glass dark:glass-dark hover:bg-blue-500 hover:text-white'
                }`}
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 mb-4"
              >
                {/* Industry Filter */}
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Industry</label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {['all', 'Fintech', 'SaaS', 'AI', 'Healthcare', 'EdTech', 'E-commerce', 'Blockchain'].map((industry) => (
                      <button
                        key={industry}
                        onClick={() => setSelectedIndustry(industry)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all ${
                          selectedIndustry === industry
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                            : 'glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10'
                        }`}
                      >
                        {industry === 'all' ? 'All Industries' : industry}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Investor Type Filter */}
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Investor Type</label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {['all', 'Angel Investor', 'VC Partner', 'Syndicate Lead'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedInvestorType(type)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all ${
                          selectedInvestorType === type
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                            : 'glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10'
                        }`}
                      >
                        {type === 'all' ? 'All Types' : type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Location</label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {['all', 'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune'].map((location) => (
                      <button
                        key={location}
                        onClick={() => setSelectedLocation(location)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all ${
                          selectedLocation === location
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                            : 'glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10'
                        }`}
                      >
                        {location === 'all' ? 'All Locations' : location}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Request Counter for Gold/Platinum */}
            {subscriptionTier !== 'free' && subscriptionTier !== 'diamond' && (
              <div className="glass dark:glass-dark rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Requests Remaining:</span>
                </div>
                <span className="text-sm px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {requestsRemaining}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Investor Cards */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredInvestors.map((investor, index) => (
              <motion.div
                key={investor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
              >
                {/* Investor Header */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={investor.image}
                    alt={investor.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg">{investor.name}</h3>
                      {investor.verified && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          <Shield className="w-3 h-3" />
                          <span className="text-xs">Verified</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{investor.firmName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{investor.investorType}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Focus Industries</p>
                      <p className="text-sm">{investor.focusIndustries.join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Typical Ticket Size</p>
                      <p className="text-sm">{investor.ticketSize}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Location</p>
                      <p className="text-sm">{investor.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Meeting Mode</p>
                      <p className="text-sm">{investor.meetingMode.join(', ')}</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{investor.bio}</p>

                {/* Action Button */}
                {investor.requestAccepted ? (
                  <button
                    onClick={() => onNavigate('booking')}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Book Meeting</span>
                  </button>
                ) : investor.requestSent ? (
                  <div className="w-full py-3 rounded-xl bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-2 border border-yellow-500/20">
                    <Clock className="w-5 h-5" />
                    <span>Request Pending</span>
                  </div>
                ) : subscriptionTier === 'free' ? (
                  <button
                    onClick={() => onNavigate('business-meetup-subscription')}
                    className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2 cursor-not-allowed relative group"
                  >
                    <Lock className="w-5 h-5" />
                    <span>Send Request</span>
                    <div className="absolute -top-2 right-0 px-2 py-1 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Subscription Required
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => handleSendRequest(investor.id)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send Request</span>
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {filteredInvestors.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">No investors found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Investor Verification Screen
  const renderInvestorVerificationScreen = () => (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass dark:glass-dark border-b border-white/20 dark:border-gray-800/50 backdrop-blur-xl"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <BackButton
              onClick={() => setViewMode('entry')}
              className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center"
            />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2>Investor Access</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create your verified investor profile
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass dark:glass-dark rounded-2xl p-6 mb-6 backdrop-blur-xl border border-blue-500/20 bg-blue-500/5"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm mb-2">
                <strong>Investor profiles require manual verification and an active subscription.</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                All submitted information will be verified by our admin team within 24-48 hours. You must maintain an active subscription for your profile to remain visible to founders.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Verification Status */}
        {verificationStatus !== 'none' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass dark:glass-dark rounded-2xl p-6 mb-6 backdrop-blur-xl border ${
              verificationStatus === 'verified' 
                ? 'border-green-500/20 bg-green-500/5'
                : verificationStatus === 'pending'
                ? 'border-yellow-500/20 bg-yellow-500/5'
                : 'border-red-500/20 bg-red-500/5'
            }`}
          >
            <div className="flex items-center gap-3">
              {verificationStatus === 'verified' && (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm">✅ Verified Investor</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Your profile is approved and visible to founders
                    </p>
                  </div>
                </>
              )}
              {verificationStatus === 'pending' && (
                <>
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="text-sm">⏳ Verification Pending</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Your application is under review by our admin team
                    </p>
                  </div>
                </>
              )}
              {verificationStatus === 'rejected' && (
                <>
                  <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-sm">❌ Verification Rejected</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Please contact support for more information
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Verification Form */}
        {verificationStatus === 'none' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass dark:glass-dark rounded-2xl p-6 mb-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
          >
            <h3 className="mb-6">Investor Verification</h3>
            
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={verificationForm.fullName}
                    onChange={(e) => setVerificationForm({ ...verificationForm, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Firm/Organization */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                  Firm / Organization <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={verificationForm.firmName}
                    onChange={(e) => setVerificationForm({ ...verificationForm, firmName: e.target.value })}
                    placeholder="Enter your firm or organization name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={verificationForm.email}
                    onChange={(e) => setVerificationForm({ ...verificationForm, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={verificationForm.phone}
                    onChange={(e) => setVerificationForm({ ...verificationForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* LinkedIn */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={verificationForm.linkedinUrl}
                    onChange={(e) => setVerificationForm({ ...verificationForm, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                  Website / Portfolio
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={verificationForm.websiteUrl}
                    onChange={(e) => setVerificationForm({ ...verificationForm, websiteUrl: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmitVerification}
              className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>Submit for Verification</span>
            </button>
          </motion.div>
        )}

        {/* Subscription Requirement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-purple-500/20 bg-purple-500/5"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm mb-2">
                <strong>Active Subscription Required</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                Your investor profile will only be visible to founders when you have an active Business Meetup subscription. Without a subscription, your profile will be hidden from search results.
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                <strong>Benefits for Investors:</strong>
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                <li>• Receive unlimited meeting requests for free</li>
                <li>• Accept requests without any additional payment</li>
                <li>• Profile visibility in investor search</li>
                <li>• Direct access to vetted founders</li>
              </ul>
            </div>
          </div>
          
          {!hasBusinessMeetupSubscription && (
            <button
              onClick={() => onNavigate('business-meetup-subscription')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              <span>Activate Subscription</span>
            </button>
          )}
          
          {hasBusinessMeetupSubscription && (
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Subscription Active</span>
            </div>
          )}
        </motion.div>

        {/* Go to Dashboard Button (if verified) */}
        {verificationStatus === 'verified' && hasBusinessMeetupSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <button
              onClick={() => setViewMode('investor-dashboard')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Briefcase className="w-5 h-5" />
              <span>Go to Investor Dashboard</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );

  // Investor Dashboard Screen
  const renderInvestorDashboardScreen = () => {
    return (
      <InvestorDashboard
        onBack={() => setViewMode('investor-verification')}
        onNavigate={onNavigate}
      />
    );
  };

  return (
    <AnimatePresence mode="wait">
      {viewMode === 'entry' && renderEntryScreen()}
      {viewMode === 'seeker-discovery' && renderSeekerDiscoveryScreen()}
      {viewMode === 'investor-verification' && renderInvestorVerificationScreen()}
      {viewMode === 'investor-dashboard' && renderInvestorDashboardScreen()}
    </AnimatePresence>
  );
}