import { useNavigate } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './account-dashboard.css'

const AccountWishlist = () => {
  const navigate = useNavigate()
  const { wishItems, toggleWish, addToCart, authUser } = useApp()

  const handleAddToCart = async (book) => {
    if (!authUser) { navigate('/login'); return }
    try {
      await addToCart(book)
    } catch (err) {
      alert(err.message || 'কার্টে যোগ করা যায়নি')
    }
  }

  return (
    <div className="account-wishlist-section">

      {/* Header banner */}
      <div className="wishlist-banner card">
        <span className="wishlist-banner__count">
          <Heart size={16} fill="currentColor" style={{ color: '#e53e3e', marginRight: '6px', verticalAlign: 'middle' }} />
          উইশলিস্টে <strong>{wishItems.length}</strong> টি বই আছে
        </span>
        <button className="wishlist-banner__shop" onClick={() => navigate('/')}>
          কেনাকাটা চালিয়ে যান
        </button>
      </div>

      {wishItems.length === 0 ? (
        /* Empty state */
        <div className="card wishlist-empty">
          <Heart size={52} opacity={0.15} />
          <p>আপনার উইশলিস্ট খালি।</p>
          <button className="wishlist-empty__btn" onClick={() => navigate('/')}>
            বই ব্রাউজ করুন
          </button>
        </div>
      ) : (
        /* Item grid */
        <div className="wishlist-grid">
          {wishItems.map((book) => (
            <div key={book.id} className="wishlist-card card">
              {/* Cover */}
              <div
                className="wishlist-card__cover"
                onClick={() => navigate(`/book/${book.id}`)}
                role="button"
                tabIndex={0}
                aria-label={book.title}
              >
                <img
                  src={book.cover || book.cover_image_url}
                  alt={book.title}
                  onError={e => { e.target.style.display = 'none' }}
                />
              </div>

              {/* Info */}
              <div className="wishlist-card__info">
                <strong
                  className="wishlist-card__title"
                  onClick={() => navigate(`/book/${book.id}`)}
                  role="button"
                  tabIndex={0}
                >
                  {book.title || book.book_name}
                </strong>
                <span className="wishlist-card__author">
                  {book.author || book.authors || ''}
                </span>
                <span className="wishlist-card__price">
                  ৳{book.price || book.discount_price || '—'}
                </span>
              </div>

              {/* Actions */}
              <div className="wishlist-card__actions">
                <button
                  className="wishlist-card__cart-btn"
                  onClick={() => handleAddToCart(book)}
                  aria-label="কার্টে যোগ করুন"
                >
                  কার্টে যোগ করুন
                </button>
                <button
                  className="wishlist-card__remove-btn"
                  onClick={() => toggleWish(book)}
                  aria-label="উইশলিস্ট থেকে সরান"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AccountWishlist
