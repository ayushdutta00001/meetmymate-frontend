import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string; disabled?: boolean }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-gray-900 dark:text-gray-100 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full px-4 py-2.5 
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            border border-gray-300 dark:border-gray-600
            rounded-lg
            shadow-sm
            appearance-none
            cursor-pointer
            transition-all
            hover:border-gray-400 dark:hover:border-gray-500
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-500 
            focus:border-blue-500
            disabled:opacity-60 
            disabled:cursor-not-allowed
            disabled:bg-gray-100 dark:disabled:bg-gray-800
            ${className}
          `}
          style={{ minHeight: '40px', fontSize: '14px' }}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="
                bg-white dark:bg-gray-900
                text-gray-900 dark:text-gray-100
                py-2
              "
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
