import { useEffect, useRef, useState } from 'react'
import { bestSellers } from '../data/books'
import BookCard from './BookCard'
import SectionHeader from './SectionHeader'
import './Recommendations.css'

const tags = ['সব', 'উপন্যাস', 'কবিতা', 'বিজ্ঞান', 'ইতিহাস', 'আত্মউন্নয়ন']

export default function Recommendations() {
  const [active, setActive] = useState('সব')
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="reco section" ref={ref} aria-label="আপনার জন্য সুপারিশ">
      <div className="container">
        <SectionHeader
          label="AI সুপারিশ"
          title="আপনার জন্য"
          subtitle="আপনার পড়ার অভ্যাস ও পছন্দ অনুযায়ী বেছে নেওয়া বই"
          linkText="সব দেখুন"
        />

        {/* Filter tabs */}
        <div className="reco__tabs" role="tablist" aria-label="বিভাগ ফিল্টার">
          {tags.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={active === t}
              className={`reco__tab ${active === t ? 'reco__tab--active' : ''}`}
              onClick={() => setActive(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className={`reco__grid ${visible ? 'reco__grid--visible' : ''}`}>
          {bestSellers.slice(0, 4).map((book, i) => (
            <div
              key={book.id}
              className="reco__item"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
