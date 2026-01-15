import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../Logo';

interface OpeningScreenProps {
  onComplete: () => void;
}

export function OpeningScreen({ onComplete }: OpeningScreenProps) {
  const [stage, setStage] = useState<'scenes' | 'merge' | 'logo' | 'brand'>('scenes');

  useEffect(() => {
    const scenesTimer = setTimeout(() => setStage('merge'), 2500);
    const mergeTimer = setTimeout(() => setStage('logo'), 3500);
    const logoTimer = setTimeout(() => setStage('brand'), 4200);
    const completeTimer = setTimeout(onComplete, 6500);
    
    return () => {
      clearTimeout(scenesTimer);
      clearTimeout(mergeTimer);
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Scene configurations - positions and delays - MOBILE OPTIMIZED
  const scenes = [
    { id: 'coffee', type: 'coffee', startX: -120, startY: -100, delay: 0 },
    { id: 'greeting', type: 'greeting', startX: 120, startY: -100, delay: 0.2 },
    { id: 'movie', type: 'movie', startX: -120, startY: 100, delay: 0.4 },
    { id: 'walking', type: 'walking', startX: 120, startY: 100, delay: 0.6 },
    { id: 'business', type: 'business', startX: 0, startY: -140, delay: 0.8 },
    { id: 'dinner', type: 'dinner', startX: -150, startY: 0, delay: 1.0 },
    { id: 'sports', type: 'sports', startX: 150, startY: 0, delay: 1.2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1F] via-[#1F3C88] to-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      {/* Ambient background glows - BRIGHTER */}
      <motion.div
        className="absolute top-10 left-10 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(55,88,255,0.3) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
        <AnimatePresence mode="wait">
          {/* Stage 1 & 2: Small scenes coming in and merging */}
          {(stage === 'scenes' || stage === 'merge') && (
            <div key="scenes" className="relative w-full h-full flex items-center justify-center">
              {scenes.map((scene, index) => (
                <motion.div
                  key={scene.id}
                  className="absolute"
                  initial={{ 
                    x: scene.startX, 
                    y: scene.startY, 
                    scale: 0, 
                    opacity: 0,
                    rotate: Math.random() * 360 
                  }}
                  animate={{
                    x: stage === 'merge' ? 0 : scene.startX,
                    y: stage === 'merge' ? 0 : scene.startY,
                    scale: stage === 'merge' ? [1, 1.2, 0] : 1,
                    opacity: stage === 'merge' ? [1, 1, 0] : 1,
                    rotate: stage === 'merge' ? 0 : 0,
                  }}
                  transition={{
                    delay: scene.delay,
                    duration: stage === 'merge' ? 0.8 : 0.6,
                    ease: stage === 'merge' ? 'easeInOut' : [0.34, 1.56, 0.64, 1],
                  }}
                >
                  <SceneIcon type={scene.type} />
                </motion.div>
              ))}

              {/* Central merge effect - BRIGHTER */}
              {stage === 'merge' && (
                <>
                  {/* Energy burst */}
                  <motion.div
                    className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.8) 0%, transparent 70%)' }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 3, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 1, delay: 1.5 }}
                  />
                  
                  {/* Particle explosion - BRIGHTER */}
                  {[...Array(30)].map((_, i) => {
                    const angle = (i / 30) * Math.PI * 2;
                    const distance = 100 + Math.random() * 50;
                    return (
                      <motion.div
                        key={`particle-${i}`}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          background: i % 2 === 0 ? '#00d4ff' : '#FFF27C',
                          boxShadow: `0 0 15px ${i % 2 === 0 ? '#00d4ff' : '#FFF27C'}`,
                        }}
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        animate={{
                          x: Math.cos(angle) * distance,
                          y: Math.sin(angle) * distance,
                          opacity: [0, 1, 0],
                          scale: [0, 2, 0],
                        }}
                        transition={{ duration: 1, delay: 1.5 + i * 0.02 }}
                      />
                    );
                  })}
                </>
              )}
            </div>
          )}

          {/* Stage 3: Logo appears */}
          {stage === 'logo' && (
            <motion.div
              key="logo"
              className="relative flex items-center justify-center"
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {/* Dark background for logo */}
              <motion.div
                className="absolute w-48 h-48 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(10, 15, 31, 0.95) 0%, rgba(10, 15, 31, 0.7) 70%, transparent 100%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Expanding rings */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`ring-${i}`}
                  className="absolute rounded-full"
                  style={{
                    border: `3px solid ${i % 2 === 0 ? '#00d4ff' : '#3758FF'}`,
                    boxShadow: `0 0 20px ${i % 2 === 0 ? '#00d4ff' : '#3758FF'}`,
                  }}
                  initial={{ width: 0, height: 0, opacity: 0 }}
                  animate={{
                    width: [0, 400],
                    height: [0, 400],
                    opacity: [0.7, 0],
                  }}
                  transition={{ duration: 1.5, delay: i * 0.2 }}
                />
              ))}

              {/* Logo without text initially */}
              <motion.div
                className="relative z-10"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Logo size="large" animated={false} showText={false} />
              </motion.div>
            </motion.div>
          )}

          {/* Stage 4: Brand name emerges from behind */}
          {stage === 'brand' && (
            <motion.div
              key="brand"
              className="relative flex flex-col items-center justify-center gap-8"
            >
              {/* Dark background circle for logo */}
              <motion.div
                className="absolute w-56 h-56 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(10, 15, 31, 0.95) 0%, rgba(10, 15, 31, 0.5) 60%, transparent 100%)',
                  top: '-60px',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Rotating ambient glow */}
              <motion.div
                className="absolute w-80 h-80 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />

              {/* Logo scales slightly back to make room */}
              <motion.div
                className="relative z-10"
                initial={{ scale: 1, y: 0 }}
                animate={{ scale: 0.9, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Logo size="large" animated={false} showText={false} />
              </motion.div>

              {/* Brand name emerging from behind with 3D effect */}
              <motion.div
                className="relative px-4"
                initial={{ z: -100, opacity: 0, scale: 0.5, y: 50 }}
                animate={{ z: 0, opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {/* Shadow layer for depth */}
                <div
                  className="absolute inset-0 blur-md"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                    fontWeight: 900,
                    transform: 'translateY(8px) translateX(4px)',
                    opacity: 0.3,
                  }}
                >
                  <span className="text-black">Meet my Mate</span>
                </div>

                {/* Main text with gradient */}
                <div
                  className="relative tracking-tight flex items-center gap-2 justify-center"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  <motion.span
                    style={{
                      background: 'linear-gradient(135deg, #00d4ff 0%, #3758FF 50%, #1F3C88 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      transform: 'rotate(-2deg)',
                      display: 'inline-block',
                      filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.5))',
                    }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Meet
                  </motion.span>
                  <motion.span
                    className="text-white"
                    style={{
                      transform: 'rotate(1deg)',
                      display: 'inline-block',
                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                      fontSize: 'clamp(1.5rem, 6vw, 2.8rem)',
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    my
                  </motion.span>
                  <motion.span
                    style={{
                      background: 'linear-gradient(135deg, #3758FF 0%, #00d4ff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      transform: 'rotate(-1deg)',
                      display: 'inline-block',
                      filter: 'drop-shadow(0 0 20px rgba(55, 88, 255, 0.5))',
                    }}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    Mate
                  </motion.span>
                </div>

                {/* Tagline */}
                <motion.div
                  className="text-center mt-4 text-gray-300 tracking-widest uppercase px-4"
                  style={{ fontSize: 'clamp(0.7rem, 3vw, 1rem)', fontWeight: 500, letterSpacing: '0.2em' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  Book People. Save Time.
                </motion.div>
              </motion.div>

              {/* Sparkle effects */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-white"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}

              {/* Loading indicator */}
              <motion.div
                className="flex gap-3 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={`dot-${i}`}
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #00d4ff, #3758FF)',
                      boxShadow: '0 0 15px #00d4ff',
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Scene Icon Component
function SceneIcon({ type }: { type: string }) {
  const baseSize = 80;
  
  return (
    <div 
      className="rounded-2xl p-4 backdrop-blur-md"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: '2px solid rgba(0, 212, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)',
      }}
    >
      <svg width={baseSize} height={baseSize} viewBox="0 0 80 80" fill="none">
        {type === 'coffee' && <CoffeeScene />}
        {type === 'greeting' && <GreetingScene />}
        {type === 'movie' && <MovieScene />}
        {type === 'walking' && <WalkingScene />}
        {type === 'business' && <BusinessScene />}
        {type === 'dinner' && <DinnerScene />}
        {type === 'sports' && <SportsScene />}
      </svg>
    </div>
  );
}

// Coffee Scene - Two people at table with coffee
function CoffeeScene() {
  return (
    <g>
      {/* Table */}
      <rect x="20" y="50" width="40" height="8" rx="2" fill="#3758FF" opacity="0.6"/>
      
      {/* Person 1 */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <circle cx="30" cy="35" r="8" fill="#00d4ff"/>
        <rect x="25" y="43" width="10" height="15" rx="3" fill="#00d4ff" opacity="0.8"/>
      </motion.g>
      
      {/* Person 2 */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        <circle cx="50" cy="35" r="8" fill="#3758FF"/>
        <rect x="45" y="43" width="10" height="15" rx="3" fill="#3758FF" opacity="0.8"/>
      </motion.g>
      
      {/* Coffee cups */}
      <motion.rect 
        x="27" y="52" width="6" height="6" rx="1" fill="#FFF27C"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.rect 
        x="47" y="52" width="6" height="6" rx="1" fill="#FFF27C"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
      />
      
      {/* Steam */}
      <motion.path
        d="M 30 48 Q 31 44 30 40"
        stroke="#ffffff"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
        animate={{ opacity: [0.6, 0.2, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path
        d="M 50 48 Q 51 44 50 40"
        stroke="#ffffff"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
        animate={{ opacity: [0.6, 0.2, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
    </g>
  );
}

// Greeting Scene - Two people saying hi
function GreetingScene() {
  return (
    <g>
      {/* Person 1 */}
      <motion.g
        animate={{ x: [0, -3, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <circle cx="25" cy="30" r="10" fill="#00d4ff"/>
        <rect x="18" y="40" width="14" height="20" rx="4" fill="#00d4ff" opacity="0.8"/>
        {/* Waving hand */}
        <motion.ellipse
          cx="15" cy="45" rx="5" ry="8"
          fill="#00d4ff"
          animate={{ rotate: [0, 20, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ transformOrigin: '15px 53px' }}
        />
      </motion.g>
      
      {/* Person 2 */}
      <motion.g
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
      >
        <circle cx="55" cy="30" r="10" fill="#3758FF"/>
        <rect x="48" y="40" width="14" height="20" rx="4" fill="#3758FF" opacity="0.8"/>
        {/* Waving hand */}
        <motion.ellipse
          cx="65" cy="45" rx="5" ry="8"
          fill="#3758FF"
          animate={{ rotate: [0, -20, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ transformOrigin: '65px 53px' }}
        />
      </motion.g>
      
      {/* Hi text */}
      <motion.text
        x="40" y="18"
        fill="#ffffff"
        fontSize="10"
        textAnchor="middle"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Hi!
      </motion.text>
    </g>
  );
}

// Movie Scene - Two people watching screen
function MovieScene() {
  return (
    <g>
      {/* Screen */}
      <motion.rect
        x="15" y="15" width="50" height="30" rx="3"
        fill="#3758FF"
        opacity="0.4"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Play icon on screen */}
      <polygon points="35,25 35,35 45,30" fill="#00d4ff" opacity="0.8"/>
      
      {/* Person 1 */}
      <circle cx="28" cy="60" r="7" fill="#00d4ff"/>
      <rect x="23" y="67" width="10" height="8" rx="2" fill="#00d4ff" opacity="0.8"/>
      
      {/* Person 2 */}
      <circle cx="52" cy="60" r="7" fill="#3758FF"/>
      <rect x="47" y="67" width="10" height="8" rx="2" fill="#3758FF" opacity="0.8"/>
      
      {/* Popcorn */}
      <motion.rect
        x="38" y="65" width="4" height="6" rx="1"
        fill="#FFF27C"
        animate={{ y: [65, 63, 65] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </g>
  );
}

// Walking Scene - Two people holding hands
function WalkingScene() {
  return (
    <motion.g
      animate={{ x: [0, 5, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      {/* Person 1 (left) */}
      <motion.g
        animate={{ y: [0, -1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <circle cx="28" cy="25" r="9" fill="#00d4ff"/>
        <rect x="22" y="34" width="12" height="18" rx="3" fill="#00d4ff" opacity="0.8"/>
        {/* Legs walking */}
        <motion.rect
          x="23" y="52" width="4" height="15" rx="2"
          fill="#00d4ff"
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ transformOrigin: '25px 52px' }}
        />
        <motion.rect
          x="29" y="52" width="4" height="15" rx="2"
          fill="#00d4ff"
          animate={{ rotate: [10, -10, 10] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ transformOrigin: '31px 52px' }}
        />
      </motion.g>
      
      {/* Person 2 (right) */}
      <motion.g
        animate={{ y: [0, -1, 0] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
      >
        <circle cx="52" cy="25" r="9" fill="#3758FF"/>
        <rect x="46" y="34" width="12" height="18" rx="3" fill="#3758FF" opacity="0.8"/>
        {/* Legs walking */}
        <motion.rect
          x="47" y="52" width="4" height="15" rx="2"
          fill="#3758FF"
          animate={{ rotate: [10, -10, 10] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ transformOrigin: '49px 52px' }}
        />
        <motion.rect
          x="53" y="52" width="4" height="15" rx="2"
          fill="#3758FF"
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ transformOrigin: '55px 52px' }}
        />
      </motion.g>
      
      {/* Holding hands */}
      <motion.line
        x1="34" y1="42" x2="46" y2="42"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      {/* Heart above */}
      <motion.path
        d="M 40 15 C 40 15, 37 12, 37 10 C 37 8, 39 7, 40 8 C 41 7, 43 8, 43 10 C 43 12, 40 15, 40 15 Z"
        fill="#FFF27C"
        animate={{ scale: [1, 1.2, 1], y: [0, -2, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '40px 11px' }}
      />
    </motion.g>
  );
}

// Business Scene - Handshake and briefcase
function BusinessScene() {
  return (
    <g>
      {/* Person 1 */}
      <circle cx="25" cy="30" r="9" fill="#00d4ff"/>
      <rect x="19" y="39" width="12" height="18" rx="3" fill="#00d4ff" opacity="0.8"/>
      
      {/* Person 2 */}
      <circle cx="55" cy="30" r="9" fill="#3758FF"/>
      <rect x="49" y="39" width="12" height="18" rx="3" fill="#3758FF" opacity="0.8"/>
      
      {/* Handshake */}
      <motion.g
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: '40px 45px' }}
      >
        <rect x="31" y="43" width="8" height="6" rx="2" fill="#00d4ff"/>
        <rect x="41" y="43" width="8" height="6" rx="2" fill="#3758FF"/>
      </motion.g>
      
      {/* Briefcase */}
      <motion.g
        animate={{ y: [65, 63, 65] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <rect x="35" y="65" width="10" height="8" rx="1" fill="#1F3C88" opacity="0.8"/>
        <rect x="38" y="65" width="4" height="2" rx="1" fill="#00d4ff"/>
      </motion.g>
      
      {/* Dollar sign */}
      <motion.text
        x="40" y="20"
        fill="#FFF27C"
        fontSize="12"
        textAnchor="middle"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        $
      </motion.text>
    </g>
  );
}

// Dinner Scene - Two people at dinner table
function DinnerScene() {
  return (
    <g>
      {/* Table */}
      <ellipse cx="40" cy="55" rx="25" ry="8" fill="#3758FF" opacity="0.5"/>
      
      {/* Person 1 */}
      <circle cx="28" cy="30" r="8" fill="#00d4ff"/>
      <rect x="23" y="38" width="10" height="15" rx="3" fill="#00d4ff" opacity="0.8"/>
      
      {/* Person 2 */}
      <circle cx="52" cy="30" r="8" fill="#3758FF"/>
      <rect x="47" y="38" width="10" height="15" rx="3" fill="#3758FF" opacity="0.8"/>
      
      {/* Wine glasses */}
      <motion.g
        animate={{ rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: '30px 53px' }}
      >
        <polygon points="28,50 32,50 31,56 29,56" fill="#FFF27C" opacity="0.7"/>
        <circle cx="30" cy="49" r="3" fill="none" stroke="#FFF27C" strokeWidth="1"/>
      </motion.g>
      
      <motion.g
        animate={{ rotate: [0, -5, 0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        style={{ transformOrigin: '50px 53px' }}
      >
        <polygon points="48,50 52,50 51,56 49,56" fill="#FFF27C" opacity="0.7"/>
        <circle cx="50" cy="49" r="3" fill="none" stroke="#FFF27C" strokeWidth="1"/>
      </motion.g>
      
      {/* Candle */}
      <rect x="38.5" y="48" width="3" height="8" rx="1" fill="#ff6b6b" opacity="0.6"/>
      <motion.ellipse
        cx="40" cy="47" rx="2" ry="3"
        fill="#FFF27C"
        animate={{ opacity: [0.8, 0.4, 0.8], scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '40px 47px' }}
      />
    </g>
  );
}

// Sports Scene - Two people playing
function SportsScene() {
  return (
    <g>
      {/* Person 1 */}
      <motion.g
        animate={{ x: [0, -3, 0], y: [0, -2, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <circle cx="28" cy="30" r="8" fill="#00d4ff"/>
        <rect x="23" y="38" width="10" height="16" rx="3" fill="#00d4ff" opacity="0.8"/>
        {/* Arm reaching */}
        <motion.rect
          x="18" y="40" width="5" height="10" rx="2"
          fill="#00d4ff"
          animate={{ rotate: [-30, 30, -30] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ transformOrigin: '20px 40px' }}
        />
      </motion.g>
      
      {/* Person 2 */}
      <motion.g
        animate={{ x: [0, 3, 0], y: [0, -2, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
      >
        <circle cx="52" cy="30" r="8" fill="#3758FF"/>
        <rect x="47" y="38" width="10" height="16" rx="3" fill="#3758FF" opacity="0.8"/>
        {/* Arm reaching */}
        <motion.rect
          x="57" y="40" width="5" height="10" rx="2"
          fill="#3758FF"
          animate={{ rotate: [30, -30, 30] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ transformOrigin: '59px 40px' }}
        />
      </motion.g>
      
      {/* Ball */}
      <motion.circle
        cx="40" cy="25" r="5"
        fill="#FFF27C"
        animate={{
          x: [0, -5, 5, 0],
          y: [0, -8, -8, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Net/Goal */}
      <line x1="35" y1="60" x2="45" y2="60" stroke="#ffffff" strokeWidth="2" opacity="0.5"/>
      <line x1="35" y1="60" x2="35" y2="70" stroke="#ffffff" strokeWidth="2" opacity="0.5"/>
      <line x1="45" y1="60" x2="45" y2="70" stroke="#ffffff" strokeWidth="2" opacity="0.5"/>
    </g>
  );
}