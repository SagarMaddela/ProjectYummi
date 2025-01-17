import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ResNavbar.css'; // Import CSS for horizontal navbar styles

const Navbar = () => (
    <div className="horizontal-navbar">
        <ul className="navbar-menu">
            <li><Link to="/restaurantdash/dashboard" className="navbar-link">Dashboard</Link></li>
            <li><Link to="/restaurantdash/menu" className="navbar-link">Menu Management</Link></li>
            <li><Link to="/restaurantdash/orders" className="navbar-link">Order History</Link></li>
            <li><Link to="/restaurantdash/analytics" className="navbar-link">Analytics</Link></li>
            <li><Link to="/restaurantdash/reviews" className="navbar-link">Reviews</Link></li>
        </ul>
    </div>
);

export default Navbar;
