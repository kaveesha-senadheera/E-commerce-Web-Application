import { useState } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
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
    
    // Find delivery by Delivery ID only (for drivers)
    const searchId = formData.deliveryId.toLowerCase().trim();
    const delivery = deliveries.find(d => 
      d.deliveryId?.toLowerCase() === searchId
    );

    if (delivery) {
      onUpdate(delivery._id, {
        driverName: formData.driverName,
        destination: formData.destination,
        deliveryDate: formData.deliveryDate,
        status: formData.status
      });

      // Store current delivery data for PDF download
      setCurrentDeliveryData({
        deliveryId: formData.deliveryId,
        driverName: formData.driverName,
        destination: formData.destination,
        deliveryDate: formData.deliveryDate,
        status: formData.status
      });

      setFormData({ deliveryId: '', driverName: '', destination: '', deliveryDate: '', status: 'COMPLETED' });
      setShowError(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } else {
      setErrorMessage(`Invalid Delivery ID! Please use only Delivery ID (e.g., DEL1000, DEL1001).\n\nDrivers should copy Delivery ID from the delivery report page.`);
      setShowSuccess(false);
      setShowError(true);
    }
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
          <label className="dm-label">Delivery ID</label>
          <input
            className="dm-input animated-input"
            type="text"
            placeholder="Delivery ID only (e.g., DEL1000)"
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
