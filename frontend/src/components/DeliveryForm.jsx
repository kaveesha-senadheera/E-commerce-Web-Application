import { useState } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { API_ENDPOINTS } from '../api/config';
import './success-message.css';

function DeliveryForm({ onUpdate, deliveries }) {
  const [formData, setFormData] = useState({
    deliveryId: '',
    driverName: '',
    destination: '',
    deliveryDate: '',
    status: 'COMPLETED'
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDownloadOption, setShowDownloadOption] = useState(false);
  const [currentDeliveryData, setCurrentDeliveryData] = useState(null);

  const letterRegex = /^[A-Za-z\s]*$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const searchId = formData.deliveryId.toUpperCase().trim();
    
    // Check if it's an Order ID (starts with ORD)
    if (searchId.startsWith('ORD')) {
      // Convert Order ID to Delivery ID (ORD1000 -> DEL1000)
      const deliveryId = searchId.replace('ORD', 'DEL');
      
      // Check if delivery already exists
      const existingDelivery = deliveries.find(d => 
        d.deliveryId?.toLowerCase() === deliveryId.toLowerCase()
      );

      if (existingDelivery) {
        // Update existing delivery
        onUpdate(existingDelivery._id, {
          driverName: formData.driverName,
          destination: formData.destination,
          deliveryDate: formData.deliveryDate,
          status: formData.status
        });
        
        showSuccessMessage(deliveryId, 'updated');
      } else {
        // Create new delivery from order
        createDeliveryFromOrder(searchId, deliveryId);
      }
    } 
    // Check if it's already a Delivery ID (starts with DEL)
    else if (searchId.startsWith('DEL')) {
      const delivery = deliveries.find(d => 
        d.deliveryId?.toLowerCase() === searchId.toLowerCase()
      );

      if (delivery) {
        onUpdate(delivery._id, {
          driverName: formData.driverName,
          destination: formData.destination,
          deliveryDate: formData.deliveryDate,
          status: formData.status
        });
        
        showSuccessMessage(searchId, 'updated');
      } else {
        setErrorMessage(`Invalid Delivery ID! Delivery ID "${searchId}" not found.\n\nPlease use a valid Delivery ID or Order ID.`);
        setShowSuccess(false);
        setShowError(true);
      }
    } else {
      setErrorMessage(`Invalid ID format! Please use:\n• Order ID (e.g., ORD1000) - will create new delivery\n• Delivery ID (e.g., DEL1000) - will update existing delivery`);
      setShowSuccess(false);
      setShowError(true);
    }
  };

  const createDeliveryFromOrder = async (orderId, deliveryId) => {
    try {
      // First, fetch the order details
      const orderResponse = await axios.get(API_ENDPOINTS.ORDER_BY_ORDER_ID(orderId));
      const order = orderResponse.data;

      if (!order) {
        setErrorMessage(`Order with ID "${orderId}" not found.`);
        setShowError(true);
        return;
      }

      // Create new delivery entry
      const deliveryData = {
        deliveryId: deliveryId,
        orderId: { orderId: orderId, _id: order._id },
        driverName: formData.driverName,
        destination: `${order.address}, ${order.city}, ${order.province} ${order.postalCode}`,
        deliveryDate: formData.deliveryDate,
        status: formData.status,
        order: order // Include full order details
      };

      const deliveryResponse = await axios.post(API_ENDPOINTS.DELIVERIES, deliveryData);
      
      // Update the deliveries list in parent component
      if (onUpdate) {
        onUpdate(null, deliveryResponse.data); // Signal new delivery created
      }

      showSuccessMessage(deliveryId, 'created');
      
    } catch (error) {
      console.error('Error creating delivery from order:', error);
      setErrorMessage(`Failed to create delivery from Order "${orderId}". Please check if the order exists.`);
      setShowError(true);
    }
  };

  const updateOrderStatusForDelivery = async (deliveryId, status) => {
    try {
      console.log('=== DIRECT ORDER STATUS UPDATE ===');
      console.log('Updating order status for delivery:', deliveryId);
      console.log('New status:', status);
      console.log('Available deliveries:', deliveries.map(d => ({ deliveryId: d.deliveryId, orderId: d.orderId })));

      // Find the delivery to get the associated order and delivery ID
      const delivery = deliveries.find(d => d.deliveryId === deliveryId);
      
      if (delivery && delivery.orderId) {
        console.log('Found delivery with orderId:', delivery.orderId);
        console.log('Delivery _id:', delivery._id);
        console.log('orderId type:', typeof delivery.orderId);
        console.log('orderId structure:', JSON.stringify(delivery.orderId, null, 2));
        
        // Use the delivery-specific endpoint that updates both delivery and order
        const updateUrl = API_ENDPOINTS.DELIVERY_UPDATE(delivery._id);
        console.log('Update URL:', updateUrl);
        
        const response = await axios.put(updateUrl, {
          status: status
        });
        
        console.log('Delivery and order status updated successfully:', response.data);
        
        // Get the actual order ID for the event
        const orderId = delivery.orderId._id || delivery.orderId;
        
        // Trigger events immediately after successful update
        console.log('=== TRIGGERING EVENTS ===');
        console.log('Triggering deliveryStatusUpdated with:', { deliveryId, status, action: 'updated', orderId });
        
        window.dispatchEvent(new CustomEvent('deliveryStatusUpdated', { 
          detail: { 
            deliveryId: deliveryId, 
            status: status,
            action: 'updated',
            orderId: orderId
          } 
        }));
        
        console.log('Triggering orderStatusUpdated with:', { orderId, status, deliveryId });
        
        window.dispatchEvent(new CustomEvent('orderStatusUpdated', { 
          detail: { 
            orderId: orderId,
            status: status,
            deliveryId: deliveryId
          } 
        }));
        
        // Force a refresh of all orders after a short delay to ensure backend sync
        setTimeout(() => {
          console.log('=== FORCING ALL ORDERS REFRESH ===');
          window.dispatchEvent(new CustomEvent('forceOrdersRefresh', { 
            detail: { 
              deliveryId: deliveryId, 
              status: status,
              orderId: orderId
            } 
          }));
        }, 300);
        
      } else {
        console.log('No delivery found or no orderId associated');
        if (!delivery) console.log('Delivery not found with ID:', deliveryId);
        if (!delivery?.orderId) console.log('No orderId in delivery:', delivery);
      }
      
    } catch (error) {
      console.error('Error updating order status directly:', error);
      console.error('Error details:', error.response?.data);
      console.error('Full error:', error);
    }
  };

  const showSuccessMessage = (deliveryId, action) => {
    setFormData({ deliveryId: '', driverName: '', destination: '', deliveryDate: '', status: 'COMPLETED' });
    setShowError(false);
    setShowSuccess(true);

    // Update the corresponding order status - this will handle all event dispatching
    updateOrderStatusForDelivery(deliveryId, formData.status);

    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const downloadPDF = () => {
    if (!currentDeliveryData) return;
    
    const doc = new jsPDF();

    // Convert deliveryDate from yyyy-mm-dd to dd/mm/yyyy
    const formattedDate = formatDate(currentDeliveryData.deliveryDate);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    doc.text('Delivery Report', 20, 20);
    doc.text(`Delivery ID: ${currentDeliveryData.deliveryId}`, 20, 40);
    doc.text(`Driver's Name: ${currentDeliveryData.driverName}`, 20, 50);
    doc.text(`Destination: ${currentDeliveryData.destination}`, 20, 60);
    doc.text(`Delivery Date: ${formattedDate}`, 20, 70);
    doc.text(`Status: ${currentDeliveryData.status}`, 20, 80);

    doc.save(`delivery_report_${currentDeliveryData.deliveryId}.pdf`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleDriverNameChange = (e) => {
    const value = e.target.value;
    if (letterRegex.test(value)) {
      setFormData({
        ...formData,
        driverName: value
      });
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time portion

    if (selectedDate >= today) {
      setFormData({
        ...formData,
        deliveryDate: e.target.value
      });
    } else {
      alert("Delivery date cannot be in the past!");
      setFormData({
        ...formData,
        deliveryDate: ''
      });
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <div className="delivery-form-container">
      {/* Success Message */}
      {showSuccess && currentDeliveryData && (
        <div className="success-message-enhanced">
          <div className="success-icon-enhanced">🎉</div>
          <div className="success-content-enhanced">
            <h3 className="success-title-enhanced">Delivery Submitted Successfully!</h3>
            <div className="delivery-details-enhanced">
              <div className="detail-item-enhanced">
                <span className="detail-label-enhanced">Delivery ID:</span>
                <span className="detail-value-enhanced">{currentDeliveryData.deliveryId}</span>
              </div>
              <div className="detail-item-enhanced">
                <span className="detail-label-enhanced">Name:</span>
                <span className="detail-value-enhanced">{currentDeliveryData.driverName}</span>
              </div>
              <div className="detail-item-enhanced">
                <span className="detail-label-enhanced">Address:</span>
                <span className="detail-value-enhanced">{currentDeliveryData.destination}</span>
              </div>
              <div className="detail-item-enhanced">
                <span className="detail-label-enhanced">Location:</span>
                <span className="detail-value-enhanced">{currentDeliveryData.destination}</span>
              </div>
              <div className="detail-item-enhanced">
                <span className="detail-label-enhanced">Phone:</span>
                <span className="detail-value-enhanced">Not provided</span>
              </div>
              <div className="detail-item-enhanced">
                <span className="detail-label-enhanced">Payment:</span>
                <span className="detail-value-enhanced payment-badge-enhanced">CASH_ON_DELIVERY</span>
              </div>
              <div className="detail-item-enhanced">
                <span className="detail-label-enhanced">Status:</span>
                <span className="detail-value-enhanced status-badge-enhanced pending-status-enhanced">
                  PENDING
                </span>
              </div>
            </div>
            <p className="success-description-enhanced">
              Your delivery has been successfully submitted and will be processed soon!
            </p>
            <div className="success-actions-enhanced">
              <div className="copy-section-enhanced">
                <span className="copy-label-enhanced">📋 Copy your Delivery ID for driver reference:</span>
                <span className="copy-id-enhanced" onClick={() => navigator.clipboard.writeText(currentDeliveryData.deliveryId)}>
                  {currentDeliveryData.deliveryId}
                </span>
              </div>
              <button 
                className="success-continue-btn-enhanced"
                onClick={() => setShowSuccess(false)}
              >
                Continue Shopping in delivery
              </button>
            </div>
          </div>
          <button 
            className="success-close-btn-enhanced"
            onClick={() => setShowSuccess(false)}
          >
            ×
          </button>
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <div className="error-message-enhanced">
          <div className="error-icon-enhanced">❌</div>
          <div className="error-content-enhanced">
            <h3 className="error-title-enhanced">Invalid Delivery ID!</h3>
            <p className="error-description-enhanced">
              {errorMessage}
            </p>
          </div>
          <button 
            className="error-close-btn-enhanced"
            onClick={() => setShowError(false)}
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="delivery-management-form animated-form">
        <div className="dm-header">
          <h2 className="dm-title">DELIVERY MANAGEMENT</h2>
          <Link to="/reports" type="button" className="dm-all-delivery-btn">ALL DELIVERY</Link>
        </div>

      <div className="dm-form-body">
        <div className="dm-form-group">
          <label className="dm-label">Order ID / Delivery ID</label>
          <input
            className="dm-input animated-input"
            type="text"
            placeholder="Enter Order ID (ORD1000) or Delivery ID (DEL1000)"
            value={formData.deliveryId}
            onChange={e => setFormData({ ...formData, deliveryId: e.target.value })}
            required
          />
        </div>

        <div className="dm-form-group">
          <label className="dm-label">Destination</label>
          <input
            className="dm-input animated-input"
            type="text"
            placeholder="Destination"
            value={formData.destination}
            onChange={e => setFormData({ ...formData, destination: e.target.value })}
            required
          />
        </div>

        <div className="dm-form-group">
          <label className="dm-label">Driver's Name</label>
          <input
            className="dm-input animated-input"
            type="text"
            placeholder="Driver Name"
            value={formData.driverName}
            onChange={handleDriverNameChange}
            required
          />
        </div>

        <div className="dm-form-group">
          <label className="dm-label">Delivery Date</label>
          <div className="dm-date-container">
            <input
              className="dm-input dm-date-input animated-input"
              type="date"
              placeholder="dd/mm/yyyy"
              value={formData.deliveryDate}
              min={todayDate}
              onChange={handleDateChange}
              required
            />
            <span className="dm-calendar-icon" onClick={() => document.querySelector('input[type="date"]').showPicker()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </span>
          </div>
        </div>

        <div className="dm-form-group">
          <label className="dm-label">Status</label>
          <div className="dm-select-container">
            <select
              className="dm-select animated-select"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="INCOMPLETE">Incomplete</option>
            </select>
          </div>
        </div>

        <button type="submit" className="dm-submit-btn animated-button">SUBMIT</button>
      </div>
    </form>
    </div>
  );
}

export default DeliveryForm;
