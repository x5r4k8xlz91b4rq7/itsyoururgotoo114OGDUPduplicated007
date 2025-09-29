import { Metadata } from 'next'
import ServicesPageContent from '@/components/services-page-content'

export const metadata: Metadata = {
  title: 'Our Services - AI Solutions for Catering Industry | Ai Thumbs',
  description: 'Comprehensive AI solutions for catering businesses: AI chatbots, tiered website packages, real-time booking integration, and CRM automation. Transform your catering business today.',
}

export default function ServicesPage() {
  return <ServicesPageContent />
}