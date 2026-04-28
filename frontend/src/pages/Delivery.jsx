import { useState, useEffect } from "react";
import axios from "axios";
import DeliveryForm from "../components/DeliveryForm";
import { Link } from "react-router-dom";
import { API_ENDPOINTS } from "../api/config";
import { useAuth } from '../context/AuthContext';

function Delivery() {
  const [deliveries, setDeliveries] = useState([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        let deliveriesResponse;
        
        // If user is a driver, fetch all deliveries
        if (user?.role === 'driver') {
          deliveriesResponse = await axios.get(`${API_ENDPOINTS.ORDERS}/deliveries`);
        } else {
          // For other users, use the standard deliveries endpoint
          deliveriesResponse = await axios.get(`${API_ENDPOINTS.DELIVERIES}`);
        }
        
        setDeliveries(deliveriesResponse.data);
      } catch (err) {
        console.error("Error fetching deliveries:", err);
      }
    };

    if (!loading && user) {
      fetchDeliveries();
    }
  }, [user, loading]);

  const updateDelivery = (id, updatedDelivery) => {
    // If id is null, it means a new delivery was created
    if (id === null && updatedDelivery) {
      setDeliveries([...deliveries, updatedDelivery]);
    } else if (id) {
      // Use the orders endpoint for delivery updates to ensure order status synchronization
      const endpoint = `${API_ENDPOINTS.ORDERS}/delivery/${id}`;
      console.log('Updating delivery with endpoint:', endpoint);
      console.log('Updated delivery data:', updatedDelivery);
      
      axios
        .put(endpoint, updatedDelivery)
        .then((res) => {
          console.log('Delivery updated successfully:', res.data);
          setDeliveries(deliveries.map((d) => (d._id === id ? res.data : d)));
        })
        .catch((err) => {
          console.error("Error updating delivery:", err);
          console.error("Error details:", err.response?.data);
        });
    }
  };

  return (
    <div className="container">
      <h1>Delivery Management</h1>
      <DeliveryForm onUpdate={updateDelivery} deliveries={deliveries} />
    </div>
  );
}

export default Delivery;