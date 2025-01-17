import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import
import { loginUser } from "../services/api";
import '../styles/Login.css'; // Import the CSS file for st // Import the image for the login page
import burgerImage from '../assets/burger.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();

    // Validate form inputs
    const validateForm = () => {
        const newErrors = {};

        // Email validation (basic regex pattern for email format)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Password validation (basic check for empty field)
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Run validation
        if (!validateForm()) {
            return;
        }

        setLoading(true); // Set loading to true when request starts
        const formData = { email, password };

        try {
            const response = await loginUser(formData);
            const { token } = response.data;

            localStorage.setItem('token', token);

            // Decode the token to get user role
            const decoded = jwtDecode(token);
            const userRole = decoded.role;

            // Redirect based on user role
            if (userRole === 'Admin') {
                navigate('/admin');
            } else if (userRole === 'Restaurant') {
                navigate('/restaurantdash');
            } else if(userRole === "User") {
                navigate('/userlayout'); // Regular user
            }

        } catch (error) {
            console.error('Login error', error);
            setErrorMessage('Invalid credentials, please try again.');
        } finally {
            setLoading(false); // Set loading to false after request completes
        }
    };

    return (
        <div className="login-body">
        <div className="login-container">
            <div className="image-section">
                <img src={burgerImage} alt="Login Illustration" />
            </div>
            <div className="form-section">
                <form onSubmit={handleSubmit} className="login-form">
                    <h2 className="login-heading">Login</h2>
                    {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Show backend error */}
                    
                    <div className="input-group">
                        <label className="input-label">Email:</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>} {/* Show validation error */}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password:</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>} {/* Show validation error */}
                    </div>

                    <button 
                        type="submit" 
                        className="login-button" 
                        disabled={loading} // Disable button when loading
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
        </div>
    );
};

export default Login;