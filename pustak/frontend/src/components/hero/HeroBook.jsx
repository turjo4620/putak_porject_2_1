import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'

export default function HeroBook() {
  const ref = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({ offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3])
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 0.6, 0])
  const rotateY = useTransform(scrollYProgress, [0, 0.5], [0, 25])
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [0, -10])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -60])

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setMousePos({
      x: ((e.clientX - cx) / rect.width) * 15,
      y: ((e.clientY - cy) / rect.height) * -15,
    })
  }

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity, y }}
      onMouseMove={handleMouseMove}
      className="relative cursor-none will-change-transform"
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* 3D tilt on mouse move */}
        <motion.div
          style={{
            rotateY: mousePos.x,
            rotateX: mousePos.y,
            transformStyle: 'preserve-3d',
            perspective: 1000,
          }}
          animate={{ rotateY: scrollYProgress }}
          transition={{ type: 'spring', stiffness: 100, damping: 30 }}
        >
          {/* Book container */}
          <div className="relative" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
            {/* Book shadow */}
            <div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full"
              style={{
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
                filter: 'blur(8px)',
              }}
            />

            {/* Book cover */}
            <div
              className="relative rounded-sm overflow-hidden"
              style={{
                width: '180px',
                height: '260px',
                boxShadow: `
                  -8px 8px 20px rgba(0,0,0,0.5),
                  inset -3px 0 6px rgba(0,0,0,0.3)
                `,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop"
                alt="Featured Book"
                className="w-full h-full object-cover"
              />
              {/* Book spine shine */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, rgba(255,255,255,0.15) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)',
                }}
              />
              {/* Golden spine line */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ background: 'linear-gradient(to bottom, #C9A86C, #B08D57, #8B6914)' }}
              />
            </div>

            {/* Bookmark ribbon */}
            <div
              className="absolute -top-0 right-6 w-3 h-14"
              style={{
                background: 'linear-gradient(to bottom, #B08D57, #8B6914)',
                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Glow */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(176,141,87,0.3) 0%, transparent 70%)',
          filter: 'blur(30px)',
          transform: 'scale(1.5)',
        }}
      />
    </motion.div>
  )
}
