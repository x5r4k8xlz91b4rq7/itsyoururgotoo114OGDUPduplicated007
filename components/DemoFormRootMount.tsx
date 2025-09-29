"use client"

import { useEffect } from 'react'
import { useDemoForm } from '@/context/demo-form-context'
import { useHeaderVisibility } from '@/context/header-visibility-context'
import DemoForm from '@/components/demo-form'

export default function DemoFormRootMount() {
  const { isOpen, close } = useDemoForm()
  const { setHeaderHidden } = useHeaderVisibility()

  // Handle header visibility based on modal state
  useEffect(() => {
    setHeaderHidden(isOpen)
    
    // Cleanup function to restore header when component unmounts or modal closes
    return () => {
      setHeaderHidden(false)
    }
  }, [isOpen, setHeaderHidden])

  // Scroll locking when modal is open
  useEffect(() => {
    if (!isOpen) return
    
    const { body, documentElement: html } = document
    const previousBodyOverflow = body.style.overflow
    const previousHtmlOverflow = html.style.overflow
    
    // Lock scroll
    body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
    
    // Cleanup function to restore scroll
    return () => {
      body.style.overflow = previousBodyOverflow
      html.style.overflow = previousHtmlOverflow
    }
  }, [isOpen])

  return (
    <DemoForm 
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          close()
        }
      }}
    />
  )
}