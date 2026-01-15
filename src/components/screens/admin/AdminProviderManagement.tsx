import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  X,
  Upload,
  Star,
  CheckCircle,
  XCircle,
  Download,
} from 'lucide-react';
import { Card } from '../../Card';

interface AdminProviderManagementProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function AdminProviderManagement({ onNavigate, onBack }: AdminProviderManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    category: 'rent-friend',
    price: '',
    bio: '',
    interests: '',
    city: '',
  });

  const providers = [
    {
      id: 1,
      name: 'Priya Sharma',
      image: 'https://images.unsplash.com/photo-1543807641-bd607cfa8dca?w=200',
      category: 'Rent a Friend',
      rating: 4.8,
      reviews: 127,
      price: 500,
      status: 'active',
      totalBookings: 156,
      joinDate: '2024-03-15',
    },
    {
      id: 2,
      name: 'Rahul Verma',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      category: 'Business Meetup',
      rating: 4.9,
      reviews: 203,
      price: 600,
      status: 'active',
      totalBookings: 142,
      joinDate: '2024-02-20',
    },
    {
      id: 3,
      name: 'Ananya Desai',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      category: 'Blind Date',
      rating: 4.7,
      reviews: 89,
      price: 450,
      status: 'inactive',
      totalBookings: 128,
      joinDate: '2024-04-10',
    },
    {
      id: 4,
      name: 'Arjun Mehta',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      category: 'Rent a Friend',
      rating: 5.0,
      reviews: 156,
      price: 700,
      status: 'active',
      totalBookings: 134,
      joinDate: '2024-01-05',
    },
    {
      id: 5,
      name: 'Sneha Patel',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      category: 'Blind Date',
      rating: 4.8,
      reviews: 142,
      price: 550,
      status: 'active',
      totalBookings: 98,
      joinDate: '2024-05-12',
    },
    {
      id: 6,
      name: 'Vikram Singh',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
      category: 'Business Meetup',
      rating: 4.9,
      reviews: 187,
      price: 800,
      status: 'active',
      totalBookings: 176,
      joinDate: '2023-12-08',
    },
  ];

  const categories = ['all', 'Rent a Friend', 'Blind Date', 'Business Meetup'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New provider:', formData);
    setShowAddModal(false);
    // Reset form
    setFormData({
      name: '',
      age: '',
      email: '',
      phone: '',
      category: 'rent-friend',
      price: '',
      bio: '',
      interests: '',
      city: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="mb-2">Provider Management</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage all service providers on the platform
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 glass dark:glass-dark rounded-full text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white rounded-full text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Provider
              </motion.button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search providers by name, email, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-sm"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                      : 'glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10'
                  }`}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Providers', value: '856', color: 'from-blue-500 to-cyan-500' },
            { label: 'Active', value: '734', color: 'from-green-500 to-teal-500' },
            { label: 'Inactive', value: '122', color: 'from-orange-500 to-red-500' },
            { label: 'Pending Approval', value: '24', color: 'from-purple-500 to-pink-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card variant="glass">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <span className="text-white text-lg">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Table View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Provider
                    </th>
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Category
                    </th>
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Rating
                    </th>
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Price/hr
                    </th>
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Bookings
                    </th>
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((provider, index) => (
                    <motion.tr
                      key={provider.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={provider.image}
                            alt={provider.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm">{provider.name}</p>
                            <p className="text-xs text-gray-500">
                              Joined {new Date(provider.joinDate).toLocaleDateString('en-US', { 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs bg-[#F2F4F7] dark:bg-[#0A0F1F]">
                          {provider.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{provider.rating}</span>
                          <span className="text-xs text-gray-500">({provider.reviews})</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">₹{provider.price}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">{provider.totalBookings}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                          provider.status === 'active'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-gray-500/10 text-gray-500'
                        }`}>
                          {provider.status === 'active' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 rounded-full glass dark:glass-dark flex items-center justify-center hover:bg-white/20 dark:hover:bg-white/10"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 rounded-full glass dark:glass-dark flex items-center justify-center hover:bg-white/20 dark:hover:bg-white/10"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 rounded-full glass dark:glass-dark flex items-center justify-center hover:bg-red-500/20 text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing 1-6 of 856 providers
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-full glass dark:glass-dark text-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                  Previous
                </button>
                <button className="px-4 py-2 rounded-full bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white text-sm">
                  1
                </button>
                <button className="px-4 py-2 rounded-full glass dark:glass-dark text-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                  2
                </button>
                <button className="px-4 py-2 rounded-full glass dark:glass-dark text-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                  3
                </button>
                <button className="px-4 py-2 rounded-full glass dark:glass-dark text-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                  Next
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Add Provider Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <Card variant="glass" className="relative">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full glass dark:glass-dark flex items-center justify-center hover:bg-white/20 dark:hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="mb-6">Add New Provider</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Profile Image Upload */}
                  <div>
                    <label className="block text-sm mb-2">Profile Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 glass dark:glass-dark rounded-full text-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all"
                      >
                        Upload Photo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-sm"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Age *</label>
                      <input
                        type="number"
                        required
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-sm"
                        placeholder="Enter age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-sm"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-sm"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Category *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-sm"
                      >
                        <option value="rent-friend">Rent a Friend</option>
                        <option value="blind-date">Blind Date</option>
                        <option value="business-meetup">Business Meetup</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Price per Hour *</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-sm"
                        placeholder="500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-2">City *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-sm"
                        placeholder="Mumbai, India"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-2">Bio *</label>
                      <textarea
                        required
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-sm resize-none"
                        placeholder="Write a short bio..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-2">Interests (comma separated)</label>
                      <input
                        type="text"
                        value={formData.interests}
                        onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-sm"
                        placeholder="Coffee, Travel, Art, Music"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-3 glass dark:glass-dark rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white rounded-full hover:shadow-lg transition-all"
                    >
                      Add Provider
                    </button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
