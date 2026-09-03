import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, Heart, ShoppingBag, Star, Share2, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'
import BookCard from '../components/BookCard'
import './BookDetailPage.css'

export default function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, toggleWish, isWished, isInCart, authUser } = useApp()

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [adding, setAdding] = useState(false)
  const [cartError, setCartError] = useState('')
  const [copied, setCopied] = useState(false)
  const [related, setRelated] = useState([])
  const [moreByAuthor, setMoreByAuthor] = useState([])

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        const res = await fetch(`http://localhost:5000/api/books/${id}`)
        
        if (res.ok) {
          const data = await res.json()
          setBook(data)
        } else {
          setBook(null)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id])

  if (loading) {
    return (
      <div className="book-detail__notfound">
        <h2>লোড হচ্ছে...</h2>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="book-detail__notfound">
        <h2>বইটি পাওয়া যায়নি</h2>
        <button onClick={() => navigate('/')}>হোমে ফিরুন</button>
      </div>
    )
  }

  // Real Database Column Mappings
  const category = book.category_name || book.raw_category || 'সাধারণ'
  const publisher = book.publications?.[0]?.title || book.publisher || 'অজ্ঞাত প্রকাশক'
  const rating = book.rating ? Number(book.rating) : 0
  const reviews = book.num_reviews || 0
  const language = book.language || 'বাংলা'
  const numPages = book.num_pages || 'অজ্ঞাত'
  const edition = book.edition || '১ম সংস্করণ'
  const isbn = book.isbn || 'প্রযোজ্য নয়'
  const description = (book.description || 'এই বইটির কোনো বিবরণ দেওয়া নেই।')
  .replace(/show more/gi, '')
  .replace(/আরো পড়ুন/g, '')
  .replace(/আরও দেখুন/g, '')
  .trim()
  const coverUrl = book.cover_image_url ? book.cover_image_url.replace('w=300&h=420', 'w=500&h=700') : ''
  
  // Stock handling based on your availability column
  const inStock = book.availability !== 'Out of stock' && book.availability !== 'Unavailable'
  
  // Pricing logic (If discount_price exists, show price as crossed out)
  const currentPrice = book.discount_price || book.price
  const originalPrice = book.discount_price && book.discount_price < book.price ? book.price : null
  const discountPct = book.discount_percentage

  const wished = isWished(book.id)
  const inCart = isInCart(book.id)

  const handleCart = async () => {
    if (!authUser) {
      navigate('/login')
      return
    }
    setCartError('')
    try {
      setAdding(true)
      await addToCart({ ...book, qty, title: book.book_name, cover: book.cover_image_url, price: currentPrice })
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (err) {
      setCartError(err.message || 'কার্টে যোগ করা যায়নি')
    } finally {
      setAdding(false)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="book-detail">
      <div className="container">
        
        <nav className="book-detail__breadcrumb" aria-label="পথ চিহ্ন">
          <button className="book-detail__back" onClick={() => navigate(-1)} aria-label="পিছনে যান">
            <ArrowLeft size={16} />
          </button>
          <Link to="/">হোম</Link>
          <span aria-hidden="true">›</span>
          {book.category_id ? (
            <Link to={`/category/${book.category_id}`}>{category}</Link>
          ) : (
            <span>{category}</span>
          )}
          <span aria-hidden="true">›</span>
          <span aria-current="page">{book.book_name}</span>
        </nav>

        <div className="book-detail__layout">
          
          <div className="book-detail__cover-col">
            <div className="book-detail__cover-wrap">
              <div className="book-detail__cover">
                <img src={coverUrl} alt={`${book.book_name} বইয়ের প্রচ্ছদ`} />
                <div className="book-detail__spine" aria-hidden="true" />
              </div>
            </div>

            <div className="book-detail__cover-actions">
              <button
                className={`book-detail__wish-btn ${wished ? 'book-detail__wish-btn--active' : ''}`}
                onClick={() => toggleWish({ ...book, title: book.book_name, cover: book.cover_image_url, price: currentPrice })}
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

          <div className="book-detail__info-col">
            <span className="book-detail__category">{category}</span>
            <h1 className="book-detail__title">{book.book_name}</h1>
            <p className="book-detail__author">
              লেখক: {book.author_id ? (
                <Link to={`/author/${book.author_id}`} className="book-detail__author-link">{book.author}</Link>
              ) : (
                <span className="book-detail__author-link">{book.author || 'অজ্ঞাত লেখক'}</span>
              )}
            </p>
            <p className="book-detail__publisher">প্রকাশক: <strong>{publisher}</strong></p>

            <div className="book-detail__rating" aria-label={`রেটিং ${rating}`}>
              <span className="book-detail__stars" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(rating) ? 'star--filled' : 'star--empty'} fill={i < Math.floor(rating) ? '#e8a020' : 'none'} />
                ))}
              </span>
              <strong>{rating}</strong>
              <span className="book-detail__review-count">({reviews.toLocaleString('bn-BD')} রিভিউ)</span>
            </div>

            <div className="book-detail__price-block">
              <strong className="book-detail__price">৳{currentPrice}</strong>
              {originalPrice && (
                <>
                  <s className="book-detail__original">৳{originalPrice}</s>
                  {discountPct && <span className="book-detail__discount-pill">{discountPct} ছাড়</span>}
                </>
              )}
            </div>

            <div className={`book-detail__stock ${inStock ? 'book-detail__stock--in' : 'book-detail__stock--out'}`}>
              {inStock ? '✓ স্টকে আছে' : '✗ স্টক নেই'}
            </div>

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
                disabled={!inStock || adding}
                aria-label="কার্টে যোগ করুন"
              >
                <ShoppingBag size={18} />
                {added ? 'কার্টে যোগ হয়েছে' : adding ? 'যোগ হচ্ছে...' : inCart ? 'কার্টে আছে' : 'কার্টে যোগ করুন'}
              </button>
            </div>

            {cartError && (
              <p style={{ color: 'var(--color-error, #c0392b)', marginTop: 'var(--space-2)', fontSize: '0.9rem' }}>
                {cartError}
              </p>
            )}

            <button className="book-detail__buy-now-btn" disabled={!inStock}
              onClick={() => {
                if (!authUser) { navigate('/login'); return; }
                navigate('/checkout', {
                  state: {
                    buyNow: {
                      book_id:       book.id,
                      book_name:     book.book_name,
                      cover_image_url: book.cover_image_url,
                      price_sold:    currentPrice,
                      quantity:      qty,
                    }
                  }
                });
              }}
            >
              এখনই কিনুন
            </button>

            <div className="book-detail__meta-grid">
              <div className="book-detail__meta-item">
                <span>ভাষা</span>
                <strong>{language}</strong>
              </div>
              <div className="book-detail__meta-item">
                <span>পৃষ্ঠা</span>
                <strong>{numPages}</strong>
              </div>
              <div className="book-detail__meta-item">
                <span>সংস্করণ</span>
                <strong>{edition}</strong>
              </div>
              <div className="book-detail__meta-item">
                <span>ISBN</span>
                <strong>{isbn}</strong>
              </div>
            </div>

            <div className="book-detail__desc">
              <h3>বই সম্পর্কে</h3>
              <p>{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}