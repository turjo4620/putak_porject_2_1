import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import './CartPage.css'

export default function CartPage() {
  const navigate = useNavigate()
  const {
    cartItems, cartLoading, cartTotal,
    incrementItem, decrementItem, removeFromCart,
    placeOrder, authUser
  } = useApp()

  const [busyItemId, setBusyItemId] = useState(null)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  const guard = async (item, fn) => {
    try {
      setBusyItemId(item.cart_item_id)
      await fn()
    } catch (err) {
      setError(err.message || 'কিছু একটা সমস্যা হয়েছে')
    } finally {
      setBusyItemId(null)
    }
  }

  const handleIncrement = (item) => guard(item, () => incrementItem(item))
  const handleDecrement = (item) => guard(item, () => decrementItem(item))
  const handleRemove = (item) => guard(item, () => removeFromCart(item.cart_item_id))

  const handlePlaceOrder = async () => {
    if (!authUser) {
      navigate('/login')
      return
    }
    setError('')
    try {
      setPlacing(true)
      const order = await placeOrder()
      navigate(`/payment/${order.order_id}`)
    } catch (err) {
      setError(err.message || 'অর্ডার দিতে সমস্যা হয়েছে')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="cart-page">
      <div className="container">
        <p className="list-page__breadcrumb" style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)' }}>
          <Link to="/">হোম</Link> › কার্ট
        </p>
        <h1 className="cart-page__title">আপনার কার্ট</h1>

        {error && <p className="cart-page__error">{error}</p>}

        {cartLoading ? (
          <p>লোড হচ্ছে...</p>
        ) : cartItems.length === 0 ? (
          <div className="cart-page__empty">
            <p>কার্ট খালি। বই কিনতে হোমে ফিরুন।</p>
            <Link to="/" className="list-page__back-btn">হোমে ফিরুন</Link>
          </div>
        ) : (
          <div className="cart-page__layout">
            {/* Items */}
            <div className="cart-page__items">
              <h2>বইয়ের তালিকা ({cartItems.length})</h2>

              {cartItems.map((item) => {
                const busy = busyItemId === item.cart_item_id
                return (
                  <div key={item.cart_item_id} className="cart-item">
                    <img
                      src={item.cover_image_url}
                      alt={item.book_name}
                      className="cart-item__cover"
                    />

                    <div className="cart-item__info">
                      <strong>
                        <Link to={`/book/${item.book_id}`}>{item.book_name}</Link>
                      </strong>
                      <span>{item.authors}</span>
                      <span className="cart-item__price">৳{item.locked_price}</span>
                    </div>

                    <div className="cart-item__qty">
                      <button
                        onClick={() => handleDecrement(item)}
                        disabled={busy}
                        aria-label="পরিমাণ কমান"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="cart-item__qty-value">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrement(item)}
                        disabled={busy}
                        aria-label="পরিমাণ বাড়ান"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="cart-item__subtotal">
                      ৳{(item.locked_price * item.quantity).toFixed(2)}
                    </div>

                    <button
                      className="cart-item__remove"
                      onClick={() => handleRemove(item)}
                      disabled={busy}
                      aria-label="মুছে ফেলুন"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <div className="cart-page__summary">
              <h2>অর্ডার সারসংক্ষেপ</h2>
              <div className="cart-page__summary-row">
                <span>মোট বই</span>
                <span>{cartItems.reduce((s, i) => s + i.quantity, 0)} টি</span>
              </div>
              <div className="cart-page__summary-row">
                <span>উপমোট</span>
                <span>৳{cartTotal.toFixed(2)}</span>
              </div>
              <div className="cart-page__summary-row">
                <span>ডেলিভারি</span>
                <span>বিনামূল্যে</span>
              </div>
              <div className="cart-page__summary-total">
                <strong>মোট</strong>
                <strong>৳{cartTotal.toFixed(2)}</strong>
              </div>
              <button
                className="cart-page__order-btn"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? 'অর্ডার দেওয়া হচ্ছে...' : 'অর্ডার দিন'}
              </button>
              <p className="cart-page__note">
                বাংলাদেশের যেকোনো ঠিকানায় ৩-৫ কার্যদিবসে ডেলিভারি
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
