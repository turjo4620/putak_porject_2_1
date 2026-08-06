import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const PARTICLE_COUNT = 30

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.4 + 0.1,
  }))
}

const particles = generateParticles()

export default function HeroParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [p.opacity, p.opacity * 0.3, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Larger dust motes */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute rounded-full bg-cream/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
          }}
          animate={{
            y: [0, -80, 0],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: Math.random() * 12 + 8,
            delay: Math.random() * 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
