import React, { useState, useEffect } from 'react';
import './account-dashboard.css';

const AccountOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders/my-orders');
        
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
           throw new Error("Unable to load orders. Please ensure the backend server is running.");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="account-orders-section">
      <div className="orders-header card">
        <input type="text" placeholder="Search orders by ID" className="search-input" />
        <div className="orders-tabs">
          <button className="tab active">All Orders</button>
          <button className="tab">To Pay</button>
          <button className="tab">Processing</button>
          <button className="tab">Shipped</button>
        </div>
      </div>

      {error && <div className="card error-banner">{error}</div>}
      
      {loading ? (
        <div className="card">Loading orders...</div>
      ) : orders.length === 0 && !error ? (
        <div className="card">No orders found.</div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card order-card">
             <div className="order-card-header">
                <span className="order-id">Order #{order._id}</span>
                <span className="order-status">{order.status || 'Completed'}</span>
             </div>
             {/* Map through order items here */}
          </div>
        ))
      )}
    </div>
  );
};

export default AccountOrders;