import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  X,
  Shield,
  BadgeCheck,
  Camera,
  MapPin,
  Heart,
} from "lucide-react";

interface BlindDateEligibilityModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const REQUIREMENTS = [
  {
    icon: BadgeCheck,
    title: "You must be 21 years or older",
    description: "Blind Date is available only for adults aged 21+.",
  },
  {
    icon: Shield,
    title: "Government ID Required",
    description: "Your identity will be verified before booking.",
  },
  {
    icon: Camera,
    title: "Selfie Verification",
    description: "A quick selfie is required to complete verification.",
  },
  {
    icon: MapPin,
    title: "Public Meetings Only",
    description: "Every Blind Date happens in a verified public place.",
  },
];

export default function BlindDateEligibilityModal({
  open,
  onClose,
  onContinue,
}: BlindDateEligibilityModalProps) {
  const [agreed, setAgreed] = useState(false);

  if (!open) return null;

  return (
    <AnimatePresence>

      <motion.div
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-md p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 40,
            scale: 0.95,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 22,
          }}
          className="
  relative
  w-full
  max-w-lg
  max-h-[90vh]
  rounded-3xl
  border
  border-gray-700
  bg-gradient-to-br
  from-[#0F172A]
  via-[#111827]
  to-[#1E293B]
  shadow-[0_20px_60px_rgba(0,0,0,.45)]
  overflow-hidden
  flex
  flex-col
"
        >

          {/* Close */}

          <button
            onClick={onClose}
            className="
              absolute
              right-5
              top-5
              w-10
              h-10
              rounded-xl
              bg-white/5
              hover:bg-white/10
              transition
              flex
              items-center
              justify-center
            "
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>

          {/* Header */}

          <div className="px-8 pt-8 pb-7 text-center">

            <div
              className="
                w-20
                h-20
                mx-auto
                rounded-full
                bg-gradient-to-br
                from-pink-500
                via-rose-500
                to-red-500
                flex
                items-center
                justify-center
                shadow-lg
                mb-5
              "
            >
              <Heart
                className="w-10 h-10 text-white"
                fill="white"
              />
            </div>

            <h2 className="text-2xl font-bold text-white">
              Before You Continue
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Please review and confirm the following
              safety requirements before booking your
              Blind Date.
            </p>

          </div>
<div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Requirements */}

          <div
  className="
    flex-1
    overflow-y-auto
    custom-scrollbar
    px-8
    space-y-4
    pr-6
  "
  style={{ maxHeight: "380px" }}
>

                        {REQUIREMENTS.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="
                    flex
                    items-start
                    gap-4
                    rounded-2xl
                    border
                    border-gray-700
                   bg-[#182233]/80 backdrop-blur-xl
                    p-4
                    hover:border-[#3C82F6]
                    transition-all
                  "
                >
                  <div
                    className="
                      w-12
                      h-12
                      rounded-xl
                      bg-[#3C82F6]/15
                      border
                      border-[#3C82F6]/30
                      flex
                      items-center
                      justify-center
                      flex-shrink-0
                    "
                  >
                    <Icon className="w-6 h-6 text-[#3C82F6]" />
                  </div>

                  <div>
                    <h4 className="text-white font-semibold">
                      {item.title}
                    </h4>

                    <p className="mt-1 text-sm text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Agreement */}

          <div className="px-8 mt-8">

            <label
              className="
                flex
                items-start
                gap-4
                rounded-2xl
                border
                border-gray-700
                bg-[#182233]/70 backdrop-blur-xl
                p-5
                cursor-pointer
                hover:border-[#3C82F6]
                transition-all
              "
            >

              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="
                  mt-1
                  h-5
                  w-5
                  rounded
                  accent-[#3C82F6]
                  cursor-pointer
                "
              />

              <span className="text-sm leading-6 text-gray-300">
                I confirm that I am at least
                <span className="font-semibold text-white">
                  {" "}21 years old
                </span>,
                understand these safety requirements,
                and agree to meet only in public places
                arranged by Meet My Mate in.
              </span>

            </label>

          </div>

         </div>

{/* Footer Buttons */}

<div className="
  sticky
  bottom-0
  flex
  gap-4
  px-8
  py-6
  border-t
  border-gray-700
  bg-[#111827]
">
            <button
              onClick={onClose}
              className="
                flex-1
                rounded-2xl
                border
                border-gray-600
                bg-transparent
                py-3.5
                text-white
                font-medium
                transition-all
                hover:bg-white/5
              "
            >
              Cancel
            </button>

            <button
              disabled={!agreed}
              onClick={() => {
                onContinue();
                setAgreed(false);
              }}
              className={`
                flex-1
                rounded-2xl
                py-3.5
                font-semibold
                transition-all

                ${
                  agreed
                    ? "bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white shadow-lg hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(59,130,246,.35)]"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              Continue
            </button>

          </div>

                  </motion.div>

      </motion.div>

    </AnimatePresence>
  );
}