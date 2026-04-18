// API Configuration
export const API_BASE_URL = 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Orders
  ORDERS: `${API_BASE_URL}/orders`,
  ORDER_BY_ID: (id) => `${API_BASE_URL}/orders/${id}`,
  
  // Deliveries
  DELIVERIES: `${API_BASE_URL}/deliveries`,
  DELIVERY_BY_ID: (id) => `${API_BASE_URL}/deliveries/${id}`,
  
  // Users
  USERS: `${API_BASE_URL}/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
};

// Axios configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};
