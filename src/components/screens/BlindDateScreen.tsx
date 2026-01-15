import React, { useEffect } from 'react';

interface BlindDateScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDateScreen({ onNavigate, onBack }: BlindDateScreenProps) {
  // Redirect to landing on mount
  useEffect(() => {
    onNavigate('blind-date-landing');
  }, [onNavigate]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}