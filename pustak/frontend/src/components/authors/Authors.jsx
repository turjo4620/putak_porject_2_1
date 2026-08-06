import SectionTitle from '../common/SectionTitle'
import AuthorCard from './AuthorCard'
import { authors } from '../../data/authors'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { RiArrowRightLine } from 'react-icons/ri'

export default function Authors() {
  return (
    <section className="relative py-28 md:py-40 bg-cream overflow-hidden">
      {/* Vertical text decoration */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3 pointer-events-none">
        <div className="h-20 w-px bg-gradient-to-b from-transparent to-gold/30" />
        <span
          className="font-body text-[9px] tracking-[0.4em] uppercase text-muted/50"
          style={{ writingMode: 'vertical-rl' }}
        >
          The Authors
        </span>
        <div className="h-20 w-px bg-gradient-to-t from-transparent to-gold/30" />
      </div>

      <div className="section-padding">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 md:mb-24">
          <SectionTitle
            eyebrow="The Voices"
            title={<>Meet the<br />Authors</>}
            subtitle="The storytellers whose words have shaped our world."
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/authors"
              className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-darkBrown hover:text-gold transition-colors duration-300 group cursor-none"
            >
              All Authors
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                <RiArrowRightLine size={14} />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Authors grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {authors.map((author, i) => (
            <AuthorCard key={author.id} author={author} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
