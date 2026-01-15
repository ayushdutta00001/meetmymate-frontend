import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  showText?: boolean;
}

export function Logo({ size = 'medium', animated = false, showText = true }: LogoProps) {
  const sizeMap = {
    small: { icon: 45, text: '1.2rem', tagline: '0.5rem' },
    medium: { icon: 65, text: '1.8rem', tagline: '0.65rem' },
    large: { icon: 85, text: '2.4rem', tagline: '0.8rem' },
  };

  const dimensions = sizeMap[size];
  const MotionWrapper = animated ? motion.div : 'div';

  return (
    <MotionWrapper
      className="flex items-center gap-3"
      {...(animated && {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: 'spring', stiffness: 200, damping: 18, delay: 0.2 },
      })}
    >
      {/* Unique Colorful M Logo */}
      <div 
        className="relative flex items-center justify-center"
        style={{ 
          width: dimensions.icon, 
          height: dimensions.icon,
        }}
      >
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Multi-color gradient for the M */}
            <linearGradient id="mGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3C82F6" />
              <stop offset="50%" stopColor="#1F3C88" />
              <stop offset="100%" stopColor="#3758FF" />
            </linearGradient>
            
            <linearGradient id="mGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF27C" />
              <stop offset="50%" stopColor="#3C82F6" />
              <stop offset="100%" stopColor="#1F3C88" />
            </linearGradient>

            <linearGradient id="mGradient3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3758FF" />
              <stop offset="50%" stopColor="#3C82F6" />
              <stop offset="100%" stopColor="#FFF27C" />
            </linearGradient>

            {/* Glow effect */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Shadow */}
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Background circle with gradient */}
          <circle 
            cx="50" 
            cy="50" 
            r="48" 
            fill="url(#mGradient1)" 
            opacity="0.1"
            filter="url(#glow)"
          />

          {/* Stylized M - Made of three geometric shapes */}
          {/* Left pillar of M */}
          <path
            d="M 25 65 L 25 35 L 32 35 L 32 65 Z"
            fill="url(#mGradient1)"
            filter="url(#shadow)"
          />
          
          {/* Left diagonal - with rounded end */}
          <path
            d="M 32 35 L 45 55 L 50 52 L 37 32 L 32 35 Z"
            fill="url(#mGradient2)"
            filter="url(#shadow)"
          />
          
          {/* Right diagonal - with rounded end */}
          <path
            d="M 50 52 L 63 32 L 68 35 L 55 55 L 50 52 Z"
            fill="url(#mGradient3)"
            filter="url(#shadow)"
          />
          
          {/* Right pillar of M */}
          <path
            d="M 68 35 L 75 35 L 75 65 L 68 65 Z"
            fill="url(#mGradient1)"
            filter="url(#shadow)"
          />

          {/* Center accent - small circle at the peak */}
          <circle
            cx="50"
            cy="50"
            r="5"
            fill="url(#mGradient2)"
            filter="url(#glow)"
          />

          {/* Decorative dots around */}
          <circle cx="20" cy="30" r="2.5" fill="#3C82F6" opacity="0.7" filter="url(#glow)"/>
          <circle cx="80" cy="30" r="2.5" fill="#FFF27C" opacity="0.7" filter="url(#glow)"/>
          <circle cx="50" cy="25" r="2" fill="#3758FF" opacity="0.7" filter="url(#glow)"/>
          <circle cx="30" cy="70" r="2" fill="#1F3C88" opacity="0.7" filter="url(#glow)"/>
          <circle cx="70" cy="70" r="2" fill="#3C82F6" opacity="0.7" filter="url(#glow)"/>

          {/* Sparkle effects */}
          <path 
            d="M 85 45 L 87 45 M 86 44 L 86 46" 
            stroke="#FFF27C" 
            strokeWidth="1.5" 
            opacity="0.8"
          />
          <path 
            d="M 15 55 L 17 55 M 16 54 L 16 56" 
            stroke="#3758FF" 
            strokeWidth="1.5" 
            opacity="0.8"
          />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <div 
            className="tracking-tight"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: dimensions.text,
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            <span 
              className="text-[#3C82F6] dark:text-[#3758FF]"
              style={{
                background: 'linear-gradient(135deg, #3C82F6 0%, #1F3C88 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 800,
              }}
            >
              Meet
            </span>
            <span className="text-gray-800 dark:text-white mx-1.5"> my </span>
            <span 
              style={{
                background: 'linear-gradient(135deg, #3758FF 0%, #3C82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 800,
              }}
            >
              Mate
            </span>
          </div>
          {size !== 'small' && (
            <span
              className="text-gray-600 dark:text-gray-400 tracking-wider uppercase"
              style={{
                fontSize: dimensions.tagline,
                marginTop: '0.15rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
              }}
            >
              Book People. Save Time.
            </span>
          )}
        </div>
      )}
    </MotionWrapper>
  );
}