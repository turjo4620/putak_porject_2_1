import React, { useState, useEffect } from 'react';
import './account-dashboard.css';

const AccountProfileCard = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile'); // Replace with your actual endpoint
        
        // Fix for the "<!DOCTYPE" error: check content type before parsing
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
            throw new Error("Failed to fetch profile data. Server returned an invalid response.");
        }

        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="card">Loading profile...</div>;

  return (
    <div className="card account-profile-card">
      <div className="card-header">
        <h2>Profile</h2>
        <button className="btn-text">Edit</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="profile-grid">
        <div className="profile-picture-section">
          <div className="avatar-placeholder">Avatar</div>
          <button className="btn-primary">Change Profile Picture</button>
        </div>

        <div className="profile-details-section">
          <div className="form-group">
            <label>Name</label>
            <input type="text" defaultValue={profileData?.name || "Turjo Sarkar Prince"} readOnly />
          </div>

          <div className="form-group">
            <label>Date of birth</label>
            <input type="date" defaultValue={profileData?.dob || ""} readOnly />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <div className="radio-group">
               <label><input type="radio" name="gender" value="Male" defaultChecked={profileData?.gender === 'Male'} /> Male</label>
               <label><input type="radio" name="gender" value="Female" defaultChecked={profileData?.gender === 'Female'} /> Female</label>
               <label><input type="radio" name="gender" value="Other" defaultChecked={profileData?.gender === 'Other'} /> Other</label>
            </div>
          </div>

          <div className="form-group">
            <label>Mobile</label>
            <div className="input-with-action">
              <input type="text" defaultValue={profileData?.mobile || ""} readOnly />
              <button className="btn-text">Change Mobile Number</button>
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-with-action">
              <input type="email" defaultValue={profileData?.email || "sarkerturjo2022@gmail.com"} readOnly />
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
  );
};

export default AccountProfileCard;