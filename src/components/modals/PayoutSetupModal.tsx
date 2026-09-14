import React from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectBank: () => void;
  onSelectUpi: () => void;
}

export function PayoutSetupModal({
  isOpen,
  onClose,
  onSelectBank,
  onSelectUpi,
}: Props) {
  if (!isOpen) return null;

 return createPortal(
 <div
  style={{
    position: "fixed",
    inset: 0,
    zIndex: 999999999,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px"
  }}
>
      <motion.div
        initial={{ opacity: 0, scale: .95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="
          w-full
          max-w-md
         bg-gray-900
          rounded-3xl
          border border-white
          p-6
        "
      >
        <h2 className="text-2xl text-gray-300 mb-6 font-bold">
          Setup Payout Method
        </h2>

        <p className="text-gray-400 mb-6">
          Choose how you want to receive withdrawals.
        </p>

        <button
          onClick={onSelectBank}
          className="
            w-full
            p-4
            rounded-2xl
            bg-blue-500
            text-white
            mb-3
          "
        >
          Add Bank Account
        </button>

        <button
          onClick={onSelectUpi}
          className="
            w-full
            p-4
            rounded-2xl
            bg-green-500
            text-white
          "
        >
          Add UPI ID
        </button>

        <button
          onClick={onClose}
          className="
            w-full
            mt-4
            p-3
            rounded-2xl
            border
            border-gray-700
            text-gray-400
            hover:bg-red-500
            hover:text-white
           transition
           duration-200
           ease-in-out
          "
        >
          Cancel
        </button>
      </motion.div>
       </div>,
    document.body
  );
}