import React from 'react';
import { Lock } from 'lucide-react';

interface LockedFeatureCardProps {
  featureName: string;
  description?: string;
  icon?: React.ReactNode;
  badgeText?: string;
  variant?: 'default' | 'compact';
}

export function LockedFeatureCard({
  featureName,
  description,
  icon,
  badgeText = 'Coming Soon',
  variant = 'default',
}: LockedFeatureCardProps) {
  return (
    <div
      className="relative w-full rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30 backdrop-blur-sm shadow-lg overflow-hidden cursor-not-allowed select-none"
      style={{ opacity: 0.65 }}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

      {/* Lock icon watermark (background) */}
      <div className="absolute top-4 right-4 opacity-[0.08]">
        <Lock className="w-24 h-24" strokeWidth={1} />
      </div>

      {/* Content */}
      <div className={`relative ${variant === 'compact' ? 'p-4' : 'p-5'}`}>
        {/* Header with lock icon and badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Lock Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-10 h-10 rounded-lg bg-gray-800/60 border border-gray-700/40 flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-400" strokeWidth={2} />
              </div>
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-300 text-base font-medium leading-tight truncate">
                {featureName}
              </h3>
              {description && variant !== 'compact' && (
                <p className="text-gray-500 text-sm mt-1.5 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Coming Soon Badge */}
          {badgeText && (
            <div className="flex-shrink-0">
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-300 border border-blue-400/20 shadow-sm"
                style={{ opacity: 1 }}
              >
                <span className="relative flex h-2 w-2 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                </span>
                {badgeText}
              </span>
            </div>
          )}
        </div>

        {/* Optional custom icon */}
        {icon && variant !== 'compact' && (
          <div className="mt-4 flex items-center justify-center opacity-40">
            {icon}
          </div>
        )}

        {/* Locked indicator bar */}
        <div className="mt-4 pt-3 border-t border-gray-700/30">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Lock className="w-3.5 h-3.5" strokeWidth={2} />
            <span>This feature is currently unavailable</span>
          </div>
        </div>
      </div>

      {/* Disabled overlay - prevents interaction */}
      <div className="absolute inset-0 cursor-not-allowed" />
    </div>
  );
}
