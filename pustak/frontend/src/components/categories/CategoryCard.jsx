import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { RiArrowRightUpLine } from 'react-icons/ri'

export default function CategoryCard({ category, index }) {
  const [hovered, setHovered] = useState(false)
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 1,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative overflow-hidden cursor-none"
      style={{ minHeight: '380px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
          animate={hovered ? { scale: 1.08 } : { scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-darkBrown/60" />
        <motion.div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${category.color}cc, ${category.color}88)` }}
          animate={hovered ? { opacity: 0.85 } : { opacity: 0.6 }}
          transition={{ duration: 0.6 }}
        />
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-between min-h-[380px]">
        {/* Top: number */}
        <div className="flex items-start justify-between">
          <span
            className="font-heading text-7xl font-light leading-none select-none"
            style={{ color: `${category.accent}40` }}
          >
            0{index + 1}
          </span>
          <motion.div
            animate={hovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="w-10 h-10 rounded-full border border-cream/40 flex items-center justify-center"
          >
            <RiArrowRightUpLine size={16} className="text-cream" />
          </motion.div>
        </div>

        {/* Bottom: text */}
        <div className="flex flex-col gap-3">
          <motion.span
            className="font-body text-[10px] tracking-[0.3em] uppercase"
            style={{ color: category.accent }}
          >
            {category.count} Books
          </motion.span>

          {/* Bengali name that reveals */}
          <div className="overflow-hidden">
            <motion.p
              className="font-body text-xs tracking-widest text-cream/40 mb-1"
              animate={hovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              {category.nameBn}
            </motion.p>
          </div>

          <h3
            className="font-heading font-light text-cream leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {category.name}
          </h3>

          {/* Description that animates up on hover */}
          <div className="overflow-hidden">
            <motion.p
              className="font-body text-sm text-cream/60 leading-relaxed max-w-xs"
              animate={hovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {category.description}
            </motion.p>
          </div>

          {/* CTA */}
          <motion.div
            animate={hovered ? { y: 0, opacity: 1 } : { y: 15, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-2"
          >
            <Link
              to={`/categories/${category.id}`}
              className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-cream border-b border-cream/30 pb-0.5 hover:border-cream transition-colors duration-300"
            >
              Explore
              <RiArrowRightUpLine size={12} />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
