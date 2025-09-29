"use client"

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  Globe, 
  Calendar, 
  BarChart3,
  Palette,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Shield,
  Users,
  Workflow,
  Star,
  Clock,
  TrendingUp,
  Zap,
  Target,
  Phone,
  Mail,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    icon: MessageCircle,
    title: 'AI Catering Chatbots',
    shortDescription: '24/7 instant replies, lead capture, and upselling to convert inquiries into bookings automatically',
    longDescription: 'Our AI-powered chatbots are specifically engineered for the catering industry, providing intelligent conversation management that never sleeps. These sophisticated systems understand catering terminology, pricing structures, and customer needs to deliver personalized responses that convert inquiries into confirmed bookings.',
    features: [
      'Instant Response to Inquiries',
      'Smart Menu Recommendations',
      'Dietary Restriction Handling',
      'Event Size Calculations',
      'Dynamic Pricing Estimates',
      'Advanced Lead Qualification',
      'Multi-language Support',
      'Integration with Booking Systems'
    ],
    benefits: [
      'Never Miss a Lead Again',
      '65% Increase in Conversion Rates',
      'Reduced Response Time to Seconds',
      'Higher Customer Satisfaction',
      '24/7 Availability',
      'Consistent Brand Voice'
    ],
    useCases: [
      'After-hours inquiry handling',
      'Menu consultation and recommendations',
      'Event planning assistance',
      'Pricing and availability checks',
      'Dietary requirement consultations',
      'Lead qualification and routing'
    ],
    pricing: 'Starting from $299/month',
    demoUrl: '#demo-chatbot'
  },
  {
    icon: Globe,
    title: 'Tiered Website Packages',
    shortDescription: 'Level 1 to Level 4 site builds—ranging from simple menus to full-service booking platforms',
    longDescription: 'Our comprehensive website solutions are tailored specifically for catering businesses, offering scalable packages that grow with your business. From simple menu showcases to sophisticated booking platforms with payment processing, each tier is designed to maximize your online presence and convert visitors into customers.',
    features: [
      'Mobile-Responsive Design',
      'Professional Menu Management',
      'High-Quality Photo Galleries',
      'Advanced Contact Forms',
      'Real-time Booking Integration',
      'Secure Payment Processing',
      'SEO Optimization',
      'Analytics Dashboard'
    ],
    benefits: [
      'Professional Online Presence',
      '150% Increase in Online Orders',
      'Streamlined Operations',
      'Enhanced Brand Recognition',
      'Better Search Rankings',
      'Improved Customer Experience'
    ],
    useCases: [
      'Menu display and management',
      'Online booking and scheduling',
      'Portfolio and gallery showcase',
      'Customer testimonials',
      'Contact and inquiry forms',
      'Payment collection'
    ],
    pricing: 'Level 1: $1,499 | Level 4: $4,999',
    demoUrl: '#demo-website'
  },
  {
    icon: Calendar,
    title: 'Real-Time Booking Integration',
    shortDescription: 'Let clients instantly schedule tastings and consults—no back-and-forth emails',
    longDescription: 'Eliminate scheduling friction with our seamless booking integration that connects directly to your calendar systems. Clients can view real-time availability, select services, and book appointments instantly, while automated workflows handle confirmations, reminders, and follow-ups.',
    features: [
      'Real-time Calendar Synchronization',
      'Automated Confirmation System',
      'Smart Reminder Notifications',
      'Service Type Selection',
      'Dynamic Time Slot Management',
      'Client Information Capture',
      'Payment Collection at Booking',
      'Cancellation and Rescheduling'
    ],
    benefits: [
      '75% Reduction in Administrative Work',
      '300% Faster Booking Process',
      'Improved Client Experience',
      'Higher Conversion Rates',
      'Reduced No-shows',
      'Better Resource Planning'
    ],
    useCases: [
      'Tasting appointments',
      'Consultation scheduling',
      'Event planning meetings',
      'Kitchen tours',
      'Menu planning sessions',
      'Final walkthroughs'
    ],
    pricing: 'Included with website packages',
    demoUrl: '#demo-booking'
  },
  {
    icon: BarChart3,
    title: 'Analytics & CRM Automation',
    shortDescription: 'Automatically capture emails, event types, and dietary info. Track it all with analytics',
    longDescription: 'Transform your customer data into actionable insights with our comprehensive analytics and CRM automation platform. Automatically capture customer interactions, track engagement patterns, and optimize your marketing efforts based on real-time data and behavioral analysis.',
    features: [
      'Automated Data Capture',
      'Customer Journey Tracking',
      'Event Type Analytics',
      'Revenue Reporting',
      'Lead Source Attribution',
      'CRM Synchronization',
      'Predictive Analytics',
      'Custom Dashboards'
    ],
    benefits: [
      'Better Customer Insights',
      '200% Improved Marketing ROI',
      'Streamlined Data Management',
      'Informed Business Decisions',
      'Automated Follow-ups',
      'Increased Customer Lifetime Value'
    ],
    useCases: [
      'Lead tracking and nurturing',
      'Customer behavior analysis',
      'Revenue forecasting',
      'Marketing campaign optimization',
      'Customer segmentation',
      'Performance monitoring'
    ],
    pricing: 'Starting from $199/month',
    demoUrl: '#demo-analytics'
  },
  {
    icon: Palette,
    title: 'Business Card & Branding Design',
    shortDescription: 'Craft powerful first impressions with custom business cards, brand-aligned visual identity, and optional logo design to elevate your catering presence',
    longDescription: 'Professional branding and business card design services specifically tailored for catering businesses, creating cohesive visual identity that sets you apart from competitors and builds trust with potential clients.',
    features: [
      'Custom Business Card Design',
      'Logo Design & Refinement',
      'Brand Color Palette',
      'Typography Selection',
      'Marketing Material Templates',
      'Social Media Brand Kit',
      'Print-Ready File Formats',
      'Brand Guidelines Document'
    ],
    benefits: [
      'Professional Brand Recognition',
      'Memorable First Impressions',
      'Consistent Visual Identity',
      'Enhanced Marketing Materials',
      'Increased Client Trust',
      'Stand Out from Competitors'
    ],
    useCases: [
      'Networking events and trade shows',
      'Client meetings and consultations',
      'Marketing material coordination',
      'Social media brand consistency',
      'Professional correspondence',
      'Brand recognition building'
    ],
    pricing: 'Starting from $499',
    demoUrl: '#demo-branding'
  }
]

