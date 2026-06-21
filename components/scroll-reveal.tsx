'use client'

import React, { useEffect, useRef, useState } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  animation?: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right'
  delay?: number
  duration?: number
  className?: string
}

export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 800,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          if (ref.current) {
            observer.unobserve(ref.current)
          }
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -60px 0px',
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
      observer.disconnect()
    }
  }, [])

  const getAnimationStyles = (): React.CSSProperties => {
    if (isRevealed) {
      return {
        opacity: 1,
        transform: 'none',
      }
    }

    switch (animation) {
      case 'fade-up':
        return { opacity: 0, transform: 'translateY(24px)' }
      case 'fade-in':
        return { opacity: 0 }
      case 'scale-in':
        return { opacity: 0, transform: 'scale(0.96)' }
      case 'slide-left':
        return { opacity: 0, transform: 'translateX(24px)' }
      case 'slide-right':
        return { opacity: 0, transform: 'translateX(-24px)' }
      default:
        return { opacity: 0, transform: 'translateY(24px)' }
    }
  }

  return (
    <div
      ref={ref}
      style={{
        ...getAnimationStyles(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity',
      }}
      className={className}
    >
      {children}
    </div>
  )
}
export default ScrollReveal
