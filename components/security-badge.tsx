"use client"

import { useState } from 'react'
import { Shield } from 'lucide-react'

const SecurityBadge = () => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="fixed bottom-4 left-4 z-40 transition-all duration-300 hover:scale-105">
      {/* Main Badge Container */}
      <div className="relative group">
        {/* Security Badge Image */}
        <img
          src="https://i.postimg.cc/13kvWzXb/Untitled-design-24.png"
          alt="AI Thumbs security compliance badges: GDPR, SSL, Secure Payment, reCAPTCHA"
          className={`
            w-24 sm:w-32 md:w-36 lg:w-40 
            max-w-xs h-auto 
            rounded-lg shadow-lg 
            border border-white/20 
            backdrop-blur-sm
            transition-all duration-300
            hover:shadow-xl hover:shadow-primary/25
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={() => setImageLoaded(true)}
          draggable="false"
        />
        
        {/* Loading Placeholder */}
        {!imageLoaded && (
          <div className="w-24 sm:w-32 md:w-36 lg:w-40 h-16 sm:h-20 md:h-24 lg:h-28 bg-primary/10 rounded-lg border border-white/20 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary animate-pulse" />
          </div>
        )}

        {/* Hover Tooltip */}
        <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap text-sm font-medium">
          Trusted & Secure AI Solutions
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
        </div>
      </div>

      {/* Hide on very small screens */}
      <style jsx>{`
        @media (max-width: 375px) {
          .fixed {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

export default SecurityBadge