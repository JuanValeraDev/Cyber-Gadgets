

// src/components/AccountPage.jsx
import React, { useState, useEffect } from 'react';
import Login from './Login';
import AccountHome from './AccountHome';

const AccountPage = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on component mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    const handleLoginSuccess = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
    };

    const handleLogout = () => {
        setUser(null);
        setToken(null);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    // If user is not logged in, show login page
    if (!user || !token) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    // If user is logged in, show account home
    return <AccountHome user={user} token={token} onLogout={handleLogout} />;
};

export default AccountPage;
