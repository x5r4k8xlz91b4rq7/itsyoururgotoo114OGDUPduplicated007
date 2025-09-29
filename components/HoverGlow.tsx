"use client"

import React from 'react';

interface HoverGlowProps {
  children: React.ReactNode;
  className?: string;
}

const HoverGlow: React.FC<HoverGlowProps> = ({ children, className = '' }) => {

  return (
    <div 
      className={`group relative rounded-2xl ${className}`}
    >
      {/* Premium glow ring effect */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -inset-2 rounded-2xl
          opacity-0 transition-opacity duration-500
          group-hover:opacity-100
          motion-reduce:transition-none motion-reduce:opacity-60
          border-2 border-primary shadow-[0_0_15px_hsl(var(--primary))]
        "
      />
      
      {/* Content slot */}
      {children}
    </div>
  );
};

export default HoverGlow;