import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedDelivery = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on user role
      if (user.role === 'customer') {
        navigate('/my-reports', { replace: true });
      } else if (user.role === 'driver') {
        navigate('/delivery-management', { replace: true });
      } else {
        // Default fallback for other roles or admin
        navigate('/reports', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // Show loading state while checking authentication
  if (loading || !user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default RoleBasedDelivery;
