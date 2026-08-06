import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SectionTitle from '../common/SectionTitle'
import ShelfBook from './ShelfBook'
import { books } from '../../data/books'

function Shelf({ shelfBooks, rowIndex }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay: rowIndex * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Books */}
      <div className="relative flex items-end gap-0.5 px-4 py-4 z-10">
        {shelfBooks.map((book, i) => (
          <ShelfBook key={book.id} book={book} index={i + rowIndex * 8} />
        ))}
      </div>

      {/* Shelf board */}
      <div
        className="relative h-5 mx-0 rounded-sm z-20"
        style={{
          background: 'linear-gradient(to bottom, #7D5A4F, #6D4C41, #5D3C31)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Wood grain */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 40px,
              rgba(0,0,0,0.08) 40px,
              rgba(0,0,0,0.08) 41px
            )`,
          }}
        />
        {/* Shelf edge highlight */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        />
      </div>

      {/* Shelf support brackets */}
      <div className="absolute bottom-0 left-8 w-3 h-8 bg-woodBrown/60 rounded-sm" />
      <div className="absolute bottom-0 right-8 w-3 h-8 bg-woodBrown/60 rounded-sm" />
    </motion.div>
  )
}

export default function Bookshelf() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-5%'])

  // Split books into two shelf rows
  const shelf1 = [...books].slice(0, 4)
  const shelf2 = [...books].slice(4, 8)
  // Pad shelf2 if needed
  while (shelf2.length < 4) shelf2.push(books[shelf2.length % books.length])

  return (
    <section className="relative py-28 md:py-40 overflow-hidden" style={{ background: '#F0EAE0' }}>
      {/* Decorative lines */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

      <div ref={ref} className="section-padding">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          {/* Left: Title */}
          <div className="lg:w-1/3 lg:sticky lg:top-32">
            <SectionTitle
              eyebrow="Browse Collection"
              title={<>The<br />Bookshelf</>}
              subtitle="Pull a spine, open a world. Each book holds a lifetime of stories waiting to be discovered."
            />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 h-px bg-gradient-to-r from-gold to-transparent origin-left"
              style={{ width: '60%' }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-8 font-heading text-4xl font-light text-ink/20 italic"
            >
              "A book is a dream that you hold in your hand."
            </motion.p>
            <p className="font-body text-xs text-muted tracking-widest uppercase mt-3">— Neil Gaiman</p>
          </div>

          {/* Right: Shelf */}
          <div className="lg:w-2/3 flex flex-col gap-2">
            {/* Bookshelf frame */}
            <div
              className="relative p-0 rounded-sm overflow-visible"
              style={{
                background: 'linear-gradient(160deg, #8B6355, #7D5347)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2), inset 0 0 30px rgba(0,0,0,0.1)',
              }}
            >
              {/* Left frame */}
              <div
                className="absolute left-0 top-0 bottom-0 w-5 z-20"
                style={{
                  background: 'linear-gradient(to right, #6D4C41, #8B6355)',
                  boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.2)',
                }}
              />
              {/* Right frame */}
              <div
                className="absolute right-0 top-0 bottom-0 w-5 z-20"
                style={{
                  background: 'linear-gradient(to left, #6D4C41, #8B6355)',
                  boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.2)',
                }}
              />
              {/* Top frame */}
              <div
                className="relative ml-5 mr-5"
                style={{ background: 'linear-gradient(135deg, #F0EAE0 0%, #E8E0D0 100%)' }}
              >
                <Shelf shelfBooks={shelf1} rowIndex={0} />
                <Shelf shelfBooks={shelf2} rowIndex={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
