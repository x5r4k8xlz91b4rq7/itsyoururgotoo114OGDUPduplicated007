"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'

const posts = [
  {
    title: 'The Future of AI in Enterprise',
    date: '2024-03-15',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Exploring how artificial intelligence is transforming enterprise operations and decision-making.',
    category: 'Enterprise AI'
  },
  {
    title: 'Machine Learning Best Practices',
    date: '2024-03-10',
    image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&q=80&w=800',
    excerpt: 'A comprehensive guide to implementing machine learning solutions effectively.',
    category: 'Machine Learning'
  },
  {
    title: 'AI Ethics and Governance',
    date: '2024-03-05',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Understanding the importance of ethical AI development and implementation.',
    category: 'AI Ethics'
  }
]

const Blog = () => {
  return (
    <section id="blog" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Latest Insights</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with our latest thoughts on AI technology and innovation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="hover:text-primary cursor-pointer">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog