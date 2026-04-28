import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdAddShoppingCart, MdPerson } from "react-icons/md";
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout, loading, user } = useAuth();

    // Debug authentication state
    console.log('Header - Auth state:', { loading, user, isAuthenticated: isAuthenticated() });

    const handleCartClick = () => {
        navigate('/cart');
    };

    const handleProtectedNavigation = (path) => {
        if (isAuthenticated()) {
            navigate(path);
        } else {
            navigate('/login');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header>
            <div className="logo">
                <img src='/logo.png' alt="E farmer Logo" className="logo-img" />
                <h1>E-FARMER</h1>
            </div>
            <nav>
                <ul>
                    <li><button onClick={() => navigate('/')} className="nav-link">Home</button></li>
                    <li><button onClick={() => handleProtectedNavigation('/store')} className="nav-link">Store</button></li>
                    <li><button onClick={() => handleProtectedNavigation('/about')} className="nav-link">About</button></li>
                    <li><button onClick={() => navigate('/delivery')} className="nav-link">Delivery</button></li>
                    <li>
                        {isAuthenticated() && user?.role === 'driver' ? (
                            <button onClick={() => navigate('/orders-view')} className="nav-link">All Orders</button>
                        ) : (
                            <button onClick={() => navigate('/orders')} className="nav-link">Orders</button>
                        )}
                    </li>
                    <li><button onClick={() => handleProtectedNavigation('/contact')} className="nav-link">Contact</button></li>
                </ul>
            </nav>
            <div className="header-actions">
                <MdAddShoppingCart
                    className="cart-icon" 
                    onClick={handleCartClick}  
                />
                {loading ? (
                    <div className="auth-loading">Loading...</div>
                ) : isAuthenticated() ? (
                    <div className="user-profile">
                        <div className="user-info">
                            <MdPerson className="user-avatar" />
                            <span className="user-name">
                                {user?.username || user?.firstName || user?.name || 'User'}
                            </span>
                        </div>
                        <button
                            className='logout-btn'
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            className='login'
                            onClick={() => navigate('/register')}
                        >
                            Register
                        </button>
                        <button
                            className='login'
                            onClick={() => navigate('/login')}
                        >
                            Sign In
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;