import React, { useState, useEffect } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getRestaurantData } from '../services/api';
import Navbar from './Navbar';
import RestaurantDetails from './RestaurantDetails';
import MenuManagement from './MenuManagement';
import OrderHistory from './OrderHistory';
import Analytics from './Analytics';
import Reviews from './Reviews';
import '../css/RestaurantDashboard.css';

const RestaurantDashboard = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const decodedToken = jwtDecode(token);
        if (decodedToken.role !== 'Restaurant') {
            navigate('/login');
            return;
        }

        const fetchRestaurantData = async () => {
            try {
                const response = await getRestaurantData(token);
                setRestaurant(response.data);
            } catch (error) {
                setError('Failed to load restaurant data. Please log in again.');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {restaurant?.ownerName}!</h1>
                <button className="logout-button" onClick={handleLogout}>Log Out</button>
            </div>

            <Navbar />

            <Routes>
                <Route path="/dashboard" element={<RestaurantDetails restaurant={restaurant} />} />
                <Route path="/menu" element={<MenuManagement menuItems={restaurant?.menuItems} />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/reviews" element={<Reviews />} />
            </Routes>
        </div>
    );
};

export default RestaurantDashboard;
