'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { RefObject } from 'react'

interface FloatingImageProps {
  src: string
  slug: string
  title: string
  taille: number
  vitesse: number
  amplitudeX: number
  amplitudeY: number
  inclinaison: number
  textRef: RefObject<HTMLHeadingElement | null>
}


function FloatingImage({
  src, slug, title, taille,
  vitesse, amplitudeX, amplitudeY,
  inclinaison, textRef
}: FloatingImageProps) {
  const posRef = useRef({ x: 0, y: 0 })
  const divRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>(0)
  const startRef = useRef<number | null>(null)

  const animate = (timestamp: number) => {
    if (!startRef.current) startRef.current = timestamp
    const t = (timestamp - startRef.current) / vitesse

    const angle = t * Math.PI * 2
    const scale = 1 / (1 + Math.sin(angle) ** 2)
    const xBrut = amplitudeX * Math.cos(angle) * scale
    const yBrut = amplitudeY * Math.sin(angle) * Math.cos(angle) * scale

    const θ = inclinaison * (Math.PI / 180)
    const x = xBrut * Math.cos(θ) - yBrut * Math.sin(θ)
    const y = xBrut * Math.sin(θ) + yBrut * Math.cos(θ)

    const distanceCentre = Math.sqrt(x ** 2 + y ** 2)
    const textHalfWidth = textRef.current ? textRef.current.offsetWidth / 2 : 200
    const tourPair = Math.floor(t) % 2 === 0
    const isBehind = tourPair && distanceCentre < textHalfWidth

    if (divRef.current) {
      divRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
      divRef.current.style.zIndex = isBehind ? '4' : '15'
      divRef.current.style.boxShadow = isBehind ? 'none' : '0 8px 32px rgba(0,0,0,0.3)'
    }

    frameRef.current = requestAnimationFrame(animate)
  }

  const startAnimation = () => {
    frameRef.current = requestAnimationFrame(animate)
  }

  const stopAnimation = () => {
    cancelAnimationFrame(frameRef.current)
    startRef.current = null
  }

  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: `${taille}px`,
        height: `${taille}px`,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      ref={(el) => {
        (divRef as any).current = el
        if (el) startAnimation()
      }}
    >
      <img
        src={src}
        alt={title}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )
}

interface Props {
  images: { src: string; slug: string; title: string }[]
}

const configs = [
  { taille: 220, vitesse: 32000, amplitudeX: 500, amplitudeY: 450, inclinaison: 0 },
  { taille: 180, vitesse: 21000, amplitudeX: 420, amplitudeY: 380, inclinaison: 30 },
  { taille: 160, vitesse: 44000, amplitudeX: 460, amplitudeY: 410, inclinaison: -42 },
]

export default function ProjectsSection({ images }: Props) {
  const textRef = useRef<HTMLHeadingElement>(null)

  const titleStyle = {
    fontSize: 'clamp(48px, 8vw, 96px)',
    fontWeight: 900,
    margin: 0,
    letterSpacing: '-2px',
    lineHeight: 1.1,
    textAlign: 'center' as const,
    userSelect: 'none' as const,
  }

  return (
    <section
      id="projects-section"
      className="min-h-screen"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
    >
      <div className="max-w-7xl mx-auto px-6" style={{ textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={{ position: 'relative', display: 'inline-block' }}
        >
          <h2
            ref={textRef}
            className="font-akira text-primary text-5xl md:text-7xl font-black"
            style={{ ...titleStyle, position: 'relative', zIndex: 5 }}
          >
            <a href="/projects" target='_blank'>My<br />Projects</a>
          </h2>

          {images.slice(0, 3).map((img, i) => (
            <FloatingImage
              key={img.slug}
              {...img}
              {...configs[i]}
              textRef={textRef}
            />
          ))}

        </motion.div>
      </div>
    </section>
  )
}