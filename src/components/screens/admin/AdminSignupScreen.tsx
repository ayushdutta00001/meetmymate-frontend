import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from '../../Logo';
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';

interface AdminSignupScreenProps {
  onSignup: (adminData: AdminSignupData) => void;
  onBackToLogin: () => void;
}

export interface AdminSignupData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

export function AdminSignupScreen({ onSignup, onBackToLogin }: AdminSignupScreenProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Admin',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Success! Show success message
      setSuccess(true);
      
      // Wait 2 seconds then call the onSignup callback
      setTimeout(() => {
        onSignup({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role,
        });
      }, 2000);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2F4F7] via-[#E8EBF0] to-[#F2F4F7] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-md"
        >
          <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-8 shadow-2xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="mb-3">Account Created Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your admin account has been created. You can now sign in with your credentials.
            </p>
            <div className="backdrop-blur-xl bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2" style={{ fontWeight: 600 }}>
                Your Login Credentials:
              </p>
              <p className="text-sm text-gray-600">Email: {formData.email}</p>
              <p className="text-sm text-gray-600">Role: {formData.role}</p>
            </div>
            <p className="text-xs text-gray-500">Redirecting to login...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F4F7] via-[#E8EBF0] to-[#F2F4F7] flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#3C82F6]/20 to-[#3758FF]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#8EA8FF]/20 to-[#3C82F6]/20 rounded-full blur-3xl"
        />
      </div>

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Glassmorphic Card */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="mb-2">Create Admin Account</h2>
            <p className="text-sm text-gray-600">
              Register as a new administrator
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-3 bg-white/50 border-2 rounded-xl focus:bg-white transition-all outline-none text-sm ${
                    errors.fullName ? 'border-red-300' : 'border-gray-200 focus:border-[#3C82F6]'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="admin@meetmymate.com"
                  className={`w-full pl-12 pr-4 py-3 bg-white/50 border-2 rounded-xl focus:bg-white transition-all outline-none text-sm ${
                    errors.email ? 'border-red-300' : 'border-gray-200 focus:border-[#3C82F6]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full pl-12 pr-4 py-3 bg-white/50 border-2 rounded-xl focus:bg-white transition-all outline-none text-sm ${
                    errors.phone ? 'border-red-300' : 'border-gray-200 focus:border-[#3C82F6]'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
                Admin Role <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-[#3C82F6] focus:bg-white transition-all outline-none text-sm"
              >
                <option value="Admin">Admin</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Content Moderator">Content Moderator</option>
                <option value="Support Manager">Support Manager</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Minimum 8 characters"
                  className={`w-full pl-12 pr-4 py-3 bg-white/50 border-2 rounded-xl focus:bg-white transition-all outline-none text-sm ${
                    errors.password ? 'border-red-300' : 'border-gray-200 focus:border-[#3C82F6]'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full pl-12 pr-4 py-3 bg-white/50 border-2 rounded-xl focus:bg-white transition-all outline-none text-sm ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-200 focus:border-[#3C82F6]'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                  className={`w-5 h-5 mt-0.5 rounded border-gray-300 text-[#3C82F6] focus:ring-[#3C82F6] ${
                    errors.terms ? 'border-red-300' : ''
                  }`}
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <button type="button" className="text-[#3C82F6] hover:underline">
                    Terms and Conditions
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-[#3C82F6] hover:underline">
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              style={{ fontWeight: 600 }}
            >
              Create Admin Account
            </motion.button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onBackToLogin}
                className="text-[#3C82F6] hover:underline"
                style={{ fontWeight: 600 }}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-4 backdrop-blur-xl bg-white/50 border border-white/40 rounded-2xl"
        >
          <p className="text-xs text-gray-600 text-center">
            🔒 Your information is encrypted and secure
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
