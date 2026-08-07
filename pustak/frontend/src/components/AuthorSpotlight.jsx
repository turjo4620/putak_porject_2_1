import { useEffect, useRef, useState } from 'react'
import { authors, bestSellers } from '../data/books'
import './AuthorSpotlight.css'

export default function AuthorSpotlight() {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const author = authors[0]

  return (
    <section
      className={`author section ${visible ? 'author--visible' : ''}`}
      ref={ref}
      aria-label="লেখক স্পটলাইট"
    >
      <div className="container">
        <div className="author__inner">

          {/* Portrait */}
          <div className="author__portrait-wrap" aria-hidden="true">
            <div className="author__portrait-bg" />
            <div className="author__portrait">
              <div className="author__avatar">{author.avatar}</div>
            </div>
            <div className="author__signature" aria-hidden="true">{author.signature}</div>
            <div className="author__quote-bubble" aria-hidden="true">
              "বই হলো আলোর বাতিঘর"
            </div>
          </div>

          {/* Info */}
          <div className="author__info">
            <span className="author__label">লেখক পরিচিতি</span>
            <h2 className="author__name">{author.name}</h2>
            <p className="author__genre">{author.genre}</p>
            <p className="author__bio">{author.bio}</p>

            <div className="author__stat-row" aria-label="লেখকের পরিসংখ্যান">
              <div className="author__stat">
                <strong>{author.books}+</strong>
                <span>রচনা</span>
              </div>
              <div className="author__stat">
                <strong>৩৫+</strong>
                <span>বছরের</span>
              </div>
              <div className="author__stat">
                <strong>৫০ লক্ষ+</strong>
                <span>পাঠক</span>
              </div>
            </div>

            <div className="author__books" aria-label="জনপ্রিয় বই">
              <p className="author__books-label">জনপ্রিয় বই</p>
              <div className="author__books-grid">
                {bestSellers.slice(0, 3).map((b) => (
                  <div key={b.id} className="author__mini-book">
                    <img src={b.cover} alt={b.title} loading="lazy" />
                    <span>{b.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <a href="#" className="author__btn">
              সকল বই দেখুন
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
