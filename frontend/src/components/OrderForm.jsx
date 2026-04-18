import { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

function OrderForm({ order, onSave, onCancel }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(order || {
    firstName: '', lastName: '', address: '', province: '', city: '',
    postalCode: '', mobileNo: '', paymentMethod: 'CASH_ON_DELIVERY'
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z\s]+$/;       
    const postalCodeRegex = /^[0-9]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.address.trim() ||
        !formData.province.trim() ||
        !formData.city.trim() ||
        !formData.postalCode.trim() ||
        !formData.mobileNo.trim() ||
        !formData.paymentMethod.trim()
    ) {
      alert("All fields must be filled!");
      return;
    }

    if (!nameRegex.test(formData.firstName)) {
      alert("First Name must contain only letters.");
      return;
    }

    if (!nameRegex.test(formData.lastName)) {
      alert("Last Name must contain only letters.");
      return;
    }

    if (!nameRegex.test(formData.province)) {
      alert("Province must contain only letters.");
      return;
    }

    if (!nameRegex.test(formData.city)) {
      alert("City must contain only letters.");
      return;
    }

    if (!postalCodeRegex.test(formData.postalCode)) {
      alert("Postal Code must be a number.");
      return;
    }

    if (!phoneRegex.test(formData.mobileNo)) {
      alert("Phone Number must be exactly 10 digits.");
      return;
    }

    // Show loading state
    const submitButton = e.target.querySelector('.submit-button');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';
    }

    // Save the data
    if (order) {
      onSave(order._id, formData);
    } else {
      onSave(formData);
    }

    // After saving, ask for PDF download (only if successful)
    setTimeout(() => {
      if (window.confirm("Do you want to download the PDF report?")) {
        downloadPDF();
      }
    }, 100);
  };

  const handleInputChange = (field, value) => {
    if (["firstName", "lastName", "province", "city"].includes(field)) {
      if (!/^[A-Za-z\s]*$/.test(value)) return;
    }
    if (field === "postalCode" || field === "mobileNo") {
      if (!/^\d*$/.test(value)) return;
    }
    setFormData({ ...formData, [field]: value });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Order Details Report", 14, 20);

    const lineHeight = 10;
    let y = 40;

    doc.setFontSize(12);
    doc.text(`First Name: ${formData.firstName}`, 14, y); y += lineHeight;
    doc.text(`Last Name: ${formData.lastName}`, 14, y); y += lineHeight;
    doc.text(`Address: ${formData.address}`, 14, y); y += lineHeight;
    doc.text(`Province: ${formData.province}`, 14, y); y += lineHeight;
    doc.text(`City: ${formData.city}`, 14, y); y += lineHeight;
    doc.text(`Postal Code: ${formData.postalCode}`, 14, y); y += lineHeight;
    doc.text(`Phone Number: ${formData.mobileNo}`, 14, y); y += lineHeight;
    doc.text(`Payment Method: ${formData.paymentMethod}`, 14, y);

    doc.save("order_report.pdf");
  };

  const handleProceedToPayment = () => {
    navigate("/payment");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Fill Your Order Details</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              className="form-input-half"
              placeholder="Receiver's Firstname"
              value={formData.firstName}
              onChange={e => handleInputChange("firstName", e.target.value)}
              required
            />
            <input
              type="text"
              className="form-input-half"
              placeholder="Receiver's Lastname"
              value={formData.lastName}
              onChange={e => handleInputChange("lastName", e.target.value)}
              required
            />
          </div>

          <div className="form-row-full">
            <textarea
              className="form-textarea"
              placeholder="Address"
              value={formData.address}
              onChange={e => handleInputChange("address", e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-row">
            <input
              type="text"
              className="form-input-half"
              placeholder="Province"
              value={formData.province}
              onChange={e => handleInputChange("province", e.target.value)}
              required
            />
            <input
              type="text"
              className="form-input-half"
              placeholder="City"
              value={formData.city}
              onChange={e => handleInputChange("city", e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              className="form-input-half"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={e => handleInputChange("postalCode", e.target.value)}
              required
            />
            <input
              type="text"
              className="form-input-half"
              placeholder="Phone Number"
              value={formData.mobileNo}
              onChange={e => handleInputChange("mobileNo", e.target.value)}
              required
            />
          </div>

          <div className="form-row-full">
            <select
              className="form-select"
              value={formData.paymentMethod}
              onChange={e => handleInputChange("paymentMethod", e.target.value)}
              required
            >
              <option value="">Select Payment Method</option>
              <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
              <option value="PAY_ONLINE">Pay Online</option>
            </select>
          </div>

          <div className="button-group">
            <button type="submit" className="submit-button">Submit</button>
            <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
          </div>

          {/* Show Proceed button if payment method is PAY_ONLINE */}
          {formData.paymentMethod === "PAY_ONLINE" && (
            <div className="payment-proceed">
              <button
                type="button"
                onClick={handleProceedToPayment}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginTop: '20px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
              >
                Proceed to Payment
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default OrderForm;
