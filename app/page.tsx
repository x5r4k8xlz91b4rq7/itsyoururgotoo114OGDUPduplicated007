import Hero from '@/components/hero'
import Services from '@/components/services'
import ContactSection from '@/components/ContactSection'
import AiThumbsScroll from '@/components/ai-thumbs-scroll'
import TrustSecurityMarquee from '@/components/security-marquee'
import SuccessStories from '@/components/success-stories'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Services />
      <AiThumbsScroll />
      <SuccessStories />
      <TrustSecurityMarquee />
      <ContactSection id="contact" />
    </div>
  )
}