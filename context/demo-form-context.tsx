"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface DemoFormContextType {
  isOpen: boolean
  open: () => void
  close: () => void
}

const DemoFormContext = createContext<DemoFormContextType | undefined>(undefined)

export function DemoFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = () => {
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  return (
    <DemoFormContext.Provider value={{ isOpen, open, close }}>
      {children}
    </DemoFormContext.Provider>
  )
}

export function useDemoForm() {
  const context = useContext(DemoFormContext)
  if (context === undefined) {
    throw new Error('useDemoForm must be used within a DemoFormProvider')
  }
  return context
}