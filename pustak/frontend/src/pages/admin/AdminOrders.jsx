import { useState, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import '../../styles/admin.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orderStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];

  useEffect(() => {
    fetchOrders();
  }, [page, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        page,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      });
      const response = await fetch(`http://localhost:5000/api/admin/orders?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch order details');
      const data = await response.json();
      setSelectedOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update order status');

      // Update the local selectedOrder state so the modal reflects the new status immediately
      setSelectedOrder(prev => ({
        ...prev,
        order: { ...prev.order, status: newStatus }
      }));
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending':    'warning',
      'Confirmed':  'info',
      'Processing': 'info',
      'Shipped':    'primary',
      'Delivered':  'success',
      'Cancelled':  'danger',
      'Returned':   'danger'
    };
    return colors[status] || 'secondary';
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Order Management</h1>
      </div>

      <div className="admin-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by order number or user name..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          {orderStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">Loading orders...</div>
      ) : (
        <>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.order_id}>
                    <td><strong>{order.order_number}</strong></td>
                    <td>
                      <div>{order.user_name}</div>
                      <small style={{ color: '#888' }}>{order.user_email}</small>
                    </td>
                    <td style={{ textAlign: 'center' }}>{order.item_count}</td>
                    <td>৳{parseFloat(order.total_amount).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-icon"
                        onClick={() => fetchOrderDetails(order.order_id)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </>
      )}

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details — {selectedOrder.order.order_number}</h2>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>&times;</button>
            </div>

            <div className="order-details">

              {/* Current status */}
              <div className="details-section">
                <h3>Current Status</h3>
                <span className={`status-badge ${getStatusColor(selectedOrder.order.status)}`} style={{ fontSize: '14px', padding: '6px 14px' }}>
                  {selectedOrder.order.status}
                </span>
              </div>

              {/* Customer */}
              <div className="details-section">
                <h3>Customer</h3>
                <p><strong>Name:</strong> {selectedOrder.order.user_name}</p>
                <p><strong>Email:</strong> {selectedOrder.order.user_email}</p>
                <p><strong>Phone:</strong> {selectedOrder.order.user_phone}</p>
              </div>

              {/* Shipping */}
              <div className="details-section">
                <h3>Shipping Address</h3>
                {selectedOrder.order.street ? (
                  <>
                    <p>{selectedOrder.order.street}</p>
                    {selectedOrder.order.area && <p>{selectedOrder.order.area}</p>}
                    <p>{[selectedOrder.order.district, selectedOrder.order.division].filter(Boolean).join(', ')}</p>
                    {selectedOrder.order.postal_code && <p>Postal: {selectedOrder.order.postal_code}</p>}
                  </>
                ) : (
                  <p style={{ color: '#888' }}>No address on file</p>
                )}
              </div>

              {/* Items */}
              <div className="details-section">
                <h3>Order Items</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Price Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="item-info">
                            {item.cover_image_url && (
                              <img src={item.cover_image_url} alt={item.book_name} />
                            )}
                            <span>{item.book_name}</span>
                          </div>
                        </td>
                        <td>৳{parseFloat(item.price_sold).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="order-total">
                  <strong>Total: ৳{parseFloat(selectedOrder.order.total_amount).toFixed(2)}</strong>
                </div>
              </div>

              {/* Update status */}
              <div className="details-section">
                <h3>Actions</h3>
                <div className="order-actions">
                  {/* Approve — visible when Pending */}
                  {selectedOrder.order.status === 'Pending' && (
                    <button
                      className="order-action-btn approve"
                      onClick={() => updateOrderStatus(selectedOrder.order.order_id, 'Confirmed')}
                    >
                      ✅ Approve Order
                    </button>
                  )}

                  {/* Set Courier / Ship — visible when Confirmed or Processing */}
                  {(selectedOrder.order.status === 'Confirmed' || selectedOrder.order.status === 'Processing') && (
                    <button
                      className="order-action-btn courier"
                      onClick={() => updateOrderStatus(selectedOrder.order.order_id, 'Shipped')}
                    >
                      🚚 Set Courier &amp; Ship
                    </button>
                  )}

                  {/* Mark Delivered — visible when Shipped */}
                  {selectedOrder.order.status === 'Shipped' && (
                    <button
                      className="order-action-btn deliver"
                      onClick={() => updateOrderStatus(selectedOrder.order.order_id, 'Delivered')}
                    >
                      📦 Mark as Delivered
                    </button>
                  )}

                  {/* Cancel — visible for any non-terminal status */}
                  {!['Cancelled', 'Returned', 'Delivered'].includes(selectedOrder.order.status) && (
                    <button
                      className="order-action-btn cancel"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to cancel this order?')) {
                          updateOrderStatus(selectedOrder.order.order_id, 'Cancelled');
                        }
                      }}
                    >
                      ❌ Cancel Order
                    </button>
                  )}

                  {/* Terminal state message */}
                  {['Cancelled', 'Returned', 'Delivered'].includes(selectedOrder.order.status) && (
                    <p style={{ color: '#888', margin: 0 }}>
                      This order is <strong>{selectedOrder.order.status}</strong> — no further actions available.
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery */}
              {selectedOrder.delivery && (
                <div className="details-section">
                  <h3>Delivery</h3>
                  <p><strong>Tracking:</strong> {selectedOrder.delivery.tracking_no}</p>
                  <p><strong>Status:</strong> {selectedOrder.delivery.status}</p>
                  {selectedOrder.delivery.dispatch_date && (
                    <p><strong>Dispatched:</strong> {new Date(selectedOrder.delivery.dispatch_date).toLocaleString()}</p>
                  )}
                </div>
              )}

              {/* Payment */}
              {selectedOrder.payment && (
                <div className="details-section">
                  <h3>Payment</h3>
                  <p><strong>Amount:</strong> ৳{parseFloat(selectedOrder.payment.amount).toFixed(2)}</p>
                  <p><strong>Status:</strong> {selectedOrder.payment.payment_status}</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.payment.payment_date).toLocaleString()}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
