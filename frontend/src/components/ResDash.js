import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ResNavbar from './ResNavbar';
import RestaurantDetails from '../components/restaurantpages/RestaurantDetails';
import MenuManagement from '../components/restaurantpages/MenuManagement';
import OrderHistory from '../components/restaurantpages/OrderHistory';
import Analytics from '../components/restaurantpages/Analytics';
import Reviews from '../components/restaurantpages/Reviews';
import { getRestaurantData } from '../services/api';
import '../styles/ResDash.css';  // Importing the new CSS

const ResDash = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    

    useEffect(() => {
        const fetchRestaurantData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            try {
                const response = await getRestaurantData(token);
                setRestaurant(response.data);
            } catch (error) {
                setError('Failed to load restaurant data.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, []);

    if (loading) {
        return <div className="resdash-loading">Loading...</div>;
    }

    if (error) {
        return <div className="resdash-error">{error}</div>;
    }

    return (
        <div className="resdash-container">
            <div className='res-main'>
                <div className="resdash-header">
                    <h1>Welcome, {restaurant?.ownerName}!</h1>
                    <ResNavbar />
                    <button className="resdash-logout-btn" onClick={() => {
                        localStorage.removeItem('token');
                        console.log("success",'token');
                        window.location.href = '/';
                        }}>
                        Log Out
                    </button>
                </div>

                {/* Navbar
                <ResNavbar /> */}

                {   /* Routes for different sections */}
                <Routes>
                    <Route path="dashboard" element={<RestaurantDetails restaurant={restaurant} />} />
                    <Route path="menu" element={<MenuManagement menuItems={restaurant?.menuItems} />} />
                    <Route path="orders" element={<OrderHistory/>} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="reviews" element={<Reviews />} />
                    <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
            </div>
        </div>
    );
};

export default ResDash;
