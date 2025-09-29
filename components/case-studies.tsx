"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const caseStudies = [
  {
    title: 'AI-Powered Customer Service',
    company: 'Global Tech Corp',
    description: 'Implemented an AI chatbot that reduced response times by 80% and improved customer satisfaction.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1600',
    tags: ['Machine Learning', 'NLP', 'Customer Service']
  },
  {
    title: 'Predictive Maintenance System',
    company: 'Industrial Solutions Ltd',
    description: 'Developed a system that predicts equipment failures with 95% accuracy, reducing downtime by 60%.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1600',
    tags: ['Predictive Analytics', 'IoT', 'Manufacturing']
  },
  {
    title: 'AI-Driven Financial Forecasting',
    company: 'Finance Plus',
    description: 'Created a financial forecasting model that improved prediction accuracy by 40%.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1600',
    tags: ['Finance', 'Deep Learning', 'Analytics']
  }
]

const CaseStudies = () => {
  return (
    <section id="case-studies" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Case Studies</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-world examples of how our AI solutions have transformed businesses
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{study.title}</CardTitle>
                  <CardDescription>{study.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{study.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CaseStudies