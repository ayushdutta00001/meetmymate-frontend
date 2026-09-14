import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, X, Ban, Edit, Star, Calendar, DollarSign, MapPin, Phone, Mail, User } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
export function FriendMarketplaceProviders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [showReviewPanel, setShowReviewPanel] = useState(false);

  // Sample Providers Data
  const providers = [
    {
      id: 'P-442',
      name: 'Rahul Verma',
      email: 'rahul.verma@email.com',
      phone: '+91 98765 43210',
      status: 'approved',
      services: ['Movie Buddy', 'Dining Partner', 'Party Companion'],
      pricePerHour: 500,
      rating: 4.8,
      totalBookings: 127,
      joinedDate: '2025-11-15',
      photo: 'https://i.pravatar.cc/150?img=12',
      bio: 'Energetic and outgoing person who loves movies, good food, and meeting new people. I enjoy creating memorable experiences and making people feel comfortable.',
      availability: ['Weekends', 'Evenings'],
      location: 'Mumbai, Maharashtra',
      languages: ['Hindi', 'English', 'Marathi'],
      verificationDocs: ['Aadhaar Card', 'PAN Card'],
    },
    {
      id: 'P-338',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@email.com',
      phone: '+91 98123 45678',
      status: 'approved',
      services: ['Dining Partner', 'Explore City', 'Emotional Support'],
      pricePerHour: 600,
      rating: 4.9,
      totalBookings: 89,
      joinedDate: '2025-12-03',
      photo: 'https://i.pravatar.cc/150?img=47',
      bio: 'Friendly foodie and city explorer. Love trying new cuisines and discovering hidden gems in the city. Great listener and conversationalist.',
      availability: ['Weekdays', 'Weekends'],
      location: 'Bangalore, Karnataka',
      languages: ['English', 'Telugu', 'Kannada'],
      verificationDocs: ['Aadhaar Card', 'Driving License'],
    },
    {
      id: 'P-124',
      name: 'Karan Malhotra',
      email: 'karan.malhotra@email.com',
      phone: '+91 97654 32109',
      status: 'pending',
      services: ['Movie Buddy', 'Dining Partner'],
      pricePerHour: 450,
      rating: 0,
      totalBookings: 0,
      joinedDate: '2026-04-12',
      photo: 'https://i.pravatar.cc/150?img=33',
      bio: 'Movie enthusiast and food lover. Looking forward to meeting interesting people and sharing great experiences.',
      availability: ['Weekends'],
      location: 'Delhi, NCR',
      languages: ['Hindi', 'English', 'Punjabi'],
      verificationDocs: ['Aadhaar Card'],
    },
    {
      id: 'P-125',
      name: 'Divya Rao',
      email: 'divya.rao@email.com',
      phone: '+91 96543 21098',
      status: 'pending',
      services: ['Explore City', 'Emotional Support'],
      pricePerHour: 550,
      rating: 0,
      totalBookings: 0,
      joinedDate: '2026-04-12',
      photo: 'https://i.pravatar.cc/150?img=44',
      bio: 'Empathetic listener and city guide. I love helping people explore new places and providing emotional support when needed.',
      availability: ['Weekdays', 'Weekends'],
      location: 'Pune, Maharashtra',
      languages: ['English', 'Hindi', 'Marathi'],
      verificationDocs: ['Aadhaar Card', 'PAN Card'],
    },
    {
      id: 'P-667',
      name: 'Arjun Singh',
      email: 'arjun.singh@email.com',
      phone: '+91 95432 10987',
      status: 'suspended',
      services: ['Party Companion', 'Movie Buddy'],
      pricePerHour: 500,
      rating: 4.6,
      totalBookings: 45,
      joinedDate: '2026-01-22',
      photo: 'https://i.pravatar.cc/150?img=51',
      bio: 'Party person and social butterfly. Love music, dancing, and creating unforgettable moments.',
      availability: ['Weekends'],
      location: 'Goa',
      languages: ['English', 'Hindi'],
      verificationDocs: ['Aadhaar Card'],
    },
    {
      id: 'P-891',
      name: 'Meera Nair',
      email: 'meera.nair@email.com',
      phone: '+91 94321 09876',
      status: 'rejected',
      services: ['Dining Partner'],
      pricePerHour: 400,
      rating: 0,
      totalBookings: 0,
      joinedDate: '2026-04-10',
      photo: 'https://i.pravatar.cc/150?img=26',
      bio: 'Food enthusiast.',
      availability: ['Weekends'],
      location: 'Chennai, Tamil Nadu',
      languages: ['Tamil', 'English'],
      verificationDocs: [],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
      case 'suspended':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400';
    }
  };

  const handleReviewProvider = (provider: any) => {
    setSelectedProvider(provider);
    setShowReviewPanel(true);
  };

  const handleApprove = (providerId: string) => {
    alert(`Approve provider ${providerId}`);
    setShowReviewPanel(false);
  };

  const handleReject = (providerId: string) => {
    alert(`Reject provider ${providerId}`);
    setShowReviewPanel(false);
  };

  const handleSuspend = (providerId: string) => {
    alert(`Suspend provider ${providerId}`);
    setShowReviewPanel(false);
  };

  const handleEdit = (providerId: string) => {
    alert(`Edit provider ${providerId} profile`);
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || provider.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Provider Management</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Review, approve, and manage "Become a Friend" applications
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search providers by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Providers Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Services Offered
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Price/Hour
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredProviders.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={provider.photo}
                        alt={provider.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{provider.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{provider.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(provider.status)}`}>
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {provider.services.slice(0, 2).map((service, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded"
                        >
                          {service}
                        </span>
                      ))}
                      {provider.services.length > 2 && (
                        <span className="text-xs px-2 py-1 bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 rounded">
                          +{provider.services.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">₹{provider.pricePerHour}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {provider.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-900 dark:text-white">{provider.rating}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-500">No rating</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReviewProvider(provider)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Review Application"
                      >
                        <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      {provider.status === 'approved' && (
                        <button
                          onClick={() => handleEdit(provider.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title="Edit Profile"
                        >
                          <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Panel Modal */}
      {showReviewPanel && selectedProvider && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1F2E] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#1A1F2E] z-10">
              <div>
                <h2 className="text-xl text-gray-900 dark:text-white">Provider Application Review</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedProvider.id}</p>
              </div>
              <button
                onClick={() => setShowReviewPanel(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div>
                <span className={`text-sm px-3 py-1 rounded ${getStatusColor(selectedProvider.status)}`}>
                  {selectedProvider.status}
                </span>
              </div>

              {/* Profile Photo & Basic Info */}
              <div className="flex items-start gap-6">
                <img
                  src={selectedProvider.photo}
                  alt={selectedProvider.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl text-gray-900 dark:text-white mb-2">{selectedProvider.name}</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedProvider.email}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {selectedProvider.phone}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {selectedProvider.location}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {selectedProvider.joinedDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Bio</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm text-gray-900 dark:text-white">{selectedProvider.bio}</p>
                </div>
              </div>

              {/* Services Offered */}
              <div>
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Services Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.services.map((service: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Pricing</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  <p className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    ₹{selectedProvider.pricePerHour} per hour
                  </p>
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Availability</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.availability.map((time: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-sm"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProvider.languages.map((lang: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verification Documents */}
              <div>
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Verification Documents</h3>
                {selectedProvider.verificationDocs.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedProvider.verificationDocs.map((doc: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg text-sm flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {doc}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-red-600 dark:text-red-400">No documents submitted</p>
                )}
              </div>

              {/* Statistics (for approved providers) */}
              {selectedProvider.status === 'approved' && (
                <div>
                  <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Performance Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Bookings</p>
                      <p className="text-2xl text-gray-900 dark:text-white">{selectedProvider.totalBookings}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rating</p>
                      <p className="text-2xl text-gray-900 dark:text-white flex items-center gap-2">
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                        {selectedProvider.rating}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                {selectedProvider.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedProvider.id)}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Provider
                    </button>
                    <button
                      onClick={() => handleReject(selectedProvider.id)}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject Application
                    </button>
                  </>
                )}
                {selectedProvider.status === 'approved' && (
                  <>
                    <button
                      onClick={() => handleEdit(selectedProvider.id)}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => handleSuspend(selectedProvider.id)}
                      className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                    >
                      <Ban className="w-4 h-4" />
                      Suspend Provider
                    </button>
                  </>
                )}
                {selectedProvider.status === 'suspended' && (
                  <button
                    onClick={() => handleApprove(selectedProvider.id)}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Reactivate Provider
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
