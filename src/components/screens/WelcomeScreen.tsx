import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../Button';
import { Logo } from '../Logo';
import { Heart, ArrowLeftRight } from 'lucide-react';

interface WelcomeScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export function WelcomeScreen({
  onSignIn,
  onSignUp,
}: WelcomeScreenProps) {
  const features = [
    {
      icon: Heart,
      label: 'Blind Mate',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: ArrowLeftRight,
      label: 'PartnerUp',
      color: 'from-violet-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-[#3C82F6] via-[#1F3C88] to-[#3758FF] dark:from-[#0A0F1F] dark:via-[#1F3C88] dark:to-[#0A0F1F] relative overflow-hidden">

      {/* =========================================================
          ANIMATED BACKGROUND BLOBS
      ========================================================== */}

      <motion.div
        className="
          pointer-events-none
          absolute
          -top-24
          -left-24
          w-72
          h-72
          sm:w-96
          sm:h-96
          bg-white/10
          rounded-full
          blur-3xl
        "
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 40, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />

      <motion.div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -right-24
          w-72
          h-72
          sm:w-96
          sm:h-96
          bg-[#FFF27C]/20
          rounded-full
          blur-3xl
        "
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
      />

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}

      <div
        className="
          relative
          z-10
          min-h-[100dvh]
          flex
          flex-col
          items-center
          justify-center
          px-5
          py-6
          sm:px-6
          sm:py-8
        "
      >

        {/* =======================================================
            LOGO
        ======================================================== */}

        <motion.div
          initial={{
            scale: 0,
            rotate: -180,
          }}
          animate={{
            scale: 1,
            rotate: 0,
          }}
          transition={{
            type: 'spring',
            duration: 1,
          }}
          className="
            mb-6
            sm:mb-8
            md:mb-10
            scale-[0.78]
            sm:scale-90
            md:scale-100
          "
        >
          <Logo size="large" />
        </motion.div>

        {/* =======================================================
            HERO
        ======================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
          }}
          className="
            w-full
            max-w-md
            text-center
            mb-7
            sm:mb-9
            md:mb-10
          "
        >
          <h2
            className="
              text-white
              text-[31px]
              leading-[1.08]
              tracking-tight
              font-bold
              mb-3
              sm:text-4xl
              md:text-5xl
              sm:mb-4
            "
          >
            Connect, Meet, Grow
          </h2>

          <p
            className="
              text-white/80
              text-[15px]
              leading-6
              sm:text-base
              sm:leading-7
              max-w-sm
              mx-auto
            "
          >
            Your time is valuable. Book meaningful connections
            for romance or peer collaboration.
          </p>
        </motion.div>

        {/* =======================================================
            FEATURE CARDS
        ======================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.5,
          }}
          className="
            w-full
            max-w-[420px]
            grid
            grid-cols-2
            gap-3
            sm:gap-4
            mb-7
            sm:mb-9
            md:mb-10
          "
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.6 + index * 0.1,
                }}
                whileHover={{
                  scale: 1.04,
                  y: -4,
                }}
                className="
                  w-full
                  min-w-0
                  h-[145px]
                  sm:h-[160px]
                  rounded-2xl
                  glass
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  px-2
                  sm:px-4
                "
              >
                {/* Icon */}

                <div
                  className={`
                    w-[58px]
                    h-[58px]
                    sm:w-16
                    sm:h-16
                    rounded-2xl
                    bg-gradient-to-br
                    ${feature.color}
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                    shadow-lg
                  `}
                >
                  <Icon
                    className="
                      w-7
                      h-7
                      sm:w-8
                      sm:h-8
                      text-white
                    "
                  />
                </div>

                {/* Label */}

                <span
                  className="
                    text-white
                    text-sm
                    sm:text-base
                    font-medium
                    text-center
                    leading-tight
                  "
                >
                  {feature.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* =======================================================
            CTA BUTTONS
        ======================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.9,
          }}
          className="
            w-full
            max-w-md
            space-y-3
            sm:space-y-4
          "
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

        {/* =======================================================
            FOOTER TEXT
        ======================================================== */}

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1.2,
          }}
          className="
            text-white/60
            text-[12px]
            sm:text-sm
            leading-5
            mt-5
            sm:mt-7
            text-center
            max-w-sm
          "
        >
          By continuing, you agree to our Terms & Conditions
        </motion.p>

      </div>
    </div>
  );
}