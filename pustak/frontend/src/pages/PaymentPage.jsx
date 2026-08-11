import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api/http'
import './PaymentPage.css'

const METHODS = [
  { id: 'card', label: 'কার্ড পেমেন্ট' },
  { id: 'mfs', label: 'মোবাইল ব্যাংকিং (bKash/Nagad/Rocket)' },
  { id: 'cod', label: 'ক্যাশ অন ডেলিভারি' },
]

export default function PaymentPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [method, setMethod] = useState('cod')
  const [form, setForm] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    api.get(`/orders/${orderId}`)
      .then((data) => setOrder(data.order))
      .catch((err) => setLoadError(err.message || 'অর্ডার লোড করা যায়নি'))
  }, [orderId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post(`/payments/${orderId}`, { method, ...form })
      navigate('/account/orders')
    } catch (err) {
      setError(err.message || 'পেমেন্ট সম্পন্ন করা যায়নি')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="payment-page">
      <div className="container">
        <p className="list-page__breadcrumb" style={{ marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)' }}>
          <Link to="/">হোম</Link> › <Link to="/cart">কার্ট</Link> › পেমেন্ট
        </p>
        <h1 className="payment-page__title">পেমেন্ট করুন</h1>

        {loadError && <p className="payment-page__error">{loadError}</p>}

        {order && (
          <div className="payment-page__layout">
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
                    {m.label}
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

              {method === 'cod' && (
                <p className="payment-page__note">ডেলিভারির সময় পণ্য বুঝে নিয়ে ক্যাশ পরিশোধ করুন।</p>
              )}

              <button type="submit" className="payment-page__pay-btn" disabled={submitting}>
                {submitting ? 'প্রসেস হচ্ছে...' : 'পেমেন্ট নিশ্চিত করুন'}
              </button>
            </form>

            <div className="payment-page__summary">
              <h2>অর্ডার সারসংক্ষেপ</h2>
              <div className="payment-page__summary-row">
                <span>অর্ডার নম্বর</span>
                <span>{order.order_number}</span>
              </div>
              <div className="payment-page__summary-row">
                <span>স্ট্যাটাস</span>
                <span>{order.status}</span>
              </div>
              <div className="payment-page__summary-total">
                <strong>পরিশোধযোগ্য</strong>
                <strong>৳{order.total_amount}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
