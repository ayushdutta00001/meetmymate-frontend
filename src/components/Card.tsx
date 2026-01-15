import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Card({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick,
}: CardProps) {
  const variants = {
    default: 'bg-white dark:bg-[#0A0F1F] shadow-lg',
    glass: 'glass dark:glass-dark',
    gradient: 'bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] text-white',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={`
        rounded-3xl p-6
        ${variants[variant]}
        ${hover ? 'transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
}

interface ProfileCardProps {
  name: string;
  age?: number;
  city: string;
  image: string;
  price?: number;
  rating?: number;
  bio?: string;
  onClick?: () => void;
  availability?: boolean;
}

export function ProfileCard({
  name,
  age,
  city,
  image,
  price,
  rating,
  bio,
  onClick,
  availability = true,
}: ProfileCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Horizontal Card Layout */}
      <div className="glass dark:glass-dark rounded-2xl overflow-hidden transition-all duration-300 flex flex-row h-32">
        {/* Image Section - Small & Left Side */}
        <div className="relative w-28 h-full flex-shrink-0 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
          
          {/* Rating Badge - Small Corner */}
          {rating && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-white text-xs">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Content Section - Right Side */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          {/* Top Section - Name & Status */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg truncate" style={{ fontWeight: 700 }}>
                {age ? `${name}, ${age}` : name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 truncate">
                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {city}
              </p>
            </div>
            
            {/* Availability Badge - Compact */}
            <div className={`px-2 py-0.5 rounded-full text-xs backdrop-blur-md flex-shrink-0 ${
              availability 
                ? 'bg-green-500/90 text-white' 
                : 'bg-red-500/90 text-white'
            }`}>
              {availability ? '● Online' : '● Busy'}
            </div>
          </div>

          {/* Bio - Single line */}
          {bio && (
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1 leading-relaxed">
              {bio}
            </p>
          )}

          {/* Bottom Section - Price & Action */}
          {price !== undefined ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-1">
                <span className="text-[#3C82F6] dark:text-[#3758FF] text-lg" style={{ fontWeight: 700 }}>
                  ₹{price}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">/hr</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1.5 bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white rounded-full text-xs hover:shadow-xl transition-all"
                style={{ fontWeight: 600 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
              >
                Book Now
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1.5 bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white rounded-full text-xs hover:shadow-xl transition-all"
                style={{ fontWeight: 600 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
              >
                View Profile
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}