import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from '../Logo';

interface OpeningScreenProps {
  onComplete: () => void;
}

const WORDS = [
  { text: 'MEET', accent: true },
  { text: 'MY',   accent: false },
  { text: 'MATE', accent: true },
  { text: 'IN',   accent: false },
];

export function OpeningScreen({ onComplete }: OpeningScreenProps) {
  // 0 = dark | 1 = glow | 2 = ring+logo | 3 = name | 4 = line+tagline | 5 = exit
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), 180),
      setTimeout(() => setPhase(2), 520),
      setTimeout(() => setPhase(3), 1080),
      setTimeout(() => setPhase(4), 1560),
      setTimeout(() => setPhase(5), 3750),
    ];
    const done = setTimeout(onComplete, 4300);
    return () => [...ts, done].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none"
      style={{ background: '#070B18' }}
    >
      {/* ── Radial glow – CSS transition only, zero JS ── */}
      <div
        style={{
          position: 'absolute',
          width: 560,
          height: 560,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(63,131,248,0.20) 0%, rgba(139,92,246,0.11) 40%, transparent 70%)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 1.1s ease',
          pointerEvents: 'none',
        }}
      />

      {/* ── Content ── */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{ gap: 0 }}
      >
        {/* ─── Logo + converging rings ─── */}
        <div
          style={{
            position: 'relative',
            width: 130,
            height: 130,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 28,
          }}
        >
          {/* Ring 1 — contracts fast */}
          {phase >= 2 && (
            <motion.div
              style={{
                position: 'absolute',
                width: 118,
                height: 118,
                borderRadius: '50%',
                border: '1.5px solid rgba(96,165,250,0.65)',
              }}
              initial={{ scale: 2.1, opacity: 0 }}
              animate={{ scale: [2.1, 1.0, 0.85], opacity: [0, 0.85, 0] }}
              transition={{ duration: 0.88, times: [0, 0.52, 1], ease: 'easeInOut' }}
            />
          )}

          {/* Ring 2 — contracts slightly slower */}
          {phase >= 2 && (
            <motion.div
              style={{
                position: 'absolute',
                width: 118,
                height: 118,
                borderRadius: '50%',
                border: '1px solid rgba(167,139,250,0.40)',
              }}
              initial={{ scale: 2.7, opacity: 0 }}
              animate={{ scale: [2.7, 1.08, 0.9], opacity: [0, 0.55, 0] }}
              transition={{ duration: 1.1, times: [0, 0.52, 1], ease: 'easeInOut', delay: 0.08 }}
            />
          )}

          {/* Logo — spring scale-up */}
          <motion.div
            style={{ position: 'relative', zIndex: 2 }}
            initial={{ opacity: 0, scale: 0.72 }}
            animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1], delay: 0.06 }}
          >
            <Logo size="large" animated={false} showText={false} />
          </motion.div>
        </div>

        {/* ─── Brand name — only mounted when it's time (fixes flash bug) ─── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0 14px',
            paddingLeft: 24,
            paddingRight: 24,
            marginBottom: 14,
          }}
        >
          {phase >= 3 &&
            WORDS.map((word, i) => (
              /* overflow:hidden clips the slide-up so word is invisible before animating */
              <div
                key={word.text}
                style={{ overflow: 'hidden', lineHeight: 1 }}
              >
                <motion.span
                  className="block font-black"
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 'clamp(2.1rem, 8vw, 3.4rem)',
                    lineHeight: 1.12,
                    letterSpacing: '-0.02em',
                    ...(word.accent
                      ? {
                          background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }
                      : { color: '#f1f5f9' }),
                  }}
                  /* start below the container, animate up */
                  initial={{ y: '108%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    delay: i * 0.11,
                    duration: 0.54,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {word.text}
                </motion.span>
              </div>
            ))}
        </div>

        {/* ─── Gradient rule under name ─── */}
        <motion.div
          style={{
            height: 2,
            borderRadius: 2,
            background:
              'linear-gradient(90deg, transparent 0%, #60a5fa 30%, #a78bfa 70%, transparent 100%)',
            marginBottom: 18,
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={phase >= 4 ? { width: 260, opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* ─── Tagline ─── */}
        <motion.p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(0.58rem, 2vw, 0.7rem)',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: 'rgba(148,163,184,0.6)',
            textAlign: 'center',
          }}
          initial={{ opacity: 0 }}
          animate={phase >= 4 ? { opacity: 1 } : {}}
          transition={{ delay: 0.28, duration: 0.55 }}
        >
          Book People. Save Time.
        </motion.p>
      </div>

      {/* ── Progress bar ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 34,
          left: 28,
          right: 28,
          height: 2,
          borderRadius: 2,
          background: 'rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            height: '100%',
            borderRadius: 2,
            background:
              'linear-gradient(90deg, #3f83f8 0%, #8b5cf6 55%, #ec4899 100%)',
          }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 3.8, ease: 'linear', delay: 0.4 }}
        />
      </div>

      {/* ── Exit overlay — CSS transition, no JS ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#070B18',
          zIndex: 50,
          opacity: phase >= 5 ? 1 : 0,
          transition: 'opacity 0.52s ease-in',
          pointerEvents: phase >= 5 ? 'auto' : 'none',
        }}
      />
    </div>
  );
}
