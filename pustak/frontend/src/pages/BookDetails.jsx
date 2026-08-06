import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { books } from '../data/books'
import { RiStarFill, RiArrowLeftLine, RiShoppingBagLine, RiHeartLine } from 'react-icons/ri'

export default function BookDetails() {
  const { id } = useParams()
  const book = books.find(b => b.id === Number(id)) || books[0]

  useEffect(() => {
    document.title = `${book.titleEn} — PUSTAK`
    window.scrollTo(0, 0)
  }, [book])

  return (
    <main className="min-h-screen bg-cream pt-28">
      <div className="section-padding py-12">
        {/* Back */}
        <Link
          to="/books"
          className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-muted hover:text-darkBrown transition-colors duration-300 cursor-none mb-12"
        >
          <RiArrowLeftLine size={12} />
          Back to Books
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Book cover */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start justify-center lg:justify-start"
          >
            <div className="relative" style={{ perspective: 1000 }}>
              <motion.div
                animate={{ rotateY: [-3, 3, -3] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
                className="will-change-transform"
              >
                <div
                  className="overflow-hidden rounded-sm"
                  style={{
                    width: 280,
                    height: 400,
                    boxShadow: '-12px 16px 40px rgba(0,0,0,0.3)',
                  }}
                >
                  <img
                    src={book.cover}
                    alt={book.titleEn}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Book info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            <div>
              <span className="font-body text-xs tracking-widest uppercase text-gold">{book.category}</span>
              <h1 className="font-heading font-light text-ink mt-2 leading-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                {book.title}
              </h1>
              <p className="font-heading text-xl font-light text-muted italic mt-1">{book.titleEn}</p>
            </div>

            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <RiStarFill key={i} size={13} className={i < Math.floor(book.rating) ? 'text-gold' : 'text-muted/30'} />
              ))}
              <span className="font-body text-xs text-muted ml-1">{book.rating} ({book.reviews.toLocaleString()} reviews)</span>
            </div>

            <div className="h-px bg-darkBrown/8" />

            <p className="font-body text-base text-muted leading-relaxed">{book.description}</p>

            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Author', value: book.authorEn },
                { label: 'Pages', value: book.pages },
                { label: 'Year', value: book.year },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-body text-[10px] tracking-widest uppercase text-muted/60">{label}</p>
                  <p className="font-heading text-lg font-light text-ink mt-1">{value}</p>
                </div>
              ))}
            </div>

            <div className="h-px bg-darkBrown/8" />

            <div className="flex items-baseline gap-3">
              <span className="font-heading text-4xl font-light text-darkBrown">৳{book.price}</span>
              {book.originalPrice && (
                <span className="font-body text-base text-muted line-through">৳{book.originalPrice}</span>
              )}
              {book.originalPrice && (
                <span className="font-body text-xs text-gold bg-gold/10 px-2 py-0.5">
                  {Math.round((1 - book.price / book.originalPrice) * 100)}% off
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 bg-darkBrown text-cream font-body text-xs tracking-widest uppercase py-4 hover:bg-gold transition-colors duration-500 cursor-none"
              >
                <RiShoppingBagLine size={14} />
                Add to Bag
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 flex items-center justify-center border border-darkBrown/20 text-muted hover:text-darkBrown hover:border-darkBrown transition-all duration-300 cursor-none"
              >
                <RiHeartLine size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
