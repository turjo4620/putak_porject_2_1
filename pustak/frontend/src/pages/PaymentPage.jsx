import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api/http'
import { useApp } from '../context/AppContext'
import './PaymentPage.css'

// ── Bengali numeral helper ──────────────────────────────────────
const toBn = (n) => String(n).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[d])
const formatBnAmount = (num) => toBn(Number(num).toFixed(2))

// ── Status badge localisation ──────────────────────────────────
const STATUS_MAP = {
  pending:    'অপেক্ষমাণ',
  processing: 'প্রক্রিয়াধীন',
  shipped:    'শিপড',
  delivered:  'ডেলিভার্ড',
  cancelled:  'বাতিল',
}

// ── Payment method definitions with inline SVG icons ──────────
const METHODS = [
  {
    id: 'card',
    label: 'কার্ড পেমেন্ট',
    group: 'কার্ড',
    icons: [
      // Visa
      <svg key="visa" viewBox="0 0 48 16" width="42" height="14" aria-label="Visa">
        <rect width="48" height="16" rx="3" fill="#1A1F71"/>
        <text x="4" y="12" fontFamily="Arial" fontSize="11" fontWeight="bold" fill="#fff" letterSpacing="1">VISA</text>
      </svg>,
      // Mastercard
      <svg key="mc" viewBox="0 0 38 24" width="32" height="20" aria-label="Mastercard">
        <circle cx="13" cy="12" r="11" fill="#EB001B"/>
        <circle cx="25" cy="12" r="11" fill="#F79E1B"/>
        <path d="M19 4.8a11 11 0 0 1 0 14.4A11 11 0 0 1 19 4.8z" fill="#FF5F00"/>
      </svg>,
    ],
  },
  {
    id: 'mfs',
    label: 'মোবাইল ব্যাংকিং',
    group: 'মোবাইল ব্যাংকিং',
    icons: [
      // bKash
      <svg key="bkash" viewBox="0 0 48 20" width="42" height="18" aria-label="bKash">
        <rect width="48" height="20" rx="4" fill="#E2136E"/>
        <text x="6" y="14" fontFamily="Arial" fontSize="9" fontWeight="bold" fill="#fff">bKash</text>
      </svg>,
      // Nagad
      <svg key="nagad" viewBox="0 0 48 20" width="42" height="18" aria-label="Nagad">
        <rect width="48" height="20" rx="4" fill="#F05A28"/>
        <text x="6" y="14" fontFamily="Arial" fontSize="9" fontWeight="bold" fill="#fff">Nagad</text>
      </svg>,
      // Rocket
      <svg key="rocket" viewBox="0 0 52 20" width="46" height="18" aria-label="Rocket">
        <rect width="52" height="20" rx="4" fill="#8b08a2"/>
        <text x="6" y="14" fontFamily="Arial" fontSize="9" fontWeight="bold" fill="#fff">Rocket</text>
      </svg>,
    ],
  },
  {
    id: 'cod',
    label: 'ক্যাশ অন ডেলিভারি',
    group: 'ক্যাশ',
    icons: [
      <svg key="cash" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" aria-label="Cash">
        <rect x="2" y="6" width="20" height="13" rx="2"/>
        <circle cx="12" cy="12.5" r="3"/>
        <path d="M6 9.5h.01M18 9.5h.01"/>
      </svg>,
    ],
  },
]

