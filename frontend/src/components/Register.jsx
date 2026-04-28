import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash, FaUserPlus, FaLock, FaEnvelope, FaUser, FaPhone, FaUserTag, FaStar, FaRocket, FaCrown } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sparkles, setSparkles] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    // Always use dark theme
    document.body.classList.add('dark-theme');
    // Trigger entrance animation
    setTimeout(() => setIsAnimating(true), 100);
    // Trigger sparkles animation
    setTimeout(() => setSparkles(true), 500);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-container dark-theme ${isAnimating ? 'animate-in' : ''}`}>
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
        {sparkles && (
          <div className="sparkles">
            <FaStar className="sparkle sparkle-1" />
            <FaStar className="sparkle sparkle-2" />
            <FaStar className="sparkle sparkle-3" />
            <FaStar className="sparkle sparkle-4" />
          </div>
        )}
      </div>

      <div className={`auth-card ${isAnimating ? 'slide-up' : ''}`}>
        <div className="auth-header">
          <div className="auth-icon">
            <FaRocket />
          </div>
          <h2>Create Account</h2>
          <p>Join us and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <div className="input-icon">
              <FaUser />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
                className="auth-input"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaEnvelope />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="auth-input"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaLock />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password (min 6 characters)"
                className="auth-input"
              />
              <button
                type="button"
                className="password-toggle enhanced"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaLock />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="auth-input"
              />
              <button
                type="button"
                className="password-toggle enhanced"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group role-selection-group">
            <label className="role-label">
              <FaCrown />
              Select Your Role
            </label>
            <div className="role-dropdown">
              <FaUserTag className="role-icon" />
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="auth-input role-select-enhanced"
              >
                <option value="">Choose your role...</option>
                <option value="customer">🛒 Customer - Buy products</option>
                <option value="driver">🚚 Driver - Deliver orders</option>
                <option value="seller">🏪 Seller - Sell products</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaPhone />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number (optional)"
                className="auth-input"
              />
            </div>
          </div>

          {error && <div className="error-message shake">{error}</div>}

          <div className="register-button-header">
            <h3>Ready to Join?</h3>
            <p>Click below to create your account and start your journey</p>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={`auth-button enhanced ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                Registering...
              </span>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? 
            <a href="/login" className="auth-link">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
