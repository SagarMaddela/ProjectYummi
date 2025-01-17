// src/components/UserLayout.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UserHomePage from './userpages/UserHomePage';
import UserNavBar from './UserNavBar';
import { RenderUserRest } from '../services/api';
import { useState, useEffect } from 'react';
import UserMenuItems from './userpages/UserMenuItems';
import UserCartPage from "./userpages/UserCartPage";
import UserResPage from './userpages/UserResPage';

const UserLayout = () => {
    const [restaurants, setRestaurants] = useState([]);  // Initialize restaurants as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch restaurants data from backend
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await RenderUserRest(); 
                console.log(response.data);
                setRestaurants(response.data);  // Set the fetched data
                setLoading(false);
            } catch (error) {
                setError('Failed to load restaurants');
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='user-layout'>
            <UserNavBar />
            <Routes>
                <Route path="userhomepage" element={<UserHomePage restaurants={restaurants} />} />
                <Route path="restaurants" element={<UserResPage restaurants={restaurants}/>}/>
                <Route path="*" element={<Navigate to="userhomepage" />} />
            </Routes>
        </div>
    );
};

export default UserLayout;
