import { useState, useEffect } from "react";
import axios from "axios";
import ViewOnlyOrderList from "../components/ViewOnlyOrderList";
import { Link } from "react-router-dom";
import { API_ENDPOINTS } from "../api/config";

function AllOrdersViewPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch all orders
    const fetchOrders = () => {
      console.log('=== FETCHING ALL ORDERS ===');
      axios
        .get(API_ENDPOINTS.ORDERS)
        .then((res) => {
          console.log('Orders fetched successfully:', res.data);
          console.log('Number of orders:', res.data.length);
          // Log order statuses to see if they're updated
          const orderStatuses = res.data.map(order => ({
            orderId: order.orderId,
            status: order.status,
            firstName: order.firstName,
            lastName: order.lastName
          }));
          console.log('Order statuses:', orderStatuses);
          setOrders(res.data);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          // Retry after a short delay on error
          setTimeout(() => {
            console.log('Retrying order fetch...');
            fetchOrders();
          }, 1000);
        });
    };

    fetchOrders();

    // Listen for delivery status updates
    const handleDeliveryStatusUpdate = (event) => {
      console.log('=== DELIVERY STATUS UPDATE EVENT RECEIVED ===');
      console.log('Event detail:', event.detail);
      console.log('Refreshing all orders...');
      // Add a small delay to ensure backend has processed the update
      setTimeout(() => {
        fetchOrders();
      }, 300);
    };

    // Listen for direct order status updates
    const handleOrderStatusUpdate = (event) => {
      console.log('=== ORDER STATUS UPDATE EVENT RECEIVED ===');
      console.log('Event detail:', event.detail);
      console.log('Refreshing all orders...');
      // Add a small delay to ensure backend has processed the update
      setTimeout(() => {
        fetchOrders();
      }, 300);
    };

    // Listen for forced orders refresh
    const handleForceOrdersRefresh = (event) => {
      console.log('=== FORCE ORDERS REFRESH EVENT RECEIVED ===');
      console.log('Event detail:', event.detail);
      console.log('Force refreshing all orders...');
      // Immediate refresh for forced refresh
      fetchOrders();
    };

    // Add global debugging for all events
    window.addEventListener('deliveryStatusUpdated', (event) => {
      console.log('=== GLOBAL: deliveryStatusUpdated event received ===', event.detail);
    });
    window.addEventListener('orderStatusUpdated', (event) => {
      console.log('=== GLOBAL: orderStatusUpdated event received ===', event.detail);
    });
    window.addEventListener('forceOrdersRefresh', (event) => {
      console.log('=== GLOBAL: forceOrdersRefresh event received ===', event.detail);
    });

    window.addEventListener('deliveryStatusUpdated', handleDeliveryStatusUpdate);
    window.addEventListener('orderStatusUpdated', handleOrderStatusUpdate);
    window.addEventListener('forceOrdersRefresh', handleForceOrdersRefresh);

    return () => {
      window.removeEventListener('deliveryStatusUpdated', handleDeliveryStatusUpdate);
      window.removeEventListener('orderStatusUpdated', handleOrderStatusUpdate);
      window.removeEventListener('forceOrdersRefresh', handleForceOrdersRefresh);
    };
  }, []);

  return (
    <div className="container">
      <h1>All Orders View</h1>
      <Link to="/orders" className="back-nav-button">
        ← Back 
      </Link>
      <ViewOnlyOrderList orders={orders} />
    </div>
  );
}

export default AllOrdersViewPage;
