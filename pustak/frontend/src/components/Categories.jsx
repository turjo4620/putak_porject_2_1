import { useEffect, useRef, useState } from 'react'
import { categories } from '../data/books'
import SectionHeader from './SectionHeader'
import './Categories.css'

export default function Categories() {
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
    <section className="categories section" ref={ref} aria-label="সব বিভাগ">
      <div className="container">
        <SectionHeader
          label="বিভাগসমূহ"
          title="আপনার আগ্রহের বিষয়"
          subtitle="বিষয়ভিত্তিক বইয়ের বিশাল সংগ্রহ"
          align="center"
        />
        <div className={`categories__grid ${visible ? 'categories__grid--visible' : ''}`}>
          {categories.map((cat, i) => (
            <a
              key={cat.id}
              href="#"
              className="cat-card"
              style={{ transitionDelay: `${i * 50}ms` }}
              aria-label={`${cat.name} — ${cat.count} টি বই`}
            >
              <div className="cat-card__icon" style={{ background: `${cat.color}15`, color: cat.color }}>
                {cat.icon}
              </div>
              <strong className="cat-card__name">{cat.name}</strong>
              <span className="cat-card__count">{cat.count.toLocaleString('bn-BD')} টি</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
