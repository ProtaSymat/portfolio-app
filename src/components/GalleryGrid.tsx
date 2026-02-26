'use client'

import { useState, useEffect, useCallback } from 'react'

function Lightbox({
  images,
  initialIndex,
  title,
  onClose,
}: {
  images: string[]
  initialIndex: number
  title: string
  onClose: () => void
}) {
  const [current, setCurrent] = useState(initialIndex)

  const prev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, prev, next])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Touch swipe support
  const touchStartX = useRef<number | null>(null)
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 md:top-5 md:right-6 text-white text-2xl md:text-3xl font-black hover:text-primary transition-colors z-10 w-10 h-10 flex items-center justify-center"
        onClick={onClose}
        aria-label="Fermer"
      >
        ✕
      </button>

      {/* Counter */}
      <span className="absolute top-4 left-4 md:top-5 md:left-6 text-white/50 text-xs md:text-sm uppercase tracking-widest font-semibold">
        {current + 1} / {images.length}
      </span>

      {/* Prev — caché sur mobile (swipe à la place) */}
      {images.length > 1 && (
        <button
          className="hidden md:block absolute left-4 md:left-8 text-white/70 hover:text-white text-5xl font-black transition-colors z-10 select-none"
          onClick={(e) => { e.stopPropagation(); prev() }}
          aria-label="Image précédente"
        >
          ‹
        </button>
      )}

      {/* Image */}
      <div
        className="w-full mx-4 md:mx-16 max-w-5xl flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={current}
          src={images[current]}
          alt={`${title} - image ${current + 1}`}
          className="max-w-full max-h-[80vh] md:max-h-[85vh] object-contain rounded-lg shadow-2xl"
          style={{ animation: 'fadeIn 0.2s ease' }}
        />
      </div>

      {/* Next — caché sur mobile */}
      {images.length > 1 && (
        <button
          className="hidden md:block absolute right-4 md:right-8 text-white/70 hover:text-white text-5xl font-black transition-colors z-10 select-none"
          onClick={(e) => { e.stopPropagation(); next() }}
          aria-label="Image suivante"
        >
          ›
        </button>
      )}

      {/* Swipe hint mobile */}
      {images.length > 1 && (
        <p className="md:hidden absolute bottom-16 left-0 right-0 text-center text-white/30 text-xs uppercase tracking-widest">
          ← swipe →
        </p>
      )}

      {/* Thumbnails — scroll horizontal sur mobile */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-start md:justify-center gap-2 px-4 overflow-x-auto scrollbar-none">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
              className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded overflow-hidden border-2 transition-all ${
                i === current ? 'border-primary opacity-100 scale-110' : 'border-transparent opacity-40 hover:opacity-70'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        .scrollbar-none { scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}

// ── needs useRef for touch ────────────────────────────────────────────────────
import { useRef } from 'react'

export default function GalleryGrid({ images, title }: { images: string[]; title: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            className="group relative overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={`Voir ${title} - image ${i + 1} en grand`}
          >
            <img
              src={img}
              alt={`${title} - image ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white text-2xl md:text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                🔍
              </span>
            </div>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          title={title}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}