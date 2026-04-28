import React, { useState } from 'react';

function ViewOnlyOrderList({ orders }) {
  const [searchOrderId, setSearchOrderId] = useState('');

  const filteredOrders = orders.filter(order =>
    order.orderId.toLowerCase().includes(searchOrderId.toLowerCase())
  );

  return (
    <div className="order-list-enhanced">
      {/* MAIN CONTENT */}
      <main className="order-main-enhanced">
        <div className="orders-section-enhanced">
          <h3 className="orders-heading-enhanced">ALL ORDERS</h3>

          {/* Search Bar */}
          <div className="search-bar-enhanced">
            <label htmlFor="searchOrderId" className="search-label-enhanced">
              Search by Order ID: 
            </label>
            <input
              type="text"
              id="searchOrderId"
              className="search-input-enhanced"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              placeholder="Enter Order ID (e.g., ORD1000)"
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-orders-enhanced">
                    No orders found for this Order ID
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

export default ViewOnlyOrderList;
