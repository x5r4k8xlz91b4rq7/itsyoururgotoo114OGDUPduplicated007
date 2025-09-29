"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useMemo, memo, useCallback } from 'react'
import Link from 'next/link'
import { GlowingStarsBackgroundCard, GlowingStarsTitle, GlowingStarsDescription } from '@/components/ui/glowing-stars'
import { 
  MessageCircle, 
  Globe, 
  Calendar, 
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Shield,
  Users,
  Workflow,
  Palette
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'

const services = [
  {
    icon: MessageCircle,
    title: 'AI Catering Chatbots',
    description: '24/7 instant replies, lead capture, and upselling to convert inquiries into bookings automatically',
    details: {
      overview: 'Our AI chatbots are specifically designed for catering businesses, handling customer inquiries around the clock and converting conversations into confirmed bookings.',
      features: [
        'Instant Response to Inquiries',
        'Menu Recommendations',
        'Dietary Restriction Handling',
        'Event Size Calculations',
        'Pricing Estimates',
        'Lead Qualification'
      ],
      benefits: [
        'Never Miss a Lead',
        'Increased Conversion Rates',
        'Reduced Response Time',
        'Higher Customer Satisfaction'
      ],
      process: [
        { title: 'Setup', description: 'Custom chatbot configuration tailored to your catering services' },
        { title: 'Training', description: 'AI learns your menu, pricing, and service areas' },
        { title: 'Integration', description: 'Seamless connection to your website and booking system' },
        { title: 'Optimization', description: 'Continuous improvement based on conversation data' }
      ]
    }
  },
  {
    icon: Globe,
    title: 'Tiered Website Packages',
    description: 'Level 1 to Level 4 site builds—ranging from simple menus to full-service booking platforms for your brand',
    details: {
      overview: 'Our tiered website packages offer catering businesses scalable solutions from basic menu displays to comprehensive booking platforms, all designed specifically for food service professionals.',
      features: [
        'Mobile-Responsive Design',
        'Menu Management System',
        'Photo Galleries',
        'Contact Forms',
        'Online Booking Integration',
        'Payment Processing'
      ],
      benefits: [
        'Professional Online Presence',
        'Increased Online Orders',
        'Streamlined Operations',
        'Brand Recognition'
      ],
      process: [
        { title: 'Consultation', description: 'Understanding your brand and business requirements' },
        { title: 'Design', description: 'Custom website design aligned with your brand identity' },
        { title: 'Development', description: 'Building your site with catering-specific features' },
        { title: 'Launch', description: 'Going live with training and ongoing support' }
      ]
    }
  },
  {
    icon: Calendar,
    title: 'Real-Time Booking Integration',
    description: 'Let clients instantly schedule tastings and consults with tools like Calendly—no back-and-forth emails',
    details: {
      overview: 'Eliminate the hassle of scheduling with integrated booking systems that allow clients to instantly book tastings, consultations, and events directly from your website.',
      features: [
        'Calendar Synchronization',
        'Automated Confirmations',
        'Reminder Notifications',
        'Service Type Selection',
        'Time Slot Management',
        'Client Information Capture'
      ],
      benefits: [
        'Reduced Administrative Work',
        'Faster Booking Process',
        'Improved Client Experience',
        'Higher Conversion Rates'
      ],
      process: [
        { title: 'Integration', description: 'Connect booking system with your existing calendar' },
        { title: 'Configuration', description: 'Set up service types, durations, and availability' },
        { title: 'Customization', description: 'Tailor booking forms to capture relevant information' },
        { title: 'Automation', description: 'Implement automated confirmations and reminders' }
      ]
    }
  },
  {
    icon: BarChart3,
    title: 'Analytics & CRM Automation',
    description: 'Automatically capture emails, event types, and dietary info. Track it all with analytics and sync to your CRM',
    details: {
      overview: 'Our analytics and CRM automation tools help catering businesses track customer interactions, automate data collection, and gain insights into their most profitable services and clients.',
      features: [
        'Automated Data Capture',
        'Customer Journey Tracking',
        'Event Type Analytics',
        'Revenue Reporting',
        'Lead Source Attribution',
        'CRM Synchronization'
      ],
      benefits: [
        'Better Customer Insights',
        'Improved Marketing ROI',
        'Streamlined Data Management',
        'Informed Business Decisions'
      ],
      process: [
        { title: 'Setup', description: 'Configure analytics tracking and CRM integration' },
        { title: 'Data Mapping', description: 'Map customer touchpoints and data collection points' },
        { title: 'Automation', description: 'Implement automated data capture and syncing' },
        { title: 'Reporting', description: 'Create custom dashboards and reporting systems' }
      ]
    }
  },
  {
    icon: Palette,
    title: 'Business Card & Branding Design',
    description: 'Craft powerful first impressions with custom business cards, brand-aligned visual identity, and optional logo design to elevate your catering presence',
    details: {
      overview: 'Professional branding and business card design services specifically tailored for catering businesses, creating cohesive visual identity that sets you apart from competitors.',
      features: [
        'Custom Business Card Design',
        'Logo Design & Refinement',
        'Brand Color Palette',
        'Typography Selection',
        'Marketing Material Templates',
        'Social Media Brand Kit'
      ],
      benefits: [
        'Professional Brand Recognition',
        'Memorable First Impressions',
        'Consistent Visual Identity',
        'Enhanced Marketing Materials'
      ],
      process: [
        { title: 'Discovery', description: 'Understanding your brand vision and target market' },
        { title: 'Design', description: 'Creating custom designs aligned with your catering style' },
        { title: 'Refinement', description: 'Perfecting designs based on your feedback' },
        { title: 'Delivery', description: 'Providing print-ready files and brand guidelines' }
      ]
    }
  }
]

const ServiceDetails = memo(({ service, isActive }: { service: typeof services[0]; isActive: boolean }) => {
  // Memoize expensive computations
  const processSteps = useMemo(() => service.details.process, [service.details.process])
  const features = useMemo(() => service.details.features, [service.details.features])
  const benefits = useMemo(() => service.details.benefits, [service.details.benefits])

  if (!isActive) return null

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="p-4 bg-primary/10 rounded-2xl">
          <service.icon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
          <p className="text-muted-foreground text-lg">{service.details.overview}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" />
            Our Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {processSteps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <h4 className="font-semibold">{step.title}</h4>
                </div>
                <p className="text-muted-foreground">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-4 -right-4 h-5 w-5 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Link href="/services">
          <Button size="lg" className="rounded-full">
            Learn More
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
})

ServiceDetails.displayName = 'ServiceDetails'

const Services = () => {
  const [activeTab, setActiveTab] = useState(services[0].title)
  const [previousTab, setPreviousTab] = useState(services[0].title)

  const handleServiceSwitch = useCallback((event: CustomEvent) => {
    const { serviceName } = event.detail
    setActiveTab(serviceName)
  }, [])

  useEffect(() => {
    window.addEventListener('switchServiceTab', handleServiceSwitch as EventListener)
    
    return () => {
      window.removeEventListener('switchServiceTab', handleServiceSwitch as EventListener)
    }
  }, [handleServiceSwitch])
  
  const handleTabChange = useCallback((value: string) => {
    // If clicking the same tab and user has scrolled down, scroll to top
    if (value === activeTab && window.scrollY > 100) {
      // Check motion preferences
      const prefersReducedMotion = typeof window !== 'undefined' && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      // Scroll to top smoothly
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      })
      return
    }
    
    // Update previous tab before changing active tab
    setPreviousTab(activeTab)
    setActiveTab(value)
  }, [activeTab])
  
  return (
    <section id="services" className="pt-8 pb-32 relative overflow-visible scroll-mt-40">
      <div className="absolute inset-0 hero-gradient opacity-50" />
      <div className="container mx-auto px-4 relative z-10">
        {/* Bold Technology Banner */}
        <div className="text-center py-6 mb-8 mt-8 sm:mt-6 md:mt-4 relative z-20">
          {/* Centered Heading */}
          <div className="relative flex justify-center mb-6">
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="section-heading">
            Catering AI Solutions
          </h2>
          <p className="section-subheading">
            Specialized websites and AI tools built to capture leads, fill calendars, and unlock growth for modern caterers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.slice(0, 4).map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlowingStarsBackgroundCard className="h-full">
                <Card className="hover-scale h-full glass-card bg-transparent border-none">
                  <CardHeader>
                    <div className="mb-6 p-4 bg-primary/10 w-fit rounded-2xl">
                      <service.icon className="h-8 w-8 text-primary" />
                    </div>
                    <GlowingStarsTitle className="text-2xl mb-4">{service.title}</GlowingStarsTitle>
                    <GlowingStarsDescription className="text-lg">{service.description}</GlowingStarsDescription>
                  </CardHeader>
                </Card>
              </GlowingStarsBackgroundCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <GlowingStarsBackgroundCard className="h-full">
            <Card className="hover-scale h-full glass-card bg-transparent border-none">
              <CardHeader>
                <div className="mb-6 p-4 bg-primary/10 w-fit rounded-2xl">
                  <Palette className="h-8 w-8 text-primary" />
                </div>
                <GlowingStarsTitle className="text-2xl mb-4">{services[4].title}</GlowingStarsTitle>
                <GlowingStarsDescription className="text-lg">{services[4].description}</GlowingStarsDescription>
              </CardHeader>
            </Card>
          </GlowingStarsBackgroundCard>
        </motion.div>

        <Card className="glass-card" id="services-tabs">
          <CardContent className="p-6">
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="w-full justify-start mb-8 overflow-x-auto flex-wrap h-auto gap-2 bg-transparent">
                {services.map((service) => (
                  <TabsTrigger
                    key={service.title}
                    value={service.title}
                    className="relative data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-150 hover:bg-primary/10 data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary-foreground data-[state=active]:after:rounded-full"
                  >
                    <service.icon className="h-4 w-4 mr-2" />
                    {service.title === 'Business Card & Branding Design' ? 'Branding & Design' : service.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {services.map((service, index) => (
                <TabsContent key={service.title} value={service.title}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ServiceDetails service={service} isActive={activeTab === service.title} />
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Services