"use client"

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export default function AiThumbsScroll() {
  const containerRef = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [isScrollArrowVisible, setIsScrollArrowVisible] = useState(true)

  // Scroll-based animation setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Define scroll transforms for the logo
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100])

  // Intersection Observer to detect when section is in view
  useEffect(() => {
    if (!containerRef.current) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.3 }
    )

    const currentRef = containerRef.current
    observer.observe(currentRef)

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
      observer.disconnect()
    }
  }, [])

  // Continuous fade in/out animation when section is in view
  useEffect(() => {
    if (!isInView) {
      setIsScrollArrowVisible(false)
      return
    }

    // Start with visible state
    setIsScrollArrowVisible(true)
    
    let intervalId: NodeJS.Timeout
    const interval = setInterval(() => {
      setIsScrollArrowVisible(prev => {
        return !prev
      })
    }, 5000) // 5 seconds
    
    intervalId = interval

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isInView])

  return (
    <motion.section 
      ref={containerRef}
      className="relative py-24 bg-[#0c1b26] overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center h-[600px] w-full p-8">
        {/* Premium Gradient Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-wider text-center mb-12 leading-tight"
        >
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-cyan-500 drop-shadow-lg filter">
            Supercharge Your Business
          </div>
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-400 to-sky-400 drop-shadow-lg filter mt-2">
            with AI
          </div>
        </motion.h1>

        {/* AI Thumbs Logo with Enhanced Effects */}
        <motion.div
          className="relative"
          style={{ scale, opacity, y }}
          whileHover={{
            scale: 1.15,
            transition: { 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              duration: 0.2
            }
          }}
          whileTap={{
            scale: 1.05,
            transition: { duration: 0.1 }
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            duration: 0.2
          }}
        >
          <img
            src="https://i.postimg.cc/h43PsyhN/Untitled-design-14.png"
            alt="AI Thumbs Logo"
            className="max-h-[300px] lg:max-h-[350px] w-auto object-contain"
            draggable="false"
            style={{
              filter: 'drop-shadow(0 10px 30px rgba(56, 189, 248, 0.3)) drop-shadow(0 0 60px rgba(6, 182, 212, 0.2))'
            }}
          />
        </motion.div>
      </div>

      {/* Premium Idle-triggered Scroll Arrow */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.8 }}
        animate={{ 
          opacity: isInView && isScrollArrowVisible ? 1 : 0,
          y: isInView ? 0 : 30,
          scale: isInView ? 1 : 0.8
        }}
        transition={{ 
          duration: 0.8,
          ease: "easeInOut"
        }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 group"
        whileHover={{ 
          scale: 1.1,
          y: -5,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
      >
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
          className="flex flex-col items-center text-cyan-400 transition-all duration-300 group-hover:text-sky-300"
          style={{
            filter: 'drop-shadow(0 0 25px rgba(6, 182, 212, 0.8)) drop-shadow(0 4px 15px rgba(56, 189, 248, 0.6)) drop-shadow(0 0 40px rgba(34, 211, 238, 0.4))'
          }}
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
            <ChevronDown className="h-12 w-12 mb-3 transition-all duration-300 group-hover:h-14 group-hover:w-14" />
          </motion.div>
          <motion.div 
            className="text-xs font-bold tracking-widest uppercase opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:tracking-wider"
            animate={{
              opacity: [0.9, 1, 0.9]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            SCROLL
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Ambient Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
    </motion.section>
  )
}