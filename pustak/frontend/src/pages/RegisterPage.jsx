import { useState } from 'react'
import { Link } from 'react-router-dom'
import './AuthPage.css'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">পুস্তক</Link>
        <h1 className="auth-title">নিবন্ধন করুন</h1>
        <p className="auth-sub">নতুন অ্যাকাউন্ট তৈরি করুন</p>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="auth-field">
            <label htmlFor="name">পুরো নাম</label>
            <input id="name" type="text" placeholder="আপনার নাম" value={form.name} onChange={set('name')} required />
          </div>
          <div className="auth-field">
            <label htmlFor="email">ইমেইল</label>
            <input id="email" type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="auth-field">
            <label htmlFor="password">পাসওয়ার্ড</label>
            <input id="password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
          </div>
          <button type="submit" className="auth-btn">নিবন্ধন করুন</button>
        </form>
        <p className="auth-switch">
          ইতোমধ্যে অ্যাকাউন্ট আছে? <Link to="/login">লগইন করুন</Link>
        </p>
      </div>
    </div>
  )
}
