import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionTitle from '../common/SectionTitle'
import { RiStarFill, RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'

const testimonials = [
  {
    id: 1,
    name: 'Anika Rahman',
    location: 'Dhaka',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text: 'Pustak transformed my reading experience. The curation is impeccable — every book feels personally chosen. I\'ve rediscovered my love for Bengali literature through this beautiful platform.',
    book: 'Pather Panchali',
  },
  {
    id: 2,
    name: 'Rafiq Hossain',
    location: 'Chittagong',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text: 'The packaging alone is an experience — like receiving a gift. But more than that, the quality of books and the thoughtful selection makes Pustak unlike anything else in Bangladesh.',
    book: 'Gora',
  },
  {
    id: 3,
    name: 'Nadia Islam',
    location: 'Sylhet',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text: 'I ordered my first rare Tagore collection here. Not only did it arrive in perfect condition, the experience of browsing felt like walking through a real library. Absolutely premium.',
    book: 'Sanchita',
  },
  {
    id: 4,
    name: 'Tanvir Mahmud',
    location: 'Rajshahi',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text: 'The attention to detail is extraordinary. From the website to the delivery, every touchpoint feels considered. This is how a bookstore should feel in 2025.',
    book: 'The Alchemist',
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  const t = testimonials[current]

  return (
    <section
      className="relative py-28 md:py-40 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #4D342B 0%, #3a261e 100%)' }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(176,141,87,0.6) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Large decorative quote mark */}
      <div
        className="absolute top-10 left-10 font-heading text-[20rem] leading-none text-white/[0.02] pointer-events-none select-none"
        aria-hidden
      >
        "
      </div>

      <div className="section-padding">
        <div className="mb-16 md:mb-20">
          <SectionTitle
            eyebrow="Readers' Words"
            title={<>What People<br />Are Saying</>}
            light
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="glass-dark rounded-sm p-8 md:p-12 lg:p-16"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <RiStarFill key={i} size={14} className="text-gold" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-heading font-light text-cream/90 leading-relaxed mb-8"
                style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}
              >
                "{t.text}"
              </blockquote>

              {/* Author info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold/30"
                  />
                  <div>
                    <p className="font-body text-sm font-medium text-cream">{t.name}</p>
                    <p className="font-body text-xs text-cream/40">{t.location} · Purchased: {t.book}</p>
                  </div>
                </div>

                {/* Progress dots */}
                <div className="hidden md:flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`cursor-none transition-all duration-300 ${
                        i === current ? 'w-6 h-1.5 bg-gold rounded-full' : 'w-1.5 h-1.5 bg-cream/30 rounded-full hover:bg-cream/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-cream/40 hover:text-cream transition-colors duration-300 cursor-none"
            >
              <RiArrowLeftLine size={14} />
              Previous
            </motion.button>

            <span className="font-heading text-5xl font-light text-white/10 select-none">
              {String(current + 1).padStart(2, '0')}
            </span>

            <motion.button
              onClick={next}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-cream/40 hover:text-cream transition-colors duration-300 cursor-none"
            >
              Next
              <RiArrowRightLine size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}
