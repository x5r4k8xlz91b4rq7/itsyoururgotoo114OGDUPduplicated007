"use client"

import React from 'react';

interface ProgressIndicatorProps {
  progress: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress }) => {
  const percentage = Math.max(0, Math.min(100, progress));
  
  return (
    <div className="w-full bg-muted rounded-full h-1.5">
      <div 
        className="bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--primary)] h-1.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressIndicator;