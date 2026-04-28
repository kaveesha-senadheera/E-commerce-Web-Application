import { useState, useEffect } from "react";
import axios from "axios";
import { MdAddShoppingCart } from "react-icons/md";
import OrderList from "../components/OrderList";
import OrderForm from "../components/OrderForm";
import AnimatedConfirmMessage from "../components/AnimatedConfirmMessage";
import { API_ENDPOINTS } from "../api/config";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showAnimatedConfirm, setShowAnimatedConfirm] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  useEffect(() => {
    // Fetch orders from the backend
    const fetchOrders = () => {
      axios
        .get(API_ENDPOINTS.ORDERS)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Error fetching orders:", err));
    };

    fetchOrders();

    // Listen for delivery status updates
    const handleDeliveryStatusUpdate = () => {
      console.log('Delivery status updated, refreshing all orders...');
      fetchOrders();
    };

    window.addEventListener('deliveryStatusUpdated', handleDeliveryStatusUpdate);

    return () => {
      window.removeEventListener('deliveryStatusUpdated', handleDeliveryStatusUpdate);
    };
  }, []);

  const showSuccessMessage = (message, orderData = null) => {
    console.log('=== SHOW SUCCESS MESSAGE CALLED ===');
    console.log('Message:', message);
    console.log('Order Data:', orderData);
    console.log('Current showAnimatedConfirm state:', showAnimatedConfirm);
    setSuccessMessage(message);
    setShowAnimatedConfirm(true);
    setSubmittedOrder(orderData);
    console.log('Set showAnimatedConfirm to true');
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      console.log('Auto-closing animated confirm message');
      setShowAnimatedConfirm(false);
      setSuccessMessage("");
      setSubmittedOrder(null);
    }, 3000);
  };

  const closeAnimatedConfirm = () => {
    setShowAnimatedConfirm(false);
    setSuccessMessage("");
    setSubmittedOrder(null);
  };

  const addOrder = (order) => {
    axios
      .post(API_ENDPOINTS.ORDERS, order, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log('API Response:', res);
        const newOrder = res.data;
        console.log('New order data:', newOrder);
        setOrders([...orders, newOrder]);
        setShowForm(false);
        
        // Show order submission success message
        showSuccessMessage("Order submitted successfully! 🎉", newOrder);
        
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

  
  
  return (
    <div>
      {/* Animated Confirmation Message */}
      <AnimatedConfirmMessage
        message={successMessage}
        isVisible={showAnimatedConfirm}
        onClose={closeAnimatedConfirm}
        orderData={submittedOrder}
      />

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

      {/* PDF Download Confirmation Modal */}
      {console.log('RENDER CHECK - submittedOrder:', submittedOrder, 'showPDFConfirmModal:', showPDFConfirmModal) || submittedOrder && (
        <PDFDownloadConfirmModal
          order={submittedOrder}
          isOpen={showPDFConfirmModal}
          onConfirm={handlePDFConfirm}
          onCancel={handlePDFCancel}
        />
      )}

      {/* PDF Download Modal */}
      {submittedOrder && (
        <PDFDownloadModal
          order={submittedOrder}
          isOpen={showPDFModal}
          onDownload={() => downloadOrderPDF(submittedOrder)}
          onClose={() => {
            setShowPDFModal(false);
            setSubmittedOrder(null);
          }}
        />
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
