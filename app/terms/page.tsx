import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Shield, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms & Conditions - Ai Thumbs Solutions',
  description: 'Read our terms and conditions for using Ai Thumbs AI catering solutions and services.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms & <span className="text-primary">Conditions</span>
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 1, 2025
            </p>
          </div>

          <div className="space-y-8">
            {/* Service Agreement */}
            <Card className="glass-card bg-blue-900/20 border-blue-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <FileText className="h-6 w-6 text-primary" />
                  Service Agreement
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p className="mb-4">By using our AI catering solutions, you agree to these terms and conditions:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Services provided on an as-is basis with warranties outlined in your service agreement</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Professional AI solutions specifically designed for catering businesses</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>24/7 technical support and maintenance included with all packages</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card className="glass-card bg-blue-900/20 border-blue-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Shield className="h-6 w-6 text-primary" />
                  User Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p className="mb-4">You are responsible for:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Maintaining confidentiality of your account information</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>All activities that occur under your account</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Providing accurate business information for setup</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Using services in compliance with applicable laws</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Service Availability */}
            <Card className="glass-card bg-blue-900/20 border-blue-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Clock className="h-6 w-6 text-primary" />
                  Service Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p className="mb-4">Our service commitment includes:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>99.9% uptime guarantee for all AI systems</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Scheduled maintenance communicated in advance</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>24/7 monitoring and support availability</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Emergency support for critical issues</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Limitations */}
            <Card className="glass-card bg-blue-900/20 border-blue-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                  Service Limitations
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p className="mb-4">Please note the following limitations:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Services designed specifically for catering industry use</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Customization requests subject to technical feasibility</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Third-party integrations depend on external service availability</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Data retention policies apply to all customer information</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}