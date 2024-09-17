
// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          axiosInstance.get('users/validate-token')
            .then(response => setUser(response.data.user))
            .catch(() => localStorage.removeItem('token'));
        }
      }, []);

    const login = (token, user) => {
        localStorage.setItem('token', token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