const stats = [
  { number: '500+', label: 'Catering Businesses Served' },
  { number: '180%', label: 'Average Revenue Increase' },
  { number: '24/7', label: 'AI Support Availability' },
  { number: '99.9%', label: 'System Uptime' }
]

const industryFocus = [
  'Corporate Catering',
  'Wedding Catering',
  'Event Catering',
  'Restaurant Catering',
  'Specialty Diets',
  'Food Trucks',
  'Bakeries',
  'Meal Prep Services'
]

export default function ServicesPageContent() {
  const router = useRouter()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-POWERED CATERING SOLUTIONS
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Transform Your</span><br />
              Catering Business
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Comprehensive AI solutions designed exclusively for the catering industry. 
              From chatbots that never sleep to websites that convert, we've got everything you need to scale your catering business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full px-8">
                <Phone className="h-5 w-5 mr-2" />
                Schedule Consultation
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8">
                <Mail className="h-5 w-5 mr-2" />
                Request Demo
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Complete Service Portfolio
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Each solution is crafted specifically for catering businesses, ensuring maximum impact and ROI
            </p>
          </motion.div>

          <div className="space-y-20">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-primary/10 rounded-2xl">
                      <service.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold">{service.title}</h3>
                      <p className="text-primary font-semibold">{service.pricing}</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {service.longDescription}
                  </p>
                  
                  <div className="flex gap-4">
                    <Button className="rounded-full">
                      View Demo
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="rounded-full">
                      Learn More
                    </Button>
                  </div>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Cpu className="h-5 w-5 text-primary" />
                            Key Features
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {service.features.slice(0, 6).map((feature) => (
                              <div key={feature} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Key Benefits
                          </h4>
                          <div className="space-y-2">
                            {service.benefits.slice(0, 3).map((benefit) => (
                              <div key={benefit} className="flex items-center gap-2 text-sm">
                                <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Focus */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Industry Specializations
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              We understand the unique challenges and opportunities in every catering niche
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industryFocus.map((industry, index) => (
              <motion.div
                key={industry}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 text-center hover:border-primary/30 transition-all duration-300"
              >
                <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold">{industry}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Implementation Process
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              From consultation to launch, we ensure a smooth transition to AI-powered operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: 'Discovery', description: 'We analyze your current operations and identify opportunities', icon: Target },
              { title: 'Strategy', description: 'Custom solution design tailored to your specific needs', icon: Workflow },
              { title: 'Implementation', description: 'Seamless integration with training and support', icon: Zap },
              { title: 'Optimization', description: 'Continuous improvement based on performance data', icon: TrendingUp }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center relative"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 h-5 w-5 text-muted-foreground" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Catering Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of successful caterers who have already revolutionized their operations with our AI solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full px-8">
                <Phone className="h-5 w-5 mr-2" />
                Get Started Today
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8">
                <Clock className="h-5 w-5 mr-2" />
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}