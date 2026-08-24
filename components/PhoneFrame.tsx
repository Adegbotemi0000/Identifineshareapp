"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface PhoneFrameProps {
  children: React.ReactNode
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  if (isMobile) {
    return <>{children}</>
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md h-[600px] bg-black/70 rounded-[36px] p-2 shadow-2xl"
      >
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black/50 rounded-b-2xl"></div>
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black/50 rounded-t-2xl"></div>
        <div className="absolute top-3 right-3 w-3 h-3 bg-black/50 rounded-full"></div>
        <div className="absolute top-3 right-10 w-2.5 h-2.5 bg-black/50 rounded-full"></div>
        <div className="absolute top-3 left-3 w-2.5 h-2.5 bg-black/50 rounded-full"></div>

        <div className="relative h-full bg-white rounded-[28px] overflow-hidden">
          {children}
        </div>
      </motion.div>
    </div>
  )
}