import { useState, useEffect } from "react";
import axios from "axios";
import { MdAddShoppingCart } from "react-icons/md";
import OrderList from "../components/OrderList";
import OrderForm from "../components/OrderForm";
import { API_ENDPOINTS } from "../api/config";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  useEffect(() => {
    // Fetch only the current customer's orders
    const fetchOrders = () => {
      axios
        .get(`${API_ENDPOINTS.ORDERS}/customer`)
        .then((res) => {
          setOrders(res.data);
        })
        .catch((err) => console.error("Error fetching customer orders:", err));
    };

    fetchOrders();

    // Listen for delivery status updates
    const handleDeliveryStatusUpdate = () => {
      console.log('Delivery status updated, refreshing orders...');
      fetchOrders();
    };

    window.addEventListener('deliveryStatusUpdated', handleDeliveryStatusUpdate);

    return () => {
      window.removeEventListener('deliveryStatusUpdated', handleDeliveryStatusUpdate);
    };
  }, []);

  const addOrder = (order) => {
    axios
      .post(API_ENDPOINTS.ORDERS, order, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        const newOrder = res.data;
        setOrders([...orders, newOrder]);
        setShowForm(false);
        setSubmittedOrder(newOrder);
        
        // Clear editing order state
        setEditingOrder(null);
      })
      .catch((err) => {
        console.error("Error adding order:", err);
        alert("Failed to submit order. Please try again.");
      });
  };

  const updateOrder = (id, updatedOrder) => {
    axios
      .put(API_ENDPOINTS.ORDER_BY_ID(id), updatedOrder, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        const updatedOrderData = res.data;
        setOrders(orders.map((o) => (o._id === id ? updatedOrderData : o)));
        setShowForm(false);
        setEditingOrder(null);
        alert("Order updated successfully! ✅");
      })
      .catch((err) => {
        console.error("Error updating order:", err);
        alert("Failed to update order. Please try again.");
      });
  };

  const deleteOrder = (id) => {
    axios
      .delete(API_ENDPOINTS.ORDER_BY_ID(id))
      .then(() => {
        setOrders(orders.filter((o) => o._id !== id));
      })
      .catch((err) => {
        console.error("Error deleting order:", err);
        alert("Failed to delete order. Please try again.");
      });
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  const closeOrderDetails = () => {
    setSubmittedOrder(null);
  };

  const generateOrderPDF = () => {
    if (!submittedOrder) {
      console.error('No order data available');
      alert('No order data available for PDF generation');
      return;
    }
    
    try {
      console.log('Generating PDF for order:', submittedOrder);
      const doc = new jsPDF();
      
      // Clean white background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 297, 'F');
      
      // Simple header
      doc.setFillColor(78, 205, 196);
      doc.rect(0, 0, 210, 30, 'F');
      
      // Company info
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, 'bold');
      doc.text('EFarmer', 15, 15);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text('Order Confirmation', 15, 25);
      
      // Order info
      doc.setFontSize(8);
      doc.text(`Order #${submittedOrder.orderId || 'N/A'}`, 195, 12, { align: 'right' });
      doc.text(`Date: ${submittedOrder.createdAt ? new Date(submittedOrder.createdAt).toLocaleDateString() : 'N/A'}`, 195, 22, { align: 'right' });
      
      // Main content
      let currentY = 55;
      
      // Order Information
      doc.setFillColor(240, 240, 240);
      doc.rect(15, currentY, 180, 20, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(135, 206, 235);
      doc.setFont(undefined, 'bold');
      doc.text('Order Information', 20, currentY + 13);
      
      currentY += 25;
      
      // Order details
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(1);
      doc.rect(15, currentY, 180, 50, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont(undefined, 'normal');
      doc.text('Order ID:', 20, currentY + 10);
      doc.text('Order Date:', 20, currentY + 20);
      doc.text('Payment Method:', 20, currentY + 30);
      doc.text('Order Status:', 20, currentY + 40);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text(submittedOrder.orderId || 'N/A', 80, currentY + 10);
      doc.text(submittedOrder.createdAt ? new Date(submittedOrder.createdAt).toLocaleDateString() : 'N/A', 80, currentY + 20);
      doc.text(submittedOrder.paymentMethod || 'N/A', 80, currentY + 30);
      doc.text(submittedOrder.status || 'PENDING', 80, currentY + 40);
      
      // Status badge
      const statusText = submittedOrder.status || 'PENDING';
      const statusColor = statusText === 'DELIVERED' ? [34, 197, 94] : 
                         statusText === 'PROCESSING' ? [59, 130, 246] : 
                         statusText === 'OUT_FOR_DELIVERY' ? [251, 146, 60] : 
                         [107, 114, 128];
      
      doc.setFillColor(...statusColor);
      doc.rect(140, currentY + 30, 50, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.text(statusText, 165, currentY + 40, { align: 'center' });
      
      currentY += 60;
      
      // Customer Information
      doc.setFillColor(240, 240, 240);
      doc.rect(15, currentY, 180, 20, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(135, 206, 235);
      doc.setFont(undefined, 'bold');
      doc.text('Customer Information', 20, currentY + 13);
      
      currentY += 25;
      
      // Customer details
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(1);
      doc.rect(15, currentY, 180, 45, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont(undefined, 'normal');
      doc.text('Full Name:', 20, currentY + 10);
      doc.text('Phone Number:', 20, currentY + 20);
      doc.text('Address:', 20, currentY + 30);
      doc.text('Location:', 20, currentY + 40);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text(`${submittedOrder.firstName || 'N/A'} ${submittedOrder.lastName || 'N/A'}`, 80, currentY + 10);
      doc.text(submittedOrder.mobileNo || 'N/A', 80, currentY + 20);
      doc.text(submittedOrder.address || 'N/A', 80, currentY + 30);
      doc.text(`${submittedOrder.city || 'N/A'}, ${submittedOrder.province || 'N/A'} ${submittedOrder.postalCode || 'N/A'}`, 80, currentY + 40);
      
      currentY += 55;
      
      // Order Summary
      doc.setFillColor(240, 240, 240);
      doc.rect(15, currentY, 180, 20, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(135, 206, 235);
      doc.setFont(undefined, 'bold');
      doc.text('Order Summary', 20, currentY + 13);
      
      currentY += 25;
      
      // Summary details
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(1);
      doc.rect(15, currentY, 180, 50, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont(undefined, 'normal');
      doc.text('Order Status:', 20, currentY + 10);
      doc.text('Expected Delivery:', 20, currentY + 20);
      doc.text('Payment Method:', 20, currentY + 30);
      doc.text('Order Type:', 20, currentY + 40);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text(submittedOrder.status || 'PENDING', 80, currentY + 10);
      doc.text('3-5 Business Days', 80, currentY + 20);
      doc.text(submittedOrder.paymentMethod || 'N/A', 80, currentY + 30);
      doc.text('Standard Delivery', 80, currentY + 40);
      
      currentY += 60;
      
      // Additional Order Details
      doc.setFillColor(240, 240, 240);
      doc.rect(15, currentY, 180, 20, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(135, 206, 235);
      doc.setFont(undefined, 'bold');
      doc.text('Additional Details', 20, currentY + 13);
      
      currentY += 25;
      
      // Additional details box
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(1);
      doc.rect(15, currentY, 180, 40, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont(undefined, 'normal');
      doc.text('User ID:', 20, currentY + 10);
      doc.text('Created At:', 20, currentY + 20);
      doc.text('Last Updated:', 20, currentY + 30);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text(submittedOrder.userId || 'N/A', 80, currentY + 10);
      doc.text(submittedOrder.createdAt ? new Date(submittedOrder.createdAt).toLocaleString() : 'N/A', 80, currentY + 20);
      doc.text(submittedOrder.updatedAt ? new Date(submittedOrder.updatedAt).toLocaleString() : 'N/A', 80, currentY + 30);
      
      currentY += 60;
      
      // Add proper spacing before footer
      currentY += 20;
      
      // Thank you message
      doc.setFontSize(12);
      doc.setTextColor(78, 205, 196);
      doc.setFont(undefined, 'bold');
      doc.text('Thank you for your order!', 105, currentY, { align: 'center' });
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont(undefined, 'normal');
      doc.text('This is an automatically generated order confirmation', 105, currentY + 10, { align: 'center' });
      doc.text('EFarmer - Your Trusted Agricultural Partner', 105, currentY + 18, { align: 'center' });
      
      // Add more spacing before footer
      currentY += 30;
      
      // Main Footer
      doc.setFillColor(78, 205, 196);
      doc.rect(0, currentY, 210, 30, 'F');
      
      // Company branding in footer
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, 'bold');
      doc.text('EFarmer - Your Trusted Agricultural Partner', 105, currentY + 10, { align: 'center' });
      
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.text('© 2024 EFarmer. All rights reserved.', 105, currentY + 20, { align: 'center' });
      doc.text('info@efarmer.com | +94 11 234 5678 | www.efarmer.com', 105, currentY + 27, { align: 'center' });
      
      currentY += 40;
      
      // Additional Footer Bar
      doc.setFillColor(30, 41, 59);
      doc.rect(0, currentY, 210, 15, 'F');
      
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, 'normal');
      doc.text('Thank you for choosing EFarmer for your agricultural needs!', 105, currentY + 8, { align: 'center' });
      
      // Download the PDF
      const fileName = `Order_${submittedOrder.orderId || 'Confirmation'}.pdf`;
      doc.save(fileName);
      console.log('PDF downloaded successfully:', fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    }
  };

  return (
    <div>
      <h1>My Orders</h1>
      <div className="order-header">
        <h2 className="order-title">My Order Delivery Details</h2>
        <button className="checkout-btn" onClick={() => setShowForm(true)}>CHECKOUT <MdAddShoppingCart className="checkout-icon" /></button>
      </div>
      
      <OrderList
        orders={orders}
        onEdit={(order) => {
          setEditingOrder(order);
          setShowForm(true);
        }}
        onDelete={deleteOrder}
      />
      
      {showForm && (
        <OrderForm
          order={editingOrder}
          onSave={editingOrder ? updateOrder : addOrder}
          onCancel={handleFormCancel}
        />
      )}

      {/* Order Details Modal */}
      {submittedOrder && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title">🎉 Order Submitted Successfully!</h2>
              <button className="close-button" onClick={closeOrderDetails}>×</button>
            </div>
            
            <div className="order-details-content" style={{ padding: '30px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#4ecdc4', marginBottom: '15px' }}>Order Details</h3>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '10px' }}>
                  <p style={{ margin: '10px 0', color: '#ffffff' }}><strong>Order ID:</strong> <span style={{ color: '#4ecdc4', fontWeight: '700', background: 'rgba(78, 205, 196, 0.1)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(78, 205, 196, 0.3)' }}>{submittedOrder.orderId}</span></p>
                  <p style={{ margin: '10px 0', color: '#ffffff' }}><strong>Name:</strong> {submittedOrder.firstName} {submittedOrder.lastName}</p>
                  <p style={{ margin: '10px 0', color: '#ffffff' }}><strong>Address:</strong> {submittedOrder.address}</p>
                  <p style={{ margin: '10px 0', color: '#ffffff' }}><strong>Location:</strong> {submittedOrder.city}, {submittedOrder.province} {submittedOrder.postalCode}</p>
                  <p style={{ margin: '10px 0', color: '#ffffff' }}><strong>Phone:</strong> {submittedOrder.mobileNo}</p>
                  <p style={{ margin: '10px 0', color: '#ffffff' }}><strong>Payment:</strong> {submittedOrder.paymentMethod}</p>
                  <p style={{ margin: '10px 0', color: '#ffffff' }}><strong>Status:</strong> <span style={{ background: 'linear-gradient(135deg, #ffc107, #e0a800)', color: '#000', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>{submittedOrder.status || 'PENDING'}</span></p>
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px' }}>
                  Your order has been successfully submitted and will be processed soon!
                </p>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: '#4ecdc4', fontWeight: '700', marginBottom: '10px' }}>
                    📋 Copy your Order ID for driver reference:
                  </p>
                  <div style={{ 
                    background: 'rgba(78, 205, 196, 0.1)', 
                    border: '1px solid rgba(78, 205, 196, 0.3)', 
                    borderRadius: '8px', 
                    padding: '15px',
                    textAlign: 'center'
                  }}>
                    <span style={{ 
                      fontSize: '18px', 
                      fontWeight: '800', 
                      color: '#4ecdc4',
                      letterSpacing: '2px'
                    }}>
                      {submittedOrder.orderId}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>
                  <button 
                    onClick={closeOrderDetails}
                    style={{
                      backgroundColor: '#4ecdc4',
                      color: '#0a2540',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Continue Shopping
                  </button>
                  
                  <button 
                    onClick={generateOrderPDF}
                    style={{
                      backgroundColor: '#4ecdc4',
                      color: '#0a2540',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default CustomerOrdersPage;
