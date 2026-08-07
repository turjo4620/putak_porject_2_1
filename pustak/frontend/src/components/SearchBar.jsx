import { useState, useRef, useEffect } from 'react'
import { Search, TrendingUp, Clock, ChevronRight } from 'lucide-react'
import './SearchBar.css'

const trending = ['হিমু', 'হুমায়ূন আহমেদ', 'রবীন্দ্রনাথ', 'মুক্তিযুদ্ধ', 'নতুন বই', 'বিজ্ঞান']

const suggestions = [
  { type: 'book',   title: 'হিমু',              author: 'হুমায়ূন আহমেদ',       cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=60&h=80&fit=crop&q=80' },
  { type: 'author', title: 'হুমায়ূন আহমেদ',     books: '২০০+ বই',              avatar: 'হু' },
  { type: 'book',   title: 'দেয়াল',             author: 'হুমায়ূন আহমেদ',       cover: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=60&h=80&fit=crop&q=80' },
  { type: 'cat',    title: 'উপন্যাস',            books: '১২৪০ টি বই',           icon: '📖' },
]

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const inputRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (wrapRef.current) observer.observe(wrapRef.current)
    return () => observer.disconnect()
  }, [])

  const showDropdown = focused && (query.length > 0 || true)

  return (
    <section className={`search-section section-sm ${visible ? 'search-section--visible' : ''}`} ref={wrapRef} aria-label="বই অনুসন্ধান">
      <div className="container">
        <div className="search-section__inner">
          <p className="search-section__label">৫০,০০০+ বই থেকে আপনার পছন্দেরটি খুঁজুন</p>

          <div className={`search-wrap ${focused ? 'search-wrap--focused' : ''}`}>
            <div className="search-input-row">
              <Search size={22} className="search-input-icon" aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                className="search-input"
                placeholder="বই, লেখক, প্রকাশক বা বিভাগ লিখুন..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                aria-label="বই খুঁজুন"
                aria-expanded={showDropdown}
                aria-haspopup="listbox"
              />
              <button className="search-btn" aria-label="অনুসন্ধান করুন">
                অনুসন্ধান
              </button>
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div className="search-dropdown" role="listbox" aria-label="অনুসন্ধান ফলাফল">
                {query.length === 0 && (
                  <div className="search-dropdown__section">
                    <div className="search-dropdown__header">
                      <TrendingUp size={14} />
                      ট্রেন্ডিং অনুসন্ধান
                    </div>
                    <div className="search-dropdown__chips">
                      {trending.map((t) => (
                        <button key={t} className="search-chip" onClick={() => setQuery(t)}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {query.length > 0 && (
                  <div className="search-dropdown__section">
                    <div className="search-dropdown__header">
                      <Search size={14} /> সাজেশন
                    </div>
                    {suggestions.map((s, i) => (
                      <div key={i} className="search-suggestion" role="option">
                        {s.type === 'book' && (
                          <>
                            <img src={s.cover} alt={s.title} className="search-suggestion__cover" />
                            <div className="search-suggestion__info">
                              <strong>{s.title}</strong>
                              <span>{s.author}</span>
                            </div>
                            <span className="search-suggestion__type">বই</span>
                          </>
                        )}
                        {s.type === 'author' && (
                          <>
                            <div className="search-suggestion__avatar">{s.avatar}</div>
                            <div className="search-suggestion__info">
                              <strong>{s.title}</strong>
                              <span>{s.books}</span>
                            </div>
                            <span className="search-suggestion__type">লেখক</span>
                          </>
                        )}
                        {s.type === 'cat' && (
                          <>
                            <div className="search-suggestion__icon">{s.icon}</div>
                            <div className="search-suggestion__info">
                              <strong>{s.title}</strong>
                              <span>{s.books}</span>
                            </div>
                            <span className="search-suggestion__type">বিভাগ</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="search-dropdown__footer">
                  <button className="search-dropdown__all">
                    সব ফলাফল দেখুন <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Trending chips below */}
          <div className="search-section__trending" aria-label="ট্রেন্ডিং">
            <span className="search-section__trending-label">ট্রেন্ডিং:</span>
            {trending.slice(0, 5).map((t) => (
              <button key={t} className="search-section__chip" onClick={() => setQuery(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
