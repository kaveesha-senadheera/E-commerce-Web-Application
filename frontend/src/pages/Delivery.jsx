import { useState, useEffect } from "react";
import axios from "axios";
import DeliveryForm from "../components/DeliveryForm";
import { Link } from "react-router-dom";
import { API_ENDPOINTS } from "../api/config";

function Delivery() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    // Fetch deliveries from the deliveries endpoint
    axios
      .get(`${API_ENDPOINTS.DELIVERIES}`)
      .then((res) => setDeliveries(res.data))
      .catch((err) => console.error("Error fetching deliveries:", err));
  }, []);

  const updateDelivery = (id, updatedDelivery) => {
    axios
      .put(`${API_ENDPOINTS.DELIVERIES}/${id}`, updatedDelivery)
      .then((res) => {
        setDeliveries(deliveries.map((d) => (d._id === id ? res.data : d)));
      })
      .catch((err) => console.error("Error updating delivery:", err));
  };

  return (
    <div className="container">
      <h1>Delivery Management</h1>
      
      <DeliveryForm onUpdate={updateDelivery} deliveries={deliveries} />
    </div>
  );
}

export default Delivery;