'use client'
import { useState, useEffect } from 'react'

export default function ParisClock() {
  const [parisTime, setParisTime] = useState('XX:XX:XX')
  const [isHovered, setIsHovered] = useState(false)
  const hour = parseInt(parisTime.split(':')[0])
  const isLate = hour >= 20 || hour < 8 
  
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date()
        const parisTime = new Intl.DateTimeFormat('fr-FR', {
          timeZone: 'Europe/Paris',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(now)
        setParisTime(parisTime)
      } catch (error) {
        setParisTime('XX:XX:XX')
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute top-6 right-8 z-40 md:top-12">
      <div className="bg-primary px-4 py-2 text-white font-mono text-lg font-semibold tracking-wider" onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        {isHovered && (
          <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-primary text-white text-sm px-3 py-2 rounded whitespace-nowrap shadow-lg" style={{ animation: 'float-circular 9s ease-in-out infinite' }}>
            <span className={`inline-block w-2 h-2 mr-2 rounded-full ${isLate ? 'bg-red-500' : 'bg-green-500'}`}></span>
{isLate ? 'Shall we catch up later? 🕺😴' : 'Free to chat 😎'}
          </div>
        )}

        <div className="flex items-center">
          <span className="text-xs tracking-widest">PARIS</span>
          <span className="ml-2">{parisTime}</span>
        </div>
      </div>
    </div>
  )
}