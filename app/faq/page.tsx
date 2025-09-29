import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle, Zap, Clock, Users, Shield, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQs - Ai Thumbs Solutions',
  description: 'Frequently asked questions about our AI catering solutions, implementation, and support.',
}

const faqs = [
  {
    question: 'How quickly can I see results from your AI solutions?',
    answer: 'Most clients see immediate improvements in lead capture within 24 hours of launch. Full optimization and significant booking increases typically occur within 2-4 weeks.',
    icon: Zap
  },
  {
    question: 'Can your AI integrate with my existing systems?',
    answer: 'Yes! Our AI solutions integrate with most popular CRM systems, calendars, and payment processors. We provide seamless integration support during setup.',
    icon: Users
  },
  {
    question: 'What if I don\'t have a finalized menu yet?',
    answer: 'No problem! We can help you develop your menu as part of the process. Our AI can suggest popular catering options based on your cuisine type and target market.',
    icon: HelpCircle
  },
  {
    question: 'Do you provide training and ongoing support?',
    answer: 'Absolutely! We provide comprehensive training for your team and offer ongoing support. Our AI systems also learn and improve over time with minimal maintenance required.',
    icon: Users
  },
  {
    question: 'What happens to leads generated during off-hours?',
    answer: 'This is where we excel! Our AI chatbot captures and qualifies leads 24/7, sending you organized summaries and hot leads via email or SMS in real-time.',
    icon: Clock
  },
  {
    question: 'Is my customer data secure?',
    answer: 'Yes, we are GDPR compliant and use enterprise-grade security measures to protect all customer data. Your information is encrypted and stored securely.',
    icon: Shield
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="text-muted-foreground text-xl">
              Get answers to the most common questions about our AI catering solutions.
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="glass-card bg-blue-900/20 border-blue-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white text-lg">
                    <faq.icon className="h-6 w-6 text-primary" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Section */}
          <Card className="glass-card bg-blue-900/20 border-blue-800/30 mt-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white text-center justify-center">
                <HelpCircle className="h-6 w-6 text-primary" />
                Still Have Questions?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-6">
                Didn't find what you're looking for? Our support team is here to help.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-300">Email: snapauctions1@gmail.com</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-300">Phone: (519) 774-6314</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-300">Live chat available 24/7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}