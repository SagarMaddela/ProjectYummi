import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import React, { useEffect, useState } from "react";
import "../styles/UserNavBar.css";
import "../styles/DashboardSlide.css"; // Create a new CSS file for the sliding dashboard
import { getUserInfo } from '../services/api';

const NavBar = () => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const navigate = useNavigate();
  const handleProfileClick = () => {
    setIsDashboardOpen(true); // Show the dashboard
  };

  const closeDashboard = () => {
    setIsDashboardOpen(false); // Hide the dashboard
  };

  const [user, setUser] = useState(null); // State to hold user data

  
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    // Fetch user details
    const fetchUser = async () => {
      try {
        const response = await getUserInfo(token);
        setUser(response.data); // Set the user data from the response
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (token) {
      fetchUser(); // Only fetch if token exists
    }
  }, [token]); // Add token as a dependency

  if (!user) return <div>Loading...</div>; // Loading state

  

  const handleLogout = () => {
    // Clear the token from localStorage to log the user out
    localStorage.removeItem("token");
    
    // Optionally, clear user-specific state (if you're storing it in React state or context)
    alert("Successfully logged out");
    // Redirect the user to the home page or login page after logging out
    navigate('/');  // Or redirect to the home page '/' if preferred
  };

  return (
    <>
      <nav className="user-navbar">
        <Link to="/" className="brand-name">Yummi</Link>
        <ul className="user-nav-links">
          <li><Link to="/userlayout">Home</Link></li>
          <li><Link to="#about">About Us</Link></li>
          <li>
            <Link to="/cart" className="cart-link">
              <FaShoppingCart className="cart-icon" /> Cart
            </Link>
          </li>
          <li>
            <button onClick={handleProfileClick} className="profile-button">
              <FaUserCircle className="profile-icon" /> Profile
            </button>
          </li>
        </ul>
      </nav>

      {isDashboardOpen && (
        <div className="dashboard-container">
          <div className="dashboard-content">
            <button className="close-button" onClick={closeDashboard}>
              Close
            </button>
            <h2>Dashboard</h2>
            <div className="welcome-section">
              <h1>Welcome, {user.username}!</h1>
              <p>Email: {user.email}</p>
            </div>
            <ul>
              <li><Link to="/userorderhistory">Order History</Link></li>
              <li><Link to="/useractiveorders">Active Orders</Link></li>
              <li><Link to="/userprofile">User Profile</Link></li>
            </ul>
            <button className="" onClick={handleLogout}>
               Log-Out
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
