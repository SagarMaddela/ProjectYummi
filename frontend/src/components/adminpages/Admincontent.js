import React from 'react';
import '../../styles/admindash.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard-container">
            <h1 className="admin-dashboard-title">Welcome to the Admin Dashboard</h1>
            <p className="admin-dashboard-description">
                Manage all aspects of the restaurant platform with ease and efficiency.
            </p>

            <div className="admin-dashboard-overview">
                <h2 className="overview-title">Overview</h2>
                <ul className="overview-list">
                    {[
                        { title: 'Manage Restaurants', description: 'Add, edit, or remove restaurants.' },
                        { title: 'View Orders', description: 'Check and manage customer orders.' },
                        { title: 'User Management', description: 'Monitor and manage user accounts and roles.' },
                        { title: 'Analytics', description: 'Access reports on sales and user activity.' },
                    ].map((item, index) => (
                        <li
                            key={index}
                            className="overview-item"
                        >
                            <strong className="overview-item-title">{item.title}:</strong> {item.description}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
