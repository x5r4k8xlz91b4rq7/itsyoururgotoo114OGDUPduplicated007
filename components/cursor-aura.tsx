"use client"

import { useEffect, useRef, useState } from 'react'

export default function CursorAura() {
  const animationRef = useRef<number>()
  const isMovingRef = useRef(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only enable cursor aura after component mounts and user starts interacting
    const handleFirstInteraction = () => {
      setIsVisible(true)
      document.removeEventListener('mousemove', handleFirstInteraction)
    }
    
    document.addEventListener('mousemove', handleFirstInteraction)
    return () => document.removeEventListener('mousemove', handleFirstInteraction)
  }, [])

  useEffect(() => {
    // Hide on mobile and touch devices
    if ('ontouchstart' in window || !isVisible) {
      return
    }

    const cursor = document.createElement('div')
    cursor.className = 'cursor-aura'
    document.body.appendChild(cursor)
    
    // Add a secondary pulse element for AI effect
    const pulse = document.createElement('div')
    pulse.className = 'cursor-pulse'
    document.body.appendChild(pulse)

    const updateCursor = (e: MouseEvent) => {
      // Update cursor position immediately for exact following
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
      pulse.style.left = e.clientX + 'px'
      pulse.style.top = e.clientY + 'px'
      
      // Add movement class for enhanced glow when moving
      if (!isMovingRef.current) {
        cursor.classList.add('moving')
        isMovingRef.current = true
        
        // Remove movement class after a delay
        setTimeout(() => {
          cursor.classList.remove('moving')
          isMovingRef.current = false
        }, 150)
      }
    }

    // Enhanced hover detection for interactive elements
    const handleMouseEnter = (e: Event) => {
      const target = e.target as Element
      if (target?.matches && (
        target.matches('button, a, [role="button"], .cursor-hover, input, textarea, select') ||
        target.closest('button, a, [role="button"], .cursor-hover')
      )) {
        cursor.classList.add('interactive')
        pulse.classList.add('interactive')
      }
    }

    const handleMouseLeave = (e: Event) => {
      const target = e.target as Element
      if (target?.matches && (
        target.matches('button, a, [role="button"], .cursor-hover, input, textarea, select') ||
        target.closest('button, a, [role="button"], .cursor-hover')
      )) {
        cursor.classList.remove('interactive')
        pulse.classList.remove('interactive')
      }
    }

    window.addEventListener('mousemove', updateCursor)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('mousemove', updateCursor)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor)
      }
      if (document.body.contains(pulse)) {
        document.body.removeChild(pulse)
      }
    }
  }, [isVisible])

  return null // This component doesn't render anything visible
}