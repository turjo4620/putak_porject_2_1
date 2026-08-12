import React, { useState, useEffect } from 'react';
import { api } from '../api/http';
import './account-dashboard.css';

// Status badge colours
const STATUS_COLORS = {
  Pending:    { bg: '#fff8e1', color: '#f59e0b' },
  Confirmed:  { bg: '#e8f5e9', color: '#16a34a' },
  Paid:       { bg: '#e8f5e9', color: '#16a34a' },
  Processing: { bg: '#e3f2fd', color: '#1d4ed8' },
  Shipped:    { bg: '#ede9fe', color: '#7c3aed' },
  Delivered:  { bg: '#d1fae5', color: '#065f46' },
  Cancelled:  { bg: '#fee2e2', color: '#dc2626' },
};

function statusStyle(status) {
  return STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#374151' };
}

// Tracking modal shown when user clicks "ট্র্যাক করুন"
function TrackingModal({ orderId, orderNumber, onClose }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    api.get(`/orders/${orderId}/tracking`)
      .then(d => setData(d))
      .catch(e => setError(e.message || 'ট্র্যাকিং তথ্য লোড করা যায়নি'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const delivery = data?.delivery;

  // Build a simple visual timeline
  const steps = [
    { key: 'ordered',    label: 'অর্ডার দেওয়া হয়েছে',  done: true },
    { key: 'confirmed',  label: 'নিশ্চিত করা হয়েছে',     done: ['Confirmed','Paid','Processing','Shipped','Delivered'].includes(data?.order?.status) },
    { key: 'dispatched', label: 'পাঠানো হয়েছে',           done: !!delivery?.dispatch_date },
    { key: 'shipped',    label: 'পথে আছে',                done: delivery?.status === 'Shipped' || delivery?.status === 'Delivered' },
    { key: 'delivered',  label: 'পৌঁছে গেছে',             done: !!delivery?.delivered_at },
  ];

  return (
    <div className="tracking-modal-backdrop" onClick={onClose}>
      <div className="tracking-modal" onClick={e => e.stopPropagation()}>
        <div className="tracking-modal__header">
          <h3>ট্র্যাকিং — Order #{orderNumber}</h3>
          <button className="tracking-modal__close" onClick={onClose} aria-label="বন্ধ করুন">✕</button>
        </div>

        {loading && <p className="tracking-modal__info">লোড হচ্ছে...</p>}
        {error   && <p className="tracking-modal__error">{error}</p>}

        {!loading && !error && (
          <>
            {/* Timeline */}
            <ul className="tracking-timeline">
              {steps.map((s, i) => (
                <li key={s.key} className={`tracking-step ${s.done ? 'tracking-step--done' : ''}`}>
                  <span className="tracking-step__dot" />
                  {i < steps.length - 1 && <span className="tracking-step__line" />}
                  <span className="tracking-step__label">{s.label}</span>
                </li>
              ))}
            </ul>

            {/* Delivery details */}
            {delivery ? (
              <table className="tracking-table">
                <tbody>
                  {delivery.tracking_no   && <tr><td>ট্র্যাকিং নম্বর</td><td><strong>{delivery.tracking_no}</strong></td></tr>}
                  {delivery.courier_name  && <tr><td>কুরিয়ার</td><td>{delivery.courier_name}</td></tr>}
                  {delivery.delivered_via && <tr><td>ডেলিভারি মাধ্যম</td><td>{delivery.delivered_via}</td></tr>}
                  {delivery.dispatch_date && <tr><td>প্রেরণের তারিখ</td><td>{new Date(delivery.dispatch_date).toLocaleDateString('bn-BD')}</td></tr>}
                  {delivery.est_date      && <tr><td>আনুমানিক ডেলিভারি</td><td>{new Date(delivery.est_date).toLocaleDateString('bn-BD')}</td></tr>}
                  {delivery.delivered_at  && <tr><td>ডেলিভারির তারিখ</td><td>{new Date(delivery.delivered_at).toLocaleDateString('bn-BD')}</td></tr>}
                  <tr><td>ডেলিভারি অবস্থা</td><td>{delivery.status || '—'}</td></tr>
                </tbody>
              </table>
            ) : (
              <p className="tracking-modal__info">এই অর্ডারটি এখনও প্রেরণ করা হয়নি। প্রস্তুত হলে ট্র্যাকিং তথ্য এখানে দেখা যাবে।</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const AccountOrders = () => {
  const [orders,  setOrders]  = useState([]);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [tab,     setTab]     = useState('all');

  // Tracking modal state
  const [trackingOrder, setTrackingOrder] = useState(null); // { order_id, order_number }

  useEffect(() => {
    api.get('/orders')
      .then(data => setOrders(data || []))
      .catch(err => setError(err.message || 'অর্ডার লোড করা যায়নি। ব্যাকএন্ড সার্ভার চালু আছে কিনা নিশ্চিত করুন।'))
      .finally(() => setLoading(false));
  }, []);

  // Tab filter map
  const TAB_STATUS = {
    all:        null,
    topay:      'Pending',
    processing: 'Processing',
    shipped:    'Shipped',
  };

  const filtered = orders.filter(o => {
    const matchTab    = !TAB_STATUS[tab] || o.status === TAB_STATUS[tab];
    const matchSearch = !search.trim() ||
      o.order_number?.toLowerCase().includes(search.trim().toLowerCase()) ||
      String(o.order_id).includes(search.trim());
    return matchTab && matchSearch;
  });

  const TABS = [
    { key: 'all',        label: 'সব অর্ডার' },
    { key: 'topay',      label: 'পেমেন্ট বাকি' },
    { key: 'processing', label: 'প্রসেসিং' },
    { key: 'shipped',    label: 'পাঠানো হয়েছে' },
  ];

  return (
    <div className="account-orders-section">
      {/* Header card: search + tabs */}
      <div className="orders-header card">
        <input
          type="text"
          placeholder="অর্ডার নম্বর দিয়ে খুঁজুন"
          className="search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="orders-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error   && <div className="card error-banner">{error}</div>}
      {loading && <div className="card">লোড হচ্ছে...</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          কোনো অর্ডার পাওয়া যায়নি।
        </div>
      )}

      {!loading && filtered.map(order => {
        const { bg, color } = statusStyle(order.status);
        return (
          <div key={order.order_id} className="card order-card">
            <div className="order-card-header">
              <span className="order-id">অর্ডার #{order.order_number}</span>
              <span
                className="order-status"
                style={{ background: bg, color, padding: '2px 10px', borderRadius: '999px', fontWeight: 600, fontSize: '0.82rem' }}
              >
                {order.status || 'Pending'}
              </span>
            </div>

            <div className="order-card-body">
              <p>
                <strong>অর্ডারের তারিখ:</strong>{' '}
                {new Date(order.order_date).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p>
                <strong>মোট পরিমাণ:</strong> ৳{Number(order.total_amount).toFixed(2)}
              </p>
            </div>

            <div className="order-card-footer" style={{ paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="track-btn"
                onClick={() => setTrackingOrder({ order_id: order.order_id, order_number: order.order_number })}
              >
                ট্র্যাক করুন
              </button>
            </div>
          </div>
        );
      })}

      {/* Tracking modal */}
      {trackingOrder && (
        <TrackingModal
          orderId={trackingOrder.order_id}
          orderNumber={trackingOrder.order_number}
          onClose={() => setTrackingOrder(null)}
        />
      )}
    </div>
  );
};

export default AccountOrders;
