import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './CheckoutPage.css'

export default function CheckoutPage() {
  const navigate  = useNavigate()
  const { cartItems, totalCartPrice, removeFromCart, placeOrder, authUser } = useApp()

  const [placing, setPlacing]           = useState(false)
  const [error, setError]               = useState('')

  // Coupon state
  const [couponInput, setCouponInput]   = useState('')
  const [couponApplied, setCouponApplied] = useState(null)   // { coupon_id, code, description, discount_value }
  const [discountAmount, setDiscountAmount] = useState(0)
  const [couponError, setCouponError]   = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const finalTotal = Math.max(0, totalCartPrice - discountAmount)

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponError('')
    setCouponLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), orderSubtotal: totalCartPrice }),
      })
      const data = await res.json()
      if (!data.success) {
        setCouponError(data.message)
        setCouponApplied(null)
        setDiscountAmount(0)
      } else {
        setCouponApplied(data.coupon)
        setDiscountAmount(data.discount_amount)
        setCouponError('')
      }
    } catch {
      setCouponError('কুপন যাচাই করতে সমস্যা হয়েছে')
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponApplied(null)
    setDiscountAmount(0)
    setCouponInput('')
    setCouponError('')
  }

  const handlePlaceOrder = async () => {
    if (!authUser) { navigate('/login'); return }
    setError('')
    try {
      setPlacing(true)
      const order = await placeOrder(null, couponApplied?.code || null)
      navigate(`/payment/${order.order_id}`)
    } catch (err) {
      setError(err.message || 'অর্ডার দিতে সমস্যা হয়েছে')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <p className="list-page__breadcrumb" style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)' }}>
          <Link to="/">হোম</Link> › চেকআউট
        </p>
        <h1 className="checkout-page__title">অর্ডার নিশ্চিত করুন</h1>

        {error && <p className="checkout-page__error">{error}</p>}

        {cartItems.length === 0 ? (
          <div className="checkout-page__empty">
            <p>কার্ট খালি। বই কিনতে হোমে ফিরুন।</p>
            <Link to="/" className="list-page__back-btn">হোমে ফিরুন</Link>
          </div>
        ) : (
          <div className="checkout-page__layout">

            {/* ── Items ── */}
            <div className="checkout-page__items">
              <h2>অর্ডার তালিকা ({cartItems.length})</h2>
              {cartItems.map((b) => (
                <div key={b.cart_item_id} className="checkout-item">
                  <img src={b.cover_image_url} alt={b.book_name} className="checkout-item__cover" />
                  <div className="checkout-item__info">
                    <strong><Link to={`/book/${b.book_id}`}>{b.book_name}</Link></strong>
                    <span>{b.authors}</span>
                    <span className="checkout-item__price">৳{b.locked_price}</span>
                  </div>
                  <button
                    className="checkout-item__remove"
                    onClick={() => removeFromCart(b.cart_item_id)}
                    aria-label="সরান"
                  >✕</button>
                </div>
              ))}
            </div>

            {/* ── Summary ── */}
            <div className="checkout-page__summary">
              <h2>অর্ডার সারসংক্ষেপ</h2>

              <div className="checkout-page__summary-row">
                <span>মোট বই</span>
                <span>{cartItems.length} টি</span>
              </div>
              <div className="checkout-page__summary-row">
                <span>উপমোট</span>
                <span>৳{totalCartPrice}</span>
              </div>

              {/* ── Coupon section ── */}
              {!couponApplied ? (
                <div className="checkout-coupon">
                  <div className="checkout-coupon__row">
                    <input
                      type="text"
                      className="checkout-coupon__input"
                      placeholder="প্রোমো কোড লিখুন"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    />
                    <button
                      className="checkout-coupon__btn"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                    >
                      {couponLoading ? '...' : 'প্রয়োগ'}
                    </button>
                  </div>
                  {couponError && <p className="checkout-coupon__error">{couponError}</p>}
                </div>
              ) : (
                <div className="checkout-coupon__applied">
                  <span>🎉 <strong>{couponApplied.code}</strong> — {couponApplied.description || `৳${couponApplied.discount_value} ছাড়`}</span>
                  <button className="checkout-coupon__remove" onClick={handleRemoveCoupon}>সরান</button>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="checkout-page__summary-row checkout-page__summary-discount">
                  <span>ছাড়</span>
                  <span>− ৳{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="checkout-page__summary-row">
                <span>ডেলিভারি</span>
                <span>বিনামূল্যে</span>
              </div>

              <div className="checkout-page__summary-total">
                <strong>মোট</strong>
                <strong>৳{finalTotal.toFixed(2)}</strong>
              </div>

              <button
                className="checkout-page__order-btn"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? 'অর্ডার দেওয়া হচ্ছে...' : 'অর্ডার দিন'}
              </button>
              <p className="checkout-page__note">
                বাংলাদেশের যেকোনো ঠিকানায় ৩-৫ কার্যদিবসে ডেলিভারি
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
