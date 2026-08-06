import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { RiArrowRightLine } from 'react-icons/ri'

export default function HeroContent() {
  const { scrollYProgress } = useScroll({ offset: ['start start', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.35], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.35], [0, -80])

  return (
    <motion.div
      style={{ opacity, y }}
      className="relative z-10 flex flex-col items-start gap-6 max-w-2xl"
    >
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3"
      >
        <span className="w-8 h-px bg-gold" />
        <span className="font-body text-[11px] tracking-[0.3em] uppercase text-gold/90">
          Bangladesh's Most Loved Bookstore
        </span>
      </motion.div>

      {/* Main title */}
      <div className="overflow-hidden">
        <motion.h1
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1.1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-light text-cream leading-none"
          style={{ fontSize: 'clamp(5rem, 12vw, 9rem)', letterSpacing: '-0.03em' }}
        >
          PUSTAK
        </motion.h1>
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="font-heading font-light text-cream/80 italic"
        style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}
      >
        Where Every Story Begins
      </motion.p>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="font-body text-cream/60 text-sm leading-relaxed max-w-sm"
      >
        Discover timeless Bengali and English literature, curated for the discerning reader.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-4 flex-wrap"
      >
        <Link
          to="/books"
          className="group inline-flex items-center gap-3 bg-gold text-cream font-body text-xs tracking-[0.15em] uppercase px-7 py-4 transition-all duration-500 hover:bg-cream hover:text-darkBrown cursor-none"
        >
          Explore Books
          <motion.span
            className="group-hover:translate-x-1 transition-transform duration-300"
          >
            <RiArrowRightLine size={14} />
          </motion.span>
        </Link>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 border border-cream/40 text-cream font-body text-xs tracking-[0.15em] uppercase px-7 py-4 transition-all duration-500 hover:border-cream hover:bg-cream/10 cursor-none"
        >
          Browse Categories
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2, ease: 'easeOut' }}
        className="flex items-center gap-8 pt-4"
      >
        {[
          { number: '50K+', label: 'Books' },
          { number: '1200+', label: 'Authors' },
          { number: '180K+', label: 'Readers' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <span className="font-heading text-2xl font-light text-cream">{stat.number}</span>
            <span className="font-body text-[10px] tracking-widest uppercase text-cream/40">{stat.label}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
