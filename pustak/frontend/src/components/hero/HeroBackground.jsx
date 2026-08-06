import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function HeroBackground() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {/* Main background image */}
      <motion.div
        style={{ scale }}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=1080&fit=crop&q=90"
          alt="Warm library"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Warm color grading overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-darkBrown/30 via-darkBrown/50 to-darkBrown/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-darkBrown/40 via-transparent to-darkBrown/20" />

      {/* Warm amber sunlight from top right */}
      <div
        className="absolute top-0 right-0 w-2/3 h-2/3 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 80% 20%, rgba(176,141,87,0.25) 0%, transparent 60%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(30,15,8,0.6) 100%)',
        }}
      />

      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scroll fade */}
      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0.3, 0.8], [0, 1]) }}
        className="absolute inset-0 bg-cream pointer-events-none"
      />
    </div>
  )
}
