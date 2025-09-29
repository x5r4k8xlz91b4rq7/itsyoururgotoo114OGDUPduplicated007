"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface GlowingStarsBackgroundCardProps {
  children: React.ReactNode
  className?: string
}

export const GlowingStarsBackgroundCard: React.FC<GlowingStarsBackgroundCardProps> = ({
  children,
  className
}) => {
  return (
    <div
      className={cn(
        "relative group p-6 rounded-2xl bg-gradient-to-br from-background via-background to-primary/5 border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(138,43,226,0.3)] hover:scale-[1.02]",
        className
      )}
    >
      {/* Glowing background effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Subtle star particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute top-4 left-4 w-1 h-1 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
        <div className="absolute top-8 right-8 w-1 h-1 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300" />
        <div className="absolute bottom-6 left-8 w-1 h-1 bg-primary/25 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200" />
        <div className="absolute bottom-4 right-4 w-1 h-1 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-400" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

interface GlowingStarsTitleProps {
  children: React.ReactNode
  className?: string
}

export const GlowingStarsTitle: React.FC<GlowingStarsTitleProps> = ({
  children,
  className
}) => {
  return (
    <h3 className={cn(
      "font-bold text-foreground group-hover:text-primary transition-colors duration-300",
      className
    )}>
      {children}
    </h3>
  )
}

interface GlowingStarsDescriptionProps {
  children: React.ReactNode
  className?: string
}

export const GlowingStarsDescription: React.FC<GlowingStarsDescriptionProps> = ({
  children,
  className
}) => {
  return (
    <p className={cn(
      "text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300",
      className
    )}>
      {children}
    </p>
  )
}