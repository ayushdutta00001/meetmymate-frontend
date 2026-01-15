import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * UI / Icon Button / Back
 * 
 * Minimal, premium back button for dark themed headers.
 * - 44×44px invisible hit area
 * - 20px chevron-left icon with 2px stroke
 * - Soft blue accent color
 * - Subtle hover/press states
 * - WCAG AA compliant
 */
export function BackButton({ onClick, className = '', disabled = false }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label="Go back"
      className={`
        icon-header-button
        inline-flex items-center justify-center
        w-[44px] h-[44px]
        bg-transparent border-none
        cursor-pointer
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <ChevronLeft 
        className="w-5 h-5 text-[#6B9FFF] transition-all duration-200 ease-out" 
        strokeWidth={2}
        aria-hidden="true"
      />
    </button>
  );
}
