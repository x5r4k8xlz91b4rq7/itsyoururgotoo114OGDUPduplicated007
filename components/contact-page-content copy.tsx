"use client"

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import CustomCaptcha from '@/components/CustomCaptcha'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Paperclip,
  Facebook, 
  Instagram,
  Send,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPageContent() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [resetCaptcha, setResetCaptcha] = useState(false)

  const validateForm = () => {
    const newErrors: Partial<ContactFormData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || isSubmitting) {
      toast({
        title: "Please fix the errors",
        description: "Check the highlighted fields and try again.",
        variant: "destructive"
      })
      return
    }

    if (!isVerified) {
      toast({
        title: "Verification required",
        description: "Please complete the verification.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      
      setResetCaptcha(prev => !prev)
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  return (
    <div className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className="text-gray-300">
            Get in touch with us for any inquiries or support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-blue-900/20 border-blue-800/30 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Phone</h3>
                    <p className="text-gray-300">(519) 774-6314</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email</h3>
                    <p className="text-gray-300">snapauctions1@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Location</h3>
                    <p className="text-gray-300">Brantford, ON</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Business Hours</h3>
                    <p className="text-gray-300">Monday - Friday: 9:00 AM - 5:00 PM EST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow Us Section */}
            <div className="bg-blue-900/20 border-blue-800/30 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Follow Us</h2>
              <div className="flex items-center gap-6">
                <a
                  href="https://www.facebook.com/profile.php?id=100063790464096"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white hover:text-primary transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.instagram.com/snap_auctions14"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white hover:text-primary transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-blue-900/20 border-blue-800/30 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Send Message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-white mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-blue-950/50 border rounded-md text-white focus:outline-none focus:border-primary ${
                    errors.name ? 'border-red-500' : 'border-blue-800/50'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-blue-950/50 border rounded-md text-white focus:outline-none focus:border-primary ${
                    errors.email ? 'border-red-500' : 'border-blue-800/50'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-white mb-2">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-blue-950/50 border rounded-md text-white focus:outline-none focus:border-primary ${
                    errors.subject ? 'border-red-500' : 'border-blue-800/50'
                  }`}
                >
                  <option value="">Select a subject</option>
                  <option value="bidding">Bidding</option>
                  <option value="payment">Payment</option>
                  <option value="shipping">Shipping</option>
                  <option value="account">Account</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>
              
              <div className="relative">
                <label htmlFor="message" className="block text-white mb-2">Message</label>
                <div className="relative">
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full px-4 py-2 pb-12 bg-blue-950/50 border rounded-md text-white focus:outline-none focus:border-primary ${
                        errors.message ? 'border-red-500' : 'border-blue-800/50'
                      }`}
                      placeholder="Type your message here..."
                    ></textarea>
                    <div className="absolute left-0 bottom-0 p-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-400 hover:text-primary transition-colors"
                        title="Attach Files"
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                </div>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <div className="mt-4">
                <CustomCaptcha 
                  onVerify={setIsVerified}
                  theme="light"
                  reset={resetCaptcha}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-950"></div>
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}