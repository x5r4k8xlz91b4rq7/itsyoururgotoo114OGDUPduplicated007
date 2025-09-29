"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Owner, Elegant Events Catering',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    content: 'The AI chatbot has revolutionized how we handle inquiries. We went from missing 40% of after-hours leads to capturing every single one. Our booking rate increased by 65% in just 3 months.',
    rating: 5,
    results: '+65% bookings'
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'CEO, Gourmet Catering Co.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    content: 'Their Level 3 website package transformed our online presence. The real-time booking system eliminated back-and-forth emails and doubled our consultation bookings.',
    rating: 5,
    results: '2x consultations'
  },
  {
    id: 3,
    name: 'Jennifer Chen',
    role: 'Director, Premium Catering Services',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    content: 'The analytics dashboard gives us incredible insights into customer preferences and seasonal trends. We\'ve optimized our menu offerings and increased average order value by 35%.',
    rating: 5,
    results: '+35% order value'
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Founder, Artisan Catering',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    content: 'Working with Ai Thumbs was a game-changer. Their CRM automation helped us track every lead and follow up systematically. Our conversion rate improved by 50%.',
    rating: 5,
    results: '+50% conversion'
  },
  {
    id: 5,
    name: 'Lisa Anderson',
    role: 'Operations Manager, Corporate Catering Plus',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    content: 'The 24/7 AI assistant handles dietary restrictions and special requests perfectly. Our clients love the instant responses, and we\'ve reduced our response time from hours to seconds.',
    rating: 5,
    results: 'Instant responses'
  },
  {
    id: 6,
    name: 'Robert Kim',
    role: 'Owner, Fusion Catering Events',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    content: 'The tiered website approach was perfect for our growing business. We started with Level 2 and upgraded to Level 4 as we expanded. Revenue has grown 180% year-over-year.',
    rating: 5,
    results: '+180% revenue'
  }
]

const SuccessStories = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [slidesToShow, setSlidesToShow] = useState(3)

  useEffect(() => {
    const updateSlidesToShow = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) setSlidesToShow(1)
        else if (window.innerWidth < 1024) setSlidesToShow(2)
        else setSlidesToShow(3)
      }
    }

    updateSlidesToShow()
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateSlidesToShow)
      return () => window.removeEventListener('resize', updateSlidesToShow)
    }
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = testimonials.length - slidesToShow
        return prevIndex >= maxIndex ? 0 : prevIndex + 1
      })
    }, 4000)
    
    return () => {
      clearInterval(interval)
    }
  }, [isAutoPlaying, slidesToShow])

  const handlePrevious = () => {
    const maxIndex = testimonials.length - slidesToShow
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const handleNext = () => {
    const maxIndex = testimonials.length - slidesToShow
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => setCurrentIndex(index)

  const maxDotIndex = testimonials.length - slidesToShow

  return (
    <section 
      className="py-20 bg-muted/50"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Success Stories</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Real results from catering businesses that transformed their operations with our AI solutions
          </p>
        </motion.div>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={handlePrevious}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="overflow-hidden mx-12">
            <motion.div
              className="flex"
              animate={{ x: `${-currentIndex * (100 / slidesToShow)}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / slidesToShow}%` }}
                >
                  <div className="glass-card p-6 h-full rounded-2xl border-2 hover:border-primary/30 transition-all duration-300">
                    <div className="flex mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <blockquote className="text-muted-foreground mb-6 text-lg leading-relaxed">
                      "{t.content}"
                    </blockquote>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                      {t.results}
                    </div>
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                      </div>
                      <div className="ml-4">
                        <div className="font-semibold text-foreground">{t.name}</div>
                        <div className="text-sm text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxDotIndex + 1 }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6">
            Ready to join these successful caterers?
          </p>
          <Button size="lg" className="rounded-full px-8">
            Start Your Success Story
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default SuccessStories