import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './SignupForm.css';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { username, email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const body = JSON.stringify({ username, email, password });
            const res = await axios.post('http://localhost:4000/api/users/signup', body, config);
            console.log(res.data);
            navigate('/login');  // Redirect to login after successful signup
        } catch (err) {
            console.error(err.response.data);
            setError(err.response.data.message);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form-wrapper">
                <h2>Create Your Account</h2>
                <form onSubmit={onSubmit} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={onChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="signup-button">Sign Up</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
                <p className="login-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupForm;
