import SectionTitle from '../common/SectionTitle'
import CategoryCard from './CategoryCard'
import { categories } from '../../data/categories'
import { motion } from 'framer-motion'

export default function Categories() {
  return (
    <section className="relative py-28 md:py-40 bg-cream overflow-hidden">
      {/* Decorative */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-3/4 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(176,141,87,0.3), transparent)' }}
      />

      <div className="section-padding">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <SectionTitle
            eyebrow="Explore by Genre"
            title={<>Every Kind<br />of Story</>}
            subtitle="From ancient classics to modern masterpieces — find your world."
            align="center"
          />
        </div>

        {/* Editorial grid - large panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-darkBrown/5">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>

        {/* Bottom flourish */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex items-center gap-6 justify-center"
          style={{ originX: 0.5 }}
        >
          <div className="h-px w-32 bg-gradient-to-r from-transparent to-gold/40" />
          <span className="font-heading text-3xl text-gold/40">✦</span>
          <div className="h-px w-32 bg-gradient-to-l from-transparent to-gold/40" />
        </motion.div>
      </div>
    </section>
  )
}
