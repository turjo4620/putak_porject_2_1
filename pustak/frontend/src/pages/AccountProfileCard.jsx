import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Check, X, Camera, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { api } from '../api/http'
import './account-dashboard.css'
import './AccountProfileCard.css'

// ── Small inline field editor ───────────────────────────────────────────────
function EditableField({ label, value, onSave, type = 'text', placeholder = '' }) {
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState(value || '')
  const [saving,  setSaving]  = useState(false)
  const [err,     setErr]     = useState('')
  const inputRef = useRef(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])
  useEffect(() => { setDraft(value || '') }, [value])

  const handleSave = async () => {
    if (draft === value) { setEditing(false); return }
    setSaving(true); setErr('')
    try {
      await onSave(draft)
      setEditing(false)
    } catch (e) {
      setErr(e.message || 'সংরক্ষণ করা যায়নি')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => { setDraft(value || ''); setErr(''); setEditing(false) }

  return (
    <div className="prof-field">
      <label className="prof-field__label">{label}</label>
      {editing ? (
        <div className="prof-field__edit-row">
          <input
            ref={inputRef}
            type={type}
            className="prof-field__input"
            value={draft}
            placeholder={placeholder}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
          />
          <button className="prof-icon-btn prof-icon-btn--save" onClick={handleSave} disabled={saving} aria-label="সংরক্ষণ করুন">
            <Check size={15} />
          </button>
          <button className="prof-icon-btn prof-icon-btn--cancel" onClick={handleCancel} aria-label="বাতিল">
            <X size={15} />
          </button>
        </div>
      ) : (
        <div className="prof-field__display-row">
          <span className="prof-field__value">{value || <em className="prof-field__empty">{placeholder || 'যোগ করা হয়নি'}</em>}</span>
          <button className="prof-icon-btn prof-icon-btn--edit" onClick={() => setEditing(true)} aria-label={`${label} সম্পাদনা করুন`}>
            <Pencil size={13} />
          </button>
        </div>
      )}
      {err && <p className="prof-field__err">{err}</p>}
    </div>
  )
}

// ── Password change section ─────────────────────────────────────────────────
function ChangePasswordSection({ onDone }) {
  const [open,    setOpen]    = useState(false)
  const [form,    setForm]    = useState({ current: '', next: '', confirm: '' })
  const [show,    setShow]    = useState({ current: false, next: false, confirm: false })
  const [saving,  setSaving]  = useState(false)
  const [err,     setErr]     = useState('')
  const [success, setSuccess] = useState('')

  const toggle = (field) => setShow(s => ({ ...s, [field]: !s[field] }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr(''); setSuccess('')
    if (form.next !== form.confirm) { setErr('নতুন পাসওয়ার্ড দুটি মিলছে না'); return }
    if (form.next.length < 8) { setErr('নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে'); return }
    setSaving(true)
    try {
      await api.post('/auth/change-password', { current_password: form.current, new_password: form.next })
      setSuccess('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।')
      setForm({ current: '', next: '', confirm: '' })
      setOpen(false)
      onDone?.()
    } catch (e) {
      setErr(e.message || 'পাসওয়ার্ড পরিবর্তন করা যায়নি')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="prof-section">
      <div className="prof-section__header" onClick={() => setOpen(o => !o)}>
        <span className="prof-section__title">পাসওয়ার্ড পরিবর্তন</span>
        <span className="prof-section__toggle">{open ? '▲' : '▼'}</span>
      </div>

      {success && <p className="prof-success">{success}</p>}

      {open && (
        <form className="prof-pass-form" onSubmit={handleSubmit}>
          {err && <p className="prof-field__err">{err}</p>}

          {[
            { field: 'current', label: 'বর্তমান পাসওয়ার্ড' },
            { field: 'next',    label: 'নতুন পাসওয়ার্ড' },
            { field: 'confirm', label: 'নতুন পাসওয়ার্ড নিশ্চিত করুন' },
          ].map(({ field, label }) => (
            <div className="prof-field" key={field}>
              <label className="prof-field__label">{label}</label>
              <div className="prof-field__edit-row">
                <input
                  type={show[field] ? 'text' : 'password'}
                  className="prof-field__input"
                  value={form[field]}
                  required
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                />
                <button type="button" className="prof-icon-btn prof-icon-btn--edit" onClick={() => toggle(field)} aria-label="দেখান/লুকান">
                  {show[field] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}

          <div className="prof-pass-form__actions">
            <button type="submit" className="prof-btn prof-btn--primary" disabled={saving}>
              {saving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন করুন'}
            </button>
            <button type="button" className="prof-btn prof-btn--ghost" onClick={() => { setOpen(false); setErr('') }}>
              বাতিল
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// ── Delete / deactivate account section ────────────────────────────────────
function DeleteAccountSection({ onDeleted }) {
  const [open,    setOpen]    = useState(false)
  const [pass,    setPass]    = useState('')
  const [show,    setShow]    = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [err,     setErr]     = useState('')

  const handleDelete = async (e) => {
    e.preventDefault()
    setErr('')
    if (!pass) { setErr('পাসওয়ার্ড দিন'); return }
    setDeleting(true)
    try {
      await api.del('/auth/me', { password: pass })
      onDeleted?.()
    } catch (e) {
      setErr(e.message || 'অ্যাকাউন্ট মুছে ফেলা যায়নি')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="prof-section prof-section--danger">
      <div className="prof-section__header" onClick={() => setOpen(o => !o)}>
        <span className="prof-section__title prof-section__title--danger">
          <AlertTriangle size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          অ্যাকাউন্ট নিষ্ক্রিয় করুন
        </span>
        <span className="prof-section__toggle">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <form className="prof-pass-form" onSubmit={handleDelete}>
          <p className="prof-danger-note">
            এই কাজটি আপনার অ্যাকাউন্টকে নিষ্ক্রিয় করবে। নিশ্চিত করতে আপনার পাসওয়ার্ড দিন।
          </p>
          {err && <p className="prof-field__err">{err}</p>}
          <div className="prof-field">
            <label className="prof-field__label">পাসওয়ার্ড নিশ্চিত করুন</label>
            <div className="prof-field__edit-row">
              <input
                type={show ? 'text' : 'password'}
                className="prof-field__input"
                value={pass}
                required
                onChange={e => setPass(e.target.value)}
              />
              <button type="button" className="prof-icon-btn prof-icon-btn--edit" onClick={() => setShow(s => !s)}>
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div className="prof-pass-form__actions">
            <button type="submit" className="prof-btn prof-btn--danger" disabled={deleting}>
              {deleting ? 'নিষ্ক্রিয় করা হচ্ছে...' : 'হ্যাঁ, নিষ্ক্রিয় করুন'}
            </button>
            <button type="button" className="prof-btn prof-btn--ghost" onClick={() => { setOpen(false); setErr('') }}>
              বাতিল
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
export default function AccountProfileCard() {
  const navigate = useNavigate()
  const { authUser, setAuthUser, signOut } = useApp()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [toast,   setToast]   = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    if (!authUser) { navigate('/login'); return }
    api.get('/auth/me')
      .then(data => setProfile(data))
      .catch(err  => setError(err.message || 'প্রোফাইল লোড করা যায়নি'))
      .finally(()  => setLoading(false))
  }, [authUser, navigate])

  // Generic field saver — patches the backend and updates local state
  const saveField = async (field, value) => {
    const updated = await api.patch('/auth/me', { [field]: value })
    setProfile(p => ({ ...p, ...updated }))
    // Keep authUser in sync (name is shown in sidebar)
    if (field === 'name') setAuthUser({ ...authUser, name: updated.name })
    showToast('পরিবর্তন সংরক্ষিত হয়েছে ✓')
  }

  const handleAvatarClick = () => {
    // Profile picture upload is not yet supported by the backend.
    showToast('প্রোফাইল ছবি আপলোড শীঘ্রই আসছে।')
  }

  const handleDeleted = () => {
    signOut()
    navigate('/')
  }

  const initials = (profile?.name || authUser?.name || '?')
    .trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()

  if (loading) {
    return (
      <div className="card account-profile-card">
        <p style={{ padding: '2rem', color: '#6b7280' }}>প্রোফাইল লোড হচ্ছে...</p>
      </div>
    )
  }

  return (
    <div className="account-profile-card">

      {/* Toast */}
      {toast && <div className="prof-toast">{toast}</div>}

      {error && <div className="error-banner" style={{ marginBottom: '1rem' }}>{error}</div>}

      {/* ── Avatar ── */}
      <div className="prof-avatar-section">
        <div className="prof-avatar-wrap">
          <div className="profile-avatar-circle">{initials}</div>
          <button
            className="prof-avatar-cam"
            onClick={handleAvatarClick}
            aria-label="প্রোফাইল ছবি পরিবর্তন করুন"
          >
            <Camera size={14} />
          </button>
        </div>
        <div className="prof-avatar-meta">
          <p className="prof-avatar-name">{profile?.name || authUser?.name}</p>
          <p className="prof-avatar-email">{profile?.email || authUser?.email}</p>
        </div>
      </div>

      {/* ── Editable fields ── */}
      <div className="prof-fields-card">
        <h3 className="prof-fields-title">ব্যক্তিগত তথ্য</h3>

        <EditableField
          label="নাম"
          value={profile?.name}
          placeholder="আপনার নাম"
          onSave={v => saveField('name', v)}
        />
        <EditableField
          label="মোবাইল নম্বর"
          value={profile?.phone_number}
          placeholder="মোবাইল নম্বর যোগ করুন"
          type="tel"
          onSave={v => saveField('phone_number', v)}
        />

        {/* Email is read-only (used as login identity) */}
        <div className="prof-field">
          <label className="prof-field__label">ইমেইল</label>
          <div className="prof-field__display-row">
            <span className="prof-field__value">{profile?.email || authUser?.email}</span>
            <span className="prof-field__readonly-badge">পরিবর্তন করা যাবে না</span>
          </div>
        </div>
      </div>

      {/* ── Password change ── */}
      <div className="prof-fields-card">
        <ChangePasswordSection onDone={() => showToast('পাসওয়ার্ড পরিবর্তন সফল হয়েছে ✓')} />
      </div>

      {/* ── Danger zone ── */}
      <div className="prof-fields-card">
        <DeleteAccountSection onDeleted={handleDeleted} />
      </div>

    </div>
  )
}
