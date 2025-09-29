"use client"

import ContactPageContent from "@/components/contact-page-content"

interface ContactSectionProps {
  id?: string
}

export default function ContactSection({ id = "contact" }: ContactSectionProps) {
  return (
    <section id={id}>
      <ContactPageContent />
    </section>
  )
}