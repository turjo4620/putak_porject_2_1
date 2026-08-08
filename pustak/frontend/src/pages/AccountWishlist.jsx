import React, { useState, useEffect } from 'react';
import './account-dashboard.css';

const AccountWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch('/api/wishlist');
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
           throw new Error("Unable to load wishlist at this time.");
        }
        const data = await response.json();
        setWishlist(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div className="account-wishlist-section">
      <div className="notification-banner">
        <span>You have {wishlist.length} product(s) in your wishlist</span>
        <button className="btn-text">Continue Shopping</button>
      </div>

      {error && <div className="card error-banner">{error}</div>}

      <div className="card wishlist-content">
        {wishlist.length === 0 && !error ? (
          <p>You have 0 product(s) in your wishlist.</p>
        ) : (
          <div className="wishlist-grid">
            {/* Render actual wishlist items here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountWishlist;