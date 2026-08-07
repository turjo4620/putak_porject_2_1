import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, Heart, ShoppingBag, Star, BookOpen, Share2, Check } from 'lucide-react'
import { bestSellers, newReleases } from '../data/books'
import { useApp } from '../context/AppContext'
import BookCard from '../components/BookCard'
import './BookDetailPage.css'

const allBooks = [...bestSellers, ...newReleases]

export default function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, toggleWish, isWished, isInCart } = useApp()

  const book = allBooks.find((b) => b.id === Number(id))
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!book) {
    return (
      <div className="book-detail__notfound">
        <h2>বইটি পাওয়া যায়নি</h2>
        <button onClick={() => navigate('/')}>হোমে ফিরুন</button>
      </div>
    )
  }

  const wished = isWished(book.id)
  const inCart = isInCart(book.id)

  const handleCart = () => {
    addToCart({ ...book, qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const related = allBooks.filter((b) => b.id !== book.id && b.category === book.category).slice(0, 4)
  const moreByAuthor = allBooks.filter((b) => b.id !== book.id && b.author === book.author).slice(0, 4)

  return (
    <div className="book-detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="book-detail__breadcrumb" aria-label="পথ চিহ্ন">
          <button className="book-detail__back" onClick={() => navigate(-1)} aria-label="পিছনে যান">
            <ArrowLeft size={16} />
          </button>
          <Link to="/">হোম</Link>
          <span aria-hidden="true">›</span>
          <Link to={`/category/${book.category}`}>{book.category}</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{book.title}</span>
        </nav>

        {/* Main layout */}
        <div className="book-detail__layout">
          {/* Left: Cover */}
          <div className="book-detail__cover-col">
            <div className="book-detail__cover-wrap">
              <div className="book-detail__cover">
                <img src={book.cover.replace('w=300&h=420', 'w=500&h=700')} alt={`${book.title} বইয়ের প্রচ্ছদ`} />
                <div className="book-detail__spine" aria-hidden="true" />
              </div>
              {book.badge && (
                <span className="book-detail__badge" style={{ background: book.badgeColor }}>
                  {book.badge}
                </span>
              )}
            </div>

            {/* Actions below cover */}
            <div className="book-detail__cover-actions">
              <button
                className={`book-detail__wish-btn ${wished ? 'book-detail__wish-btn--active' : ''}`}
                onClick={() => toggleWish(book)}
                aria-label={wished ? 'উইশলিস্ট থেকে সরান' : 'উইশলিস্টে যোগ করুন'}
                aria-pressed={wished}
              >
                <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
                {wished ? 'সংরক্ষিত' : 'উইশলিস্ট'}
              </button>
              <button
                className="book-detail__share-btn"
                onClick={handleShare}
                aria-label="শেয়ার করুন"
              >
                {copied ? <Check size={16} /> : <Share2 size={16} />}
                {copied ? 'কপি হয়েছে' : 'শেয়ার'}
              </button>
            </div>
          </div>

          {/* Right: Info */}
          <div className="book-detail__info-col">
            <span className="book-detail__category">{book.category}</span>
            <h1 className="book-detail__title">{book.title}</h1>
            <p className="book-detail__author">
              লেখক: <Link to={`/author/${encodeURIComponent(book.author)}`} className="book-detail__author-link">{book.author}</Link>
            </p>
            <p className="book-detail__publisher">প্রকাশক: <strong>{book.publisher}</strong></p>

            {/* Rating */}
            <div className="book-detail__rating" aria-label={`রেটিং ${book.rating}`}>
              <span className="book-detail__stars" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(book.rating) ? 'star--filled' : 'star--empty'} fill={i < Math.floor(book.rating) ? '#e8a020' : 'none'} />
                ))}
              </span>
              <strong>{book.rating}</strong>
              <span className="book-detail__review-count">({book.reviews.toLocaleString('bn-BD')} রিভিউ)</span>
            </div>

            {/* Price */}
            <div className="book-detail__price-block">
              <strong className="book-detail__price">৳{book.price}</strong>
              {book.originalPrice && (
                <>
                  <s className="book-detail__original">৳{book.originalPrice}</s>
                  <span className="book-detail__discount-pill">{book.discount}% ছাড়</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className={`book-detail__stock ${book.inStock ? 'book-detail__stock--in' : 'book-detail__stock--out'}`}>
              {book.inStock ? '✓ স্টকে আছে' : '✗ স্টক নেই'}
            </div>

            {/* Qty + Cart */}
            <div className="book-detail__buy-row">
              <div className="book-detail__qty" aria-label="পরিমাণ">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="কমান"
                  disabled={qty <= 1}
                >−</button>
                <span aria-live="polite">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="বাড়ান"
                >+</button>
              </div>
              <button
                className={`book-detail__cart-btn ${inCart ? 'book-detail__cart-btn--in' : ''} ${added ? 'book-detail__cart-btn--added' : ''}`}
                onClick={handleCart}
                disabled={!book.inStock}
                aria-label="কার্টে যোগ করুন"
              >
                <ShoppingBag size={18} />
                {added ? 'কার্টে যোগ হয়েছে' : inCart ? 'কার্টে আছে' : 'কার্টে যোগ করুন'}
              </button>
            </div>

            <button className="book-detail__buy-now-btn" disabled={!book.inStock}>
              এখনই কিনুন
            </button>

            {/* Book meta */}
            <div className="book-detail__meta-grid">
              <div className="book-detail__meta-item">
                <span>ভাষা</span>
                <strong>বাংলা</strong>
              </div>
              <div className="book-detail__meta-item">
                <span>পৃষ্ঠা</span>
                <strong>২৮৪</strong>
              </div>
              <div className="book-detail__meta-item">
                <span>সংস্করণ</span>
                <strong>৩য় সংস্করণ</strong>
              </div>
              <div className="book-detail__meta-item">
                <span>ISBN</span>
                <strong>978-984-XX-XXXX</strong>
              </div>
            </div>

            {/* Description */}
            <div className="book-detail__desc">
              <h3>বই সম্পর্কে</h3>
              <p>
                {book.title} বাংলা সাহিত্যের একটি অমর কীর্তি। {book.author} এর অসাধারণ
                লেখনীতে উঠে এসেছে বাংলার মানুষের জীবন, স্বপ্ন ও সংগ্রামের কথা।
                প্রতিটি পাতায় পাঠক খুঁজে পাবেন নিজের প্রতিফলন, হাসবেন, কাঁদবেন
                এবং ভাববেন। এই বইটি প্রতিটি বাড়ির বুকশেলফে থাকা উচিত।
              </p>
            </div>
          </div>
        </div>

        {/* Related Books */}
        {related.length > 0 && (
          <div className="book-detail__related">
            <h2 className="book-detail__section-title">একই বিভাগের আরও বই</h2>
            <div className="book-detail__related-grid">
              {related.map((b) => <BookCard key={b.id} book={b} size="small" />)}
            </div>
          </div>
        )}

        {/* More by author */}
        {moreByAuthor.length > 0 && (
          <div className="book-detail__related">
            <h2 className="book-detail__section-title">{book.author} এর আরও বই</h2>
            <div className="book-detail__related-grid">
              {moreByAuthor.map((b) => <BookCard key={b.id} book={b} size="small" />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
