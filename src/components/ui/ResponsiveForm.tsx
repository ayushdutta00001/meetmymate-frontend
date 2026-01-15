import React from 'react';

interface ResponsiveFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export function ResponsiveForm({ children, onSubmit, className = '' }: ResponsiveFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={`w-full ${className}`}
    >
      {children}
    </form>
  );
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}

export function FormField({
  label,
  children,
  required = false,
  error,
  helperText,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`mb-4 md:mb-5 ${className}`}>
      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2" style={{ fontWeight: 500 }}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}

interface FormRowProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function FormRow({ children, columns = 1, className = '' }: FormRowProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-4 md:gap-5 ${className}`}>
      {children}
    </div>
  );
}

interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function FormActions({ children, className = '', align = 'right' }: FormActionsProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`
      flex flex-col sm:flex-row gap-3
      ${alignClasses[align]}
      pt-4 md:pt-6
      ${className}
    `}>
      {children}
    </div>
  );
}
