import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import './AuthPage.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

async function parseApiResponse(response) {
  const text = await response.text()
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    return { message: 'The authentication service returned an unexpected response.' }
  }
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuthUser, authUser } = useApp()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Redirect already-logged-in users away from the login page
  useEffect(() => {
    if (authUser) {
      navigate('/', { replace: true })
    }
  }, [authUser, navigate])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      })

      const data = await parseApiResponse(response)
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to sign you in right now.')
      }

      localStorage.setItem('pustak-auth-token', data.token)
      // update app context so navigation shows user menu
      setAuthUser(data.user)
      setMessage({ type: 'success', text: data.message })
      // show success briefly then navigate home so user sees message and navigation opens account drawer
      setTimeout(() => navigate('/'), 700)
    } catch (error) {
      const friendlyMessage = error.message.includes('Unexpected token')
        ? 'The authentication service is unavailable. Make sure the backend is running.'
        : error.message
      setMessage({ type: 'error', text: friendlyMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">পুস্তক</Link>
        <h1 className="auth-title">লগইন করুন</h1>
        <p className="auth-sub">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">ইমেইল</label>
            <input id="email" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="auth-field">
            <label htmlFor="password">পাসওয়ার্ড</label>
            <input id="password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
          </div>
          {message.text ? (
            <p className={`auth-message ${message.type}`} role="status" aria-live="polite">
              {message.text}
            </p>
          ) : null}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'সাইন ইন হচ্ছে…' : 'লগইন'}
          </button>
        </form>
        <p className="auth-switch">
          অ্যাকাউন্ট নেই? <Link to="/register">নিবন্ধন করুন</Link>
        </p>
      </div>
    </div>
  )
}
