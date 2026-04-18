import { useState, useEffect } from "react";
import axios from "axios";
import DeliveryStatusReport from "../components/DeliveryStatusReport";
import { Link } from "react-router-dom";
import { API_ENDPOINTS } from "../api/config";

function DeliveryReportPage() {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    // Fetch deliveries from the orders endpoint since deliveries are created with orders
    axios
      .get(`${API_ENDPOINTS.ORDERS}/deliveries`)
      .then((res) => setDeliveries(res.data))
      .catch((err) => console.error("Error fetching deliveries:", err));
  }, []);

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