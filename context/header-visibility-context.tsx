"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface HeaderVisibilityContextType {
  isHeaderHidden: boolean
  setHeaderHidden: (hidden: boolean) => void
}

const HeaderVisibilityContext = createContext<HeaderVisibilityContextType | undefined>(undefined)

export function HeaderVisibilityProvider({ children }: { children: ReactNode }) {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)

  const setHeaderHidden = (hidden: boolean) => {
    setIsHeaderHidden(hidden)
  }

  return (
    <HeaderVisibilityContext.Provider value={{ isHeaderHidden, setHeaderHidden }}>
      {children}
    </HeaderVisibilityContext.Provider>
  )
}

export function useHeaderVisibility() {
  const context = useContext(HeaderVisibilityContext)
  if (context === undefined) {
    throw new Error('useHeaderVisibility must be used within a HeaderVisibilityProvider')
  }
  return context
}