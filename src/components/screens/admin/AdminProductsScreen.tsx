import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Edit, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';

interface Product {
  id: number;
  image: string;
  title: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
}

export function AdminProductsScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400',
      title: 'Premium Date Package',
      category: 'Blind Dates',
      price: 2500,
      description: 'Curated blind date experience at premium restaurants',
      available: true,
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
      title: 'Business Consultation',
      category: 'Business Meetup',
      price: 3500,
      description: 'One-on-one business strategy consultation session',
      available: true,
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400',
      title: 'Weekend Companion',
      category: 'Rent a Friend',
      price: 1800,
      description: 'Full day weekend companionship for events or activities',
      available: true,
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400',
      title: 'Networking Event Access',
      category: 'Business Meetup',
      price: 5000,
      description: 'VIP access to exclusive business networking events',
      available: false,
    },
  ]);

  const categories = ['Rent a Friend', 'Blind Dates', 'Business Meetup'];

  const handleAddProduct = (formData: Partial<Product>) => {
    const newProduct: Product = {
      id: products.length + 1,
      image: formData.image || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400',
      title: formData.title || '',
      category: formData.category || categories[0],
      price: formData.price || 0,
      description: formData.description || '',
      available: formData.available ?? true,
    };
    setProducts([...products, newProduct]);
    setShowAddModal(false);
  };

  const handleEditProduct = (formData: Partial<Product>) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="mb-2">Product Management</h2>
          <p className="text-sm text-gray-600">Manage all platform products and services</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/30"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm" style={{ fontWeight: 600 }}>Add New Product</span>
        </motion.button>
      </div>

      {/* Search & Filter */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 backdrop-blur-xl bg-white/70 border border-gray-200 rounded-xl focus:border-[#3C82F6] transition-all outline-none text-sm"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
          >
            {/* Product Image */}
            <div className="relative h-48 overflow-hidden">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 flex gap-2">
                <span className={`px-2 py-1 rounded-lg text-xs backdrop-blur-md ${
                  product.available ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
                }`} style={{ fontWeight: 600 }}>
                  {product.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="mb-2">
                <span className="text-xs text-gray-500">{product.category}</span>
                <h3 className="text-base mt-1">{product.title}</h3>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg text-[#3C82F6]" style={{ fontWeight: 700 }}>₹{product.price}</span>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditingProduct(product)}
                    className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteProduct(product.id)}
                    className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      <ProductFormModal
        isOpen={showAddModal || !!editingProduct}
        onClose={() => {
          setShowAddModal(false);
          setEditingProduct(null);
        }}
        onSave={editingProduct ? handleEditProduct : handleAddProduct}
        product={editingProduct}
        categories={categories}
      />
    </div>
  );
}

// Product Form Modal Component
interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
  product: Product | null;
  categories: string[];
}

function ProductFormModal({ isOpen, onClose, onSave, product, categories }: ProductFormModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || { title: '', category: categories[0], price: 0, description: '', available: true, image: '' }
  );

  React.useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({ title: '', category: categories[0], price: 0, description: '', available: true, image: '' });
    }
  }, [product, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl backdrop-blur-xl bg-white/90 border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Product Name */}
                <div>
                  <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter product name"
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:border-[#3C82F6] transition-all outline-none text-sm"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:border-[#3C82F6] transition-all outline-none text-sm"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="Enter price"
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:border-[#3C82F6] transition-all outline-none text-sm"
                    required
                    min="0"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:border-[#3C82F6] transition-all outline-none text-sm resize-none"
                    required
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
                    Image URL
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full pl-12 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:border-[#3C82F6] transition-all outline-none text-sm"
                    />
                  </div>
                  {formData.image && (
                    <div className="mt-3">
                      <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                    </div>
                  )}
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="available"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-[#3C82F6] focus:ring-[#3C82F6]"
                  />
                  <label htmlFor="available" className="text-sm" style={{ fontWeight: 600 }}>
                    Product is available for purchase
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white rounded-xl shadow-lg shadow-blue-500/30"
                    style={{ fontWeight: 600 }}
                  >
                    {product ? 'Save Changes' : 'Add Product'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
