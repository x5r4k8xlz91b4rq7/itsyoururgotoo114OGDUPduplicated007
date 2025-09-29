'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useDemoForm } from '@/context/demo-form-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import FilePreviewModal, { PreviewItem } from '@/components/FilePreviewModal'
import HoverGlow from '@/components/HoverGlow'
import { createPortal } from 'react-dom'
import { 
  MessageCircle, 
  Globe, 
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Clock,
  TrendingUp,
  Star,
  Phone,
  Mail,
  Sparkles,
  Calendar,
  CreditCard,
  Shield,
  Target,
  AlertCircle,
  X,
  Eye,
  DollarSign,
  ChevronDown,
  Palette,
  Bot,
  Zap as ZapIcon,
  Clock as ClockIcon,
  Users as UsersIcon
} from 'lucide-react'

const websitePackages = [
  {
    level: 'Level 1',
    name: 'Essential',
    originalPrice: '$500',
    price: '$250',
    features: ['Professional Menu Display', 'Contact Forms', 'Mobile Responsive', 'Basic SEO'],
    highlight: false
  },
  {
    level: 'Level 2', 
    name: 'Professional',
    originalPrice: '$1,000',
    price: '$500',
    features: ['Everything in Level 1', 'Photo Galleries', 'Online Inquiry Forms', 'Social Media Integration'],
    highlight: false
  },
  {
    level: 'Level 3',
    name: 'Advanced',
    originalPrice: '$1,500',
    price: '$1,000',
    features: ['Everything in Level 2', 'Real-time Booking', 'Payment Processing', 'Customer Portal'],
    highlight: true
  },
  {
    level: 'Level 4',
    name: 'Enterprise',
    originalPrice: '$2,000',
    price: '$1,500',
    features: ['Everything in Level 3', 'Advanced Analytics', 'CRM Integration', 'Multi-location Support'],
    highlight: false
  }
]

const chatbotMessages = [
  { sender: 'user', text: 'Hi, I need catering for a wedding for 150 people' },
  { sender: 'bot', text: 'Congratulations on your upcoming wedding! I\'d be happy to help. What date are you planning for?' },
  { sender: 'user', text: 'June 15th, 2024. Do you handle dietary restrictions?' },
  { sender: 'bot', text: 'Yes! We specialize in all dietary needs - vegetarian, vegan, gluten-free, and more. I can connect you with our head chef to discuss a custom menu. Would you like to schedule a tasting?' }
]

const crmFeatures = [
  {
    icon: UsersIcon,
    title: 'Smart Customer Profiles',
    description: 'Automatically capture and organize customer data from every interaction'
  },
  {
    icon: TrendingUp,
    title: 'Conversion Analytics',
    description: 'Track lead sources, conversion rates, and identify your most profitable channels'
  },
  {
    icon: Calendar,
    title: 'Automated Follow-ups',
    description: 'Never miss a follow-up with AI-powered scheduling and reminder systems'
  },
  {
    icon: Target,
    title: 'Lead Scoring',
    description: 'AI prioritizes leads based on likelihood to convert and event value'
  },
  {
    icon: Palette,
    title: 'Brand Identity Management',
    description: 'Consistent branding across all customer touchpoints and marketing materials'
  }
]

const testimonials = [
  {
    name: 'Sarah Mitchell',
    company: 'Elegant Events Catering',
    result: '+65% bookings',
    quote: 'The AI chatbot has revolutionized how we handle inquiries. We went from missing 40% of after-hours leads to capturing every single one.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Marcus Rodriguez', 
    company: 'Gourmet Catering Co.',
    result: '2x consultations',
    quote: 'Their Level 3 website package transformed our online presence. The real-time booking system eliminated back-and-forth emails.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Jennifer Chen',
    company: 'Premium Catering Services', 
    result: '+35% order value',
    quote: 'The analytics dashboard gives us incredible insights into customer preferences and seasonal trends.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
  }
]

