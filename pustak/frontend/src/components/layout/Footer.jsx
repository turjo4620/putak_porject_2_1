import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { RiBookOpenLine, RiInstagramLine, RiFacebookCircleLine, RiTwitterXLine, RiYoutubeLine } from 'react-icons/ri'

const footerLinks = {
  Shop: [
    { label: 'All Books', path: '/books' },
    { label: 'New Arrivals', path: '/books?filter=new' },
    { label: 'Bestsellers', path: '/books?filter=bestseller' },
    { label: 'Gift Cards', path: '/gifts' },
  ],
  Discover: [
    { label: 'Categories', path: '/categories' },
    { label: 'Authors', path: '/authors' },
    { label: 'Reading Lists', path: '/lists' },
    { label: 'Blog', path: '/blog' },
  ],
  Company: [
    { label: 'About Pustak', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Press', path: '/press' },
    { label: 'Contact', path: '/contact' },
  ],
}

const socials = [
  { icon: RiInstagramLine, href: '#', label: 'Instagram' },
  { icon: RiFacebookCircleLine, href: '#', label: 'Facebook' },
  { icon: RiTwitterXLine, href: '#', label: 'Twitter' },
  { icon: RiYoutubeLine, href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #3a261e 0%, #2a1a12 100%)' }}
    >
      {/* Top border */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(to right, transparent, rgba(176,141,87,0.4), transparent)' }}
      />

      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            rgba(176,141,87,0.2) 20px,
            rgba(176,141,87,0.2) 21px
          )`,
        }}
      />

      <div className="section-padding py-20 md:py-24 relative z-10">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2.5 cursor-none">
              <RiBookOpenLine size={20} className="text-gold" />
              <span className="font-heading text-2xl font-light tracking-[0.12em] text-cream">
                PUSTAK
              </span>
            </Link>
            <p className="font-body text-sm text-cream/40 leading-relaxed max-w-xs">
              Bangladesh's most loved independent bookstore. Curating stories that matter since 2019.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-4 mt-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, color: '#B08D57' }}
                  className="text-cream/30 hover:text-gold transition-colors duration-300 cursor-none"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
            <div className="mt-4">
              <p className="font-body text-xs text-cream/20 tracking-widest uppercase">
                Dhaka · Chittagong · Sylhet
              </p>
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="flex flex-col gap-5">
              <h4 className="font-body text-[10px] tracking-[0.3em] uppercase text-gold/70">
                {section}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="font-body text-sm text-cream/40 hover:text-cream transition-colors duration-300 cursor-none"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="font-body text-xs text-cream/20">
            © 2025 Pustak. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="font-body text-xs text-cream/20 hover:text-cream/50 transition-colors duration-300 cursor-none"
              >
                {item}
              </Link>
            ))}
          </div>
          <p className="font-body text-xs text-cream/20">
            Crafted with ♥ in Dhaka
          </p>
        </div>
      </div>
    </footer>
  )
}
