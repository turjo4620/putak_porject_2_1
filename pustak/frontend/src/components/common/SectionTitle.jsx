import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function SectionTitle({ eyebrow, title, subtitle, align = 'left', light = false }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const alignClass = {
    left: 'text-left',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  return (
    <div ref={ref} className={`flex flex-col gap-4 ${alignClass[align]}`}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`font-body text-xs tracking-[0.25em] uppercase font-medium ${light ? 'text-gold' : 'text-gold'}`}
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={`font-heading font-light leading-[1.05] ${light ? 'text-cream' : 'text-ink'}`}
        style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`font-body text-base leading-relaxed max-w-lg ${light ? 'text-cream/70' : 'text-muted'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
