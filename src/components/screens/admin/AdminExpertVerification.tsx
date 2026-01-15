import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  UserCheck,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Award,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Download,
  Star,
  TrendingUp,
} from 'lucide-react';

interface ExpertApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  location: string;
  expertise: string;
  yearsOfExperience: number;
  currentRole: string;
  company: string;
  linkedinUrl: string;
  portfolioUrl?: string;
  proposedHourlyRate: number;
  bio: string;
  achievements: string[];
  certifications: string[];
  references: string[];
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  reviewNotes?: string;
  documents: {
    resume: string;
    idProof: string;
    certifications: string[];
  };
}

export function AdminExpertVerification() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'under-review' | 'all'>('pending');
  const [selectedExpert, setSelectedExpert] = useState<ExpertApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  // Mock expert applications
  const applications: ExpertApplication[] = [
    {
      id: 'EXP-APP-001',
      applicantName: 'Rajesh Kumar',
      email: 'rajesh.k@email.com',
      phone: '+91 98765 11111',
      location: 'Mumbai, India',
      expertise: 'Startup Strategy',
      yearsOfExperience: 15,
      currentRole: 'CEO & Founder',
      company: 'TechVentures Inc',
      linkedinUrl: 'linkedin.com/in/rajeshkumar',
      portfolioUrl: 'rajeshkumar.com',
      proposedHourlyRate: 5000,
      bio: 'Serial entrepreneur with 15+ years of experience. Founded and exited 3 successful startups. Specializing in Series A fundraising and go-to-market strategies.',
      achievements: [
        'Raised $50M+ in venture funding',
        'Mentored 200+ startups',
        '3 successful exits',
        'Featured speaker at TechCrunch Disrupt',
      ],
      certifications: [
        'Stanford GSB Executive Program',
        'Y Combinator Alumni',
        'Certified Business Coach',
      ],
      references: [
        'Amit Verma - Partner, Sequoia Capital',
        'Priya Mehta - VP, Google India',
      ],
      applicationDate: '2024-12-20 10:30',
      status: 'pending',
      documents: {
        resume: 'resume_rajesh_kumar.pdf',
        idProof: 'aadhar_rajesh.pdf',
        certifications: ['stanford_cert.pdf', 'yc_cert.pdf'],
      },
    },
    {
      id: 'EXP-APP-002',
      applicantName: 'Priya Mehta',
      email: 'priya.m@email.com',
      phone: '+91 98765 22222',
      location: 'Bangalore, India',
      expertise: 'Marketing Strategy',
      yearsOfExperience: 10,
      currentRole: 'Marketing Director',
      company: 'Brand Solutions Ltd',
      linkedinUrl: 'linkedin.com/in/priyamehta',
      proposedHourlyRate: 3500,
      bio: 'Digital marketing expert with proven track record in scaling brands from 0 to millions in revenue. Specializing in growth hacking and performance marketing.',
      achievements: [
        'Scaled 5 brands to 7-figure revenue',
        'Google Marketing Expert',
        'Won Best Campaign Award 2023',
      ],
      certifications: [
        'Google Ads Certified',
        'Facebook Blueprint Certified',
        'HubSpot Inbound Marketing',
      ],
      references: [
        'Sandeep Roy - CMO, Flipkart',
      ],
      applicationDate: '2024-12-21 14:00',
      status: 'approved',
      reviewNotes: 'Excellent credentials. Approved for platform.',
      documents: {
        resume: 'resume_priya_mehta.pdf',
        idProof: 'pan_priya.pdf',
        certifications: ['google_cert.pdf', 'fb_cert.pdf'],
      },
    },
    {
      id: 'EXP-APP-003',
      applicantName: 'Amit Verma',
      email: 'amit.v@email.com',
      phone: '+91 98765 33333',
      location: 'Delhi, India',
      expertise: 'Tech Innovation',
      yearsOfExperience: 12,
      currentRole: 'CTO',
      company: 'AI Solutions Inc',
      linkedinUrl: 'linkedin.com/in/amitverma',
      proposedHourlyRate: 6000,
      bio: 'Technology leader with expertise in AI/ML, cloud architecture, and product development. Built and scaled tech teams from 5 to 100+ engineers.',
      achievements: [
        'Built AI products serving 10M+ users',
        'Patent holder (3 patents)',
        'TEDx Speaker on AI Ethics',
      ],
      certifications: [
        'AWS Certified Solutions Architect',
        'Google Cloud Professional',
        'MIT AI & ML Certificate',
      ],
      references: [
        'Dr. Sharma - Professor, IIT Delhi',
        'Lisa Chen - VP Engineering, Microsoft',
      ],
      applicationDate: '2024-12-19 09:00',
      status: 'under-review',
      reviewNotes: 'Checking references. Credentials look strong.',
      documents: {
        resume: 'resume_amit_verma.pdf',
        idProof: 'aadhar_amit.pdf',
        certifications: ['aws_cert.pdf', 'gcp_cert.pdf', 'mit_cert.pdf'],
      },
    },
    {
      id: 'EXP-APP-004',
      applicantName: 'Sanjay Gupta',
      email: 'sanjay.g@email.com',
      phone: '+91 98765 44444',
      location: 'Mumbai, India',
      expertise: 'Financial Planning',
      yearsOfExperience: 8,
      currentRole: 'Senior Financial Advisor',
      company: 'Wealth Partners',
      linkedinUrl: 'linkedin.com/in/sanjaygupta',
      proposedHourlyRate: 4500,
      bio: 'Chartered Accountant with expertise in business financial planning, tax optimization, and investment strategies for startups and SMEs.',
      achievements: [
        'Managed portfolios worth ₹500Cr+',
        'Advised 100+ businesses',
        'Regular contributor to Economic Times',
      ],
      certifications: [
        'Chartered Accountant (CA)',
        'Certified Financial Planner (CFP)',
      ],
      references: [
        'Ravi Kumar - CFO, Tata Group',
      ],
      applicationDate: '2024-12-18 16:00',
      status: 'rejected',
      reviewNotes: 'Insufficient years of experience for proposed rate. Needs 10+ years.',
      documents: {
        resume: 'resume_sanjay_gupta.pdf',
        idProof: 'pan_sanjay.pdf',
        certifications: ['ca_cert.pdf', 'cfp_cert.pdf'],
      },
    },
  ];

  const stats = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    underReview: applications.filter(a => a.status === 'under-review').length,
  };

  const filteredApplications = applications.filter(app => {
    const matchesTab = activeTab === 'all' || app.status === activeTab;
    const matchesSearch =
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.expertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'under-review':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleApprove = (appId: string, notes: string) => {
    console.log('Approving application:', appId, 'Notes:', notes);
    setShowDetailsModal(false);
    setReviewNotes('');
  };

  const handleReject = (appId: string, notes: string) => {
    console.log('Rejecting application:', appId, 'Notes:', notes);
    setShowDetailsModal(false);
    setReviewNotes('');
  };

  const handleMarkUnderReview = (appId: string, notes: string) => {
    console.log('Marking under review:', appId, 'Notes:', notes);
    setShowDetailsModal(false);
    setReviewNotes('');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl mb-2">Expert Verification & Approval</h2>
            <p className="text-gray-600">Review and approve expert applications for Business Meetup</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-xl hover:bg-gray-50 transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-xl hover:bg-gray-50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">Total</p>
              <UserCheck className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl mb-1">{stats.all}</p>
            <p className="text-xs text-gray-500">Applications</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">Pending</p>
              <Clock className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-2xl mb-1">{stats.pending}</p>
            <p className="text-xs text-gray-500">Need review</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">Under Review</p>
              <AlertCircle className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl mb-1">{stats.underReview}</p>
            <p className="text-xs text-gray-500">In progress</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 shadow-lg text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/90">Approved</p>
              <CheckCircle className="w-4 h-4" />
            </div>
            <p className="text-2xl mb-1">{stats.approved}</p>
            <p className="text-xs text-white/80">Active experts</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 shadow-lg text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/90">Rejected</p>
              <XCircle className="w-4 h-4" />
            </div>
            <p className="text-2xl mb-1">{stats.rejected}</p>
            <p className="text-xs text-white/80">Declined</p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 p-1 bg-white/70 rounded-xl border border-gray-200/50 backdrop-blur-xl overflow-x-auto">
          {(['pending', 'under-review', 'approved', 'rejected', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 rounded-lg transition-all text-sm whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={{ fontWeight: activeTab === tab ? 600 : 500 }}
            >
              {tab === 'under-review' ? 'Under Review' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== 'all' && ` (${tab === 'under-review' ? stats.underReview : stats[tab]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by application ID, name, expertise, or email..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-xl focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Application ID</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Expertise</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Proposed Rate</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Application Date</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-gray-900">{app.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm">
                        {app.applicantName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{app.applicantName}</p>
                        <p className="text-xs text-gray-500">{app.currentRole}</p>
                        <p className="text-xs text-gray-400">{app.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{app.expertise}</p>
                      <p className="text-xs text-gray-500">{app.company}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{app.yearsOfExperience} years</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">₹{app.proposedHourlyRate.toLocaleString()}/hr</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-500">{app.applicationDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedExpert(app);
                        setReviewNotes(app.reviewNotes || '');
                        setShowDetailsModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-1">No applications found</p>
            <p className="text-sm text-gray-500">Expert applications will appear here</p>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showDetailsModal && selectedExpert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="mb-2">Expert Application Review</h3>
                  <p className="text-sm text-gray-600">{selectedExpert.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(selectedExpert.status)}`}>
                  {selectedExpert.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-sm mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Personal Information
                </h4>
                <div className="p-4 rounded-lg bg-blue-50 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm">{selectedExpert.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {selectedExpert.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {selectedExpert.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedExpert.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div>
                <h4 className="text-sm mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Professional Details
                </h4>
                <div className="p-4 rounded-lg bg-purple-50 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Expertise</p>
                      <p className="text-sm">{selectedExpert.expertise}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Years of Experience</p>
                      <p className="text-sm">{selectedExpert.yearsOfExperience} years</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Current Role</p>
                      <p className="text-sm">{selectedExpert.currentRole}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Company</p>
                      <p className="text-sm">{selectedExpert.company}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Proposed Hourly Rate</p>
                    <p className="text-2xl text-purple-600">₹{selectedExpert.proposedHourlyRate.toLocaleString()}/hr</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bio</p>
                    <p className="text-sm text-gray-700">{selectedExpert.bio}</p>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h4 className="text-sm mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Key Achievements
                </h4>
                <div className="p-4 rounded-lg bg-green-50">
                  <ul className="space-y-2">
                    {selectedExpert.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Star className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="text-sm mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Certifications
                </h4>
                <div className="p-4 rounded-lg bg-amber-50">
                  <div className="flex flex-wrap gap-2">
                    {selectedExpert.certifications.map((cert, index) => (
                      <span key={index} className="px-3 py-1 bg-white rounded-full text-sm border border-amber-200">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* References */}
              <div>
                <h4 className="text-sm mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  References
                </h4>
                <div className="p-4 rounded-lg bg-gray-50">
                  <ul className="space-y-2">
                    {selectedExpert.references.map((ref, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>{ref}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h4 className="text-sm mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Submitted Documents
                </h4>
                <div className="p-4 rounded-lg bg-gray-50 space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-sm">Resume/CV</span>
                    <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {selectedExpert.documents.resume}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-sm">ID Proof</span>
                    <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {selectedExpert.documents.idProof}
                    </button>
                  </div>
                  {selectedExpert.documents.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <span className="text-sm">Certificate {index + 1}</span>
                      <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {cert}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Notes */}
              <div>
                <h4 className="text-sm mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Admin Review Notes
                </h4>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add your review notes here..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-all resize-none"
                  rows={4}
                />
              </div>

              {/* Previous Review Notes */}
              {selectedExpert.reviewNotes && (
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-600 mb-1">Previous Review Notes:</p>
                  <p className="text-sm text-blue-900">{selectedExpert.reviewNotes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setReviewNotes('');
                }}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all"
              >
                Close
              </button>
              {selectedExpert.status !== 'approved' && selectedExpert.status !== 'rejected' && (
                <>
                  <button
                    onClick={() => handleMarkUnderReview(selectedExpert.id, reviewNotes)}
                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Mark Under Review
                  </button>
                  <button
                    onClick={() => handleReject(selectedExpert.id, reviewNotes)}
                    className="flex-1 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleApprove(selectedExpert.id, reviewNotes)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Expert
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
