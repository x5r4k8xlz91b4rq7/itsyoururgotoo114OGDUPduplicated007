import { Metadata } from 'next'
import Support from '@/components/Support'

export const metadata: Metadata = {
  title: 'Support',
  description: 'Get help and support for your account'
}

export default function SupportPage() {
  return <Support />
}