import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { books } from '../data/books'
import FeaturedBookCard from '../components/featured/FeaturedBookCard'
import SectionTitle from '../components/common/SectionTitle'
import { RiFilterLine, RiGridLine, RiListCheck2 } from 'react-icons/ri'
import { categories } from '../data/categories'

const filters = ['All', 'Bengali Classics', 'International Fiction', 'Poetry', 'Mystery & Thriller']

export default function Books() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [gridView, setGridView] = useState(true)

  useEffect(() => {
    document.title = 'Books — PUSTAK'
  }, [])

  const filtered = activeFilter === 'All' ? books : books.filter(b => b.category === activeFilter)

  return (
    <main className="min-h-screen bg-cream pt-28">
      {/* Header */}
      <div className="section-padding py-16 border-b border-darkBrown/8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <SectionTitle
            eyebrow="The Collection"
            title="All Books"
            subtitle={`${books.length} carefully curated titles`}
          />

          {/* View toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGridView(true)}
              className={`p-2 cursor-none transition-colors duration-300 ${gridView ? 'text-darkBrown' : 'text-muted'}`}
            >
              <RiGridLine size={18} />
            </button>
            <button
              onClick={() => setGridView(false)}
              className={`p-2 cursor-none transition-colors duration-300 ${!gridView ? 'text-darkBrown' : 'text-muted'}`}
            >
              <RiListCheck2 size={18} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mt-8 flex-wrap">
          {filters.map((f) => (
            <motion.button
              key={f}
              onClick={() => setActiveFilter(f)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`font-body text-xs tracking-[0.15em] uppercase px-5 py-2.5 border transition-all duration-300 cursor-none ${
                activeFilter === f
                  ? 'bg-darkBrown text-cream border-darkBrown'
                  : 'border-darkBrown/20 text-muted hover:border-darkBrown/50'
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Books grid */}
      <div className="section-padding py-16">
        <motion.div
          layout
          className={`grid gap-6 lg:gap-8 ${
            gridView ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'
          }`}
        >
          {filtered.map((book, i) => (
            <FeaturedBookCard key={book.id} book={book} index={i} />
          ))}
        </motion.div>
      </div>
    </main>
  )
}
