import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  title: string;
  message: string;
  consequence?: string;
  confirmText: string;
  confirmStyle?: 'success' | 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  title,
  message,
  consequence,
  confirmText,
  confirmStyle = 'success',
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  const getConfirmButtonStyle = () => {
    switch (confirmStyle) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-orange-600 hover:bg-orange-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const getIcon = () => {
    switch (confirmStyle) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />;
      case 'danger':
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />;
      default:
        return <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 max-w-md w-full shadow-2xl"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getIcon()}
              <h2 className="text-lg text-gray-900 dark:text-white">{title}</h2>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {message}
            </p>
            {consequence && (
              <div className="p-3 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-lg">
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  <strong>Consequence:</strong> {consequence}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-[#0A0F1F] border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white dark:bg-[#1A1F2E] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg text-sm ${getConfirmButtonStyle()}`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
