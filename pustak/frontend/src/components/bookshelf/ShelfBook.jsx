import { useState } from 'react'
import { motion } from 'framer-motion'

const SPINE_COLORS = ['#4D342B', '#2C4A2E', '#1A237E', '#4E342E', '#311B92', '#BF360C', '#880E4F', '#33691E']
const SPINE_HEIGHTS = [180, 200, 170, 210, 185, 195, 175, 205]

export default function ShelfBook({ book, index }) {
  const [hovered, setHovered] = useState(false)
  const height = SPINE_HEIGHTS[index % SPINE_HEIGHTS.length]
  const spineColor = book.spine || SPINE_COLORS[index % SPINE_COLORS.length]
  const width = 32 + (index % 3) * 6

  return (
    <div
      className="relative flex items-end cursor-none group"
      style={{ height: 220 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        animate={hovered ? { y: -20, rotateY: -8 } : { y: 0, rotateY: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width,
          height,
          transformOrigin: 'bottom center',
          transformStyle: 'preserve-3d',
          perspective: 600,
        }}
        className="relative will-change-transform"
      >
        {/* Book spine */}
        <div
          className="w-full h-full relative overflow-hidden rounded-t-sm"
          style={{
            background: `linear-gradient(to right, ${spineColor}dd, ${spineColor}, ${spineColor}bb)`,
            boxShadow: hovered
              ? `4px 12px 30px rgba(0,0,0,0.5), inset -2px 0 4px rgba(255,255,255,0.1)`
              : `2px 4px 12px rgba(0,0,0,0.3), inset -1px 0 3px rgba(255,255,255,0.05)`,
            transition: 'box-shadow 0.4s ease',
          }}
        >
          {/* Spine highlight */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5"
            style={{
              background: 'linear-gradient(to right, rgba(255,255,255,0.15), transparent)',
            }}
          />

          {/* Gold top/bottom decoration */}
          <div
            className="absolute top-3 left-2 right-2 h-px"
            style={{ background: 'rgba(176,141,87,0.5)' }}
          />
          <div
            className="absolute bottom-3 left-2 right-2 h-px"
            style={{ background: 'rgba(176,141,87,0.5)' }}
          />

          {/* Vertical title */}
          {width > 30 && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              <span
                className="font-heading text-[10px] text-white/70 truncate select-none"
                style={{ maxHeight: height - 32 }}
              >
                {book.title}
              </span>
            </div>
          )}

          {/* Page edges */}
          <div
            className="absolute right-0 top-0 bottom-0 w-1"
            style={{
              background: 'linear-gradient(to left, rgba(240,234,224,0.8), transparent)',
            }}
          />
        </div>

        {/* Shadow under book when hovered */}
        <motion.div
          animate={hovered ? { opacity: 1, scaleX: 1.3 } : { opacity: 0.4, scaleX: 1 }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-3 rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
            filter: 'blur(4px)',
          }}
        />
      </motion.div>

      {/* Tooltip on hover */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={hovered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -top-24 left-1/2 -translate-x-1/2 glass shadow-warm-lg p-3 w-36 z-20 pointer-events-none"
      >
        <p className="font-heading text-sm text-darkBrown leading-tight">{book.title}</p>
        <p className="font-body text-[10px] text-muted mt-1">{book.authorEn}</p>
        <p className="font-body text-xs text-gold font-medium mt-1">৳{book.price}</p>
      </motion.div>
    </div>
  )
}
