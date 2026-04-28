import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_ENDPOINTS } from "../api/config";

function AccountOwnerDeliveryReportPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    // Fetch only the current customer's deliveries
    const fetchDeliveries = () => {
      axios
        .get(`${API_ENDPOINTS.ORDERS}/deliveries/customer`)
        .then((res) => {
          setDeliveries(res.data);
        })
        .catch((err) => console.error("Error fetching customer deliveries:", err));
    };

    fetchDeliveries();

    // Listen for delivery status updates
    const handleDeliveryStatusUpdate = () => {
      console.log('Delivery status updated, refreshing customer deliveries...');
      fetchDeliveries();
    };

    window.addEventListener('deliveryStatusUpdated', handleDeliveryStatusUpdate);

    return () => {
      window.removeEventListener('deliveryStatusUpdated', handleDeliveryStatusUpdate);
    };
  }, []);

  // Filter deliveries by Order ID or Delivery ID
  const filteredDeliveries = deliveries.filter((delivery) => {
    const searchLower = searchId.toLowerCase();
    return (
      delivery.orderId?.orderId?.toString().toLowerCase().includes(searchLower) ||
      delivery.deliveryId?.toString().toLowerCase().includes(searchLower) ||
      delivery._id?.toString().includes(searchLower)
    );
  });

  // Format deliveryDate to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Build destination string from order fields
  const buildDestination = (delivery) => {
    if (delivery.destination && delivery.destination.trim() !== '') {
      return delivery.destination;
    }
    
    const parts = [];
    if (delivery.order) {
      if (delivery.order.address) parts.push(delivery.order.address);
      if (delivery.order.city) parts.push(delivery.order.city);
      if (delivery.order.province) parts.push(delivery.order.province);
    }
    return parts.join(', ');
  };

  return (
    <div className="container">
      <h1>My Delivery Status Reports</h1>
      <Link to="/delivery" className="back-nav-button">
        ← Back 
      </Link>
      
      <div className="delivery-report-enhanced">
        {/* HEADER SECTION */}
        <div className="delivery-report-header-enhanced">
          <div className="header-content-enhanced">
            <h1 className="report-title-enhanced">My Delivery Status Report</h1>
            <p className="report-subtitle-enhanced">Track and monitor your delivery operations</p>
          </div>
          <div className="header-stats-enhanced">
            <div className="stat-item-enhanced">
              <span className="stat-number-enhanced">{deliveries.length}</span>
              <span className="stat-label-enhanced">Total Deliveries</span>
            </div>
            <div className="stat-item-enhanced">
              <span className="stat-number-enhanced">{filteredDeliveries.length}</span>
              <span className="stat-label-enhanced">Filtered</span>
            </div>
          </div>
        </div>

        {/* SEARCH SECTION */}
        <div className="search-section-enhanced">
          <div className="search-container-enhanced">
            <input
              type="text"
              className="search-input-enhanced"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Search by Order ID or Delivery ID..."
            />
            <div className="search-results-enhanced">
              <div className="results-count-enhanced">
                <span className="results-number-enhanced">{filteredDeliveries.length}</span>
                <span className="results-text-enhanced">
                  {filteredDeliveries.length === 1 ? 'result found' : 'results found'}
                </span>
              </div>
              {searchId && (
                <div className="search-query-enhanced">
                  Searching for: <span className="search-term-enhanced">"{searchId}"</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="table-section-enhanced">
          <div className="table-container-enhanced">
            <table className="delivery-table-enhanced">
              <thead>
                <tr>
                  <th className="header-cell-enhanced">
                    <div className="header-content-enhanced">
                      <span className="header-icon-enhanced">📦</span>
                      <span className="header-text-enhanced">Order ID</span>
                    </div>
                  </th>
                  <th className="header-cell-enhanced">
                    <div className="header-content-enhanced">
                      <span className="header-icon-enhanced">🚚</span>
                      <span className="header-text-enhanced">Delivery ID</span>
                    </div>
                  </th>
                  <th className="header-cell-enhanced">
                    <div className="header-content-enhanced">
                      <span className="header-icon-enhanced">👨‍✈️</span>
                      <span className="header-text-enhanced">Driver Name</span>
                    </div>
                  </th>
                  <th className="header-cell-enhanced">
                    <div className="header-content-enhanced">
                      <span className="header-icon-enhanced">📍</span>
                      <span className="header-text-enhanced">Destination</span>
                    </div>
                  </th>
                  <th className="header-cell-enhanced">
                    <div className="header-content-enhanced">
                      <span className="header-icon-enhanced">📅</span>
                      <span className="header-text-enhanced">Delivery Date</span>
                    </div>
                  </th>
                  <th className="header-cell-enhanced">
                    <div className="header-content-enhanced">
                      <span className="header-icon-enhanced">🚚</span>
                      <span className="header-text-enhanced">Status</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.length > 0 ? (
                  filteredDeliveries.map((delivery, index) => (
                    <tr key={delivery._id} className="delivery-row-enhanced" style={{animationDelay: `${index * 0.1}s`}}>
                      <td className="delivery-cell-enhanced">
                        <div className="delivery-id-display-enhanced">
                          <span className="id-number-enhanced">{delivery.orderId?.orderId || delivery.orderId?.toString()}</span>
                        </div>
                      </td>
                      <td className="delivery-cell-enhanced">
                        <div className="delivery-id-enhanced">
                          <span className="id-number-enhanced">{delivery.deliveryId}</span>
                        </div>
                      </td>
                      <td className="delivery-cell-enhanced">
                        <div className="driver-info-enhanced">
                          <div className="driver-name-enhanced">{delivery.driverName}</div>
                          <div className="driver-status-enhanced">Available</div>
                        </div>
                      </td>
                      <td className="delivery-cell-enhanced">
                        <div className="destination-details-enhanced">
                          <div className="destination-text-enhanced">{buildDestination(delivery)}</div>
                        </div>
                      </td>
                      <td className="delivery-cell-enhanced">
                        <div className="date-info-enhanced">
                          <div className="date-text-enhanced">{formatDate(delivery.deliveryDate)}</div>
                          <div className="date-status-enhanced">Scheduled</div>
                        </div>
                      </td>
                      <td className="delivery-cell-enhanced">
                        <div className={`status-badge-enhanced ${delivery.status.toLowerCase().replace(/\s+/g, '-')}-status-enhanced`}>
                          <div className="status-icon-enhanced">
                            {delivery.status === 'COMPLETED' ? '✅' : 
                             delivery.status === 'PENDING' ? '⏳' : 
                             delivery.status === 'IN_PROGRESS' ? '🚚' : 
                             delivery.status === 'INCOMPLETE' ? '❌' : '📦'}
                          </div>
                          <div className="status-text-enhanced">
                            {delivery.status === 'COMPLETED' ? 'Delivered' : 
                             delivery.status === 'PENDING' ? 'Pending' : 
                             delivery.status === 'IN_PROGRESS' ? 'In Transit' : 
                             delivery.status === 'INCOMPLETE' ? 'Incomplete' : delivery.status}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-deliveries-enhanced">
                      <div className="no-deliveries-content-enhanced">
                        <div className="no-deliveries-icon-enhanced">📦</div>
                        <div className="no-deliveries-text-enhanced">No deliveries found</div>
                        <div className="no-deliveries-subtext-enhanced">Try searching with a different delivery ID</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* STATUS CARDS SECTION */}
        <div className="status-cards-section-enhanced">
          <h2 className="section-title-enhanced">Delivery Status Overview</h2>
          
          {/* DELIVERED CARD */}
          <div className="status-card-container-enhanced">
            <div className="status-card-header-enhanced delivered-header-enhanced">
              <div className="status-card-icon-enhanced">✅</div>
              <div className="status-card-title-enhanced">Delivered</div>
              <div className="status-card-count-enhanced">{deliveries.filter(d => d.status === 'COMPLETED').length}</div>
            </div>
            <div className="status-card-content-enhanced">
              {deliveries.filter(d => d.status === 'COMPLETED').length > 0 ? (
                deliveries.filter(d => d.status === 'COMPLETED').map((delivery) => (
                  <div key={delivery._id} className="delivery-item-enhanced">
                    <div className="delivery-item-header-enhanced">
                      <span className="delivery-id-enhanced">{delivery.deliveryId}</span>
                      <span className="delivery-date-enhanced">{formatDate(delivery.deliveryDate)}</span>
                    </div>
                    <div className="delivery-item-details-enhanced">
                      <div className="detail-row-enhanced">
                        <span className="detail-label-enhanced">Order ID:</span>
                        <span className="detail-value-enhanced">{delivery.orderId?.orderId || delivery.orderId?.toString()}</span>
                      </div>
                      <div className="detail-row-enhanced">
                        <span className="detail-label-enhanced">Driver:</span>
                        <span className="detail-value-enhanced">{delivery.driverName}</span>
                      </div>
                      <div className="detail-row-enhanced">
                        <span className="detail-label-enhanced">Destination:</span>
                        <span className="detail-value-enhanced">{buildDestination(delivery)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-deliveries-in-status-enhanced">
                  <span className="no-deliveries-text-enhanced">No delivered deliveries</span>
                </div>
              )}
            </div>
          </div>

          {/* PENDING CARD */}
          <div className="status-card-container-enhanced">
            <div className="status-card-header-enhanced pending-header-enhanced">
              <div className="status-card-icon-enhanced">⏳</div>
              <div className="status-card-title-enhanced">Pending</div>
              <div className="status-card-count-enhanced">{deliveries.filter(d => d.status === 'PENDING').length}</div>
            </div>
            <div className="status-card-content-enhanced">
              {deliveries.filter(d => d.status === 'PENDING').length > 0 ? (
                deliveries.filter(d => d.status === 'PENDING').map((delivery) => (
                  <div key={delivery._id} className="delivery-item-enhanced">
                    <div className="delivery-item-header-enhanced">
                      <span className="delivery-id-enhanced">{delivery.deliveryId}</span>
                      <span className="delivery-date-enhanced">{formatDate(delivery.deliveryDate)}</span>
                    </div>
                    <div className="delivery-item-details-enhanced">
                      <div className="detail-row-enhanced">
                        <span className="detail-label-enhanced">Order ID:</span>
                        <span className="detail-value-enhanced">{delivery.orderId?.orderId || delivery.orderId?.toString()}</span>
                      </div>
                      <div className="detail-row-enhanced">
                        <span className="detail-label-enhanced">Driver:</span>
                        <span className="detail-value-enhanced">{delivery.driverName}</span>
                      </div>
                      <div className="detail-row-enhanced">
                        <span className="detail-label-enhanced">Destination:</span>
                        <span className="detail-value-enhanced">{buildDestination(delivery)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-deliveries-in-status-enhanced">
                  <span className="no-deliveries-text-enhanced">No pending deliveries</span>
                </div>
              )}
            </div>
          </div>

          {/* IN TRANSIT CARD */}
          <div className="status-card-container-enhanced">
            <div className="status-card-header-enhanced transit-header-enhanced">
              <div className="status-card-icon-enhanced">🚚</div>
              <div className="status-card-title-enhanced">In Transit</div>
              <div className="status-card-count-enhanced">{deliveries.filter(d => d.status === 'IN_PROGRESS').length}</div>
            </div>
            <div className="status-card-content-enhanced">
              {deliveries.filter(d => d.status === 'IN_PROGRESS').length > 0 ? (
                deliveries.filter(d => d.status === 'IN_PROGRESS').map((delivery) => (
                  <div key={delivery._id} className="delivery-item-enhanced">
                    <div className="delivery-item-header-enhanced">
                      <span className="delivery-id-enhanced">{delivery.deliveryId}</span>
                      <span className="delivery-date-enhanced">{formatDate(delivery.deliveryDate)}</span>
                    </div>
                    <div className="delivery-item-details-enhanced">
                      <div className="detail-row-enhanced">
                        <span className="detail-label-enhanced">Order ID:</span>
                        <span className="detail-value-enhanced">{delivery.orderId?.orderId || delivery.orderId?.toString()}</span>
                      </div>
                      <div className="detail-row-enhanced">
                        <span className="detail-label-enhanced">Driver:</span>
                        <span className="detail-value-enhanced">{delivery.driverName}</span>
                      </div>
                      <div className="detail-row-enhanced">
                        <span className="detail-label-enhanced">Destination:</span>
                        <span className="detail-value-enhanced">{buildDestination(delivery)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-deliveries-in-status-enhanced">
                  <span className="no-deliveries-text-enhanced">No deliveries in transit</span>
                </div>
              )}
            </div>
          </div>

          {/* INCOMPLETE CARD */}
          <div className="status-card-container-enhanced">
            <div className="status-card-header-enhanced incomplete-header-enhanced">
              <div className="status-card-icon-enhanced">❌</div>
              <div className="status-card-title-enhanced">Incomplete</div>
              <div className="status-card-count-enhanced">{deliveries.filter(d => d.status === 'INCOMPLETE').length}</div>
            </div>
            <div className="status-card-content-enhanced">
              {deliveries.filter(d => d.status === 'INCOMPLETE').length > 0 ? (
                deliveries.filter(d => d.status === 'INCOMPLETE').map((delivery) => (
                  <div key={delivery._id} className="delivery-item-enhanced">
                    <div className="delivery-item-header-enhanced">
                      <span className="delivery-id-enhanced">{delivery.deliveryId}</span>
                      <span className="delivery-date-enhanced">{formatDate(delivery.deliveryDate)}</span>
                    </div>
                    <div className="delivery-item-details-enhanced">
                      <div className="detail-row-enhanced">
                        <span className="detail-label-enhanced">Order ID:</span>
                        <span className="detail-value-enhanced">{delivery.orderId?.orderId || delivery.orderId?.toString()}</span>
                      </div>
                      <div className="detail-row-enhanced">
                        <span className="detail-label-enhanced">Driver:</span>
                        <span className="detail-value-enhanced">{delivery.driverName}</span>
                      </div>
                      <div className="detail-row-enhanced">
                        <span className="detail-label-enhanced">Destination:</span>
                        <span className="detail-value-enhanced">{buildDestination(delivery)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-deliveries-in-status-enhanced">
                  <span className="no-deliveries-text-enhanced">No incomplete deliveries</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountOwnerDeliveryReportPage;
