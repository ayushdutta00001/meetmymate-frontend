import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface FilterButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  isActive?: boolean;
}

/**
 * UI / Icon Button / Filter
 * 
 * Minimal, premium filter button for dark themed headers.
 * - 44×44px invisible hit area
 * - 20px filter icon with 2px stroke
 * - Soft blue accent color
 * - Subtle hover/press states
 * - WCAG AA compliant
 * - Optional active state for when filters are applied
 */
export function FilterButton({ 
  onClick, 
  className = '', 
  disabled = false,
  isActive = false 
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label="Filter options"
      aria-pressed={isActive}
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
      <SlidersHorizontal 
        className={`
          w-5 h-5 transition-all duration-200 ease-out
          ${isActive ? 'text-[#8AB4FF]' : 'text-[#6B9FFF]'}
        `}
        strokeWidth={2}
        aria-hidden="true"
      />
    </button>
  );
}
