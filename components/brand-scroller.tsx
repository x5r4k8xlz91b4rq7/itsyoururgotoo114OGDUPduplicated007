"use client"

import { Marquee } from "@/components/lukacho/marquee";

const BRANDS = [
  "OpenAI", 
  "Canva", 
  "DALL·E", 
  "Claude", 
  "Voiceflow", 
  "Supabase", 
  "Airtable", 
  "Vistaprint",
];

const BrandScroller = () => {
  return (
    <div className="text-center mb-4 relative z-20">
      {/* Centered Heading */}
      <div className="relative flex justify-center mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-white">
          🚀 Powered by leading AI technologies
        </h3>
      </div>
      
      {/* Brand Marquee */}
      <div className="w-full h-12 overflow-hidden relative bg-transparent mb-2">
        <Marquee
          items={BRANDS}
          bullet="•"
          speed={30}
          className="text-4xl text-purple-500 font-bold"
          itemClassName="mx-6"
          bulletClassName="mx-2"
        />
      </div>
    </div>
  )
}

export default BrandScroller