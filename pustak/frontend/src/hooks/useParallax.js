import { useRef, useEffect } from 'react'
import { useScroll, useTransform } from 'framer-motion'

export function useParallax(speed = 0.5) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [`${-50 * speed}%`, `${50 * speed}%`])

  return { ref, y }
}

export function useMouseParallax(strength = 0.05) {
  const ref = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      ref.current = {
        x: (e.clientX - centerX) * strength,
        y: (e.clientY - centerY) * strength,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [strength])

  return ref
}
