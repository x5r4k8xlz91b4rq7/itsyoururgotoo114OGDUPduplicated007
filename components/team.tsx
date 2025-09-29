"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Github, Linkedin, Twitter } from 'lucide-react'

const team = [
  {
    name: 'Dr. Alexandra Chen',
    role: 'Chief AI Officer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    bio: 'Ph.D. in Machine Learning with 15+ years of experience in AI research and implementation.'
  },
  {
    name: 'Marcus Thompson',
    role: 'Lead AI Engineer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    bio: 'Specialized in deep learning and neural networks with a track record of successful AI deployments.'
  },
  {
    name: 'Dr. Sarah Patel',
    role: 'Head of Research',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
    bio: 'Leading breakthrough research in natural language processing and computer vision.'
  },
  {
    name: 'James Wilson',
    role: 'Solutions Architect',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    bio: 'Expert in designing and implementing enterprise-scale AI solutions.'
  }
]

const Team = () => {
  return (
    <section id="team" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet our team of AI experts and innovators
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-muted-foreground hover:text-primary">
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary">
                      <Github className="h-5 w-5" />
                    </a>
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

export default Team