const faqs = [
  {
    question: 'Can this integrate with my existing website?',
    answer: 'Absolutely! Our AI chatbot can be integrated into any existing website with a simple code snippet. For website packages, we can work with your current hosting or provide new hosting solutions.'
  },
  {
    question: 'What if I don\'t have a menu finalized yet?',
    answer: 'No problem! We can help you develop your menu as part of the process. Our AI can suggest popular catering options based on your cuisine type and target market.'
  },
  {
    question: 'How quickly can I see results?',
    answer: 'Most clients see immediate improvements in lead capture within 24 hours of launch. Full optimization and significant booking increases typically occur within 2-4 weeks.'
  },
  {
    question: 'Do you provide training and support?',
    answer: 'Yes! We provide comprehensive training for your team and offer ongoing support. Our AI systems also learn and improve over time with minimal maintenance required.'
  },
  {
    question: 'What happens to leads generated during off-hours?',
    answer: 'This is where we shine! Our AI chatbot captures and qualifies leads 24/7, sending you organized summaries and hot leads via email or SMS in real-time.'
  }
]

const aiFeatures = [
  {
    icon: ZapIcon,
    title: "Never miss leads",
    description: "24/7 AI captures every inquiry"
  },
  {
    icon: UsersIcon, 
    title: "High conversion AI Assistant",
    description: "Smart responses boost bookings"
  },
  {
    icon: ClockIcon,
    title: "Smart 24/7 Customer Support", 
    description: "Instant responses any time"
  }
]

const brandDesignImages: PreviewItem[] = [
  {
    id: 'raptor-card',
    name: 'Raptor Catering & Events Business Card',
    type: 'url',
    data: 'https://i.postimg.cc/vBsz2g4x/Remove-background-project-2.png'
  },
  {
    id: 'elegant-card', 
    name: 'Elegant Events Premium Catering Business Card',
    type: 'url',
    data: 'https://i.postimg.cc/xC3Pwfmx/Remove-background-project-1.png'
  }
]

