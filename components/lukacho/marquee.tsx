"use client"

import { useEffect, useRef } from 'react'
import { useMemo } from 'react'

interface MarqueeProps {
  items: string[]
  bullet?: string
  speed?: number
  className?: string
  itemClassName?: string
  bulletClassName?: string
}

export function Marquee({
  items,
  bullet = "•",
  speed = 30,
  className = "",
  itemClassName = "",
  bulletClassName = ""
}: MarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null)

  // Memoize the items array to prevent unnecessary re-renders
  const memoizedItems = useMemo(() => {
    if (!Array.isArray(items)) return []
    return items
  }, [JSON.stringify(items)])

  useEffect(() => {
    const marquee = marqueeRef.current
    if (!marquee || memoizedItems.length === 0) return

    const scrollWidth = marquee.scrollWidth
    
    let animationId: number
    let position = 0
    let isActive = true

    const animate = () => {
      if (!isActive) return
      
      position -= speed / 60 // Convert speed to pixels per frame (60fps)
      
      // Reset position when content has completely scrolled off screen
      if (Math.abs(position) >= scrollWidth / 2) {
        position = 0
      }
      
      marquee.style.transform = `translateX(${position}px)`
      if (isActive) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      isActive = false
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [speed, memoizedItems.length])

  // Create the content with bullets
  const content = memoizedItems.map((item, index) => (
    <span key={index} className="flex items-center">
      <span className={itemClassName}>{item}</span>
      {index < memoizedItems.length - 1 && (
        <span className={bulletClassName}>{bullet}</span>
      )}
    </span>
  )).concat(
    // Add the last bullet after the last item
    <span key="final-bullet" className={bulletClassName}>{bullet}</span>
  )

  return (
    <div className="overflow-hidden whitespace-nowrap w-full">
      <div 
        ref={marqueeRef} 
        className={`flex items-center ${className}`}
        style={{ display: 'flex', width: 'max-content' }}
      >
        {/* Duplicate content for seamless looping */}
        <div className="flex items-center">
          {content}
        </div>
        <div className="flex items-center">
          {content}
        </div>
      </div>
    </div>
  )
}