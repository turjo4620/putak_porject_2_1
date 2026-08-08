import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { Search, Heart, ShoppingBag, User, Menu, X, Sun, Moon, ChevronDown, Trash2, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './Navigation.css'

const navLinks = [
  { label: 'বিভাগ', hasDropdown: true },
  { label: 'আজকের অফার', to: '/offers' },
  { label: 'নতুন বই',    to: '/new-arrivals' },
  { label: 'বেস্টসেলার', to: '/bestsellers' },
  { label: 'লেখক',       to: '/authors' },
  { label: 'প্রকাশক',    to: '/publishers' },
]

const categories = [
  { name: 'উপন্যাস',     id: 'novel' },
  { name: 'কবিতা',       id: 'poetry' },
  { name: 'বিজ্ঞান',     id: 'science' },
  { name: 'ইতিহাস',      id: 'history' },
  { name: 'শিশুদের বই',  id: 'children' },
  { name: 'আত্মউন্নয়ন',  id: 'self-help' },
  { name: 'ইসলামিক',     id: 'islamic' },
  { name: 'একাডেমিক',    id: 'academic' },
  { name: 'ব্যবসা',      id: 'business' },
  { name: 'বিদেশী বই',   id: 'foreign' },
  { name: 'মুক্তিযুদ্ধ', id: 'freedom' },
  { name: 'আত্মজীবনী',   id: 'biography' },
]

const trendingSearches = ['হিমু', 'হুমায়ূন আহমেদ', 'রবীন্দ্রনাথ', 'মুক্তিযুদ্ধ', 'বিজ্ঞান']

export default function Navigation({ isDarkMode, toggleDarkMode }) {
  const navigate = useNavigate()
  const { cartItems, wishItems, removeFromCart, totalCartPrice,
          cartOpen, setCartOpen, wishOpen, setWishOpen, authUser, signOut } = useApp()

  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [catOpen, setCatOpen]     = useState(false)
  const [userOpen, setUserOpen]   = useState(false)
  const [query, setQuery]         = useState('')
  const searchRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  
  // Close drawers on route change
  useEffect(() => {
    setMobileOpen(false)
    setCartOpen(false)
    setWishOpen(false)
    setUserOpen(false)
  }, [navigate])

  // Open user drawer when authUser becomes available (e.g., after login)
  useEffect(() => {
    if (authUser) {
      setUserOpen(true)
      // make sure other drawers are closed
      setCartOpen(false)
      setWishOpen(false)
    }
  }, [authUser])
  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  const handleSearchChip = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`)
    setSearchOpen(false)
  }

  const anyDrawerOpen = cartOpen || wishOpen || userOpen || mobileOpen

  return (
    <>
      <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`} role="navigation" aria-label="প্রধান নেভিগেশন">
        <div className="nav__inner container">

          {/* Logo */}
          <Link to="/" className="nav__logo" aria-label="পুস্তক হোম">
            <PustakLogo />
          </Link>

          {/* Desktop Links */}
          <ul className="nav__links" role="list">
            {navLinks.map((link) => (
              <li key={link.label} className="nav__item">
                {link.hasDropdown ? (
                  <button
                    className="nav__link nav__link--btn"
                    aria-expanded={catOpen}
                    aria-haspopup="true"
                    onMouseEnter={() => setCatOpen(true)}
                    onMouseLeave={() => setCatOpen(false)}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`nav__chevron ${catOpen ? 'nav__chevron--open' : ''}`} />
                  </button>
                ) : (
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `nav__link${isActive ? ' nav__link--active' : ''}`
                    }
                  >
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="nav__actions">
            <button
              className="nav__icon-btn"
              aria-label="অনুসন্ধান"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={20} />
            </button>

            <button
              className={`nav__icon-btn nav__icon-btn--badge ${wishOpen ? 'nav__icon-btn--open' : ''}`}
              aria-label={`উইশলিস্ট (${wishItems.length} টি বই)`}
              aria-expanded={wishOpen}
              data-count={wishItems.length || ''}
              onClick={() => { setWishOpen(!wishOpen); setCartOpen(false); setUserOpen(false) }}
            >
              <Heart size={20} />
            </button>

            <button
              className={`nav__icon-btn nav__icon-btn--badge ${cartOpen ? 'nav__icon-btn--open' : ''}`}
              aria-label={`কার্ট (${cartItems.length} টি বই)`}
              aria-expanded={cartOpen}
              data-count={cartItems.length || ''}
              onClick={() => { setCartOpen(!cartOpen); setWishOpen(false); setUserOpen(false) }}
            >
              <ShoppingBag size={20} />
            </button>

            <button
              className="nav__icon-btn"
              aria-label={isDarkMode ? 'লাইট মোড' : 'ডার্ক মোড'}
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              className={`nav__icon-btn nav__icon-btn--user ${userOpen ? 'nav__icon-btn--open' : ''}`}
              aria-label="প্রোফাইল"
              aria-expanded={userOpen}
              onClick={() => { setUserOpen(!userOpen); setCartOpen(false); setWishOpen(false) }}
            >
              <User size={20} />
            </button>

            <button
              className="nav__hamburger"
              aria-label="মেনু"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Category Mega Dropdown */}
        {catOpen && (
          <div
            className="nav__dropdown"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <div className="container">
              <div className="nav__dropdown-grid">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    className="nav__dropdown-item"
                    onClick={() => setCatOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <Link to="/offers" className="nav__dropdown-promo" onClick={() => setCatOpen(false)}>
                <span className="nav__dropdown-promo-label">বিশেষ অফার</span>
                <strong>আজ সকল বইয়ে ২০% ছাড়</strong>
                <ArrowRight size={16} className="nav__dropdown-promo-arrow" />
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Cart Drawer ── */}
      <Drawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        title={`কার্ট (${cartItems.length})`}
        side="right"
      >
        {cartItems.length === 0 ? (
          <div className="drawer__empty">
            <ShoppingBag size={48} opacity={0.25} />
            <p>কার্ট খালি আছে</p>
            <button
              className="drawer__cta"
              onClick={() => { setCartOpen(false); navigate('/') }}
            >
              বই কিনুন
            </button>
          </div>
        ) : (
          <>
            <ul className="drawer__list">
              {cartItems.map((b) => (
                <li key={b.id} className="drawer__item">
                  <img
                    src={b.cover}
                    alt={b.title}
                    className="drawer__item-cover"
                    onClick={() => { setCartOpen(false); navigate(`/book/${b.id}`) }}
                  />
                  <div className="drawer__item-info">
                    <strong
                      className="drawer__item-title"
                      onClick={() => { setCartOpen(false); navigate(`/book/${b.id}`) }}
                    >
                      {b.title}
                    </strong>
                    <span className="drawer__item-author">{b.author}</span>
                    <span className="drawer__item-price">৳{b.price}</span>
                  </div>
                  <button
                    className="drawer__item-remove"
                    onClick={() => removeFromCart(b.id)}
                    aria-label={`${b.title} সরান`}
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="drawer__footer">
              <div className="drawer__total">
                <span>মোট</span>
                <strong>৳{totalCartPrice}</strong>
              </div>
              <button
                className="drawer__checkout"
                onClick={() => { setCartOpen(false); navigate('/checkout') }}
              >
                চেকআউট করুন
              </button>
            </div>
          </>
        )}
      </Drawer>

      {/* ── Wishlist Drawer ── */}
      <Drawer
        open={wishOpen}
        onClose={() => setWishOpen(false)}
        title={`উইশলিস্ট (${wishItems.length})`}
        side="right"
      >
        {wishItems.length === 0 ? (
          <div className="drawer__empty">
            <Heart size={48} opacity={0.25} />
            <p>উইশলিস্ট খালি আছে</p>
            <button
              className="drawer__cta"
              onClick={() => { setWishOpen(false); navigate('/') }}
            >
              বই ব্রাউজ করুন
            </button>
          </div>
        ) : (
          <ul className="drawer__list">
            {wishItems.map((b) => (
              <li key={b.id} className="drawer__item">
                <img
                  src={b.cover}
                  alt={b.title}
                  className="drawer__item-cover"
                  onClick={() => { setWishOpen(false); navigate(`/book/${b.id}`) }}
                />
                <div className="drawer__item-info">
                  <strong
                    className="drawer__item-title"
                    onClick={() => { setWishOpen(false); navigate(`/book/${b.id}`) }}
                  >
                    {b.title}
                  </strong>
                  <span className="drawer__item-author">{b.author}</span>
                  <span className="drawer__item-price">৳{b.price}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Drawer>

      {/* ── User Drawer ── */}
      <Drawer
        open={userOpen}
        onClose={() => setUserOpen(false)}
        title="আমার অ্যাকাউন্ট"
        side="right"
      >
        <div className="user-drawer">
          {authUser ? (
            <>
              <div className="user-drawer__avatar">{(authUser.name || authUser.email || 'U').slice(0,1)}</div>
              <p className="user-drawer__name">{authUser.name || authUser.email}</p>
              <div className="user-drawer__links">
                {[
                  { label: 'Account Info', to: '/account' },
                  { label: 'Orders & Tracking', to: '/orders' },
                  { label: 'Rating & Reviews', to: '/reviews' },
                  { label: 'Wishlist', to: '/wishlist' },
                ].map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    className="user-drawer__link"
                    onClick={() => setUserOpen(false)}
                  >
                    {l.label} <ArrowRight size={14} />
                  </Link>
                ))}

                <button
                  className="user-drawer__link user-drawer__link--signout"
                  onClick={() => { signOut(); setUserOpen(false); navigate('/') }}
                >
                  Sign out <ArrowRight size={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="user-drawer__avatar">পা</div>
              <p className="user-drawer__name">অতিথি পাঠক</p>
              <div className="user-drawer__links">
                {[
                  { label: 'লগইন করুন',      to: '/login' },
                  { label: 'নিবন্ধন করুন',   to: '/register' },
                  { label: 'আমার অর্ডার',    to: '/orders' },
                  { label: 'সেটিংস',         to: '/settings' },
                ].map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    className="user-drawer__link"
                    onClick={() => setUserOpen(false)}
                  >
                    {l.label} <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </Drawer>

      {/* ── Mobile Drawer ── */}
      <div className={`nav__drawer ${mobileOpen ? 'nav__drawer--open' : ''}`} role="dialog" aria-modal="true">
        <div className="nav__drawer-inner">
          <div className="nav__drawer-header">
            <Link to="/" onClick={() => setMobileOpen(false)}><PustakLogo /></Link>
            <button onClick={() => setMobileOpen(false)} aria-label="বন্ধ করুন">
              <X size={22} />
            </button>
          </div>
          <nav className="nav__drawer-links">
            {navLinks.map((link) => (
              link.hasDropdown
                ? categories.slice(0, 6).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      className="nav__drawer-link"
                      onClick={() => setMobileOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))
                : (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="nav__drawer-link"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
            ))}
          </nav>
          <div className="nav__drawer-footer">
            <button className="nav__drawer-dark-btn" onClick={toggleDarkMode}>
              {isDarkMode ? <><Sun size={16}/> লাইট মোড</> : <><Moon size={16}/> ডার্ক মোড</>}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for all drawers/mobile */}
      {anyDrawerOpen && (
        <div
          className="nav__overlay"
          onClick={() => {
            setMobileOpen(false)
            setCartOpen(false)
            setWishOpen(false)
            setUserOpen(false)
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Search Modal ── */}
      {searchOpen && (
        <div className="search-modal" role="dialog" aria-modal="true" aria-label="বই খুঁজুন">
          <div className="search-modal__backdrop" onClick={() => setSearchOpen(false)} />
          <div className="search-modal__box">
            <form className="search-modal__input-wrap" onSubmit={handleSearch}>
              <Search size={22} className="search-modal__icon" />
              <input
                ref={searchRef}
                type="search"
                className="search-modal__input"
                placeholder="বই, লেখক বা বিভাগ খুঁজুন..."
                aria-label="বই খুঁজুন"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="search-modal__submit" aria-label="অনুসন্ধান করুন">
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                className="search-modal__close"
                onClick={() => setSearchOpen(false)}
                aria-label="বন্ধ করুন"
              >
                <X size={20} />
              </button>
            </form>
            <div className="search-modal__trending">
              <p className="search-modal__label">ট্রেন্ডিং অনুসন্ধান</p>
              <div className="search-modal__chips">
                {trendingSearches.map((t) => (
                  <button
                    key={t}
                    className="search-modal__chip"
                    onClick={() => handleSearchChip(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ── Reusable Drawer ── */
function Drawer({ open, onClose, title, children, side = 'right' }) {
  return (
    <div
      className={`side-drawer side-drawer--${side} ${open ? 'side-drawer--open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="side-drawer__header">
        <h2 className="side-drawer__title">{title}</h2>
        <button className="side-drawer__close" onClick={onClose} aria-label="বন্ধ করুন">
          <X size={20} />
        </button>
      </div>
      <div className="side-drawer__body">{children}</div>
    </div>
  )
}

/* ── Logo ── */
function PustakLogo() {
  return (
    <div className="pustak-logo" aria-label="পুস্তক">
      <svg width="110" height="44" viewBox="0 0 110 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 36 Q30 40 55 38 Q80 36 102 39" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35"/>
        <path d="M46 4 Q55 1 64 4" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5"/>
        <text x="55" y="30" textAnchor="middle" fontFamily="'Noto Serif Bengali', 'Tiro Bangla', serif" fontWeight="700" fontSize="26" fill="currentColor" letterSpacing="1">পুস্তক</text>
        <circle cx="55" cy="6" r="1.5" fill="currentColor" opacity="0.6"/>
      </svg>
    </div>
  )
}
