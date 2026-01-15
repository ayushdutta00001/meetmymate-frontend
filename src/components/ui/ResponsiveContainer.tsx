import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

export function ResponsiveContainer({
  children,
  className = '',
  maxWidth = 'full',
  padding = true,
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={`
        w-full
        ${maxWidthClasses[maxWidth]}
        mx-auto
        ${padding ? 'px-4 sm:px-6 lg:px-8' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backButton?: React.ReactNode;
}

export function PageHeader({ title, description, actions, backButton }: PageHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      {backButton && <div className="mb-4">{backButton}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 dark:text-white mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-xl md:rounded-2xl
        shadow-sm
        ${padding ? 'p-4 md:p-6' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Grid({ children, columns = 3, gap = 'md', className = '' }: GridProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-3 md:gap-4',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8',
  };

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

interface StackProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
  responsive?: boolean; // Stack vertically on mobile, horizontal on desktop
}

export function Stack({
  children,
  direction = 'vertical',
  gap = 'md',
  className = '',
  responsive = false,
}: StackProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const directionClasses = responsive
    ? 'flex flex-col md:flex-row'
    : direction === 'vertical'
    ? 'flex flex-col'
    : 'flex flex-row';

  return (
    <div className={`${directionClasses} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}
