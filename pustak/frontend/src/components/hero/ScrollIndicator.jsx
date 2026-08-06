import { motion } from 'framer-motion'

export default function ScrollIndicator() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 cursor-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5, duration: 1 }}
    >
      <motion.span
        className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/50"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        Scroll
      </motion.span>
      <div className="relative w-px h-12 overflow-hidden">
        <div className="absolute inset-0 bg-cream/20" />
        <motion.div
          className="absolute top-0 left-0 right-0 bg-gold"
          animate={{ scaleY: [0, 1, 0], y: ['0%', '0%', '100%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ height: '50%', originY: 0 }}
        />
      </div>
    </motion.div>
  )
}
