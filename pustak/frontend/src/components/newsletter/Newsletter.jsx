import { useState } from 'react'
import { motion } from 'framer-motion'
import { RiSendPlane2Line } from 'react-icons/ri'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="relative py-28 md:py-44 bg-cream overflow-hidden">
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-0 left-1/4 w-px h-full pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(176,141,87,0.12), transparent)' }}
      />
      <motion.div
        className="absolute top-0 right-1/4 w-px h-full pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(176,141,87,0.12), transparent)' }}
      />

      {/* Large background text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="font-heading font-light text-darkBrown/[0.03] leading-none whitespace-nowrap"
          style={{ fontSize: 'clamp(8rem, 20vw, 18rem)' }}
        >
          LETTERS
        </span>
      </div>

      <div className="section-padding relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-gold/50" />
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-gold">
              Stay Connected
            </span>
            <div className="h-px w-12 bg-gold/50" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-light text-ink leading-tight mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}
          >
            Letters from<br />
            <em className="text-gradient-gold not-italic">the Library</em>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-muted text-base leading-relaxed mb-12 max-w-md mx-auto"
          >
            New arrivals, curated reading lists, and stories from our editors — delivered to your inbox, twice a month.
          </motion.p>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-8"
              >
                <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    ✓
                  </motion.div>
                </div>
                <p className="font-heading text-2xl font-light text-darkBrown">Welcome to the library.</p>
                <p className="font-body text-sm text-muted">Your first letter arrives soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-transparent border border-darkBrown/20 px-6 py-4 font-body text-sm text-ink placeholder:text-muted/50 outline-none focus:border-gold transition-colors duration-300 cursor-none"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 bg-darkBrown text-cream font-body text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-gold transition-colors duration-500 cursor-none whitespace-nowrap"
                >
                  Subscribe
                  <RiSendPlane2Line size={14} />
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Fine print */}
          {!submitted && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="font-body text-xs text-muted/50 mt-5 tracking-wide"
            >
              No spam. No noise. Only stories worth reading.
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}
