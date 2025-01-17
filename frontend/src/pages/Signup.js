import React, { useState } from 'react';
import { signupUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css';
import burgerImage from '../assets/burger.png'; // Add the path to your burger image

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = { username, email, password };
        try {
            const response = await signupUser(formData);
            if (response.status === 201) {
                alert('User registered successfully!');
                navigate('/login');
            } else {
                alert('Registration failed');
            }
        } catch (error) {
            console.error('Signup error', error);
        }
    };

    return (
        <div className="signup-body">
        <div className="signup-container">
            
            <div className="image-section1">
                <img src={burgerImage} alt="Delicious Burger" />
            </div>
            <div className="form-section">
                <h2>Sign up!</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Signup</button>
                </form>
            </div>
        </div>
        </div>
    );
};

export default Signup;