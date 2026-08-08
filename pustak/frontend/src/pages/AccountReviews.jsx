import React, { useState, useEffect } from 'react';
import './account-dashboard.css';

const AccountReviews = () => {
  const [activeTab, setActiveTab] = useState('Not Reviewed');
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch logic with the JSON safety check goes here
  }, [activeTab]);

  return (
    <div className="account-reviews-section">
      <div className="reviews-tabs card">
        <button 
          className={`tab ${activeTab === 'Not Reviewed' ? 'active' : ''}`}
          onClick={() => setActiveTab('Not Reviewed')}
        >
          Not Reviewed
        </button>
        <button 
          className={`tab ${activeTab === 'Reviewed' ? 'active' : ''}`}
          onClick={() => setActiveTab('Reviewed')}
        >
          Reviewed
        </button>
      </div>

      {error && <div className="card error-banner">{error}</div>}

      <div className="card reviews-content">
         <p>No items</p>
      </div>
    </div>
  );
};

export default AccountReviews;