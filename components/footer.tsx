'use client'

import { useState, useCallback } from 'react'
import { Brain, Facebook, Instagram, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import Notification from './Notification'

const Footer = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterError, setNewsletterError] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null)

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleNavClick = (targetPath: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    // If clicking on the same page, scroll to top
    if (targetPath === pathname) {
      e.preventDefault()
      
      // Check motion preferences
      const prefersReducedMotion = typeof window !== 'undefined' && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      // Scroll to top
      if (typeof window !== 'undefined') {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        })
      }
    }
  }

  const handleNewsletterEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewsletterEmail(e.target.value)
    // Clear error when user starts typing
    if (newsletterError) {
      setNewsletterError('')
    }
  }

  const validateNewsletterEmail = () => {
    if (!newsletterEmail.trim()) {
      setNewsletterError('Email is required')
      return false
    }
    // Clear any existing errors if field is not empty
    setNewsletterError('')
    return true
  }

  const handleNewsletterSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget as HTMLFormElement;

    // Always prevent default form submission
    e.preventDefault();

    // First check custom validation (empty field only)
    if (!validateNewsletterEmail()) {
      return;
    }

    // If field is not empty, trigger HTML5 validation for format issues (like missing @)
    if (!form.checkValidity()) {
      form.reportValidity(); // Show native HTML5 validation tooltip
      return;
    }

    // Check if already subscribing
    if (isSubscribing) {
      return
    }

    setIsSubscribing(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      showNotification('success', "Successfully subscribed! You'll receive updates on upcoming AI features and exclusive demos.")

      // Reset form
      setNewsletterEmail('')
      setNewsletterError('')
    } catch (error) {
      showNotification('error', 'Subscription failed. Please try again.')
      setNewsletterError('Subscription failed. Please try again.')
    } finally {
      setIsSubscribing(false)
    }
  }

  const quickLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Contact Support', href: '/support' }
  ]

  return (
    <>
    {notification && <Notification type={notification.type} message={notification.message} />}
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-10 lg:gap-y-0 lg:gap-x-12">
          {/* Brand Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="https://i.postimg.cc/h43PsyhN/Untitled-design-14.png" 
                alt="Ai Thumbs" 
                className="h-8 w-auto"
              />
              <span className="font-bold text-xl">Ai Thumbs</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Transforming businesses through advanced AI solutions and expert consulting.
            </p>
            <div className="relative mt-4 inline-block">
              <div className="relative group">
                <img
                  src="https://i.postimg.cc/13kvWzXb/Untitled-design-24.png"
                  alt="Trusted & Secure AI Solutions — GDPR, SSL, Payment Security"
                  className="w-24 sm:w-28 lg:w-32 rounded-xl shadow-md opacity-90 group-hover:opacity-100 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/25 transition-all duration-300"
                  draggable="false"
                />
                
                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-0 mb-3 px-4 py-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap text-sm font-medium z-50 pointer-events-none min-w-max">
                  Trusted & Secure AI Solutions
                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Sections Grid */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8 items-start">
              {/* Quick Links */}
              <div>
                <h3 className="text-lg lg:text-xl font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2" aria-label="Footer quick links">
                  {quickLinks.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.href}
                        onClick={(e) => handleNavClick(link.href, e)}
                        className="text-sm hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Us */}
              <div>
                <h3 className="text-lg lg:text-xl font-semibold mb-4">Contact Us</h3>
                <ul className="space-y-2">
                  <li className="text-sm">Phone: (519) 774-6314</li>
                  <li className="text-sm">Email: snapauctions1@gmail.com</li>
                </ul>
              </div>

              {/* Follow Us */}
              <div>
                <h3 className="text-lg lg:text-xl font-semibold mb-4">Follow Us</h3>
                <div className="flex items-center gap-4">
                  <a 
                    href="#" 
                    aria-label="Follow us on Facebook"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a 
                    href="#" 
                    aria-label="Follow us on Instagram"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                </div>
              </div>

              {/* Newsletter */}
              <div className="w-full">
                <h3 className="text-lg lg:text-xl font-semibold mb-4">Newsletter</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Stay updated on upcoming AI features and exclusive demos.
                </p>
                <form onSubmit={handleNewsletterSubscribe} className="flex w-full">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={handleNewsletterEmailChange}
                    placeholder="Enter your email"
                    className={`flex-1 px-3 py-2 text-sm bg-background border border-r-0 rounded-l-md focus:outline-none transition-colors ${
                      newsletterError 
                        ? 'border-red-500 focus:border-red-500 focus:shadow-[inset_0_0_0_2px_theme(colors.red.500)]' 
                        : 'border-input focus:shadow-[inset_0_0_0_2px_theme(colors.purple.500)]'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-r-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Subscribe to newsletter"
                  >
                    {isSubscribing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                  </button>
                </form>
                {newsletterError && (
                  <p className="text-red-500 text-sm mt-2">{newsletterError}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Ai Thumbs Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}

export default Footer