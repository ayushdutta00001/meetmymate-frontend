import React from 'react';

interface ScrollableTableProps {
  children: React.ReactNode;
  className?: string;
  minWidth?: string;
}

export function ScrollableTable({ 
  children, 
  className = '', 
  minWidth = '1000px' 
}: ScrollableTableProps) {
  return (
    <div className="relative">
      <div 
        className="overflow-x-auto horizontal-scroll"
        style={{
          scrollbarWidth: 'thin',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div style={{ minWidth }}>
          {children}
        </div>
      </div>
    </div>
  );
}

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  stickyHeader?: boolean;
}

export function Table({ stickyHeader = true, className = '', children, ...props }: TableProps) {
  return (
    <table 
      className={`w-full ${className}`} 
      {...props}
    >
      {children}
    </table>
  );
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  sticky?: boolean;
}

export function TableHeader({ sticky = true, className = '', children, ...props }: TableHeaderProps) {
  return (
    <thead 
      className={`
        ${sticky ? 'sticky top-0 z-10' : ''}
        bg-gray-50 dark:bg-gray-800
        ${className}
      `}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody 
      className={`bg-white dark:bg-gray-900 ${className}`}
      {...props}
    />
  );
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  clickable?: boolean;
}

export function TableRow({ clickable = false, className = '', ...props }: TableRowProps) {
  return (
    <tr 
      className={`
        border-b border-gray-200 dark:border-gray-700
        ${clickable ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors' : ''}
        ${className}
      `}
      style={{ minHeight: '40px' }}
      {...props}
    />
  );
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  sticky?: boolean;
}

export function TableCell({ sticky = false, className = '', ...props }: TableCellProps) {
  return (
    <td 
      className={`
        px-4 py-3
        text-sm text-gray-900 dark:text-gray-100
        ${sticky ? 'sticky left-0 z-10 bg-white dark:bg-gray-900' : ''}
        ${className}
      `}
      {...props}
    />
  );
}

interface TableHeadCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sticky?: boolean;
}

export function TableHeadCell({ sticky = false, className = '', ...props }: TableHeadCellProps) {
  return (
    <th 
      className={`
        px-4 py-3
        text-left text-xs font-semibold
        text-gray-700 dark:text-gray-300
        uppercase tracking-wider
        ${sticky ? 'sticky left-0 z-20 bg-gray-50 dark:bg-gray-800' : ''}
        ${className}
      `}
      {...props}
    />
  );
}
