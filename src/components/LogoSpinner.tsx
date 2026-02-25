'use client'
import { useState, useEffect, useRef } from 'react';

export default function LogoSpinner({ onUnlock }: { onUnlock?: () => void }) {
  const [rotation, setRotation] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [continuousRotation, setContinuousRotation] = useState(720);
  const [shouldBlock, setShouldBlock] = useState(true);
  const accumulatedScroll = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasAnchor = window.location.hash !== '';
    const hasParams = window.location.search !== '';
    
    if (hasAnchor || hasParams) {
      setShouldBlock(false);
      setIsUnlocked(true);
      onUnlock?.();
    }
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isInView && shouldBlock) {
        if (!isUnlocked) {
          e.preventDefault();

          accumulatedScroll.current += e.deltaY;
          const maxScroll = 2000;
          const progress = Math.min(Math.max(accumulatedScroll.current, 0), maxScroll);
          const rotationDegrees = (progress / maxScroll) * 720;

          setRotation(rotationDegrees);

          if (progress >= maxScroll) {
            setTimeout(() => {
              setIsUnlocked(true);
              setContinuousRotation(720);
              onUnlock?.();
            }, 300);
          }
        }
        else {
          const scrollSpeed = 0.5;
          setContinuousRotation(prev => prev + (e.deltaY * scrollSpeed));
        }
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.5,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    if (!isUnlocked && isInView && shouldBlock) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('wheel', handleWheel, { passive: false });
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('wheel', handleWheel);
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isUnlocked, isInView, shouldBlock]);

  useEffect(() => {
    if (isUnlocked) {
      document.body.style.overflow = 'auto';
    }
  }, [isUnlocked]);

  return (
    <div ref={containerRef} className="flex flex-row justify-center items-center gap-20">
      <div className="relative">
        <div
          className="w-50 h-50 flex items-center justify-center"
          style={{
            transform: `rotate(${isUnlocked ? continuousRotation : rotation}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <img src="/logo.svg" alt="Mathys" className="w-full h-full object-contain" />
        </div>
      </div>

      <div className="text-left">
        <h1 className="text-7xl font-black font-neue">
          Mathys<br />Girault
        </h1>
      </div>

      {!isUnlocked && rotation < 100 && (
        <div className="absolute bottom-8">
          <div className="w-10 h-10 rounded-full flex justify-center">
            <div className="w-2 h-2 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}