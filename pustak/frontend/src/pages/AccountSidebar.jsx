import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './account-dashboard.css';

const AccountSidebar = () => {
  const [user, setUser] = useState({ name: "", email: "", initials: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBrief = async () => {
      try {
        // Use your actual endpoint that returns the logged-in user's data
        const response = await fetch('/api/user/profile'); 
        
        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setUser({
            name: data.name,
            email: data.email,
            // Get first letter of name for the avatar, default to User if null
            initials: data.name ? data.name.charAt(0).toUpperCase() : "U"
          });
        }
      } catch (error) {
        console.error("Failed to fetch sidebar user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBrief();
  }, []);

  return (
    <div className="account-sidebar">
      <div className="sidebar-profile-header">
        <div className="avatar-circle">
          {loading ? "..." : user.initials}
        </div>
        <div className="sidebar-profile-info">
          <h3>{loading ? "Loading..." : user.name}</h3>
          <p>{user.email}</p>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/account/info" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Account Info
        </NavLink>
        <NavLink to="/account/orders" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Orders & Tracking
        </NavLink>
        <NavLink to="/account/wishlist" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Wishlist
        </NavLink>
        <NavLink to="/account/reviews" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          Rating & Reviews
        </NavLink>
      </nav>
      
      <button className="sign-out-btn">Sign out</button>
    </div>
  );
};

export default AccountSidebar;