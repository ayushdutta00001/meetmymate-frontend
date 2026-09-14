import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconHeaderButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  ariaLabel: string;
  className?: string;
}

export function IconHeaderButton({ 
  icon: Icon, 
  onClick, 
  ariaLabel,
  className = '' 
}: IconHeaderButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        icon-header-button
        inline-flex items-center justify-center
        w-[44px] h-[44px]
        bg-transparent border-none
        cursor-pointer
        transition-all duration-200 ease-out
        ${className}
      `}
    >
      <Icon 
        className="w-5 h-5 text-[#6B9FFF] transition-all duration-200 ease-out" 
        strokeWidth={2}
      />
    </button>
  );
}
