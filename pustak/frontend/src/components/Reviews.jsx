import { Star } from 'lucide-react'
import { reviews } from '../data/books'
import SectionHeader from './SectionHeader'
import './Reviews.css'

export default function Reviews() {
  return (
    <section className="reviews section-sm" aria-label="পাঠক রিভিউ">
      <div className="container">
        <SectionHeader
          label="পাঠক মতামত"
          title="পাঠকরা কী বলছেন"
          align="center"
        />
        <div className="reviews__grid">
          {reviews.map((r) => (
            <article key={r.id} className="review-card" aria-label={`${r.name} এর রিভিউ`}>
              <div className="review-card__header">
                <div className="review-card__avatar">{r.avatar}</div>
                <div className="review-card__info">
                  <strong className="review-card__name">{r.name}</strong>
                  <span className="review-card__location">{r.location}</span>
                </div>
                <div className="review-card__stars" aria-label={`রেটিং: ${r.rating} এর মধ্যে ৫`}>
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={12} className="star--filled" />
                  ))}
                </div>
              </div>
              <p className="review-card__text">{r.text}</p>
              <div className="review-card__footer">
                <span className="review-card__book">{r.book}</span>
                <span className="review-card__date">{r.date}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
