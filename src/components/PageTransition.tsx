'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const triangles = [
  {
    id: 'top',
    initial: { y: 0 },
    animate: { y: '-100%' },
    style: { top: 0, left: 0, right: 0, height: '50vh' },
    points: '0,0 100,0 50,100'
  },
  {
    id: 'bottom',
    initial: { y: 0 },
    animate: { y: '100%' },
    style: { bottom: 0, left: 0, right: 0, height: '50vh' },
    points: '50,0 0,100 100,100'
  },
  {
    id: 'left',
    initial: { x: 0 },
    animate: { x: '-100%' },
    style: { left: 0, top: 0, bottom: 0, width: '50vw' },
    points: '0,0 100,50 0,100'
  },
  {
    id: 'right',
    initial: { x: 0 },
    animate: { x: '100%' },
    style: { right: 0, top: 0, bottom: 0, width: '50vw' },
    points: '100,0 0,50 100,100'
  },
]

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <motion.div initial="initial" animate="animate" exit="exit">

      {isMobile ? (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#8B0909',
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        />
      ) : (
        triangles.map((t) => (
          <motion.div
            key={t.id}
            initial={t.initial}
            animate={t.animate}
            transition={{ duration: 1.95, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed',
              zIndex: 9999,
              ...t.style
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon
                points={t.points}
                fill="#8B0909"
                stroke="black"
                strokeWidth="0.25"
              />
            </svg>
          </motion.div>
        ))
      )}

      <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.3 }}>
        {children}
      </motion.div>

    </motion.div>
  )
}