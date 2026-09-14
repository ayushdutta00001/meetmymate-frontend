import React, { useState } from 'react';
import { Plus, Edit, Trash2, Film, Utensils, PartyPopper, Map, Heart, Save, X } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
export function FriendMarketplaceServices() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Movie Buddy',
      icon: 'Film',
      description: 'Enjoy movies together at cinemas or home',
      isActive: true,
      totalProviders: 87,
    },
    {
      id: 2,
      name: 'Dining Partner',
      icon: 'Utensils',
      description: 'Share meals and discover new restaurants',
      isActive: true,
      totalProviders: 112,
    },
    {
      id: 3,
      name: 'Party Companion',
      icon: 'PartyPopper',
      description: 'Have fun at parties, clubs, and social events',
      isActive: true,
      totalProviders: 64,
    },
    {
      id: 4,
      name: 'Explore City',
      icon: 'Map',
      description: 'Discover tourist spots and hidden gems',
      isActive: true,
      totalProviders: 93,
    },
    {
      id: 5,
      name: 'Emotional Support',
      icon: 'Heart',
      description: 'Get a listening ear and friendly conversation',
      isActive: true,
      totalProviders: 56,
    },
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'Film',
    description: '',
  });

  const iconOptions = [
    { value: 'Film', label: 'Film', component: Film },
    { value: 'Utensils', label: 'Utensils', component: Utensils },
    { value: 'PartyPopper', label: 'Party Popper', component: PartyPopper },
    { value: 'Map', label: 'Map', component: Map },
    { value: 'Heart', label: 'Heart', component: Heart },
  ];

  const getIconComponent = (iconName: string) => {
    const iconObj = iconOptions.find((opt) => opt.value === iconName);
    return iconObj ? iconObj.component : Film;
  };

  const handleEdit = (service: any) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      icon: service.icon,
      description: service.description,
    });
    setShowEditModal(true);
  };

  const handleDelete = (serviceId: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter((s) => s.id !== serviceId));
    }
  };

  const handleAddNew = () => {
    setFormData({
      name: '',
      icon: 'Film',
      description: '',
    });
    setShowAddModal(true);
  };

  const handleSaveEdit = () => {
    setServices(
      services.map((s) =>
        s.id === selectedService.id
          ? { ...s, name: formData.name, icon: formData.icon, description: formData.description }
          : s
      )
    );
    setShowEditModal(false);
  };

  const handleSaveNew = () => {
    const newService = {
      id: services.length + 1,
      name: formData.name,
      icon: formData.icon,
      description: formData.description,
      isActive: true,
      totalProviders: 0,
    };
    setServices([...services, newService]);
    setShowAddModal(false);
  };

  const toggleServiceStatus = (serviceId: number) => {
    setServices(
      services.map((s) => (s.id === serviceId ? { ...s, isActive: !s.isActive } : s))
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Services Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Control what services are available in "Book a Friend"
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const IconComponent = getIconComponent(service.icon);
          return (
            <div
              key={service.id}
              className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6 relative"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => toggleServiceStatus(service.id)}
                  className={`text-xs px-2 py-1 rounded ${
                    service.isActive
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400'
                  }`}
                >
                  {service.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* Icon */}
              <div className="w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4">
                <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>

              {/* Content */}
              <h3 className="text-lg text-gray-900 dark:text-white mb-2">{service.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Providers</p>
                  <p className="text-lg text-gray-900 dark:text-white">{service.totalProviders}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Edit Service"
                  >
                    <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1F2E] rounded-xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl text-gray-900 dark:text-white">Edit Service</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Service Name */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter service name"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter service description"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1F2E] rounded-xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl text-gray-900 dark:text-white">Add New Service</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Service Name */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter service name"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter service description"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNew}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
