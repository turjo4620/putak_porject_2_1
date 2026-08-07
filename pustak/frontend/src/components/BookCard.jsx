import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './BookCard.css'

export default function BookCard({ book, size = 'default' }) {
  const navigate = useNavigate()
  const { addToCart, toggleWish, isWished } = useApp()
  const [added, setAdded] = useState(false)

  const wished = isWished(book.id)

  const handleCart = (e) => {
    e.stopPropagation()
    addToCart(book)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handlePreview = (e) => {
    e.stopPropagation()
    navigate(`/book/${book.id}`)
  }

  const handleWish = (e) => {
    e.stopPropagation()
    toggleWish(book)
  }

  return (
    <article
      className={`book-card book-card--${size}`}
      aria-label={`${book.title} — ${book.author}`}
      onClick={() => navigate(`/book/${book.id}`)}
      role="button"
      tabIndex={0}
    >
      {/* Cover */}
      <div className="book-card__cover-wrap">
        <div className="book-card__cover">
          <img
            src={book.cover}
            alt={`${book.title} বইয়ের প্রচ্ছদ`}
            loading="lazy"
          />
          <div className="book-card__spine" aria-hidden="true" />
        </div>

        {/* Hover overlay */}
        <div className="book-card__overlay" aria-hidden="true">
          <button
            className="book-card__action"
            aria-label="প্রিভিউ দেখুন"
            onClick={handlePreview}
          >
            <Eye size={16} />
          </button>
          <button
            className={`book-card__action book-card__action--cart ${added ? 'book-card__action--added' : ''}`}
            aria-label="কার্টে যোগ করুন"
            onClick={handleCart}
          >
            <ShoppingBag size={16} />
            {added ? 'যোগ হয়েছে' : 'কার্টে যোগ'}
          </button>
        </div>

        {/* Badges */}
        {book.badge && (
          <span
            className="book-card__badge"
            style={{ background: book.badgeColor }}
            aria-label={`ব্যাজ: ${book.badge}`}
          >
            {book.badge}
          </span>
        )}
        {book.discount > 0 && (
          <span className="book-card__discount" aria-label={`${book.discount}% ছাড়`}>
            -{book.discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          className={`book-card__wish ${wished ? 'book-card__wish--active' : ''}`}
          onClick={handleWish}
          aria-label={wished ? 'উইশলিস্ট থেকে সরান' : 'উইশলিস্টে যোগ করুন'}
          aria-pressed={wished}
        >
          <Heart size={15} fill={wished ? 'currentColor' : 'none'} />
        </button>

        {/* Stock */}
        {!book.inStock && (
          <div className="book-card__out-of-stock" aria-label="স্টক নেই">স্টক নেই</div>
        )}
      </div>

      {/* Info */}
      <div className="book-card__info">
        <span className="book-card__category">{book.category}</span>
        <h3 className="book-card__title">{book.title}</h3>
        <p className="book-card__author">{book.author}</p>

        <div className="book-card__rating" aria-label={`রেটিং: ${book.rating} এর মধ্যে ৫`}>
          <span className="book-card__stars" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(book.rating) ? 'star--filled' : 'star--empty'}
              />
            ))}
          </span>
          <span className="book-card__rating-num">{book.rating}</span>
          <span className="book-card__reviews">({book.reviews.toLocaleString('bn-BD')})</span>
        </div>

        <div className="book-card__pricing">
          <strong className="book-card__price">৳{book.price}</strong>
          {book.originalPrice && (
            <s className="book-card__original">৳{book.originalPrice}</s>
          )}
        </div>
      </div>
    </article>
  )
}
