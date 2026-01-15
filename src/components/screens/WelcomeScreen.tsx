import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../Button';
import { Logo } from '../Logo';
import { Users, Heart, Briefcase } from 'lucide-react';

interface WelcomeScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export function WelcomeScreen({ onSignIn, onSignUp }: WelcomeScreenProps) {
  const features = [
    { icon: Users, label: 'Rent a Friend', color: 'from-blue-500 to-purple-500' },
    { icon: Heart, label: 'Blind Dates', color: 'from-pink-500 to-red-500' },
    { icon: Briefcase, label: 'Business Meetups', color: 'from-green-500 to-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3C82F6] via-[#1F3C88] to-[#3758FF] dark:from-[#0A0F1F] dark:via-[#1F3C88] dark:to-[#0A0F1F] relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#FFF27C]/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1 }}
          className="mb-12"
        >
          <Logo size="large" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12 max-w-md"
        >
          <h2 className="text-white mb-4">
            Connect, Meet, Grow
          </h2>
          <p className="text-white/80">
            Your time is valuable. Book meaningful connections for friendship, romance, or business.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-12 max-w-2xl"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`glass rounded-2xl p-6 flex flex-col items-center gap-3 min-w-[140px]`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-white text-sm text-center">{feature.label}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full max-w-md space-y-4"
        >
          <Button
            variant="secondary"
            size="large"
            fullWidth
            onClick={onSignUp}
          >
            Create Account
          </Button>
          <Button
            variant="glass"
            size="large"
            fullWidth
            onClick={onSignIn}
          >
            Sign In
          </Button>
        </motion.div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-white/60 text-sm mt-8 text-center"
        >
          By continuing, you agree to our Terms & Conditions
        </motion.p>
      </div>
    </div>
  );
}