import { useState, useEffect } from "react";
import axios from "axios";
import DeliveryStatusReport from "../components/DeliveryStatusReport";
import { Link } from "react-router-dom";
import { API_ENDPOINTS } from "../api/config";
import { useAuth } from '../context/AuthContext';

function DeliveryReportPage() {
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
          // For other users (customers, etc.), fetch customer-specific deliveries
          deliveriesResponse = await axios.get(`${API_ENDPOINTS.ORDERS}/deliveries/customer`);
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

  return (
    <div className="container">
      <h1>Delivery Status Reports</h1>
      <Link to="/delivery" className="back-nav-button">
        ← Back 
      </Link>
      <DeliveryStatusReport deliveries={deliveries} />
    </div>
  );
}

export default DeliveryReportPage;