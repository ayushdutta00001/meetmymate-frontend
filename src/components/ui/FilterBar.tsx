import React from 'react';

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function FilterChip({ label, active = false, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-shrink-0
        px-4 py-2
        rounded-full
        border
        transition-all
        min-h-[40px]
        whitespace-nowrap
        ${
          active
            ? 'bg-blue-500 text-white border-blue-500'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
        }
      `}
    >
      {label}
    </button>
  );
}

interface FilterBarProps {
  filters: { id: string; label: string }[];
  activeFilter?: string;
  onFilterChange?: (filterId: string) => void;
  className?: string;
}

export function FilterBar({ filters, activeFilter, onFilterChange, className = '' }: FilterBarProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="filter-bar-scroll">
        {filters.map((filter) => (
          <FilterChip
            key={filter.id}
            label={filter.label}
            active={activeFilter === filter.id}
            onClick={() => onFilterChange?.(filter.id)}
          />
        ))}
      </div>
    </div>
  );
}