export default function DemoPageContent() {
  const router = useRouter()
  const { open } = useDemoForm()
  const [aiToggles, setAiToggles] = useState<Record<string, boolean>>({
    'Level 1': false,
    'Level 2': false,
    'Level 3': false,
    'Level 4': false
  })
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false)
  const [currentBrandImageIndex, setCurrentBrandImageIndex] = useState(0)

  const handleToggle = (level: string) => {
    setAiToggles(prev => ({
      ...prev,
      [level]: !prev[level]
    }))
  }

  const openBrandModal = (index: number) => {
    setCurrentBrandImageIndex(index)
    setIsBrandModalOpen(true)
  }

  const closeBrandModal = () => {
    setIsBrandModalOpen(false)
  }
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
              LIVE INTERACTIVE DEMO
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Explore Ai Thumbs</span><br />
              in Action
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              Interactive previews of our chatbots, websites, and CRM tools that are transforming catering businesses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="rounded-full px-8"
                onClick={(e) => {
                  e.preventDefault()
                  open()
                }}
              >
                <Phone className="h-5 w-5 mr-2" />
                Request Personal Demo
              </Button>
              <a href="#chatbot-demo">
                <Button size="lg" className="rounded-full px-8">
                  <Eye className="h-5 w-5 mr-2" />
                  View Live Example
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Chatbot Demo Section */}
      <section id="chatbot-demo" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI Catering Chatbot Preview
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              See how our AI assistant handles real customer inquiries 24/7
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card">
                <CardHeader className="bg-primary/5 rounded-t-xl">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Live Chat Demo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-96 overflow-y-auto p-4 space-y-4">
                    {chatbotMessages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.2 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs p-3 rounded-lg ${
                          message.sender === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="border-t p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      AI is typing...
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold">What Our AI Chatbot Handles:</h3>
              <div className="space-y-4">
                {[
                  'Instant response to catering inquiries',
                  'Menu recommendations and customization',
                  'Dietary restriction consultations',
                  'Event size and pricing calculations',
                  'Availability checking and booking',
                  'Lead qualification and routing'
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Result:</strong> Our clients typically see a 65% increase in conversion rates and never miss another lead.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tiered Website Packages Section */}
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
              Tiered Website Packages
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              From simple menu displays to full-service booking platforms - choose what fits your business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
            {websitePackages.map((pkg, index) => (
              <motion.div
                key={pkg.level}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex flex-col"
              >
                {pkg.highlight && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full animate-pulse opacity-75"></div>
                      <div className="relative bg-gradient-to-r from-primary via-purple-500 to-primary text-primary-foreground px-4 py-1.5 rounded-full font-bold text-xs shadow-lg shadow-primary/50 whitespace-nowrap">
                        ⭐ MOST POPULAR
                      </div>
                    </div>
                  </div>
                )}
                <Card className={`relative flex flex-col ${
                  pkg.highlight 
                    ? 'scale-[1.02] ring-2 ring-primary/50 shadow-2xl shadow-primary/25' 
                    : ''
                } glass-card bg-white/3 backdrop-blur-md border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 transition-all duration-300 group overflow-hidden`}
                  data-ai-active={aiToggles[pkg.level]}
                  style={{
                    minHeight: '500px',
                    contain: 'layout style'
                  }}
                >
                  
                  {/* Animated neon border for featured card */}
                  {pkg.highlight && (
                    <div className="absolute inset-0 rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-purple-500 to-primary p-[1px] animate-pulse">
                        <div className="w-full h-full bg-background/95 rounded-2xl"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Content wrapper */}
                  <div className="relative z-10 flex flex-col flex-1">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4 relative">
                        <Badge 
                          variant={pkg.highlight ? "default" : "secondary"}
                          className={`${pkg.highlight ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/10 text-muted-foreground border-white/20'} px-3 py-1 rounded-full font-medium`}
                        >
                          {pkg.level}
                        </Badge>
                        
                        {/* AI Chat Assistant Toggle - now in vertical container */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-primary" />
                            <Switch
                              checked={aiToggles[pkg.level]}
                              onCheckedChange={() => handleToggle(pkg.level)}
                              className="data-[state=checked]:bg-primary"
                              aria-label={`Toggle AI Chat Assistant for ${pkg.name} package`}
                              role="switch"
                              aria-checked={aiToggles[pkg.level]}
                            />
                          </div>
                          
                          {/* Monthly pricing indicator - now below the toggle */}
                          {aiToggles[pkg.level] && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.2, delay: 0.1 }}
                              className="text-xs text-primary font-semibold"
                            >
                              +$50 monthly
                            </motion.div>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-2xl md:text-3xl font-bold mb-4 gradient-text">{pkg.name}</CardTitle>
                      <div className="mb-6">
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-sm text-muted-foreground line-through opacity-60">$</span>
                          <span className="text-2xl font-semibold text-muted-foreground line-through opacity-60">
                            {pkg.originalPrice.replace('$', '')}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm text-muted-foreground">$</span>
                          <span className="text-4xl md:text-5xl font-bold text-primary">
                            {pkg.price.replace('$', '').replace(',', ',')}
                          </span>
                          <span className="text-muted-foreground ml-2">one-time</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1">
                      <ul className="space-y-3 mb-8 flex-1">
                        {pkg.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {/* AI Assistant Features */}
                      <motion.div
                        initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        animate={{ 
                          opacity: aiToggles[pkg.level] ? 1 : 0,
                          height: aiToggles[pkg.level] ? 'auto' : 0
                        }}
                        transition={{ 
                          duration: 0.4, 
                          ease: 'easeInOut',
                          height: { duration: 0.4 },
                          opacity: { duration: 0.3, delay: aiToggles[pkg.level] ? 0.1 : 0 }
                        }}
                        className="overflow-hidden will-change-transform"
                        style={{
                          transformOrigin: 'top',
                          backfaceVisibility: 'hidden'
                        }}
                      >
                        {aiToggles[pkg.level] && (
                          <div className="space-y-3 pt-4 mt-2 border-t border-primary/20">
                            <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Bot className="h-3 w-3" />
                              AI Chat Assistant Benefits
                            </div>
                            {aiFeatures.map((feature, index) => (
                              <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                transition={{ 
                                  duration: 0.3, 
                                  delay: index * 0.08,
                                  ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                                className="relative p-3 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/30 glow-border mb-6"
                              >
                                <div className="flex items-start gap-2">
                                  <feature.icon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-sm font-semibold text-primary">{feature.title}</div>
                                    <div className="text-xs text-muted-foreground">{feature.description}</div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                      
                      <Button 
                        className={`w-full rounded-full py-3 font-semibold transition-all duration-300 mt-4 ${
                          pkg.highlight 
                            ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]' 
                            : 'bg-white/5 hover:bg-white/10 border border-white/20 hover:border-primary/50 text-foreground hover:text-primary'
                        }`}
                        variant="ghost"
                        aria-label={`View example for ${pkg.name} package`}
                      >
                        View Example
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call-to-Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-6 text-lg">
            Ready to see these solutions in action for your catering business?
          </p>
          <Button
            size="lg" 
            className="group text-lg h-16 px-10 rounded-full hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/25 button-shine"
            onClick={(e) => {
              e.preventDefault()
              open()
            }}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Schedule Your Personalized Demo
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        {/* Add CSS to prevent grid interference */}
        <style jsx>{`
          .grid {
            align-items: start !important;
          }
          
          @media (prefers-reduced-motion: reduce) {
            .glow-border::before {
              animation: none !important;
              opacity: 0.6;
            }
          }
        `}</style>
      </section>

      {/* Real-Time Booking Integration Section */}
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
              Real-Time Booking Integration
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Eliminate scheduling friction with instant booking that syncs with your calendar
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card">
                <CardHeader className="bg-primary/5 rounded-t-xl">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Booking Calendar Demo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="font-semibold text-muted-foreground p-2">{day}</div>
                      ))}
                      {Array.from({ length: 35 }, (_, i) => {
                        const date = i + 1 - 6
                        const isToday = date === 15
                        const isAvailable = date > 0 && date <= 30 && ![1, 7, 8, 14, 21, 22, 28, 29].includes(date)
                        return (
                          <div
                            key={i}
                            className={`p-2 text-sm rounded transition-colors ${
                              date <= 0 || date > 30 
                                ? 'text-muted-foreground/30' 
                                : isToday
                                ? 'bg-primary text-primary-foreground font-bold'
                                : isAvailable
                                ? 'hover:bg-primary/10 cursor-pointer'
                                : 'text-muted-foreground/50 line-through'
                            }`}
                          >
                            {date > 0 && date <= 30 ? date : ''}
                          </div>
                        )
                      })}
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Available Time Slots (Today):</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {['10:00 AM', '2:00 PM', '4:00 PM'].map(time => (
                          <Button key={time} variant="outline" size="sm" className="text-xs">
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold">Booking Integration Features:</h3>
              <div className="space-y-4">
                {[
                  'Real-time calendar synchronization',
                  'Automated confirmation emails',
                  'SMS reminder notifications',
                  'Service type selection (tasting, consultation, etc.)',
                  'Client information capture',
                  'Payment collection at booking',
                  'Cancellation and rescheduling options',
                  'Staff availability management'
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Result:</strong> 75% reduction in administrative work and 300% faster booking process.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CRM & Analytics Section */}
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
              Analytics & CRM Automation
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Automated lead nurturing and data-driven insights to maximize your catering business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {crmFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card text-center p-6 hover:scale-105 transition-all duration-300">
                  <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full">
              <ZapIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold">Average Result: 200% improvement in marketing ROI</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Card & Branding Design Section */}
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
              Business Card & Branding Design
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Professional branding that creates memorable first impressions and builds trust
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold">Professional Brand Identity:</h3>
              <div className="space-y-4">
                {[
                  'Custom business card design',
                  'Logo design and refinement',
                  'Brand color palette selection',
                  'Typography and font selection',
                  'Marketing material templates',
                  'Social media brand kit',
                  'Print-ready file formats',
                  'Brand guidelines document'
                ].map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Starting at $499:</strong> Complete branding package with unlimited revisions until perfect.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader className="bg-primary/5 rounded-t-xl">
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    Brand Design Examples
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center">
                      <HoverGlow>
                        <button
                          type="button"
                          onClick={() => openBrandModal(0)}
                          className="
                            w-full max-w-full aspect-[3.5/2] relative overflow-hidden rounded-xl
                            ring-1 ring-white/10 bg-white/0 cursor-pointer
                            transition-transform duration-500 ease-out will-change-transform
                            group-hover:scale-[1.03] group-hover:-translate-y-0.5
                            motion-reduce:transition-none motion-reduce:transform-none
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60
                          "
                          aria-label="View Raptor Catering & Events business card design"
                        >
                          <img
                            src="https://i.postimg.cc/vBsz2g4x/Remove-background-project-2.png"
                            alt="Raptor Catering & Events Business Card"
                            className="h-full w-full object-cover select-none"
                          />
                        </button>
                      </HoverGlow>
                      <HoverGlow>
                        <button
                          type="button"
                          onClick={() => openBrandModal(1)}
                          className="
                            w-full max-w-full aspect-[3.5/2] relative overflow-hidden rounded-xl
                            ring-1 ring-white/10 bg-white/0 cursor-pointer
                            transition-transform duration-500 ease-out will-change-transform
                            group-hover:scale-[1.03] group-hover:-translate-y-0.5
                            motion-reduce:transition-none motion-reduce:transform-none
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60
                          "
                          aria-label="View Elegant Events Premium Catering business card design"
                        >
                          <img
                            src="https://i.postimg.cc/xC3Pwfmx/Remove-background-project-1.png"
                            alt="Elegant Events Premium Catering Business Card"
                            className="h-full w-full object-cover select-none"
                          />
                        </button>
                      </HoverGlow>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Custom designs aligned with your catering style and target market
                      </p>
                      <div className="flex justify-center gap-4">
                        <Badge variant="outline">Logo Design</Badge>
                        <Badge variant="outline">Business Cards</Badge>
                        <Badge variant="outline">Brand Kit</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Before vs After Comparison */}
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
              Before vs. After Ai Thumbs
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              See the transformation our AI solutions bring to catering businesses
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card">
                <CardHeader className="bg-red-500/10 text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-red-600">
                    <X className="h-5 w-5" />
                    Traditional Catering Lead System
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[
                    'Missed calls during busy kitchen hours',
                    'Emails buried in cluttered inboxes',
                    'No response to after-hours inquiries',
                    'Manual follow-up tracking',
                    'Lost leads due to slow response times',
                    'No automated booking confirmations',
                    'Pricing calculations done manually',
                    'Customer data scattered across systems',
                    'Inconsistent branding and materials'
                  ].map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* After */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader className="bg-green-500/10 text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    With Ai Thumbs Solutions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {[
                    '24/7 AI chatbot handles all inquiries',
                    'Instant responses increase conversion rates',
                    'Automated lead capture and qualification',
                    'Smart follow-up sequences',
                    'Real-time booking with calendar sync',
                    'Automatic pricing calculations',
                    'Centralized customer database',
                    'Data-driven insights and reporting',
                    'Professional brand consistency'
                  ].map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Client Success Stories Preview */}
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
              Client Success Stories
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Real results from catering businesses that transformed with our AI solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card h-full">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <blockquote className="text-muted-foreground mb-6">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                        </div>
                      </div>
                      <Badge className="bg-primary/10 text-primary">
                        {testimonial.result}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Get answers to the most common questions about our AI solutions
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 flex items-start gap-2">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary text-sm font-bold">Q</span>
                      </div>
                      {faq.question}
                    </h3>
                    <div className="pl-8">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Let's Build Your AI Assistant Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join hundreds of successful caterers who have already revolutionized their operations with our AI solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="rounded-full px-8"
                onClick={(e) => {
                  e.preventDefault()
                  open()
                }}
              >
                <Phone className="h-5 w-5 mr-2" />
                Request a Demo
              </Button>
              <Link href="#contact">
                <Button size="lg" className="rounded-full px-8">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Us
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Secure & GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <ZapIcon className="h-4 w-4" />
                <span>Setup in 24 Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" />
                <span>500+ Happy Clients</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Design Modal */}
      {isBrandModalOpen && createPortal(
        <FilePreviewModal
          items={brandDesignImages}
          currentIndex={currentBrandImageIndex}
          onClose={closeBrandModal}
          showClickSides={true}
          hideControls={true}
        />,
        document.body
      )}
    </div>
  )
}