import { useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { RiBookOpenLine, RiSearchLine, RiShoppingBagLine, RiMenuLine, RiCloseLine } from 'react-icons/ri'

const navLinks = [
  { label: 'Books', path: '/books' },
  { label: 'Authors', path: '/authors' },
  { label: 'Categories', path: '/categories' },
  { label: 'About', path: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const location = useLocation()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 60)
  })

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <div className={`mx-4 md:mx-8 rounded-2xl transition-all duration-700 ${
          scrolled
            ? 'glass shadow-warm px-6 py-3'
            : 'bg-transparent px-6 py-2'
        }`}>
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 cursor-none group">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <RiBookOpenLine
                  size={22}
                  className={`transition-colors duration-500 ${scrolled ? 'text-darkBrown' : 'text-cream'}`}
                />
              </motion.div>
              <span
                className={`font-heading text-2xl font-light tracking-[0.12em] transition-colors duration-500 ${
                  scrolled ? 'text-darkBrown' : 'text-cream'
                }`}
              >
                PUSTAK
              </span>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`font-body text-xs tracking-[0.15em] uppercase transition-colors duration-300 cursor-none relative group ${
                      scrolled ? 'text-ink hover:text-darkBrown' : 'text-cream/80 hover:text-cream'
                    } ${location.pathname === link.path ? (scrolled ? 'text-darkBrown' : 'text-cream') : ''}`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-500 ${scrolled ? 'bg-gold' : 'bg-cream'}`} />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`hidden md:flex cursor-none transition-colors duration-300 ${scrolled ? 'text-ink hover:text-darkBrown' : 'text-cream/80 hover:text-cream'}`}
              >
                <RiSearchLine size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-none transition-colors duration-300 relative ${scrolled ? 'text-ink hover:text-darkBrown' : 'text-cream/80 hover:text-cream'}`}
              >
                <RiShoppingBagLine size={18} />
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-cream text-[9px] font-body font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                  3
                </span>
              </motion.button>

              <Link
                to="/login"
                className={`hidden md:block font-body text-xs tracking-[0.15em] uppercase border px-4 py-2 transition-all duration-500 cursor-none ${
                  scrolled
                    ? 'border-darkBrown text-darkBrown hover:bg-darkBrown hover:text-cream'
                    : 'border-cream/50 text-cream hover:bg-cream hover:text-darkBrown'
                }`}
              >
                Login
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`md:hidden cursor-none transition-colors duration-300 ${scrolled ? 'text-ink' : 'text-cream'}`}
              >
                {menuOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: menuOpen ? 1 : 0, x: menuOpen ? '0%' : '100%' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-40 bg-cream md:hidden flex flex-col justify-center px-10"
      >
        <ul className="flex flex-col gap-8">
          {navLinks.map((link, i) => (
            <motion.li
              key={link.path}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: menuOpen ? 1 : 0, x: menuOpen ? 0 : 40 }}
              transition={{ delay: menuOpen ? 0.1 + i * 0.08 : 0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={link.path}
                className="font-heading text-5xl font-light text-darkBrown hover:text-gold transition-colors duration-300 cursor-none"
              >
                {link.label}
              </Link>
            </motion.li>
          ))}
        </ul>
        <div className="mt-16 border-t border-darkBrown/10 pt-8">
          <Link to="/login" className="font-body text-sm text-muted tracking-widest uppercase cursor-none">
            Login / Register
          </Link>
        </div>
      </motion.div>
    </>
  )
}
