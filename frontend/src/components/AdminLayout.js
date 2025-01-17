import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import {jwtDecode} from 'jwt-decode'; // Correctly importing jwt-decode
import '../styles/adminlayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role !== 'Admin') {
                navigate('/login');
            }
        } catch (error) {
            navigate('/login');
        }
    }, [navigate]);

    const isSpecialRoute =
        ['/admin/restaurants', '/admin/orders', '/admin/users'].includes(location.pathname);

    return (
        <div className="admin-container">
            <Navbar />
            <div className="admin-content">
                <Sidebar />
                <div className="admin-main-content">
                    {!isSpecialRoute && (
                        <div className="admin-welcome-text">
                            <h1 className="admin-heading">Welcome to the Admin Panel</h1>
                            <p className="admin-paragraph">
                                Use the sidebar to navigate through different sections.
                            </p>
                        </div>
                    )}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
