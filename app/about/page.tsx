import { Metadata } from 'next'
import AboutPageContent from '@/components/about-page-content'

export const metadata: Metadata = {
  title: 'About Us - AI Automation Experts for Catering | Ai Thumbs',
  description: 'Learn about Ai Thumbs, the leading AI automation company revolutionizing catering operations. Discover our mission, team expertise, and why caterers trust us worldwide.',
}

export default function AboutPage() {
  return <AboutPageContent />
}