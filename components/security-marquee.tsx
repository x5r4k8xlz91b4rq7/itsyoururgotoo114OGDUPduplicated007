"use client"

import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Lock, ShieldCheck, Server, Users, Clock, ScrollText, Database, RotateCcw, Activity, Bell, Key, LifeBuoy, EyeOff, Cookie, File, Settings, MailCheck, ChevronDown } from 'lucide-react'
import { useMemo } from 'react'

// Row 1 features (scroll →)
const row1Features = [
  { icon: Lock, text: "HTTPS/TLS Enabled", color: "text-blue-400" },
  { icon: ShieldCheck, text: "Encrypted in Transit", color: "text-green-400" },
  { icon: Server, text: "Secure Hosting", color: "text-purple-400" },
  { icon: Users, text: "Role-Based Access", color: "text-yellow-400" },
  { icon: Clock, text: "Session Timeout", color: "text-emerald-400" },
  { icon: ScrollText, text: "Activity Logs", color: "text-red-400" },
]

// Row 2 features (scroll ←)
const row2Features = [
  { icon: Database, text: "Regular Backups", color: "text-pink-400" },
  { icon: RotateCcw, text: "Restore Options", color: "text-orange-400" },
  { icon: Activity, text: "Uptime Status", color: "text-cyan-400" },
  { icon: Bell, text: "Service Notifications", color: "text-indigo-400" },
  { icon: Key, text: "Access Requests", color: "text-teal-400" },
  { icon: LifeBuoy, text: "Account Recovery", color: "text-violet-400" },
]

// Row 3 features (scroll →)
const row3Features = [
  { icon: ShieldCheck, text: "Two-Step Sign-In (Optional)", color: "text-blue-400" },
  { icon: EyeOff, text: "Privacy Controls", color: "text-green-400" },
  { icon: Cookie, text: "Cookie Preferences", color: "text-purple-400" },
  { icon: File, text: "Read-Only Permissions", color: "text-yellow-400" },
  { icon: Settings, text: "Secure Defaults", color: "text-emerald-400" },
  { icon: MailCheck, text: "Email Verified", color: "text-red-400" },
]

const TrustFeatureBadge = ({ icon: Icon, text, color }: { icon: any, text: string, color: string }) => (
  <div 
    className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full whitespace-nowrap mx-4 hover:bg-white/8 transition-all duration-300"
    tabIndex={-1}
    role="presentation"
    aria-hidden="true"
  >
    <Icon className={`h-5 w-5 ${color}`} />
    <span className="text-white font-medium">{text}</span>
  </div>
)

const SmoothMarquee = ({ items, direction = "left", speed = 30 }: { 
  items: typeof row1Features, 
  direction?: "left" | "right",
  speed?: number 
}) => {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const isPausedRef = useRef(false)
  const positionRef = useRef(0)
  const animationIdRef = useRef<number>()
  
  // Memoize the items array to prevent unnecessary re-renders
  const memoizedItems = useMemo(() => {
    if (!Array.isArray(items)) return []
    return items
  }, [JSON.stringify(items)])

  // Handle reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)
      
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches)
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Handle tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPausedRef.current = document.hidden
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Pause animations when not in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isPausedRef.current = !entry.isIntersecting
      },
      { threshold: 0.1 }
    )

    if (marqueeRef.current) {
      observer.observe(marqueeRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const marquee = marqueeRef.current
    if (!marquee || memoizedItems.length === 0 || prefersReducedMotion) return

    // Initialize position if not set
    if (positionRef.current === 0) {
      positionRef.current = direction === "right" ? -marquee.scrollWidth / 2 : 0
    }
    
    const scrollSpeed = direction === "left" ? -speed : speed
    let isActive = true

    const animate = () => {
      if (!isActive) return
      
      // Only update position when not paused
      if (!isPausedRef.current) {
        positionRef.current += scrollSpeed / 60 // Convert speed to pixels per frame (60fps)
        
        // Reset position when content has completely scrolled off screen
        if (direction === "left" && positionRef.current <= -marquee.scrollWidth / 2) {
          positionRef.current = 0
        } else if (direction === "right" && positionRef.current >= 0) {
          positionRef.current = -marquee.scrollWidth / 2
        }
      }
      
      // Always apply current position
      marquee.style.transform = `translateX(${positionRef.current}px)`
      
      if (isActive) {
        animationIdRef.current = requestAnimationFrame(animate)
      }
    }

    animationIdRef.current = requestAnimationFrame(animate)

    return () => {
      isActive = false
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [speed, direction, memoizedItems.length, prefersReducedMotion])

  // Static grid fallback for reduced motion
  if (prefersReducedMotion) {
    return (
      <div className="flex flex-wrap justify-center gap-4 px-4">
        {memoizedItems.map((feature, index) => (
          <TrustFeatureBadge
            key={`${feature.text}-${index}`}
            icon={feature.icon}
            text={feature.text}
            color={feature.color}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-hidden whitespace-nowrap w-full">
      <div 
        ref={marqueeRef} 
        className="flex items-center"
        style={{ display: 'flex', width: 'max-content' }}
        onMouseEnter={() => { isPausedRef.current = true }}
        onMouseLeave={() => { isPausedRef.current = false }}
      >
        {/* Duplicate content for seamless looping */}
        <div className="flex items-center">
          {memoizedItems.map((feature, index) => (
            <TrustFeatureBadge
              key={`${feature.text}-${index}`}
              icon={feature.icon}
              text={feature.text}
              color={feature.color}
            />
          ))}
        </div>
        <div className="flex items-center">
          {memoizedItems.map((feature, index) => (
            <TrustFeatureBadge
              key={`${feature.text}-dup-${index}`}
              icon={feature.icon}
              text={feature.text}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const scrollToServices = () => {
  const contactSection = document.getElementById('contact')
  if (contactSection) {
    const headerHeight = 80 // Account for fixed header
    const elementPosition = contactSection.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - headerHeight
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

export default function TrustSecurityMarquee() {

  return (
    <>
    <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Everyday Web Trust & Safety
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Simple, universal safeguards you expect from modern sites.
          </p>
        </motion.div>

        <div className="space-y-6 mb-16">
          {/* Top row - Left scrolling */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <SmoothMarquee items={row1Features} direction="left" speed={40} />
          </motion.div>

          {/* Middle row - Right scrolling */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <SmoothMarquee items={row2Features} direction="right" speed={45} />
          </motion.div>

          {/* Bottom row - Left scrolling */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <SmoothMarquee items={row3Features} direction="left" speed={50} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="flex flex-col items-center text-cyan-400 transition-all duration-300 group cursor-pointer" onClick={scrollToServices}>
            <motion.div
              animate={{
                y: [0, 15, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: [0.45, 0.05, 0.55, 0.95],
                repeatType: "reverse"
              }}
              className="pointer-events-auto"
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ChevronDown className="h-8 w-8 mb-3 transition-all duration-300 group-hover:h-10 group-hover:w-10 text-gray-400 group-hover:text-gray-300" />
              </motion.div>
            </motion.div>
            <motion.div 
              className="text-xs font-bold tracking-widest uppercase opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:tracking-wider text-gray-400 group-hover:text-gray-300"
              animate={{
                opacity: [0.9, 1, 0.9]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Continue
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  )
}
