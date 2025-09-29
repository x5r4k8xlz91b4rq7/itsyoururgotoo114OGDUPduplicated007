"use client"

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Award,
  Users,
  History,
  Shield,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPageContent() {
  const router = useRouter()

  return (
    <div className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">
            About <span className="gradient-text">Ai Thumbs</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Transforming the catering industry through cutting-edge AI solutions and expert technology consulting
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-blue-900/20 border-blue-800/30 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-300">
            To empower catering businesses with AI-driven solutions that eliminate missed opportunities, 
            streamline operations, and unlock unprecedented growth potential. Every caterer deserves to focus 
            on creating amazing food experiences while our AI handles lead capture, customer service, and 
            business optimization.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-blue-900/20 border-blue-800/30 p-8 rounded-lg">
            <Award className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Industry Recognition</h3>
            <p className="text-gray-300">
              Award-winning AI solutions with proven results across 500+ successful catering implementations 
              and industry recognition for innovation excellence in food service technology.
            </p>
          </div>
          
          <div className="bg-blue-900/20 border-blue-800/30 p-8 rounded-lg">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Collaborative Partnership</h3>
            <p className="text-gray-300">
              We work closely with each client, building lasting partnerships through dedicated support, 
              comprehensive training, and ongoing optimization to ensure maximum ROI.
            </p>
          </div>
          
          <div className="bg-blue-900/20 border-blue-800/30 p-8 rounded-lg">
            <History className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Deep Domain Experience</h3>
            <p className="text-gray-300">
              Years of specialized experience in both AI technology and catering operations, ensuring 
              solutions that truly understand your industry challenges and opportunities.
            </p>
          </div>
          
          <div className="bg-blue-900/20 border-blue-800/30 p-8 rounded-lg">
            <Shield className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Robust Security & Compliance</h3>
            <p className="text-gray-300">
              Enterprise-grade security, GDPR compliance, and 99.9% uptime guarantee ensure your data 
              and operations are always protected and reliable.
            </p>
          </div>
        </div>

        {/* Ai Thumbs Logo */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">The <span className="gradient-text">Ai Thumbs</span> Difference</h2>
          <div className="max-w-lg mx-auto bg-blue-900/20 border-blue-800/30 p-8 rounded-lg">
            <img
              src="https://i.postimg.cc/h43PsyhN/Untitled-design-14.png"
              alt="Ai Thumbs Logo"
              className="w-full rounded-lg select-none pointer-events-none"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </div>
  )
}