import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, Lock, EyeOff, Mail, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - Ai Thumbs Solutions',
  description: 'Learn how Ai Thumbs protects your data and privacy when using our AI catering solutions.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy <span className="text-primary">Policy</span>
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 1, 2025
            </p>
          </div>

          <div className="space-y-8">
            {/* Information We Collect */}
            <Card className="glass-card bg-blue-900/20 border-blue-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p className="mb-4">We collect and maintain:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Name and contact information</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Billing and shipping addresses</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Payment information</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Bidding and transaction history</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Communication preferences</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* How We Protect Your Data */}
            <Card className="glass-card bg-blue-900/20 border-blue-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Lock className="h-6 w-6 text-primary" />
                  How We Protect Your Data
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p className="mb-4">We implement appropriate security measures:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Secure payment processing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Regular security audits</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Limited employee access to personal data</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Your Privacy Rights */}
            <Card className="glass-card bg-blue-900/20 border-blue-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <EyeOff className="h-6 w-6 text-primary" />
                  Your Privacy Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p className="mb-4">You have the right to:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Access your personal information</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Correct inaccurate data</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Request deletion of your data</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Opt-out of marketing communications</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Lodge a complaint with supervisory authorities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Us */}
            <Card className="glass-card bg-blue-900/20 border-blue-800/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Mail className="h-6 w-6 text-primary" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p className="mb-4">If you have any questions about our Privacy Policy, please contact us:</p>
                <div className="space-y-2">
                  <p>Email: snapauctions1@gmail.com</p>
                  <p>Phone: (519) 774-6314</p>
                  <p>Location: Brantford, ON</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}