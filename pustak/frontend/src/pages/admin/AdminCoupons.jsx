import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, Copy, Check, Ticket, AlertCircle } from 'lucide-react';
import '../../styles/admin.css';

// ── API helpers ──────────────────────────────────────────────────────────────
const BASE = 'http://localhost:5000/api';

async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(opts.headers || {}),
    },
  });
  const body = res.status === 204 ? null : await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || `HTTP ${res.status}`);
  return body;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function derivedStatus(coupon) {
  const now = new Date();
  if (!coupon.is_active) return 'inactive';
  if (coupon.end_date && new Date(coupon.end_date) < now) return 'expired';
  if (coupon.start_date && new Date(coupon.start_date) > now) return 'scheduled';
  return 'active';
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function discountLabel(c) {
  if (!c) return '—';
  if (c.discount_type === 'percentage') {
    return c.max_discount
      ? `${c.discount_value}% (max ৳${c.max_discount})`
      : `${c.discount_value}%`;
  }
  return `৳${c.discount_value}`;
}

const STATUS_META = {
  active:    { label: 'Active',    badge: 'coupon-badge coupon-badge--active' },
  inactive:  { label: 'Inactive',  badge: 'coupon-badge coupon-badge--inactive' },
  expired:   { label: 'Expired',   badge: 'coupon-badge coupon-badge--expired' },
  scheduled: { label: 'Scheduled', badge: 'coupon-badge coupon-badge--scheduled' },
};

// ── Empty form ───────────────────────────────────────────────────────────────
const BLANK = {
  code: '', description: '',
  discount_type: 'percentage', discount_value: '',
  max_discount: '', min_order_amount: '',
  usage_limit: '', per_user_limit: '1',
  start_date: '', end_date: '',
  is_active: true,
};

// ════════════════════════════════════════════════════════════════════════════
// CopyBtn
// ════════════════════════════════════════════════════════════════════════════
function CopyBtn({ text }) {
  const [done, setDone] = useState(false);
  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    });
  };
  return (
    <button className="coupon-copy-btn" onClick={copy} title="Copy code" aria-label="Copy coupon code">
      {done ? <Check size={11} /> : <Copy size={11} />}
    </button>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CouponModal  (Add / Edit)
// ════════════════════════════════════════════════════════════════════════════
function CouponModal({ coupon, onClose, onSuccess }) {
  const isEdit = Boolean(coupon);

  const [form, setForm] = useState(() =>
    isEdit ? {
      code:             coupon.code            ?? '',
      description:      coupon.description     ?? '',
      discount_type:    coupon.discount_type   ?? 'percentage',
      discount_value:   coupon.discount_value  != null ? String(coupon.discount_value)  : '',
      max_discount:     coupon.max_discount    != null ? String(coupon.max_discount)    : '',
      min_order_amount: coupon.min_order_amount != null ? String(coupon.min_order_amount) : '',
      usage_limit:      coupon.usage_limit     != null ? String(coupon.usage_limit)     : '',
      per_user_limit:   coupon.per_user_limit  != null ? String(coupon.per_user_limit)  : '1',
      start_date:       coupon.start_date ? coupon.start_date.slice(0, 10) : '',
      end_date:         coupon.end_date   ? coupon.end_date.slice(0, 10)   : '',
      is_active:        coupon.is_active  !== false,
    } : { ...BLANK }
  );

  const [errors,    setErrors]    = useState({});
  const [saving,    setSaving]    = useState(false);
  const [serverErr, setServerErr] = useState('');

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: '' }));
  };

  // ── Client-side validation ──────────────────────────────────────────────
  function validate() {
    const e = {};
    const cleaned = form.code.trim().toUpperCase();

    if (!cleaned)
      e.code = 'Coupon code is required.';
    else if (!/^[A-Z0-9_-]{3,32}$/.test(cleaned))
      e.code = 'Code must be 3–32 chars using A–Z, 0–9, - or _.';

    const val = Number(form.discount_value);
    if (!form.discount_value || val <= 0)
      e.discount_value = 'Enter a positive value.';
    else if (form.discount_type === 'percentage' && val > 100)
      e.discount_value = 'Percentage cannot exceed 100.';

    if (form.max_discount && Number(form.max_discount) <= 0)
      e.max_discount = 'Must be positive.';
    if (form.min_order_amount !== '' && Number(form.min_order_amount) < 0)
      e.min_order_amount = 'Cannot be negative.';
    if (form.usage_limit !== '' && Number(form.usage_limit) < 1)
      e.usage_limit = 'Must be at least 1.';
    if (!form.per_user_limit || Number(form.per_user_limit) < 1)
      e.per_user_limit = 'Must be at least 1.';
    if (form.start_date && form.end_date && form.end_date <= form.start_date)
      e.end_date = 'End date must be after start date.';

    setErrors(e);
    return !Object.keys(e).length;
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setServerErr('');
    setSaving(true);

    const payload = {
      code:             form.code.trim().toUpperCase(),
      description:      form.description.trim() || null,
      discount_type:    form.discount_type,
      discount_value:   Number(form.discount_value),
      max_discount:     form.max_discount     ? Number(form.max_discount)     : null,
      min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : 0,
      usage_limit:      form.usage_limit      ? Number(form.usage_limit)      : null,
      per_user_limit:   Number(form.per_user_limit),
      start_date:       form.start_date || null,
      end_date:         form.end_date   || null,
      is_active:        form.is_active,
    };

    try {
      if (isEdit) {
        await apiFetch(`/coupons/admin/${coupon.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiFetch('/coupons/admin', { method: 'POST', body: JSON.stringify(payload) });
      }
      onSuccess(`Coupon "${payload.code}" ${isEdit ? 'updated' : 'created'} successfully.`);
    } catch (err) {
      setServerErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 660 }} onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2>{isEdit ? 'Edit Coupon' : 'Add New Coupon'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-form">

            {serverErr && (
              <div className="coupon-server-err">
                <AlertCircle size={15} />
                <span>{serverErr}</span>
              </div>
            )}

            {/* Code */}
            <div className="form-group">
              <label>Coupon Code *</label>
              <input
                type="text"
                value={form.code}
                onChange={e => set('code', e.target.value.toUpperCase().replace(/\s/g, ''))}
                placeholder="e.g. SUMMER25"
                maxLength={32}
                className={errors.code ? 'input-error' : ''}
                style={{ fontFamily: 'monospace', letterSpacing: '0.06em', fontWeight: 700 }}
              />
              {errors.code && <span className="coupon-field-err">{errors.code}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description (optional)</label>
              <input
                type="text"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Short note shown to customer on apply"
              />
            </div>

            {/* Discount type + value */}
            <div className="form-row">
              <div className="form-group">
                <label>Discount Type *</label>
                <select
                  value={form.discount_type}
                  onChange={e => { set('discount_type', e.target.value); set('max_discount', ''); }}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (৳)</option>
                </select>
              </div>
              <div className="form-group">
                <label>{form.discount_type === 'percentage' ? 'Percentage (%) *' : 'Amount (৳) *'}</label>
                <input
                  type="number"
                  min="0.01" step="0.01"
                  max={form.discount_type === 'percentage' ? 100 : undefined}
                  value={form.discount_value}
                  onChange={e => set('discount_value', e.target.value)}
                  placeholder={form.discount_type === 'percentage' ? 'e.g. 20' : 'e.g. 100'}
                  className={errors.discount_value ? 'input-error' : ''}
                />
                {errors.discount_value && <span className="coupon-field-err">{errors.discount_value}</span>}
              </div>
            </div>

            {/* Max discount cap — percentage only */}
            {form.discount_type === 'percentage' && (
              <div className="form-group">
                <label>Max Discount Cap (৳) — optional</label>
                <input
                  type="number"
                  min="1" step="1"
                  value={form.max_discount}
                  onChange={e => set('max_discount', e.target.value)}
                  placeholder="e.g. 500 — leave blank for no cap"
                  className={errors.max_discount ? 'input-error' : ''}
                />
                {errors.max_discount && <span className="coupon-field-err">{errors.max_discount}</span>}
              </div>
            )}

            {/* Min order + global limit */}
            <div className="form-row">
              <div className="form-group">
                <label>Minimum Order Amount (৳)</label>
                <input
                  type="number"
                  min="0" step="1"
                  value={form.min_order_amount}
                  onChange={e => set('min_order_amount', e.target.value)}
                  placeholder="0 = no minimum"
                  className={errors.min_order_amount ? 'input-error' : ''}
                />
                {errors.min_order_amount && <span className="coupon-field-err">{errors.min_order_amount}</span>}
              </div>
              <div className="form-group">
                <label>Global Usage Limit</label>
                <input
                  type="number"
                  min="1" step="1"
                  value={form.usage_limit}
                  onChange={e => set('usage_limit', e.target.value)}
                  placeholder="blank = unlimited"
                  className={errors.usage_limit ? 'input-error' : ''}
                />
                {errors.usage_limit && <span className="coupon-field-err">{errors.usage_limit}</span>}
              </div>
            </div>

            {/* Per-user limit */}
            <div className="form-row">
              <div className="form-group">
                <label>Per-User Limit *</label>
                <input
                  type="number"
                  min="1" step="1"
                  value={form.per_user_limit}
                  onChange={e => set('per_user_limit', e.target.value)}
                  placeholder="e.g. 1"
                  className={errors.per_user_limit ? 'input-error' : ''}
                />
                {errors.per_user_limit && <span className="coupon-field-err">{errors.per_user_limit}</span>}
              </div>
            </div>

            {/* Date range */}
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={e => set('start_date', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End Date (Expiry)</label>
                <input
                  type="date"
                  value={form.end_date}
                  min={form.start_date || undefined}
                  onChange={e => set('end_date', e.target.value)}
                  className={errors.end_date ? 'input-error' : ''}
                />
                {errors.end_date && <span className="coupon-field-err">{errors.end_date}</span>}
              </div>
            </div>

            {/* Active toggle */}
            <div className="form-group">
              <label>Status</label>
              <div className="coupon-toggle-row">
                <span className="coupon-toggle-hint">
                  {form.is_active ? 'Active — customers can use this coupon' : 'Inactive — coupon is disabled'}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.is_active}
                  className={`coupon-toggle ${form.is_active ? 'coupon-toggle--on' : ''}`}
                  onClick={() => set('is_active', !form.is_active)}
                >
                  <span className="coupon-toggle-thumb" />
                </button>
              </div>
            </div>

          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit"  className="btn-primary"   disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// AdminCoupons — main page
// ════════════════════════════════════════════════════════════════════════════
export default function AdminCoupons() {
  const [coupons,      setCoupons]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal,    setShowModal]    = useState(false);
  const [editing,      setEditing]      = useState(null);
  const [toast,        setToast]        = useState('');

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const data = await apiFetch(`/coupons/admin?${params}`);
      setCoupons(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error('Fetch coupons:', err);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleDelete = async (c) => {
    if (!confirm(`Delete coupon "${c.code}"? This cannot be undone.`)) return;
    try {
      await apiFetch(`/coupons/admin/${c.id}`, { method: 'DELETE' });
      showToast(`Coupon "${c.code}" deleted.`);
      fetchCoupons();
    } catch (err) {
      alert(err.message || 'Delete failed.');
    }
  };

  const handleToggle = async (c) => {
    try {
      await apiFetch(`/coupons/admin/${c.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...c, is_active: !c.is_active }),
      });
      showToast(`"${c.code}" ${c.is_active ? 'deactivated' : 'activated'}.`);
      fetchCoupons();
    } catch (err) {
      alert(err.message || 'Toggle failed.');
    }
  };

  const openCreate = ()  => { setEditing(null); setShowModal(true); };
  const openEdit   = (c) => { setEditing(c);    setShowModal(true); };
  const closeModal = ()  => { setShowModal(false); setEditing(null); };
  const onSuccess  = (msg) => { closeModal(); fetchCoupons(); showToast(msg); };

  // ── Summary counts ────────────────────────────────────────────────────────
  const counts = coupons.reduce((acc, c) => {
    const s = derivedStatus(c);
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="admin-page">

      {/* ── Toast ── */}
      {toast && <div className="coupon-toast" role="status">{toast}</div>}

      {/* ── Header ── */}
      <div className="admin-header">
        <div>
          <h1>Coupon Management</h1>
          <p className="admin-subtitle">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''} total</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add New Coupon
        </button>
      </div>

      {/* ── Stats bar ── */}
      {!loading && coupons.length > 0 && (
        <div className="coupon-stats-bar">
          {['active','scheduled','inactive','expired'].map(s =>
            (counts[s] || 0) > 0 && (
              <button
                key={s}
                className={`coupon-stat coupon-stat--${s}${statusFilter === s ? ' coupon-stat--selected' : ''}`}
                onClick={() => setStatusFilter(prev => prev === s ? 'all' : s)}
              >
                <span className="coupon-stat__n">{counts[s]}</span>
                <span className="coupon-stat__l">{STATUS_META[s].label}</span>
              </button>
            )
          )}
        </div>
      )}

      {/* ── Filters ── */}
      <div className="admin-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by coupon code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="scheduled">Scheduled</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="admin-loading">Loading coupons…</div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Max Cap</th>
                <th>Usage</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={9} className="no-data">
                    {search || statusFilter !== 'all'
                      ? 'No coupons match the current filters.'
                      : 'No coupons yet — create your first one!'}
                  </td>
                </tr>
              ) : coupons.map(c => {
                const st   = derivedStatus(c);
                const meta = STATUS_META[st];
                const usageLimit = c.usage_limit != null ? c.usage_limit : '∞';
                const usedCount  = c.usage_count ?? 0;
                const usageFull  = c.usage_limit != null && usedCount >= c.usage_limit;

                return (
                  <tr key={c.id} className={st === 'expired' ? 'hidden-row' : ''}>

                    {/* Code */}
                    <td>
                      <div className="coupon-code-cell">
                        <span className="coupon-code-text">{c.code}</span>
                        <CopyBtn text={c.code} />
                      </div>
                      {c.description && (
                        <div className="coupon-desc">{c.description}</div>
                      )}
                    </td>

                    {/* Discount */}
                    <td style={{ whiteSpace: 'nowrap' }}>{discountLabel(c)}</td>

                    {/* Min order */}
                    <td>{c.min_order_amount > 0 ? `৳${c.min_order_amount}` : '—'}</td>

                    {/* Max cap */}
                    <td>
                      {c.discount_type === 'percentage' && c.max_discount
                        ? `৳${c.max_discount}`
                        : '—'}
                    </td>

                    {/* Usage */}
                    <td>
                      <span className={`coupon-usage${usageFull ? ' coupon-usage--full' : ''}`}>
                        {usedCount} / {usageLimit}
                      </span>
                    </td>

                    {/* Expiry */}
                    <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(c.end_date)}</td>

                    {/* Status badge */}
                    <td><span className={meta.badge}>{meta.label}</span></td>

                    {/* Active toggle */}
                    <td>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={c.is_active}
                        className={`coupon-toggle coupon-toggle--sm ${c.is_active ? 'coupon-toggle--on' : ''}`}
                        onClick={() => handleToggle(c)}
                        disabled={st === 'expired'}
                        title={c.is_active ? 'Click to deactivate' : 'Click to activate'}
                      >
                        <span className="coupon-toggle-thumb" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="actions-cell">
                      <button
                        className="btn-icon"
                        onClick={() => openEdit(c)}
                        title="Edit"
                        aria-label={`Edit ${c.code}`}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn-icon danger"
                        onClick={() => handleDelete(c)}
                        title="Delete"
                        aria-label={`Delete ${c.code}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <CouponModal
          coupon={editing}
          onClose={closeModal}
          onSuccess={onSuccess}
        />
      )}

    </div>
  );
}
