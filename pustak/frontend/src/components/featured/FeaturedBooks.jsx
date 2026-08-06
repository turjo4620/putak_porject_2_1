import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SectionTitle from '../common/SectionTitle'
import FeaturedBookCard from './FeaturedBookCard'
import { featuredBooks } from '../../data/books'
import { Link } from 'react-router-dom'
import { RiArrowRightLine } from 'react-icons/ri'

// Flying pages that transition into book cards
function FlyingPage({ delay, fromX, fromY, toX, toY }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{ x: fromX, y: fromY, rotate: Math.random() * 30 - 15, opacity: 0, scale: 0.5 }}
      whileInView={{ x: toX, y: toY, rotate: 0, opacity: [0, 1, 0], scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: 60,
        height: 80,
        background: 'linear-gradient(135deg, #F0EAE0, #E8E0D0)',
        boxShadow: '2px 4px 12px rgba(0,0,0,0.15)',
      }}
    />
  )
}

export default function FeaturedBooks() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 30%'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  return (
    <section ref={sectionRef} className="relative py-28 md:py-40 bg-cream overflow-hidden">
      {/* Decorative background text */}
      <div
        className="absolute top-8 right-0 font-heading text-[12rem] font-light text-darkBrown/[0.03] leading-none pointer-events-none select-none hidden lg:block"
        aria-hidden
      >
        Featured
      </div>

      <div className="section-padding">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 md:mb-24">
          <SectionTitle
            eyebrow="Curated Selection"
            title="Featured Books"
            subtitle="Handpicked stories that have touched generations of readers."
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link
              to="/books"
              className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-darkBrown hover:text-gold transition-colors duration-300 group cursor-none"
            >
              View All Books
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                <RiArrowRightLine size={14} />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Books grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {featuredBooks.map((book, i) => (
            <FeaturedBookCard key={book.id} book={book} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 text-center"
        >
          <p className="font-heading text-2xl md:text-3xl font-light text-ink/50 italic mb-6">
            "A reader lives a thousand lives before he dies."
          </p>
          <span className="font-body text-xs tracking-widest text-muted uppercase">
            — George R.R. Martin
          </span>
        </motion.div>
      </div>
    </section>
  )
}
