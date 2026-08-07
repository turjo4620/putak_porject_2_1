import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { bestSellers } from '../data/books'
import BookCard from './BookCard'
import SectionHeader from './SectionHeader'
import './BestSellers.css'

export default function BestSellers() {
  const scrollRef = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    const amount = dir === 'left' ? -320 : 320
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 0)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }

  return (
    <section className="bestsellers section" id="books" aria-label="বেস্টসেলার বই">
      <div className="container">
        <SectionHeader
          label="বেস্টসেলার"
          title="সবচেয়ে বেশি পড়া বই"
          subtitle="পাঠকদের প্রিয় — এ মাসের সেরা বিক্রয়"
          linkText="সব দেখুন"
        />
      </div>

      <div className="bestsellers__track-wrap">
        <div className="container">
          {/* Nav Buttons */}
          <button
            className={`bestsellers__nav bestsellers__nav--prev ${atStart ? 'bestsellers__nav--hidden' : ''}`}
            onClick={() => scroll('left')}
            aria-label="আগের বই"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className={`bestsellers__nav bestsellers__nav--next ${atEnd ? 'bestsellers__nav--hidden' : ''}`}
            onClick={() => scroll('right')}
            aria-label="পরের বই"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Scrollable track */}
        <div
          className="bestsellers__track"
          ref={scrollRef}
          onScroll={onScroll}
          role="list"
          aria-label="বেস্টসেলার বইয়ের তালিকা"
        >
          <div className="bestsellers__track-inner container">
            {bestSellers.map((book) => (
              <div key={book.id} className="bestsellers__item" role="listitem">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
