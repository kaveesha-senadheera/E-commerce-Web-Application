import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdAddShoppingCart } from "react-icons/md";


const Header = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleCartClick = () => {
        navigate('/cart');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Implement search functionality here
            console.log('Searching for:', searchQuery);
            // You can navigate to search results page or filter products
            // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <header>
            <div className="logo">
                <img src='/logo.png' alt="E farmer Logo" className="logo-img" />
                <h1>E-FARMER</h1>
            </div>
            <nav>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to=''>store</Link></li>
                    <li><Link to=''>about</Link></li>
                    <li><Link to='/delivery'>Delivery</Link></li>
                    <li><Link to='/orders'>Orders</Link></li>
                    <li><Link to=''>contact</Link></li>   
                </ul>
            </nav>
            <div className="header-actions">
                <form className="search-login" onSubmit={handleSearch}>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                    />
                    <button type="submit" className="search-btn">Search</button>
                </form>
                <MdAddShoppingCart
                    className="cart-icon" 
                    onClick={handleCartClick}  
                />
                <button
                    className='login'
                    onClick={() => navigate('/login')}
                >
                   LogOut
                </button>
            </div>
        </header>
    );
};

export default Header;