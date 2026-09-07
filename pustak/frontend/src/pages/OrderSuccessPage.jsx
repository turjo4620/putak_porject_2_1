import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, Copy, Check, MapPin, Package } from 'lucide-react'
import { api } from '../api/http'
import './OrderSuccessPage.css'

// ── Bengali helpers ─────────────────────────────────────────────────────────
const toBn   = (n) => String(n).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[d])
const fmtAmt = (n) => toBn(Number(n).toFixed(2))

// ── Payment method label ────────────────────────────────────────────────────
function methodLabel(method, providerName, cardBrand, cardLast4) {
  if (method === 'cod')  return 'ক্যাশ অন ডেলিভারি'
  if (method === 'mfs')  return providerName ? `${providerName} — সফল` : 'মোবাইল ব্যাংকিং — সফল'
  if (method === 'card') {
    const brand = cardBrand || 'কার্ড'
    return cardLast4 ? `${brand} (****${cardLast4}) — সফল` : `${brand} — সফল`
  }
  return 'পেমেন্ট সম্পন্ন'
}

// ── Address single line ─────────────────────────────────────────────────────
function formatAddress(addr) {
  if (!addr) return null
  return [addr.street, addr.area, addr.district, addr.division, addr.postal_code]
    .filter(Boolean).join(', ')
}

export default function OrderSuccessPage() {
  const { orderId } = useParams()
  const location    = useLocation()
  const navigate    = useNavigate()

  // State passed from PaymentPage (fastest path — no extra fetch needed)
  const passed = location.state || {}

  const [order,   setOrder]   = useState(passed.order   || null)
  const [items,   setItems]   = useState(passed.items   || [])
  const [address, setAddress] = useState(passed.address || null)
  const [payment, setPayment] = useState(null)  // enriched from API
  const [loading, setLoading] = useState(!passed.order)
  const [copied,  setCopied]  = useState(false)

  // method info from navigation state (before API confirms)
  const passedMethod      = passed.method      || null
  const passedProvider    = passed.providerName || null
  const passedCardBrand   = passed.cardBrand   || null
  const passedCardLast4   = passed.cardLast4   || null

  // Always fetch fresh data so the address + payment fields are populated
  // even if user lands here directly via URL
  useEffect(() => {
    api.get(`/orders/${orderId}`)
      .then(data => {
        setOrder(data.order)
        setItems(data.items   || [])
        setAddress(data.address || null)
        setPayment(data.payment || null)
      })
      .catch(() => {}) // keep passed state as fallback
      .finally(() => setLoading(false))
  }, [orderId])

  const handleCopy = () => {
    if (!order?.order_number) return
    navigator.clipboard.writeText(order.order_number).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  // Resolve method: prefer API-confirmed data, fall back to passed state
  const resolvedMethod   = payment?.method        || passedMethod
  const resolvedProvider = payment?.provider_name || passedProvider
  const resolvedBrand    = payment?.card_brand     || passedCardBrand
  const resolvedLast4    = payment?.card_last_4_digits || passedCardLast4

  const addrLine = formatAddress(address)

  if (loading) {
    return (
      <div className="ospage">
        <div className="container ospage__center">
          <div className="ospage__spinner" aria-label="লোড হচ্ছে" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="ospage">
        <div className="container ospage__center">
          <p className="ospage__err">অর্ডারের তথ্য পাওয়া যায়নি।</p>
          <Link to="/" className="ospage__btn ospage__btn--outline">হোমে ফিরুন</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="ospage">
      <div className="container">
        <div className="ospage__card">

          {/* ── Hero: checkmark + heading ── */}
          <div className="ospage__hero">
            <div className="ospage__check-ring" aria-hidden="true">
              <CheckCircle size={52} strokeWidth={1.6} className="ospage__check-icon" />
            </div>
            <h1 className="ospage__heading">ধন্যবাদ!</h1>
            <p className="ospage__subheading">আপনার অর্ডারটি গ্রহণ করা হয়েছে</p>
          </div>

          {/* ── Order ID + delivery estimate ── */}
          <div className="ospage__id-block">
            <div className="ospage__id-row">
              <span className="ospage__id-label">অর্ডার নম্বর</span>
              <div className="ospage__id-value-wrap">
                <span className="ospage__id-value">#{order.order_number}</span>
                <button
                  className="ospage__copy-btn"
                  onClick={handleCopy}
                  title="অর্ডার নম্বর কপি করুন"
                  aria-label="অর্ডার নম্বর কপি করুন"
                >
                  {copied
                    ? <Check size={14} className="ospage__copy-icon ospage__copy-icon--done" />
                    : <Copy size={14} className="ospage__copy-icon" />
                  }
                  <span className="ospage__copy-tip">{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                </button>
              </div>
            </div>
            <p className="ospage__eta">
              <Package size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
              ২–৫ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন হবে
            </p>
          </div>

          {/* ── Order recap card ── */}
          <div className="ospage__recap">

            {/* Items */}
            {items.length > 0 && (
              <div className="ospage__items">
                {items.map((item, i) => (
                  <div key={i} className="ospage__item">
                    <div className="ospage__item-thumb-wrap">
                      {item.cover_image_url
                        ? <img src={item.cover_image_url} alt={item.book_name} className="ospage__item-thumb" />
                        : <div className="ospage__item-thumb-placeholder" />
                      }
                    </div>
                    <div className="ospage__item-info">
                      <span className="ospage__item-title">{item.book_name}</span>
                      {item.author && (
                        <span className="ospage__item-author">{item.author}</span>
                      )}
                      <span className="ospage__item-meta">
                        ×{toBn(item.quantity)}
                        {item.line_total && (
                          <span className="ospage__item-price"> · ৳{fmtAmt(item.line_total)}</span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="ospage__divider" />

            {/* Payment method */}
            <div className="ospage__meta-row">
              <span className="ospage__meta-label">পেমেন্ট পদ্ধতি</span>
              <span className="ospage__meta-value">
                {methodLabel(resolvedMethod, resolvedProvider, resolvedBrand, resolvedLast4)}
              </span>
            </div>

            {/* Delivery address */}
            {addrLine && (
              <div className="ospage__meta-row">
                <span className="ospage__meta-label">
                  <MapPin size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  ডেলিভারি ঠিকানা
                </span>
                <span className="ospage__meta-value ospage__meta-value--addr">{addrLine}</span>
              </div>
            )}

            <div className="ospage__divider" />

            {/* Total */}
            <div className="ospage__total-row">
              <span className="ospage__total-label">
                {resolvedMethod === 'cod' ? 'পরিশোধযোগ্য' : 'মোট পরিশোধিত'}
              </span>
              <span className="ospage__total-value">৳{fmtAmt(order.total_amount)}</span>
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div className="ospage__actions">
            <Link to="/" className="ospage__btn ospage__btn--outline">
              আরও বই দেখুন
            </Link>
            <Link to="/account/orders" className="ospage__btn ospage__btn--primary">
              অর্ডার ট্র্যাক করুন
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
