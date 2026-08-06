import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { RiArrowRightLine, RiBookLine } from 'react-icons/ri'

export default function AuthorCard({ author, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.9,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group cursor-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Portrait */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
        <motion.img
          src={author.portrait}
          alt={author.nameEn}
          className="w-full h-full object-cover grayscale transition-all duration-700"
          style={{ filter: hovered ? 'grayscale(0%)' : 'grayscale(60%)' }}
          animate={hovered ? { scale: 1.06 } : { scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0"
          animate={hovered
            ? { opacity: 1 }
            : { opacity: 0.4 }
          }
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(to top, rgba(77,52,43,0.95) 0%, rgba(77,52,43,0.3) 50%, transparent 100%)',
          }}
        />

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Genre tags */}
          <motion.div
            className="flex flex-wrap gap-1.5 mb-3"
            animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            {author.genre.slice(0, 2).map((g) => (
              <span key={g} className="font-body text-[9px] tracking-widest uppercase text-gold border border-gold/40 px-2 py-0.5">
                {g}
              </span>
            ))}
          </motion.div>

          {/* Name */}
          <div className="overflow-hidden">
            <motion.h3
              className="font-heading font-light text-cream leading-tight"
              animate={hovered ? { y: 0 } : { y: 5 }}
              transition={{ duration: 0.5 }}
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
            >
              {author.name}
            </motion.h3>
          </div>

          <motion.p
            className="font-body text-xs text-cream/50 mt-1"
            animate={hovered ? { opacity: 1 } : { opacity: 0.6 }}
            transition={{ duration: 0.4 }}
          >
            {author.born} — {author.died}
          </motion.p>

          {/* Bio */}
          <motion.p
            className="font-body text-xs text-cream/60 leading-relaxed mt-3 line-clamp-2"
            animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {author.bio}
          </motion.p>

          {/* Books count & link */}
          <motion.div
            className="flex items-center justify-between mt-4"
            animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="flex items-center gap-1.5 text-cream/50">
              <RiBookLine size={12} />
              <span className="font-body text-xs">{author.books} works</span>
            </div>
            <Link
              to={`/authors/${author.id}`}
              className="inline-flex items-center gap-1 font-body text-[10px] tracking-widest uppercase text-gold hover:text-cream transition-colors duration-300"
            >
              View <RiArrowRightLine size={10} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Quote below card */}
      <motion.div
        className="mt-4 px-1"
        animate={hovered ? { opacity: 1 } : { opacity: 0.4 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-heading text-base font-light italic text-ink/60 line-clamp-2">
          "{author.quote}"
        </p>
      </motion.div>
    </motion.div>
  )
}