export default function PaymentPage() {
  const { orderId } = useParams()
  const navigate    = useNavigate()
  const { fetchCart } = useApp()

  const [order, setOrder]         = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [method, setMethod]       = useState('cod')
  const [form, setForm]           = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')
  const [loadError, setLoadError] = useState('')
  const [copied, setCopied]       = useState(false)

  useEffect(() => {
    api.get(`/orders/${orderId}`)
      .then((data) => {
        setOrder(data.order)
        setOrderItems(data.items || [])
      })
      .catch((err) => setLoadError(err.message || 'অর্ডার লোড করা যায়নি'))
  }, [orderId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post(`/payments/${orderId}`, { method, ...form })
      await fetchCart()  // now refresh cart from DB — it's empty after order was placed
      navigate('/account/orders')
    } catch (err) {
      setError(err.message || 'পেমেন্ট সম্পন্ন করা যায়নি')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopyOrderId = () => {
    if (!order) return
    navigator.clipboard.writeText(order.order_number).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Dynamic CTA label
  const ctaLabel = submitting
    ? 'প্রসেস হচ্ছে...'
    : method === 'cod'
      ? 'অর্ডার কনফার্ম করুন'
      : order
        ? `৳${formatBnAmount(order.total_amount)} পরিশোধ করুন`
        : 'পেমেন্ট নিশ্চিত করুন'

  return (
    <div className="payment-page">
      <div className="container">

        {/* Breadcrumb with top spacing to avoid nav overlap */}
        <p className="payment-page__breadcrumb">
          <Link to="/">হোম</Link>
          <span> › </span>
          <Link to="/cart">কার্ট</Link>
          <span> › </span>
          <span>পেমেন্ট</span>
        </p>

        <h1 className="payment-page__title">পেমেন্ট করুন</h1>

        {loadError && <p className="payment-page__error">{loadError}</p>}

        {order && (
          <div className="payment-page__layout">

            {/* ── Left: Payment form ── */}
            <form onSubmit={handleSubmit} className="payment-page__form">
              {error && <p className="payment-page__error">{error}</p>}

              <h2>পেমেন্ট পদ্ধতি বেছে নিন</h2>
              <div className="payment-page__methods">
                {METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`payment-method ${method === m.id ? 'payment-method--active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={m.id}
                      checked={method === m.id}
                      onChange={() => { setMethod(m.id); setForm({}) }}
                    />
                    <div className="payment-method__body">
                      <div className="payment-method__top">
                        <span className="payment-method__label">{m.label}</span>
                        <div className="payment-method__icons">{m.icons}</div>
                      </div>

                      {/* COD helper text inside the card */}
                      {m.id === 'cod' && method === 'cod' && (
                        <p className="payment-method__cod-note">
                          ডেলিভারির সময় পণ্য বুঝে নিয়ে ক্যাশ পরিশোধ করুন।
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {method === 'mfs' && (
                <div className="payment-page__fields">
                  <input
                    placeholder="প্রোভাইডার (bKash / Nagad / Rocket)"
                    required
                    value={form.providerName || ''}
                    onChange={(e) => setForm((f) => ({ ...f, providerName: e.target.value }))}
                  />
                  <input
                    placeholder="প্রেরকের মোবাইল নম্বর"
                    required
                    value={form.mobileNo || ''}
                    onChange={(e) => setForm((f) => ({ ...f, mobileNo: e.target.value }))}
                  />
                </div>
              )}

              {method === 'card' && (
                <div className="payment-page__fields">
                  <input
                    placeholder="কার্ড ব্র্যান্ড (Visa / MasterCard)"
                    required
                    value={form.cardBrand || ''}
                    onChange={(e) => setForm((f) => ({ ...f, cardBrand: e.target.value }))}
                  />
                  <input
                    placeholder="কার্ড নম্বরের শেষ ৪ ডিজিট"
                    required
                    maxLength={4}
                    value={form.cardLast4 || ''}
                    onChange={(e) => setForm((f) => ({ ...f, cardLast4: e.target.value.replace(/\D/g, '') }))}
                  />
                  <input
                    placeholder="ব্যাংকের নাম"
                    required
                    value={form.bankName || ''}
                    onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
                  />
                </div>
              )}

              <button type="submit" className="payment-page__pay-btn" disabled={submitting}>
                {ctaLabel}
              </button>
            </form>

            {/* ── Right: Order summary ── */}
            <div className="payment-page__summary">
              <h2>অর্ডার সারসংক্ষেপ</h2>

              {/* Order number with copy */}
              <div className="payment-page__summary-row">
                <span>অর্ডার নম্বর</span>
                <div className="payment-page__order-id">
                  <span className="payment-page__order-id-text">{order.order_number}</span>
                  <button
                    type="button"
                    className="payment-page__copy-btn"
                    onClick={handleCopyOrderId}
                    title="কপি করুন"
                    aria-label="অর্ডার নম্বর কপি করুন"
                  >
                    {copied ? (
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="2,8 6,12 14,4"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="5" y="5" width="9" height="10" rx="1.5"/>
                        <path d="M11 5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Status badge */}
              <div className="payment-page__summary-row">
                <span>স্ট্যাটাস</span>
                <span className={`payment-page__status-badge payment-page__status-badge--${order.status}`}>
                  {STATUS_MAP[order.status] || order.status}
                </span>
              </div>

              {/* Item previews */}
              {orderItems.length > 0 && (
                <div className="payment-page__items-preview">
                  {orderItems.map((item, i) => (
                    <div key={i} className="payment-page__item-row">
                      <span className="payment-page__item-name">{item.book_name || item.title}</span>
                      <span className="payment-page__item-qty">×{toBn(item.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="payment-page__summary-total">
                <strong>পরিশোধযোগ্য</strong>
                <strong>৳{formatBnAmount(order.total_amount)}</strong>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
