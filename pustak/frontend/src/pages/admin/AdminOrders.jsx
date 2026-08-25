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

      alert('Order status updated successfully');
      fetchOrders();
      if (selectedOrder && selectedOrder.order.order_id === orderId) {
        fetchOrderDetails(orderId);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'warning',
      'Confirmed': 'info',
      'Processing': 'info',
      'Shipped': 'primary',
      'Delivered': 'success',
      'Cancelled': 'danger',
      'Returned': 'danger'
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
          {orderStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
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
                  <th>Order ID</th>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Order Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td><strong>{order.order_number}</strong></td>
                    <td>
                      <div>{order.user_name}</div>
                      <small>{order.user_email}</small>
                    </td>
                    <td>{order.item_count}</td>
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
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - {selectedOrder.order.order_number}</h2>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>&times;</button>
            </div>

            <div className="order-details">
              <div className="details-section">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrder.order.user_name}</p>
                <p><strong>Email:</strong> {selectedOrder.order.user_email}</p>
                <p><strong>Phone:</strong> {selectedOrder.order.user_phone}</p>
              </div>

              <div className="details-section">
                <h3>Shipping Address</h3>
                <p>{selectedOrder.order.street_address}</p>
                <p>{selectedOrder.order.city}, {selectedOrder.order.postal_code}</p>
                <p>{selectedOrder.order.country}</p>
              </div>

              <div className="details-section">
                <h3>Order Items</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="item-info">
                            <img src={item.cover_image_url} alt={item.book_name} />
                            <span>{item.book_name}</span>
                          </div>
                        </td>
                        <td>{item.quantity}</td>
                        <td>৳{parseFloat(item.unit_price).toFixed(2)}</td>
                        <td>৳{(item.quantity * parseFloat(item.unit_price)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="order-total">
                  <strong>Total: ৳{parseFloat(selectedOrder.order.total_amount).toFixed(2)}</strong>
                </div>
              </div>

              <div className="details-section">
                <h3>Update Order Status</h3>
                <div className="status-update">
                  <select
                    value={selectedOrder.order.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.order.order_id, e.target.value)}
                  >
                    {orderStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedOrder.delivery && (
                <div className="details-section">
                  <h3>Delivery Information</h3>
                  <p><strong>Tracking:</strong> {selectedOrder.delivery.tracking_no}</p>
                  <p><strong>Status:</strong> {selectedOrder.delivery.status}</p>
                  {selectedOrder.delivery.dispatch_date && (
                    <p><strong>Dispatched:</strong> {new Date(selectedOrder.delivery.dispatch_date).toLocaleString()}</p>
                  )}
                </div>
              )}

              {selectedOrder.payment && (
                <div className="details-section">
                  <h3>Payment Information</h3>
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
