import React, { useState, useEffect } from 'react';
import { api } from '../api/http';
import './account-dashboard.css';

const AccountOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.get('/orders');
        setOrders(data || []);
      } catch (err) {
        setError(err.message || "Unable to load orders. Please ensure the backend server is running.");
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
          <div key={order.order_id} className="card order-card">
             <div className="order-card-header">
                <span className="order-id">Order #{order.order_number}</span>
                <span className="order-status">{order.status || 'Pending'}</span>
             </div>
             <div className="order-card-body">
                <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString('bn-BD')}</p>
                <p><strong>Total Amount:</strong> ৳{Number(order.total_amount).toFixed(2)}</p>
             </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AccountOrders;