import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { RiStarFill, RiArrowRightLine } from 'react-icons/ri'

export default function FeaturedBookCard({ book, index }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 12
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -12
    setTilt({ x, y })
  }

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.9,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      whileHover={{ y: -12, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-none will-change-transform"
    >
      <div className="bg-cream rounded-sm overflow-hidden shadow-warm hover:shadow-warm-xl transition-shadow duration-500">
        {/* Book cover */}
        <div className="relative overflow-hidden aspect-[3/4]">
          <motion.img
            src={book.cover}
            alt={book.titleEn}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {book.bestseller && (
              <span className="bg-gold text-cream font-body text-[9px] tracking-widest uppercase px-2.5 py-1">
                Bestseller
              </span>
            )}
            {book.new && (
              <span className="bg-darkBrown text-cream font-body text-[9px] tracking-widest uppercase px-2.5 py-1">
                New
              </span>
            )}
          </div>

          {/* Overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-darkBrown/60 flex items-end p-4"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to={`/books/${book.id}`}
              className="w-full flex items-center justify-between text-cream font-body text-xs tracking-widest uppercase border-t border-cream/30 pt-3"
            >
              View Details
              <RiArrowRightLine size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Book info */}
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-body text-[10px] tracking-widest uppercase text-gold">
              {book.category}
            </span>
          </div>

          <h3 className="font-heading text-xl font-medium text-ink leading-tight">
            {book.title}
          </h3>
          <p className="font-body text-xs text-muted">{book.authorEn}</p>

          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <RiStarFill
                key={i}
                size={10}
                className={i < Math.floor(book.rating) ? 'text-gold' : 'text-muted/30'}
              />
            ))}
            <span className="font-body text-[10px] text-muted ml-1">({book.reviews.toLocaleString()})</span>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-darkBrown/8">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-xl text-darkBrown">৳{book.price}</span>
              {book.originalPrice && (
                <span className="font-body text-xs text-muted line-through">৳{book.originalPrice}</span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-body text-[10px] tracking-widest uppercase bg-darkBrown text-cream px-4 py-2 hover:bg-gold transition-colors duration-300 cursor-none"
            >
              Add
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
