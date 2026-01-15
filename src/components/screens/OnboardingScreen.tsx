import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../Button';
import { Users, Heart, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Users,
      title: 'Rent a Friend',
      description: 'Connect with amazing people for activities, events, or just hanging out. Make new friends on your schedule.',
      color: 'from-blue-500 to-purple-500',
      image: 'https://images.unsplash.com/photo-1763429642850-aa2de401e3e0?w=800',
    },
    {
      icon: Heart,
      title: 'Blind Date',
      description: 'Experience the thrill of mystery dates. Let our AI match you with compatible partners for meaningful connections.',
      color: 'from-pink-500 to-red-500',
      image: 'https://images.unsplash.com/photo-1615500025837-cf3a8716c83d?w=800',
    },
    {
      icon: Briefcase,
      title: 'Business Meetup',
      description: 'Network with professionals in your industry. Schedule meetings with mentors, partners, or potential clients.',
      color: 'from-green-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?w=800',
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] flex flex-col">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-8 pb-4">
        {slides.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-gradient-to-r from-[#3C82F6] to-[#1F3C88]'
                : 'w-2 bg-gray-300 dark:bg-gray-700'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Slides */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
          >
            {/* Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative w-full max-w-md mb-8"
            >
              <div className="aspect-square rounded-3xl overflow-hidden relative">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className={`absolute top-8 left-1/2 -translate-x-1/2 w-24 h-24 rounded-3xl bg-gradient-to-br ${slide.color} flex items-center justify-center shadow-2xl`}>
                  <Icon className="w-12 h-12 text-white" />
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                className={`absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${slide.color} opacity-20 blur-xl`}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 10, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className={`absolute -bottom-4 -left-4 w-20 h-20 rounded-2xl bg-gradient-to-br ${slide.color} opacity-20 blur-xl`}
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -10, 0],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center max-w-md"
            >
              <h2 className="mb-4">{slide.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {slide.description}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-6 space-y-4"
      >
        <div className="flex gap-4 max-w-md mx-auto">
          {currentSlide > 0 && (
            <Button
              variant="outline"
              size="large"
              onClick={prevSlide}
              icon={<ChevronLeft className="w-5 h-5" />}
            >
              Back
            </Button>
          )}
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={nextSlide}
            icon={currentSlide < slides.length - 1 ? <ChevronRight className="w-5 h-5" /> : undefined}
          >
            {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </div>
        
        {currentSlide < slides.length - 1 && (
          <button
            onClick={onComplete}
            className="w-full text-center text-sm text-gray-500 hover:text-[#3C82F6] dark:hover:text-[#3758FF] transition-colors"
          >
            Skip
          </button>
        )}
      </motion.div>
    </div>
  );
}
