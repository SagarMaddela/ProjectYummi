import React, { useState } from 'react';
import { Registeradmin } from '../services/api';


const RegisterAdmin = () => {
    const [adminName, setAdminName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = { adminName, email, password };

        try {


            // Making a POST request to the backend with form data
            const response = await Registeradmin(formData);
            // Handle the response if needed (redirect, success message, etc.)
            console.log(response.data);
            alert('Admin registered successfully!');
        } catch (error) {
            console.error('Error registering admin:', error);
            alert('Failed to register admin');
        }
    };

    return (
        <div>
            <h1>Register as an Admin</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="adminName">Admin Name:</label>
                <input
                    type="text"
                    id="adminName"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterAdmin;
