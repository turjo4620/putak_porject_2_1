import { useState } from 'react'
import { Link } from 'react-router-dom'
import './AuthPage.css'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">পুস্তক</Link>
        <h1 className="auth-title">লগইন করুন</h1>
        <p className="auth-sub">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="auth-field">
            <label htmlFor="email">ইমেইল</label>
            <input id="email" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="auth-field">
            <label htmlFor="password">পাসওয়ার্ড</label>
            <input id="password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
          </div>
          <button type="submit" className="auth-btn">লগইন</button>
        </form>
        <p className="auth-switch">
          অ্যাকাউন্ট নেই? <Link to="/register">নিবন্ধন করুন</Link>
        </p>
      </div>
    </div>
  )
}
