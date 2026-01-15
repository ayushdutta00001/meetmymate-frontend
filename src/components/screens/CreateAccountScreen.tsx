import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Logo } from '../Logo';
import { User, Phone, Mail, Lock } from 'lucide-react';
import { BackButton } from '../ui/BackButton';

interface CreateAccountScreenProps {
  onCreateAccount: () => void;
  onBack: () => void;
}

export function CreateAccountScreen({ onCreateAccount, onBack }: CreateAccountScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onCreateAccount();
    }, 1500);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#3C82F6] to-[#1F3C88] opacity-20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="relative z-10 min-h-screen flex flex-col px-4 py-6 overflow-y-auto">
        {/* Back button */}
        <BackButton onClick={onBack} />

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-6"
          >
            <Logo size="small" />
            <h2 className="mt-4 text-center">Create Account</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mt-1">
              Join Meet my Mate and start connecting
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              icon={<User className="w-5 h-5" />}
              required
            />

            <Input
              type="tel"
              label="Phone Number"
              placeholder="9876543210"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              icon={<Phone className="w-5 h-5" />}
              required
            />

            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              type="password"
              label="Create Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              helperText="Minimum 6 characters"
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              required
            />

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
              >
                Create Account
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onBack}
                className="text-[#3C82F6] dark:text-[#3758FF] hover:underline"
              >
                Sign In
              </button>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}