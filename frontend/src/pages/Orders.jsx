import { useState, useEffect } from "react";
import axios from "axios";
import { MdAddShoppingCart } from "react-icons/md";
import OrderList from "../components/OrderList";
import OrderForm from "../components/OrderForm";
import { API_ENDPOINTS } from "../api/config";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  useEffect(() => {
    axios
      .get(API_ENDPOINTS.ORDERS)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSuccessMessage("");
    }, 3000);
  };

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
        showSuccessMessage("Order submitted successfully! 🎉");
        
        // Clear editing order state
        setEditingOrder(null);
      })
      .catch((err) => {
        console.error("Error adding order:", err);
        showSuccessMessage("Failed to submit order. Please try again.");
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
        showSuccessMessage("Order updated successfully! ✅");
      })
      .catch((err) => {
        console.error("Error updating order:", err);
        showSuccessMessage("Failed to update order. Please try again.");
      });
  };

  const deleteOrder = (id) => {
    axios
      .delete(API_ENDPOINTS.ORDER_BY_ID(id))
      .then(() => {
        setOrders(orders.filter((o) => o._id !== id));
        showSuccessMessage("Order deleted successfully! 🗑️");
      })
      .catch((err) => {
        console.error("Error deleting order:", err);
        showSuccessMessage("Failed to delete order. Please try again.");
      });
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  const closeOrderDetails = () => {
    setSubmittedOrder(null);
  };

  return (
    <div>
      {/* Success Message */}
      {showSuccess && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#28a745',
            color: 'white',
            padding: '15px 25px',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(40, 167, 69, 0.4)',
            zIndex: '9999',
            fontSize: '16px',
            fontWeight: '600',
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          {successMessage}
        </div>
      )}

      <h1>Order Delivery Details</h1>
      <div className="order-header">
        <h2 className="order-title">Order Delivery Details</h2>
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

export default Orders;
