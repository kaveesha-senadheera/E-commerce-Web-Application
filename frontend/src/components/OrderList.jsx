import React, { useState } from 'react';

function OrderList({ orders, onEdit, onDelete }) {
  const [searchPhone, setSearchPhone] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const filteredOrders = orders.filter(order =>
    order.mobileNo.includes(searchPhone)
  );

  return (
    <div className="order-list-enhanced">
      {/* MAIN CONTENT */}
      <main className="order-main-enhanced">
        <div className="orders-section-enhanced">
          <h3 className="orders-heading-enhanced">ALL ORDERS</h3>

          {/* Search Bar */}
          <div className="search-bar-enhanced">
            <label htmlFor="searchPhone" className="search-label-enhanced">
              Search by Mobile Number: 
            </label>
            <input
              type="text"
              id="searchPhone"
              className="search-input-enhanced"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <table className="orders-table-enhanced">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Delivery Details</th>
                <th>Mobile No</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order._id} className="order-row-enhanced">
                    <td>
                      <div className="order-id-container">
                        <span className="order-id-text">{order.orderId}</span>
                      </div>
                    </td>
                    <td>{order.firstName}</td>
                    <td>{order.lastName}</td>
                    <td>
                      <div className="delivery-details-box">
                        <div className="detail-item">
                          <span className="detail-label">📍</span>
                          <span className="detail-text">{order.address}</span>
                          <button
                            className="copy-btn-enhanced"
                            onClick={() => handleCopy(order.address, order._id)}
                            title="Copy Address"
                          >
                            {copiedId === order._id ? '✅' : '📋'}
                          </button>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">🏙️</span>
                          <span className="detail-text">{order.city}, {order.province} {order.postalCode}</span>
                        </div>
                      </div>
                    </td>
                    <td>{order.mobileNo}</td>
                    <td className={`payment-cell-enhanced ${order.paymentMethod === 'CASH_ON_DELIVERY' ? 'cash-payment-enhanced' : 'online-payment-enhanced'}`}>
                      {order.paymentMethod}
                    </td>
                    <td className={`status-cell-enhanced ${order.status?.toLowerCase()}-status-enhanced`}>
                      <span className="status-badge">
                        {order.status || 'PENDING'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="edit-btn-enhanced"
                        onClick={() => onEdit(order)}
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn-enhanced"
                        onClick={() => onDelete(order._id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-orders-enhanced">
                    No orders found for this mobile number
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default OrderList;
