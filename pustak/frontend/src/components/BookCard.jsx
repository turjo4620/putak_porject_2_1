import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './BookCard.css'

export default function BookCard({ book, size = 'default' }) {
  const navigate = useNavigate()
  const { addToCart, toggleWish, isWished } = useApp()
  const [added, setAdded] = useState(false)

  // ---------------------------------------------------------
  // DATABASE DATA MAPPING & FALLBACKS
  // This maps your PostgreSQL column names to the UI, 
  // and provides safe defaults for missing data (like reviews)
  // ---------------------------------------------------------
  const bookId = book.id;
  const title = book.book_name || book.title || 'শিরোনাম নেই';
  const cover = book.cover_image_url || book.cover;
  const author = book.author || 'অজ্ঞাত';
  const price = book.price || 0;
  
  // Safe defaults for UI features not in the DB yet
  const category = book.category || null;
  const rating = book.rating || 0;
  const reviews = book.reviews || 0;
  const inStock = book.inStock !== false; // defaults to true
  const originalPrice = book.originalPrice || null;
  const discount = book.discount || 0;
  const badge = book.badge || null;
  const badgeColor = book.badgeColor || '#000';
  // ---------------------------------------------------------

  const wished = isWished(bookId)

  const handleCart = (e) => {
    e.stopPropagation()
    addToCart(book)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handlePreview = (e) => {
    e.stopPropagation()
    navigate(`/book/${bookId}`)
  }

  const handleWish = (e) => {
    e.stopPropagation()
    toggleWish(book)
  }

  return (
    <article
      className={`book-card book-card--${size}`}
      aria-label={`${title} — ${author}`}
      onClick={() => navigate(`/book/${bookId}`)}
      role="button"
      tabIndex={0}
    >
      {/* Cover */}
      <div className="book-card__cover-wrap">
        <div className="book-card__cover">
          <img
            src={cover}
            alt={`${title} বইয়ের প্রচ্ছদ`}
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
        {badge && (
          <span
            className="book-card__badge"
            style={{ background: badgeColor }}
            aria-label={`ব্যাজ: ${badge}`}
          >
            {badge}
          </span>
        )}
        {discount > 0 && (
          <span className="book-card__discount" aria-label={`${discount}% ছাড়`}>
            -{discount}%
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
        {!inStock && (
          <div className="book-card__out-of-stock" aria-label="স্টক নেই">স্টক নেই</div>
        )}
      </div>

      {/* Info */}
      <div className="book-card__info">
        {category && <span className="book-card__category">{category}</span>}
        <h3 className="book-card__title">{title}</h3>
        <p className="book-card__author">{author}</p>

        <div className="book-card__rating" aria-label={`রেটিং: ${rating} এর মধ্যে ৫`}>
          <span className="book-card__stars" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(rating) ? 'star--filled' : 'star--empty'}
              />
            ))}
          </span>
          <span className="book-card__rating-num">{rating}</span>
          <span className="book-card__reviews">({reviews.toLocaleString('bn-BD')})</span>
        </div>

        <div className="book-card__pricing">
          <strong className="book-card__price">৳{price}</strong>
          {originalPrice && (
            <s className="book-card__original">৳{originalPrice}</s>
          )}
        </div>
      </div>
    </article>
  )
}