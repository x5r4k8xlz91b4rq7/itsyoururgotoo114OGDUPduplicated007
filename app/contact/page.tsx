import { Metadata } from 'next'
import Contact from '@/components/Contact'

export const metadata: Metadata = {
  title: 'Contact Us - Get AI Solutions for Your Catering Business | Ai Thumbs',
  description: 'Ready to transform your catering business with AI? Contact Ai Thumbs today for custom chatbots, websites, and automation solutions. Free consultation available.',
}

export default function ContactPage() {
  return <Contact />
}