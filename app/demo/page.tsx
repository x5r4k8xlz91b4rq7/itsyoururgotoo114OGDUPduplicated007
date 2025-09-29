import { Metadata } from 'next'
import DemoPageContent from '@/components/demo-page-content'

export const metadata: Metadata = {
  title: 'Interactive Demo - AI Solutions for Catering | Ai Thumbs',
  description: 'Experience our AI-powered catering solutions live. Try our chatbot, explore website examples, and see real-time booking integration in action.',
}

export default function DemoPage() {
  return <DemoPageContent />
}