import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { api } from '../api/http'
import './account-dashboard.css'

const AccountProfileCard = () => {
  const navigate = useNavigate()
  const { authUser } = useApp()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!authUser) { navigate('/login'); return }

    api.get('/auth/me')
      .then(data => setProfile(data))
      .catch(err => setError(err.message || 'প্রোফাইল লোড করা যায়নি'))
      .finally(() => setLoading(false))
  }, [authUser, navigate])

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
    <div className="card account-profile-card">

      <div className="profile-card__header">
        <h2>Profile</h2>
        <button className="btn-text">Edit</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="profile-grid">

        {/* ── Avatar column ── */}
        <div className="profile-picture-section">
          <div className="profile-avatar-circle">{initials}</div>
          <button className="btn-primary">Change Profile Picture</button>
        </div>

        {/* ── Details column ── */}
        <div className="profile-details-section">

          <div className="form-group">
            <label>Name</label>
            <input type="text" value={profile?.name ?? authUser?.name ?? ''} readOnly />
          </div>

          <div className="form-group">
            <label>Date of birth</label>
            {/* Not stored in DB yet — kept as editable UI field */}
            <input type="date" placeholder="mm/dd/yyyy" />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <div className="radio-group">
              <label><input type="radio" name="gender" value="Male"   /> Male</label>
              <label><input type="radio" name="gender" value="Female" /> Female</label>
              <label><input type="radio" name="gender" value="Other"  /> Other</label>
            </div>
          </div>

          <div className="form-group">
            <label>Mobile</label>
            <div className="input-with-action">
              <input
                type="text"
                value={profile?.phone_number ?? ''}
                placeholder="মোবাইল নম্বর যোগ করুন"
                readOnly
              />
              <button className="btn-text">Change Mobile Number</button>
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-with-action">
              <input type="email" value={profile?.email ?? authUser?.email ?? ''} readOnly />
              <button className="btn-text">Change Email</button>
            </div>
          </div>

          <div className="password-actions">
            <button className="btn-text">Change Password</button>
            <button className="btn-text text-danger">Remove Password</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AccountProfileCard
